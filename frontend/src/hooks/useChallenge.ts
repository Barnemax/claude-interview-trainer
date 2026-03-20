import { useState } from 'react';
import { generateChallenge, evaluateAnswer, getHint, getFullAnswer } from '../api/claude';
import { useSession } from './useSession';
import type { Challenge, Evaluation } from '../types';

type Phase = 'setup' | 'loading' | 'challenge' | 'evaluating' | 'results';

export function useChallenge() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [fullAnswer, setFullAnswer] = useState<string | null>(null);
  const [fullAnswerLoading, setFullAnswerLoading] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { stats, recordResult, clearStats } = useSession();

  const generate = async (topic: string, level: string, type: string, jobContext?: string) => {
    setPhase('loading');
    setError(null);
    try {
      const result = await generateChallenge(topic, level, type, jobContext);
      setChallenge(result);
      setEvaluation(null);
      setHints([]);
      setHintLevel(0);
      setFullAnswer(null);
      setPhase('challenge');
    } catch (e) {
      setError((e as Error).message);
      setPhase('setup');
    }
  };

  const evaluate = async (answer: string) => {
    if (!challenge) return;
    setPhase('evaluating');
    setError(null);
    try {
      const result = await evaluateAnswer(challenge, answer);
      setEvaluation(result);
      recordResult(result.verdict);
      setPhase('results');
    } catch (e) {
      setError((e as Error).message);
      setPhase('challenge');
    }
  };

  const requestHint = async () => {
    if (!challenge || hintLevel >= 3) return;
    setError(null);
    setHintLoading(true);
    try {
      const nextLevel = hintLevel + 1;
      const result = await getHint(challenge, nextLevel, hints);
      setHints((prev) => [...prev, result.hint]);
      setHintLevel(nextLevel);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setHintLoading(false);
    }
  };

  const requestFullAnswer = async () => {
    if (!challenge) return;
    setError(null);
    setFullAnswerLoading(true);
    try {
      const result = await getFullAnswer(challenge);
      setFullAnswer(result.answer);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setFullAnswerLoading(false);
    }
  };

  const reset = () => {
    setPhase('setup');
    setChallenge(null);
    setEvaluation(null);
    setHints([]);
    setHintLevel(0);
    setFullAnswer(null);
    setFullAnswerLoading(false);
    setError(null);
  };

  return {
    phase, challenge, evaluation, hints, hintLevel, fullAnswer, fullAnswerLoading, hintLoading, error, stats,
    generate, evaluate, requestHint, requestFullAnswer, reset, clearStats,
  };
}
