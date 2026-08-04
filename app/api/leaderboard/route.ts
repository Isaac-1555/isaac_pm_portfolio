import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboardData, submitScore } from '@/lib/leaderboard/service';

/**
 * GET /api/leaderboard
 * Returns the top 10 scores plus the 10th-place cutoff (for qualification).
 * No secrets, no auth, cheap O(log N) sorted-set read.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const data = await getLeaderboardData();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[leaderboard] GET failed:', err);
    return NextResponse.json(
      { error: 'Leaderboard is temporarily unavailable.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leaderboard
 * Validates and (if it qualifies) saves a score. All validation happens here.
 * Body: { name, score, token }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = (forwardedFor ? forwardedFor.split(',')[0] : request.headers.get('x-real-ip'))?.trim() ?? 'unknown';

  try {
    const outcome = await submitScore({
      name: body.name,
      score: body.score,
      token: body.token,
      ip,
    });

    switch (outcome.status) {
      case 'saved':
        return NextResponse.json(
          { saved: true, entry: outcome.entry, leaderboard: outcome.leaderboard },
          { status: 201 }
        );
      case 'does_not_qualify':
        return NextResponse.json(
          { saved: false, reason: 'does_not_qualify', leaderboard: outcome.leaderboard },
          { status: 200 }
        );
      case 'rate_limited':
        return NextResponse.json(
          { saved: false, error: 'Too many submissions. Please wait a few seconds.' },
          { status: 429 }
        );
      case 'invalid_session':
        return NextResponse.json(
          { saved: false, error: 'Invalid or expired game session.' },
          { status: 401 }
        );
      case 'rejected':
        return NextResponse.json({ saved: false, error: outcome.reason }, { status: 400 });
    }
  } catch (err) {
    console.error('[leaderboard] POST failed:', err);
    return NextResponse.json(
      { saved: false, error: 'Could not save score. Please try again.' },
      { status: 500 }
    );
  }
}
