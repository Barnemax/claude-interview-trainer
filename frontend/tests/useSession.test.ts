import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSession } from '../src/hooks/useSession';

const STORAGE_KEY = 'interview-trainer-stats';

beforeEach(() => {
  localStorage.clear();
});

describe('useSession', () => {
  it('starts with zeroed stats when localStorage is empty', () => {
    const { result } = renderHook(() => useSession());
    expect(result.current.stats).toEqual({
      total: 0, strong: 0, acceptable: 0, needs_work: 0, off_track: 0,
    });
  });

  it('increments total and the correct verdict counter on recordResult', () => {
    const { result } = renderHook(() => useSession());

    act(() => { result.current.recordResult('strong'); });
    expect(result.current.stats.total).toBe(1);
    expect(result.current.stats.strong).toBe(1);

    act(() => { result.current.recordResult('needs_work'); });
    expect(result.current.stats.total).toBe(2);
    expect(result.current.stats.needs_work).toBe(1);
  });

  it('persists stats to localStorage on recordResult', () => {
    const { result } = renderHook(() => useSession());

    act(() => { result.current.recordResult('acceptable'); });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.acceptable).toBe(1);
    expect(stored.total).toBe(1);
  });

  it('loads existing stats from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      total: 5, strong: 3, acceptable: 1, needs_work: 1, off_track: 0,
    }));

    const { result } = renderHook(() => useSession());
    expect(result.current.stats.total).toBe(5);
    expect(result.current.stats.strong).toBe(3);
  });

  it('resets all stats to zero on clearStats', () => {
    const { result } = renderHook(() => useSession());

    act(() => { result.current.recordResult('strong'); });
    act(() => { result.current.recordResult('off_track'); });
    act(() => { result.current.clearStats(); });

    expect(result.current.stats).toEqual({
      total: 0, strong: 0, acceptable: 0, needs_work: 0, off_track: 0,
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).total).toBe(0);
  });
});
