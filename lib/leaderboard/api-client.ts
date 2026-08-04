import type { LeaderboardData, LeaderboardEntry } from './types';

/**
 * Client-side fetchers for the leaderboard API.
 * Only imports pure modules — never touches server code or secrets.
 */

export class LeaderboardApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'LeaderboardApiError';
  }
}

export async function fetchLeaderboard(signal?: AbortSignal): Promise<LeaderboardData> {
  const res = await fetch('/api/leaderboard', {
    signal,
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new LeaderboardApiError(res.status, 'Failed to load leaderboard.');
  }
  return (await res.json()) as LeaderboardData;
}

export async function createSession(): Promise<{ token: string; expiresAt: number }> {
  const res = await fetch('/api/leaderboard/session', {
    method: 'POST',
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new LeaderboardApiError(res.status, 'Failed to start game session.');
  }
  return (await res.json()) as { token: string; expiresAt: number };
}

export interface SubmitScoreResponse {
  saved: boolean;
  reason?: string;
  entry?: LeaderboardEntry;
  leaderboard: LeaderboardData;
}

export async function submitScore(input: {
  name: string;
  score: number;
  token: string;
}): Promise<SubmitScoreResponse> {
  const res = await fetch('/api/leaderboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  let data: SubmitScoreResponse | null = null;
  try {
    data = (await res.json()) as SubmitScoreResponse;
  } catch {
    // Non-JSON error body; fall through to status-based error.
  }

  if (!res.ok) {
    const message = data && 'error' in data
      ? (data as { error: string }).error
      : 'Failed to save score.';
    throw new LeaderboardApiError(res.status, message);
  }

  if (!data) {
    throw new LeaderboardApiError(res.status, 'Failed to save score.');
  }
  return data;
}
