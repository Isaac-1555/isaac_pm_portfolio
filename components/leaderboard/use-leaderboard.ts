'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  fetchLeaderboard,
  submitScore,
  type SubmitScoreResponse,
} from '@/lib/leaderboard/api-client';
import { qualifiesForScore } from '@/lib/leaderboard/validation';
import { LEADERBOARD_TOP_N } from '@/lib/leaderboard/types';
import type { LeaderboardData, LeaderboardEntry } from '@/lib/leaderboard/types';

/**
 * React state + data fetching for the leaderboard.
 * Single instance per game lightbox so the panel and the score-entry flow
 * share one source of truth.
 */
export interface UseLeaderboard {
  entries: LeaderboardEntry[];
  cutoff: number | null;
  loading: boolean;
  error: string | null;
  submittedEntryId: string | null;
  setSubmittedEntryId: (id: string | null) => void;
  qualifiesFor: (score: number) => boolean;
  refresh: () => Promise<void>;
  submit: (name: string, score: number, token: string) => Promise<SubmitScoreResponse>;
}

export function useLeaderboard(): UseLeaderboard {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [cutoff, setCutoff] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submittedEntryId, setSubmittedEntryId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data: LeaderboardData = await fetchLeaderboard();
      setEntries(data.entries);
      setCutoff(data.cutoff);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error && err.message ? err.message : 'Failed to load leaderboard.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const qualifiesFor = useCallback(
    (score: number) => qualifiesForScore(score, cutoff),
    [cutoff]
  );

  const submit = useCallback(
    async (name: string, score: number, token: string): Promise<SubmitScoreResponse> => {
      const res = await submitScore({ name, score, token });
      // The POST returns a fresh board — apply it immediately, no extra request.
      setEntries(res.leaderboard.entries);
      setCutoff(res.leaderboard.cutoff);
      return res;
    },
    []
  );

  return {
    entries,
    cutoff,
    loading,
    error,
    submittedEntryId,
    setSubmittedEntryId,
    qualifiesFor,
    refresh,
    submit,
  };
}

/** Keep the board size constant available for empty-state messaging. */
export { LEADERBOARD_TOP_N };
