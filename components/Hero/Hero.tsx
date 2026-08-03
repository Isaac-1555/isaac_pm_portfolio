'use client';

import { useState } from 'react';
import HeroContent from './HeroContent';
import { HeroBackground } from './HeroBackground';
import GameOverlay from './GameOverlay';
import TrophyIcon from '@/components/icons/trophy-icon';

export function Hero() {
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <section
      id="mission-home-hero"
      className="relative w-full min-h-[calc(100dvh-3.5rem)] md:min-h-[calc(100dvh-4rem)] bg-bg-base flex flex-col items-center justify-center [@media(max-height:680px)]:justify-start overflow-hidden"
    >
      <HeroBackground />

      <div className="hero-wrap container mx-auto relative z-10 px-6 md:px-8">
        <HeroContent />
      </div>

      {/* Game Launch */}
      <button
        type="button"
        onClick={() => setIsGameOpen(true)}
        aria-label="Beat the high score"
        className="hero-game-btn group absolute bottom-6 left-6 z-20 flex h-11 items-center overflow-hidden rounded-sm border-2 border-[#F0EAD6]/25 bg-tech text-[#F0EAD6] transition-colors duration-300 hover:border-[#F0EAD6]/50 hover:bg-tech/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8DCC0]"
      >
        <span className="flex h-full w-11 shrink-0 items-center justify-center">
          <TrophyIcon size={18} />
        </span>
        <span className="hero-game-btn-label max-w-0 overflow-hidden whitespace-nowrap font-industrial text-sm uppercase tracking-widest opacity-0 transition-all duration-500 ease-in-out group-hover:max-w-80 group-hover:pl-2 group-hover:pr-4 group-hover:opacity-100 group-focus-within:max-w-80 group-focus-within:pl-2 group-focus-within:pr-4 group-focus-within:opacity-100">
          Beat the high score
        </span>
      </button>

      {isGameOpen && <GameOverlay onClose={() => setIsGameOpen(false)} />}

      {/* Decorative Status */}
      <div className="absolute bottom-10 right-10 hidden lg:block text-right opacity-90 pointer-events-none z-20 [text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_6px_rgba(0,0,0,0.85)]">
        <div className="font-tech text-[#F0EAD6] uppercase tracking-widest text-xs">
          STATUS: AVAILABLE
        </div>
        <div className="font-tech text-[#F0EAD6] uppercase tracking-widest text-xs">
          LOC: CALGARY, AB
        </div>
      </div>
    </section>
  );
}
