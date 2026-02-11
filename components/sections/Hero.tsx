import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center bg-bg-base overflow-hidden py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 diagonal-stripes pointer-events-none" />
      
      {/* Accent Stripe */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-bg-dark/10 to-transparent skew-x-12 transform origin-top-right pointer-events-none" />

      <div className="container mx-auto relative z-10 px-6 md:px-8 flex flex-col items-start gap-6">
        <Badge variant="tech" className="animate-pulse">
          OPEN TO WORK
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-industrial uppercase font-bold tracking-wide md:tracking-widest text-text-primary leading-none">
          <span className="block">Product <span className="text-cta">Manager</span></span>
          <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl normal-case tracking-normal font-sans text-text-secondary">
            B2B SaaS & Internal Tools
          </span>
        </h1>
        
        <p className="max-w-xl text-base sm:text-lg md:text-xl text-text-secondary font-sans leading-relaxed">
          Transforming ambiguous problems into scalable, user-centric solutions. 5+ years driving adoption and workflow efficiency through data-driven strategy.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-8 w-full sm:w-auto">
          <Link href="/work">
            <Button size="lg" className="group w-full sm:w-auto">
              View Work
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/Resume_Isaac_Daniel_Sudakar.pdf" download target="_blank">
            <Button variant="outline" size="lg" className="group w-full sm:w-auto">
              Download Resume
              <FileText className="ml-2 h-4 w-4 transition-transform group-hover:-rotate-12" />
            </Button>
          </Link>
        </div>

        {/* Technical Decorative Elements - Kept for theme consistency but simplified */}
        <div className="absolute bottom-10 right-10 hidden lg:block text-right opacity-50">
          <div className="text-xs font-mono text-text-secondary mb-1">STATUS: AVAILABLE</div>
          <div className="text-xs font-mono text-text-secondary">LOC: CALGARY, AB</div>
        </div>
      </div>
    </section>
  );
}
