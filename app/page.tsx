import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { FadeIn } from "@/components/ui/fade-in";

export default function Home() {
  return (
    <>
      <FadeIn>
        <Hero />
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <FeaturedWork />
      </FadeIn>
      
      <FadeIn delay={0.4}>
        {/* Quick About Section */}
        <section className="py-24 bg-bg-dark text-bg-base relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 z-0 diagonal-stripes opacity-5 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4 font-tech text-gold uppercase tracking-widest">
                Profile Summary
              </div>
              <h2 className="text-3xl md:text-5xl font-industrial font-bold uppercase tracking-widest text-white mb-6">
                Engineering <span className="text-cta">Impact</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8 max-w-lg">
                With over 8 years of experience in product management and systems architecture, I specialize in transforming ambiguous problems into scalable, user-centric solutions. My approach combines rigorous data analysis with intuitive design principles.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="border-l-2 border-cta pl-4">
                  <div className="text-4xl font-industrial font-bold text-white">8+</div>
                  <div className="text-sm font-tech text-text-secondary uppercase">Years Exp</div>
                </div>
                <div className="border-l-2 border-cta pl-4">
                  <div className="text-4xl font-industrial font-bold text-white">12</div>
                  <div className="text-sm font-tech text-text-secondary uppercase">Products Shipped</div>
                </div>
              </div>
            </div>
            <div className="relative h-96 w-full border-2 border-bg-accent rounded-sm overflow-hidden bg-bg-accent/20 backdrop-blur flex items-center justify-center">
              {/* Placeholder for Profile Image or abstract graphic */}
              <div className="text-bg-accent/50 font-industrial text-4xl font-bold uppercase tracking-widest rotate-45 border-4 border-bg-accent/30 p-4">
                Profile Visual
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </>
  );
}
