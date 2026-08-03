'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import InteractivePortfolioGame from './InteractivePortfolioGame';

interface Props {
  onClose: () => void;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 520;

export default function GameOverlay({ onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

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
      overlayRef.current?.querySelector<HTMLElement>('button')?.focus();
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
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-bg-dark/80 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative bg-card border-2 border-bg-dark rounded-sm shadow-lg overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{
          width: `min(92vw, calc((100dvh - 6rem) * ${GAME_WIDTH / GAME_HEIGHT}))`,
          aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close game"
          className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-sm border border-divider bg-bg-dark text-text-secondary hover:bg-bg-accent hover:text-white transition-colors text-sm leading-none"
        >
          ✕
        </button>
        <InteractivePortfolioGame />
      </div>

      <div className="text-center font-tech text-[10px] text-text-secondary uppercase tracking-widest opacity-60">
        [A/D] or [←/→] move &middot; [Space] shoot &middot; click loot to view projects
      </div>
    </div>,
    document.body
  );
}
