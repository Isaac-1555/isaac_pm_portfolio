"use client";

import { Button } from "@/components/ui/button";
import { AnimatedText } from "@/components/ui/split-flap";
import RightChevron from "@/components/icons/right-chevron";
import FileDescriptionIcon from "@/components/icons/file-description-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";

const ROLES = [
  { title: "Software Developer", subtitle: "Web and mobile apps" },
  { title: "Product Manager", subtitle: "B2B SaaS & Internal Tools" },
  { title: "AI Engineer", subtitle: "AI Powered Automations" },
  
] as const;

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const currentRole = ROLES[roleIndex];
  const isHoveredRef = useRef(false);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    let lastUpdate = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      if (!isHoveredRef.current && now - lastUpdate >= 5000) {
        setRoleIndex((i) => (i + 1) % ROLES.length);
        lastUpdate = now;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);
  return (
    <section
      id="mission-home-hero"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full min-h-[calc(100dvh-3.5rem)] md:min-h-[calc(100dvh-4rem)] flex items-center bg-bg-base overflow-hidden py-16 md:py-24"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 diagonal-stripes pointer-events-none" />
      
      {/* Accent Stripe */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-bg-dark/10 to-transparent skew-x-12 transform origin-top-right pointer-events-none" />

      <div className="container mx-auto relative z-10 px-6 md:px-8 flex flex-col items-start gap-6">
        <Badge variant="tech" className="animate-pulse">
          OPEN TO WORK
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-industrial uppercase font-bold tracking-wide md:tracking-widest text-text-primary leading-none select-none">
          {currentRole.title.split(" ").map((word, i) => (
            <span key={i} className="block">
              <AnimatedText text={word} />
            </span>
          ))}
          <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl normal-case tracking-normal font-sans text-text-secondary">
            <AnimatedText text={currentRole.subtitle} />
          </span>
        </h1>
        
        <p className="max-w-xl text-base sm:text-lg md:text-xl text-text-secondary font-sans leading-relaxed">
          Transforming ambiguous problems into scalable, user-centric solutions. 5+ years driving adoption and workflow efficiency through data-driven strategy.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-8 w-full sm:w-auto">
          <Link href="/work" data-icon-hover-trigger>
            <Button size="lg" className="group w-full sm:w-auto">
              View Works
              <IconHoverWrapper hoverTrigger="closest">
                <RightChevron size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </IconHoverWrapper>
            </Button>
          </Link>
<Link href="/Isaac_Daniel_Sudakar_Resume.pdf" download target="_blank" data-icon-hover-trigger>
            <Button variant="outline" size="lg" className="group w-full sm:w-auto">
              Download Resume
              <IconHoverWrapper hoverTrigger="closest">
                <FileDescriptionIcon size={16} className="ml-2 transition-transform group-hover:-rotate-12" />
              </IconHoverWrapper>
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
