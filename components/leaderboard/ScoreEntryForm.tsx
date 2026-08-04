'use client';

import { useEffect, useRef, useState } from 'react';
import { sanitizeName } from '@/lib/leaderboard/validation';
import { NAME_MAX_LENGTH } from '@/lib/leaderboard/types';

/**
 * Name-entry modal shown at game over when a score qualifies for the Top 10.
 * Mirrors the server's sanitization rules for instant client-side feedback;
 * the server re-validates and remains the source of truth.
 */

interface ScoreEntryFormProps {
  score: number;
  waveReached: number;
  submitting: boolean;
  error: string | null;
  onSubmit: (name: string) => void;
  onDismiss: () => void;
}

export function ScoreEntryForm({
  score,
  waveReached,
  submitting,
  error,
  onSubmit,
  onDismiss,
}: ScoreEntryFormProps) {
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    const result = sanitizeName(name);
    if (!result.ok) {
      setLocalError(result.reason);
      return;
    }
    setLocalError(null);
    onSubmit(result.value);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-bg-dark/70 p-4 backdrop-blur-sm">
      <div className="nasa-punk-card w-full max-w-sm">
        <div className="mb-4 text-center">
          <div className="font-industrial text-sm uppercase tracking-widest text-gold">
            Top 10 Qualified
          </div>
          <div className="mt-2 font-jb text-3xl tabular-nums text-text-primary">
            {score.toLocaleString()}
          </div>
          <div className="font-tech text-[10px] uppercase tracking-widest text-text-secondary">
            Wave {waveReached}
          </div>
        </div>

        <label
          htmlFor="leaderboard-name"
          className="technical-label mb-1 block"
        >
          Enter your name
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id="leaderboard-name"
            type="text"
            value={name}
            maxLength={NAME_MAX_LENGTH}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setName(e.target.value);
              if (localError) setLocalError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Pilot"
            aria-invalid={Boolean(localError)}
            className="w-full rounded-sm border-2 border-bg-dark bg-bg-base px-3 py-2 font-tech text-sm text-text-primary outline-none transition-colors focus:border-cta"
          />
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-jb text-[10px] text-text-secondary">
            {name.length}/{NAME_MAX_LENGTH}
          </span>
        </div>

        <div className="mt-2 min-h-[1rem]">
          {(localError || error) && (
            <p className="font-tech text-[10px] text-cta" role="alert">
              {localError ?? error}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDismiss}
            disabled={submitting}
            className="rounded-sm border-2 border-bg-dark bg-transparent px-4 py-2 font-industrial text-[10px] uppercase tracking-widest text-bg-dark transition-colors hover:bg-bg-dark hover:text-white disabled:opacity-50"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-sm border-2 border-bg-dark bg-cta px-6 py-2 font-industrial text-[11px] uppercase tracking-widest text-white transition-all hover:bg-warning hover:shadow-[4px_4px_0px_var(--color-bg-dark)] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Save score'}
          </button>
        </div>
      </div>
    </div>
  );
}
