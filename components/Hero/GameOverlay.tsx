'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import InteractivePortfolioGame, { type GameResult } from './InteractivePortfolioGame';
import { Button } from '@/components/ui/button';
import { Leaderboard } from '@/components/leaderboard/Leaderboard';
import { ScoreEntryForm } from '@/components/leaderboard/ScoreEntryForm';
import { useLeaderboard } from '@/components/leaderboard/use-leaderboard';
import { createSession, LeaderboardApiError } from '@/lib/leaderboard/api-client';

interface Props {
  onClose: () => void;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 520;

/**
 * Full-screen game lightbox.
 * Hosts the canvas game, the standalone global leaderboard, and the
 * post-game score-entry flow. A one-time session token is issued on open
 * and consumed server-side when a score is submitted.
 */
export default function GameOverlay({ onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const keepPlayingRef = useRef<HTMLButtonElement>(null);

  const leaderboard = useLeaderboard();

  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);

  // Issue a fresh one-time session token when the lightbox opens.
  useEffect(() => {
    let cancelled = false;
    createSession()
      .then((session) => {
        if (!cancelled) setSessionToken(session.token);
      })
      .catch(() => {
        if (!cancelled) setSessionError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGameStart = useCallback(() => {
    setGameResult(null);
    setSubmitError(null);
    setIsPlaying(true);
  }, []);

  const handleGameOver = useCallback((result: GameResult) => {
    setGameResult(result);
    setSubmitError(null);
    setIsPlaying(false);
  }, []);

  const requestClose = useCallback(() => {
    if (isPlaying) {
      setConfirmQuit(true);
      return;
    }
    onClose();
  }, [isPlaying, onClose]);

  useEffect(() => {
    if (!isPlaying) setConfirmQuit(false);
  }, [isPlaying]);

  useEffect(() => {
    if (!confirmQuit) return;
    const timer = setTimeout(() => keepPlayingRef.current?.focus(), 30);
    return () => clearTimeout(timer);
  }, [confirmQuit]);

  const qualifies = gameResult !== null && leaderboard.qualifiesFor(gameResult.score);

  const handleSubmitName = useCallback(
    async (name: string) => {
      if (!gameResult) return;
      if (!sessionToken) {
        setSubmitError(sessionError ? 'Game session unavailable. Try again.' : 'Session still loading. Try again.');
        return;
      }
      setSubmitting(true);
      setSubmitError(null);
      try {
        const res = await leaderboard.submit(name, gameResult.score, sessionToken);
        if (res.saved && res.entry) {
          leaderboard.setSubmittedEntryId(res.entry.id);
        }
        // Success or "does_not_qualify" race: close the prompt either way.
        setGameResult(null);
      } catch (err) {
        if (err instanceof LeaderboardApiError && err.status === 401) {
          setSubmitError('This game session expired. Press Space to play again.');
          setGameResult(null);
        } else if (err instanceof LeaderboardApiError && err.status === 429) {
          setSubmitError('Slow down — one score every 10 seconds.');
        } else {
          setSubmitError('Could not save your score. Try again.');
        }
      } finally {
        setSubmitting(false);
      }
    },
    [gameResult, sessionToken, sessionError, leaderboard]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      const el = overlayRef.current?.querySelector<HTMLElement>(
        'canvas, button, input, [tabindex]:not([tabindex="-1"])'
      );
      el?.focus();
    }, 50);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer);
    };
  }, [handleKeyDown]);

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive portfolio game"
      className="fixed inset-0 z-[60] flex flex-col items-center gap-4 overflow-y-auto bg-bg-dark/80 p-4 backdrop-blur-sm"
    >
      {/* Centered game card. The leaderboard floats to the right on lg+. */}
      <div className="relative w-full lg:my-auto lg:w-auto">
        <div
          className="relative mx-auto overflow-hidden rounded-sm border-2 border-bg-dark bg-card shadow-lg lg:max-w-[calc(100vw-44rem)]"
          style={{
            width: `min(92vw, calc((100dvh - 10rem) * ${GAME_WIDTH / GAME_HEIGHT}))`,
            aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
          }}
        >
          <InteractivePortfolioGame
            onGameOver={handleGameOver}
            onGameStart={handleGameStart}
          />
        </div>
      </div>

      <button
        onClick={requestClose}
        aria-label="Quit game"
        className="fixed top-4 right-4 z-[70] w-8 h-8 flex items-center justify-center rounded-sm border border-divider bg-bg-dark/60 text-text-secondary hover:bg-bg-accent hover:text-white transition-colors text-sm leading-none"
      >
        ✕
      </button>

      {/* Standalone global leaderboard — stacked below the game on mobile,
          pinned to the right edge on desktop. */}
      <Leaderboard
        entries={leaderboard.entries}
        loading={leaderboard.loading}
        error={leaderboard.error}
        highlightedId={leaderboard.submittedEntryId}
        onRetry={leaderboard.refresh}
        className="w-full max-w-md lg:absolute lg:right-6 lg:top-1/2 lg:max-h-[calc(100dvh-8rem)] lg:w-80 lg:max-w-80 lg:-translate-y-1/2"
      />

      <div className="text-center font-tech text-[10px] uppercase tracking-widest text-white">
        [A/D] or [←/→] or mouse move &middot; hold click / [Space] shoot &middot; click loot to view projects
      </div>

      {qualifies && gameResult && (
        <ScoreEntryForm
          score={gameResult.score}
          waveReached={gameResult.waveReached}
          submitting={submitting}
          error={submitError}
          onSubmit={handleSubmitName}
          onDismiss={() => setGameResult(null)}
        />
      )}

      {confirmQuit && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-bg-dark/50 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Quit game?"
            className="w-full max-w-xs rounded-sm border-2 border-bg-dark bg-card p-5 shadow-lg"
          >
            <h3 className="font-industrial text-base uppercase tracking-wider text-text-primary">
              Quit current run?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary font-sans">
              Your progress in this run will be lost.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                ref={keepPlayingRef}
                variant="outline"
                size="sm"
                onClick={() => setConfirmQuit(false)}
              >
                Keep playing
              </Button>
              <Button variant="destructive" size="sm" onClick={onClose}>
                Quit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
