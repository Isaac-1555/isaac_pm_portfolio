import { Redis } from '@upstash/redis';
import { KV_PREFIX } from './types';
import type { LeaderboardEntry } from './types';

/**
 * Server-only Upstash Redis client.
 * Reads credentials from the standard Upstash env names, falling back to the
 * legacy Vercel KV names and a HIGH_SCORE_-prefixed variant for namespacing.
 */

function resolveEnv(): { url?: string; token?: string } {
  return {
    url:
      process.env.UPSTASH_REDIS_REST_URL ??
      process.env.KV_REST_API_URL ??
      process.env.HIGH_SCORE_KV_REST_API_URL,
    token:
      process.env.UPSTASH_REDIS_REST_TOKEN ??
      process.env.KV_REST_API_TOKEN ??
      process.env.HIGH_SCORE_KV_REST_API_TOKEN,
  };
}

let client: Redis | null = null;

export function getRedis(): Redis {
  if (client) return client;
  const { url, token } = resolveEnv();
  if (!url || !token) {
    throw new Error(
      'Upstash Redis is not configured. Set UPSTASH_REDIS_REST_URL and ' +
        'UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL / KV_REST_API_TOKEN) ' +
        'in your environment.'
    );
  }
  client = new Redis({ url, token });
  return client;
}

export const leaderboardKey = (): string => `${KV_PREFIX}:scores`;
export const sessionKey = (token: string): string => `${KV_PREFIX}:session:${token}`;
export const rateLimitKey = (ipHash: string, windowStart: number): string =>
  `${KV_PREFIX}:rl:${ipHash}:${windowStart}`;

/**
 * Sorted-set member encoding.
 *
 * Member = `<timeComplement>:<entryJson>`.
 * The complement (9e15 - createdAt, zero-padded) makes equal scores sort by
 * submission time: Redis breaks ties lexicographically, and ZRANGE ... REV
 * returns descending members, so the EARLIER submission (larger complement)
 * ranks first. The JSON payload avoids a second lookup per entry.
 */
const TIME_BASE = BigInt('9000000000000000');

export function makeMember(createdAt: number, entry: LeaderboardEntry): string {
  const complement = (TIME_BASE - BigInt(createdAt)).toString().padStart(16, '0');
  return `${complement}:${JSON.stringify(entry)}`;
}

export function parseMember(member: string): LeaderboardEntry {
  const sep = member.indexOf(':');
  if (sep === -1) throw new Error('Malformed member');
  return JSON.parse(member.slice(sep + 1)) as LeaderboardEntry;
}
