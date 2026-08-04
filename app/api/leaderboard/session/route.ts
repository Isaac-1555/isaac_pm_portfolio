import { NextResponse } from 'next/server';
import { createSession } from '@/lib/leaderboard/service';

/**
 * POST /api/leaderboard/session
 * Issues a one-time game session token, stored server-side with a TTL.
 * The client sends it back when submitting a score; the server consumes it
 * atomically so the same game session cannot submit twice.
 */
export async function POST(): Promise<NextResponse> {
  try {
    const session = await createSession();
    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    console.error('[leaderboard] session creation failed:', err);
    return NextResponse.json(
      { error: 'Could not start a game session.' },
      { status: 500 }
    );
  }
}
