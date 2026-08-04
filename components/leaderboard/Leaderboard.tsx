'use client';

import TrophyIcon from '@/components/icons/trophy-icon';
import { cn } from '@/lib/utils';
import { LEADERBOARD_TOP_N } from '@/lib/leaderboard/types';
import type { LeaderboardEntry } from '@/lib/leaderboard/types';

/**
 * Standalone "HIGH SCORES" panel rendered inside the game lightbox.
 * Presentational: all state lives in useLeaderboard() (owned by GameOverlay).
 */

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  highlightedId: string | null;
  onRetry: () => void;
  className?: string;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

const RANK_CLASS: Record<number, string> = {
  0: 'text-gold',
  1: 'text-text-secondary',
  2: 'text-warning',
};

export function Leaderboard({
  entries,
  loading,
  error,
  highlightedId,
  onRetry,
  className,
}: LeaderboardProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-sm border-2 border-bg-dark bg-card shadow-lg',
        className
      )}
    >
      {/* Panel header */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-bg-dark bg-bg-dark px-3 py-2">
        <div className="flex items-center gap-2">
          <TrophyIcon size={15} color="var(--color-gold)" className="cursor-default" />
          <span className="font-industrial text-xs uppercase tracking-widest text-[#F0EAD6]">
            High Scores
          </span>
        </div>
        <span className="font-tech text-[10px] uppercase tracking-widest text-text-secondary">
          Top {LEADERBOARD_TOP_N}
        </span>
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <LeaderboardSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
            <p className="font-tech text-xs leading-relaxed text-text-secondary">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-sm border-2 border-bg-dark bg-transparent px-4 py-1.5 font-industrial text-[10px] uppercase tracking-widest text-bg-dark transition-colors hover:bg-bg-dark hover:text-white"
            >
              Retry
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
            <p className="font-tech text-xs uppercase tracking-widest text-text-secondary">
              No scores yet
            </p>
            <p className="font-tech text-[10px] text-text-secondary/80">
              Finish a run to claim the top spot.
            </p>
          </div>
        ) : (
          <ol className="divide-y divide-divider/30">
            {entries.map((entry, index) => {
              const highlighted = entry.id === highlightedId;
              return (
                <li
                  key={entry.id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 transition-colors',
                    index % 2 === 0 ? 'bg-card' : 'bg-card/70',
                    highlighted &&
                      'bg-gold/85 ring-1 ring-inset ring-bg-dark'
                  )}
                >
                  <span
                    className={cn(
                      'w-6 shrink-0 text-center font-tech text-sm font-bold',
                      RANK_CLASS[index] ?? 'text-text-primary'
                    )}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      'min-w-0 flex-1 truncate font-tech text-sm text-text-primary',
                      highlighted && 'font-semibold text-bg-dark'
                    )}
                  >
                    {entry.name}
                  </span>
                  <span className="hidden shrink-0 font-jb text-[10px] text-text-secondary sm:inline">
                    {timeAgo(entry.createdAt)}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 font-jb text-sm tabular-nums text-text-primary',
                      highlighted && 'text-bg-dark'
                    )}
                  >
                    {entry.score.toLocaleString()}
                  </span>
                  {highlighted && (
                    <span className="shrink-0 rounded-sm bg-bg-dark px-1.5 py-0.5 font-tech text-[9px] uppercase tracking-widest text-gold">
                      You
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-3 py-3" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 animate-pulse"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <div className="h-4 w-6 rounded-sm bg-divider/40" />
          <div className="h-4 flex-1 rounded-sm bg-divider/40" />
          <div className="h-4 w-10 rounded-sm bg-divider/40" />
        </div>
      ))}
    </div>
  );
}
