'use client';

import { Button } from '@/components/ui/button';
import { AnimatedText } from '@/components/ui/split-flap';
import RightChevron from '@/components/icons/right-chevron';
import FileDescriptionIcon from '@/components/icons/file-description-icon';
import IconHoverWrapper from '@/components/icons/IconHoverWrapper';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useRef } from 'react';

const ROLES = [
  { title: 'Software Developer', subtitle: 'Web and mobile apps' },
  { title: 'Product Manager', subtitle: 'B2B SaaS & Internal Tools' },
  { title: 'AI Engineer', subtitle: 'AI Powered Automations' },
] as const;

export default function HeroContent() {
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
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex flex-col items-start gap-6"
    >
      <Badge variant="tech" className="animate-pulse">
        OPEN TO WORK
      </Badge>

      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-industrial uppercase font-bold tracking-wide md:tracking-widest text-text-primary leading-none select-none">
        {currentRole.title.split(' ').map((word, i) => (
          <span key={i} className="block">
            <AnimatedText text={word} />
          </span>
        ))}
        <span className="block mt-2 text-xs sm:text-sm md:text-base lg:text-lg leading-none overflow-hidden normal-case tracking-normal font-sans text-text-secondary">
          <AnimatedText text={currentRole.subtitle} />
        </span>
      </h1>

      <p className="max-w-xl text-base sm:text-lg md:text-xl text-text-secondary font-sans leading-relaxed">
        Transforming ambiguous problems into scalable, user-centric solutions. 5+ years driving adoption
        and workflow efficiency through data-driven strategy.
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
        <Link
          href="/Isaac_Daniel_Sudakar_Resume.pdf"
          download
          target="_blank"
          data-icon-hover-trigger
        >
          <Button variant="outline" size="lg" className="group w-full sm:w-auto">
            Download Resume
            <IconHoverWrapper hoverTrigger="closest">
              <FileDescriptionIcon size={16} className="ml-2 transition-transform group-hover:-rotate-12" />
            </IconHoverWrapper>
          </Button>
        </Link>
      </div>
    </div>
  );
}
