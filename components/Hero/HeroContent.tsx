'use client';

import { Button } from '@/components/ui/button';
import ScrambleText from '@/components/fancy/text/scramble-text';
import { MediaBetweenText } from '@/components/fancy/blocks/media-between-text';
import RightChevron from '@/components/icons/right-chevron';
import FileDescriptionIcon from '@/components/icons/file-description-icon';
import IconHoverWrapper from '@/components/icons/IconHoverWrapper';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, useRevealMotion } from '@/lib/motion';

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
  const reduced = useRevealMotion();

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
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={staggerContainer}
      initial={reduced ? false : 'hidden'}
      animate="visible"
      className="hero-compact flex flex-col items-center text-center gap-6"
    >
      <motion.p
        variants={staggerItem}
        className="hero-line flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-0 text-text-primary leading-none"
      >
        <span className="font-jb text-base sm:text-lg md:text-xl font-medium">Hi, I&apos;m</span>
        <span className="hero-isaac font-vt323 text-3xl sm:text-4xl md:text-5xl leading-none">Isaac,</span>
        <span className="font-jb text-base sm:text-lg md:text-xl font-medium">a</span>
      </motion.p>

      <motion.h1
        variants={staggerItem}
        className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-industrial uppercase font-bold tracking-wide md:tracking-widest text-text-primary leading-none select-none"
      >
        {currentRole.title.split(' ').map((word, i) => (
          <span key={i} className="block">
            <ScrambleText text={word} />
          </span>
        ))}
        <span className="hero-subtitle block mt-2 text-xs sm:text-sm md:text-base lg:text-lg leading-none overflow-hidden normal-case tracking-normal font-sans text-text-secondary">
          <ScrambleText text={currentRole.subtitle} />
        </span>
      </motion.h1>

      <motion.div
        variants={staggerItem}
        className="hero-desc max-w-xl mx-auto text-base sm:text-lg md:text-xl text-text-primary font-sans leading-relaxed"
      >
        I turn vague problems into shipped, measurable wins. Code was born on localhost. It was never meant to die there{" "}
        <MediaBetweenText
          as="span"
          firstText="<!-- Insert clever dev joke here ("
          secondText=") -->"
          mediaUrl="/where.gif"
          mediaType="image"
          triggerType="hover"
          alt="where"
          className="hidden sm:inline-flex items-center align-middle"
          leftTextClassName="font-mono text-text-primary/80"
          rightTextClassName="font-mono text-text-primary/80"
          mediaContainerClassName="h-[2.25em] overflow-hidden mx-1"
          animationVariants={{
            initial: { width: 0 },
            animate: {
              width: "2.25em",
              transition: {
                duration: 0.45,
                type: "spring",
                bounce: 0.15,
              },
            },
          }}
        />
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="hero-cta-row flex flex-col sm:flex-row justify-center gap-4 mt-4 md:mt-8 w-full sm:w-auto"
      >
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
      </motion.div>
    </motion.div>
  );
}
