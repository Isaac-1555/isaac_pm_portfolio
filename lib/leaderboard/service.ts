import { createHash, randomUUID } from 'crypto';
import {
  getRedis,
  leaderboardKey,
  rateLimitKey,
  sessionKey,
  makeMember,
  parseMember,
} from './redis';
import { parseScore, qualifiesForScore, sanitizeName } from './validation';
import {
  LEADERBOARD_CAP,
  LEADERBOARD_TOP_N,
  MIN_SESSION_MS,
  RATE_LIMIT_HITS_PER_WINDOW,
  RATE_LIMIT_WINDOW_MS,
  SESSION_TTL_SECONDS,
} from './types';
import type { LeaderboardData, LeaderboardEntry } from './types';

/** All server-side leaderboard logic lives here. Route handlers stay thin. */

export async function createSession(): Promise<{ token: string; expiresAt: number }> {
  const redis = getRedis();
  const token = randomUUID();
  const createdAt = Date.now();
  await redis.set(
    sessionKey(token),
    JSON.stringify({ createdAt }),
    { ex: SESSION_TTL_SECONDS }
  );
  return { token, expiresAt: createdAt + SESSION_TTL_SECONDS * 1000 };
}

export async function getLeaderboardData(): Promise<LeaderboardData> {
  const redis = getRedis();
  const members = await redis.zrange<string[]>(leaderboardKey(), 0, LEADERBOARD_TOP_N - 1, {
    rev: true,
  });

  const entries: LeaderboardEntry[] = [];
  for (const member of members) {
    try {
      entries.push(parseMember(member));
    } catch {
      // Skip corrupt members rather than failing the whole read.
    }
  }

  const cutoff = entries.length >= LEADERBOARD_TOP_N ? entries[LEADERBOARD_TOP_N - 1].score : null;
  return { entries, cutoff };
}

export type SubmitOutcome =
  | { status: 'saved'; entry: LeaderboardEntry; leaderboard: LeaderboardData }
  | { status: 'does_not_qualify'; leaderboard: LeaderboardData }
  | { status: 'rate_limited' }
  | { status: 'invalid_session' }
  | { status: 'rejected'; reason: string };

export interface SubmitInput {
  name: unknown;
  score: unknown;
  token: unknown;
  ip?: string;
}

export async function submitScore(input: SubmitInput): Promise<SubmitOutcome> {
  // 1. Validate score + name before touching any shared state.
  const score = parseScore(input.score);
  if (!score.ok) return { status: 'rejected', reason: score.reason };

  const name = sanitizeName(input.name);
  if (!name.ok) return { status: 'rejected', reason: name.reason };

  if (typeof input.token !== 'string' || input.token.length === 0) {
    return { status: 'invalid_session' };
  }

  const redis = getRedis();

  // 2. Basic rate limit: one submission per window per IP.
  const ipHash = createHash('sha256')
    .update(input.ip ?? 'unknown')
    .digest('hex');
  const windowStart = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS);
  const rlResult = await redis.set(
    rateLimitKey(ipHash, windowStart),
    String(RATE_LIMIT_HITS_PER_WINDOW),
    {
      nx: true,
      ex: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000) + 1,
    }
  );
  if (rlResult !== 'OK') {
    return { status: 'rate_limited' };
  }

  // 3. Verify the session token and enforce a minimum play duration.
  // NOTE: @upstash/redis `get` auto-deserializes JSON, so the stored
  // { createdAt } object comes back already parsed.
  const session = await redis.get<{ createdAt: number }>(sessionKey(input.token));
  if (!session || typeof session.createdAt !== 'number') {
    return { status: 'invalid_session' };
  }
  if (Date.now() - session.createdAt < MIN_SESSION_MS) {
    return { status: 'rejected', reason: 'Score submitted too fast.' };
  }

  // 4. Consume the token atomically: only one request can win the DEL.
  const removed = await redis.del(sessionKey(input.token));
  if (removed === 0) return { status: 'invalid_session' };

  // 5. Only save scores that actually make the board.
  const leaderboard = await getLeaderboardData();
  if (!qualifiesForScore(score.value, leaderboard.cutoff)) {
    return { status: 'does_not_qualify', leaderboard };
  }

  // 6. Insert + trim. Equal scores rank by earlier submission via member encoding.
  const id = randomUUID();
  const createdAt = Date.now();
  const entry: LeaderboardEntry = {
    id,
    name: name.value,
    score: score.value,
    createdAt,
  };

  await redis.zadd(leaderboardKey(), { score: entry.score, member: makeMember(createdAt, entry) });
  await redis.zremrangebyrank(leaderboardKey(), 0, -(LEADERBOARD_CAP + 1));

  const fresh = await getLeaderboardData();
  return { status: 'saved', entry, leaderboard: fresh };
}
