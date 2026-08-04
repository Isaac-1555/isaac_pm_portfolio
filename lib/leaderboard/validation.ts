import {
  LEADERBOARD_MAX_SCORE,
  LEADERBOARD_MIN_SCORE,
  NAME_MAX_LENGTH,
} from './types';

/**
 * Pure validation/sanitization helpers.
 * Mirrored on the client so the UI gives instant feedback with the same rules
 * the server enforces. The server is always the source of truth.
 */

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; reason: string };

/**
 * Sanitize a player name:
 * - strips control characters and HTML angle brackets
 * - collapses internal whitespace and trims
 * - truncates to NAME_MAX_LENGTH
 */
export function sanitizeName(raw: unknown): ValidationResult<string> {
  if (typeof raw !== 'string') {
    return { ok: false, reason: 'Name must be a string.' };
  }
  const name = raw
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, NAME_MAX_LENGTH);

  if (name.length === 0) {
    return { ok: false, reason: 'Name cannot be empty.' };
  }
  return { ok: true, value: name };
}

/** Validate a score is an integer inside the game's achievable range. */
export function parseScore(raw: unknown): ValidationResult<number> {
  const num = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN;
  if (!Number.isInteger(num)) {
    return { ok: false, reason: 'Score must be an integer.' };
  }
  if (num < LEADERBOARD_MIN_SCORE || num > LEADERBOARD_MAX_SCORE) {
    return {
      ok: false,
      reason: `Score must be between ${LEADERBOARD_MIN_SCORE} and ${LEADERBOARD_MAX_SCORE}.`,
    };
  }
  return { ok: true, value: num };
}

/**
 * A score qualifies for the board when it is within the valid range AND either
 * the board is not full (cutoff null) or it strictly beats the 10th place.
 * Equal scores do NOT displace an earlier submission.
 */
export function qualifiesForScore(score: number, cutoff: number | null): boolean {
  if (!Number.isInteger(score)) return false;
  if (score < LEADERBOARD_MIN_SCORE || score > LEADERBOARD_MAX_SCORE) return false;
  return cutoff === null || score > cutoff;
}
