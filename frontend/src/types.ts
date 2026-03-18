export interface Challenge {
  title: string;
  type: string;
  body: string;
  key_concepts: string[];
  difficulty_note: string;
}

export type Verdict = 'strong' | 'acceptable' | 'needs_work' | 'off_track';

export interface Evaluation {
  covered_concepts: string[];
  missing_concepts: string[];
  coverage_percent: number;
  feedback: string;
  strengths: string;
  verdict: Verdict;
}

export interface Stats {
  total: number;
  strong: number;
  acceptable: number;
  needs_work: number;
  off_track: number;
}
