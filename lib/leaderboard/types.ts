/**
 * Shared types and constants for the global game leaderboard.
 * Pure module: safe to import from both server (route handlers) and client.
 */

export const LEADERBOARD_TOP_N = 10;

/** Max entries kept in the sorted set (bound storage; reads still O(log N)). */
export const LEADERBOARD_CAP = 100;

/** Valid score range for a single game run. Anything outside is rejected. */
export const LEADERBOARD_MIN_SCORE = 1;
export const LEADERBOARD_MAX_SCORE = 1_000_000;

/** Max display-name length after sanitization. */
export const NAME_MAX_LENGTH = 20;

/** Game session tokens live this long before they expire. */
export const SESSION_TTL_SECONDS = 60 * 60 * 2;

/** Basic rate limit: one submission per window, per IP. */
export const RATE_LIMIT_WINDOW_MS = 10_000;
export const RATE_LIMIT_HITS_PER_WINDOW = 1;

/** Reject submissions that arrive faster than a real game could finish. */
export const MIN_SESSION_MS = 5_000;

/** Redis key namespace for everything this feature touches. */
export const KV_PREFIX = 'game:leaderboard';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  createdAt: number;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  /** Score of the current 10th place, or null when fewer than 10 entries exist. */
  cutoff: number | null;
}
