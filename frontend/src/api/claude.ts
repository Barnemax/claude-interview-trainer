import type { Challenge, Evaluation } from '../types';

const BASE = '/api';

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Could not reach the server — is the backend running?');
  }
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const generateChallenge = (topic: string, level: string, challenge_type: string) =>
  post<Challenge>('/challenge', { topic, level, challenge_type });

export const evaluateAnswer = (challenge: Challenge, answer: string) =>
  post<Evaluation>('/evaluate', { challenge, answer });

export const getHint = (challenge: Challenge, hint_level: number, previous_hints: string[]) =>
  post<{ hint: string }>('/hint', { challenge, hint_level, previous_hints });

export const getFullAnswer = (challenge: Challenge) =>
  post<{ answer: string }>('/answer', { challenge });
