import HeroContent from './HeroContent';
import InteractivePortfolioGame from './InteractivePortfolioGame';

export function Hero() {
  return (
    <section
      id="mission-home-hero"
      className="relative w-full min-h-[calc(100dvh-3.5rem)] md:min-h-[calc(100dvh-4rem)] bg-bg-base py-12 md:py-16 lg:py-24 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 diagonal-stripes pointer-events-none" />

      {/* Accent Stripe */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-bg-dark/10 to-transparent skew-x-12 transform origin-top-right pointer-events-none" />

      <div className="container mx-auto relative z-10 px-6 md:px-8">
        <div className="relative">
          {/* Hero Content */}
          <div className="w-full lg:w-1/2 pb-[calc(300px+2rem)] lg:pb-0">
            <HeroContent />
          </div>

          {/* Game Area - absolutely positioned, anchored to right (desktop) or bottom (mobile) */}
          <div className="absolute z-10 left-0 right-0 bottom-0 lg:left-auto lg:right-0 lg:top-0 lg:bottom-auto lg:w-2/5">
            <div className="border-2 border-bg-dark rounded-sm bg-card shadow-lg relative overflow-hidden min-h-[300px] lg:min-h-[360px]">
              <InteractivePortfolioGame />
            </div>

            {/* Controls Hint */}
            <div className="hidden lg:block mt-2 text-center font-tech text-[10px] text-text-secondary uppercase tracking-widest opacity-40">
              [A/D] or [←/→] move &middot; [Space] shoot &middot; click loot to view projects
            </div>
          </div>
        </div>
      </div>

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
