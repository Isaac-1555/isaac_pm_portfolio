import { Hero } from "@/components/sections/Hero";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      
      {/* Quick About Section */}
      <section className="py-16 md:py-24 bg-bg-dark text-bg-base relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 z-0 diagonal-stripes opacity-5 pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-8 relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className="mb-4 font-industrial text-gold uppercase tracking-widest text-sm">
              Profile Summary
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-industrial font-bold uppercase tracking-wide md:tracking-widest text-white mb-6">
              Engineering <span className="text-cta">Impact</span>
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8 max-w-lg font-sans text-sm md:text-base">
              With over 8 years of experience in product management and systems architecture, I specialize in transforming ambiguous problems into scalable, user-centric solutions. My approach combines rigorous data analysis with intuitive design principles.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-l-2 border-cta pl-4">
                <div className="text-3xl md:text-4xl font-industrial font-bold text-white">8+</div>
                <div className="text-xs md:text-sm font-industrial text-text-secondary uppercase tracking-wide">Years Exp</div>
              </div>
              <div className="border-l-2 border-cta pl-4">
                <div className="text-3xl md:text-4xl font-industrial font-bold text-white">12</div>
                <div className="text-xs md:text-sm font-industrial text-text-secondary uppercase tracking-wide">Products Shipped</div>
              </div>
            </div>
          </div>
          <div className="relative h-64 md:h-96 w-full border-2 border-bg-accent rounded-sm overflow-hidden bg-bg-accent/20 backdrop-blur">
            <Image
              src="/isaac.png"
              alt="Isaac Daniel Sudakar"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
