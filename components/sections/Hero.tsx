import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative w-full h-[80vh] flex items-center bg-bg-base overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 diagonal-stripes pointer-events-none" />
      
      {/* Accent Stripe */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-bg-dark/10 to-transparent skew-x-12 transform origin-top-right pointer-events-none" />

      <div className="container mx-auto relative z-10 px-4 flex flex-col items-start gap-6">
        <Badge variant="tech" className="animate-pulse">
          PM-ID: 240827-001
        </Badge>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-industrial uppercase font-bold tracking-widest text-text-primary leading-tight">
          Product <span className="text-cta">Manager</span>
          <br />
          <span className="text-bg-dark">Systems</span> Architect
        </h1>
        
        <p className="max-w-xl text-lg md:text-xl text-text-secondary font-tech leading-relaxed">
          Orchestrating complex product ecosystems with data-driven precision and user-centric design.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/case-studies">
            <Button size="lg" className="group">
              View Case Studies
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg" className="group">
              Explore Profile
              <Play className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
            </Button>
          </Link>
        </div>

        {/* Technical Decorative Elements */}
        <div className="absolute bottom-10 right-10 hidden md:block text-right">
          <div className="text-xs font-mono text-text-secondary mb-1">COORDS: 45.92, -12.04</div>
          <div className="text-xs font-mono text-text-secondary">SYS: ONLINE</div>
        </div>
      </div>
    </section>
  );
}
