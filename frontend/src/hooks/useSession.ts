import { useState } from 'react';
import type { Stats, Verdict } from '../types';

const STORAGE_KEY = 'interview-trainer-stats';

const EMPTY_STATS: Stats = { total: 0, strong: 0, acceptable: 0, needs_work: 0, off_track: 0 };

function loadStats(): Stats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Stats;
  } catch (e) {
    console.error('Failed to load stats from localStorage:', e);
  }
  return { ...EMPTY_STATS };
}

function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats to localStorage:', e);
  }
}

export function useSession() {
  const [stats, setStats] = useState<Stats>(loadStats);

  const recordResult = (verdict: Verdict) => {
    setStats((prev) => {
      const next: Stats = {
        ...prev,
        total: prev.total + 1,
        [verdict]: prev[verdict] + 1,
      };
      saveStats(next);
      return next;
    });
  };

  const clearStats = () => {
    saveStats({ ...EMPTY_STATS });
    setStats({ ...EMPTY_STATS });
  };

  return { stats, recordResult, clearStats };
}
