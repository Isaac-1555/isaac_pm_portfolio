'use client';

import { useState } from 'react';
import HeroContent from './HeroContent';
import { HeroBackground } from './HeroBackground';
import GameOverlay from './GameOverlay';
import { Button } from '@/components/ui/button';
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
      <Button
        variant="gold"
        size="lg"
        onClick={() => setIsGameOpen(true)}
        className="hero-game-btn absolute bottom-6 left-6 z-20 group gap-2"
      >
        Beat the high score
        <TrophyIcon size={16} className="transition-transform group-hover:translate-y-0.5" />
      </Button>

      {isGameOpen && <GameOverlay onClose={() => setIsGameOpen(false)} />}

      {/* Decorative Status */}
      <div className="absolute bottom-10 right-10 hidden lg:block text-right opacity-50 pointer-events-none z-20">
        <div className="font-tech text-text-secondary uppercase tracking-widest text-xs">
          STATUS: AVAILABLE
        </div>
        <div className="font-tech text-text-secondary uppercase tracking-widest text-xs">
          LOC: CALGARY, AB
        </div>
      </div>
    </section>
  );
}
