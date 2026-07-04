"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccentWord } from "@/components/ui/AccentWord";
import RightChevron from "@/components/icons/right-chevron";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import type { CaseStudy } from "@/app/case-studies/data";
import { HudCanvas } from "./featured/HudCanvas";

interface FeaturedWorkClientProps {
  studies: [CaseStudy, CaseStudy, CaseStudy];
  missionIds: readonly [string, string, string];
}

const ROTATION_INTERVAL_MS = 6000;

export function FeaturedWorkClient({
  studies,
  missionIds,
}: FeaturedWorkClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const isAutoScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [booted, setBooted] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [hoverCount, setHoverCount] = useState(0);

  const isHovered = hoverCount > 0;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setBooted(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.05 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const rotate = useCallback(
    (dir: 1 | -1 = 1) => setRotationIndex((i) => (i + dir + 3) % 3),
    []
  );

  useEffect(() => {
    if (!booted || isHovered) return;
    const id = setInterval(() => rotate(1), ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [booted, isHovered, rotate]);

  const handleHoverChange = useCallback((h: boolean) => {
    setHoverCount((c) => Math.max(0, c + (h ? 1 : -1)));
  }, []);

  const handleMobileScroll = useCallback(() => {
    if (isAutoScrollRef.current) return;
    const container = mobileScrollRef.current;
    if (!container || container.offsetWidth === 0) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      const idx = Math.round(container.scrollLeft / container.clientWidth);
      if (idx >= 0 && idx < 3) setRotationIndex(idx);
    }, 150);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) return;
    const container = mobileScrollRef.current;
    if (!container || container.offsetWidth === 0) return;
    isAutoScrollRef.current = true;
    const target = container.children[rotationIndex] as HTMLElement | undefined;
    if (target) {
      container.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    }
    const t = setTimeout(() => {
      isAutoScrollRef.current = false;
    }, 600);
    return () => clearTimeout(t);
  }, [rotationIndex]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const flagship = studies[rotationIndex];
  const sat1 = studies[(rotationIndex + 1) % 3];
  const sat2 = studies[(rotationIndex + 2) % 3];
  const flagshipId = missionIds[rotationIndex];
  const sat1Id = missionIds[(rotationIndex + 1) % 3];
  const sat2Id = missionIds[(rotationIndex + 2) % 3];

  const d = (offset: number) =>
    ({ "--boot-delay": `${offset}ms` } as React.CSSProperties);

  return (
    <section
      ref={sectionRef}
      id="mission-home-featured"
      data-booted={booted ? "true" : "false"}
      className="relative h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-4rem)] flex flex-col overflow-hidden bg-gradient-to-b from-bg-dark to-tech"
    >
      {/* Theme texture: diagonal stripes + noise */}
      <div className="absolute inset-0 diagonal-stripes opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-8 py-4 md:py-6 relative z-10 flex flex-col min-h-0 flex-1">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 md:mb-6 gap-4 shrink-0">
          <div className="boot-reveal" style={d(0)}>
            <Badge variant="warning" className="mb-2">
              Selected Case Studies
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-industrial font-bold uppercase tracking-wide md:tracking-widest text-white">
              Featured <AccentWord text="Works" />
            </h2>
            {/* Rotation indicator dots */}
            <div className="mt-3 flex items-center gap-2" role="tablist" aria-label="Rotate featured projects">
              {studies.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={rotationIndex === i}
                  aria-label={`Show ${s.title} in flagship slot`}
                  onClick={() => setRotationIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    rotationIndex === i
                      ? "w-8 bg-cta"
                      : "w-3 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
          <Link
            href="/work"
            className="hidden md:block boot-reveal shrink-0"
            style={d(120)}
          >
            <Button variant="outline" data-icon-hover-trigger className="text-white border-white before:bg-white hover:text-bg-dark">
              View Full Portfolio
              <IconHoverWrapper hoverTrigger="closest">
                <RightChevron size={16} className="ml-2" />
              </IconHoverWrapper>
            </Button>
          </Link>
        </div>

        {/* Desktop layout: flagship + satellites row */}
        <div className="hidden md:flex flex-col min-h-0 flex-1 gap-4">
          {/* Flagship full-width */}
          <div className="flex-1 min-h-0">
            <HudCanvas
              key={`flagship-${flagship.id}-${rotationIndex}`}
              study={flagship}
              missionId={flagshipId}
              variant="flagship"
              booted={booted}
              bootDelay={200}
              onHoverChange={handleHoverChange}
            />
          </div>

          {/* Satellites side-by-side */}
          <div className="grid grid-cols-2 gap-6 shrink-0 h-[35%]">
            <HudCanvas
              key={`sat1-${sat1.id}-${rotationIndex}`}
              study={sat1}
              missionId={sat1Id}
              variant="satellite"
              booted={booted}
              bootDelay={440}
              onHoverChange={handleHoverChange}
            />
            <HudCanvas
              key={`sat2-${sat2.id}-${rotationIndex}`}
              study={sat2}
              missionId={sat2Id}
              variant="satellite"
              booted={booted}
              bootDelay={560}
              onHoverChange={handleHoverChange}
            />
          </div>
        </div>

        {/* Mobile layout: horizontal scroll-snap row */}
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex md:hidden flex-1 min-h-0 overflow-x-auto snap-x snap-mandatory gap-4 -mx-1 px-1 pb-2"
        >
          {studies.map((study, i) => (
            <div
              key={`mobile-${study.id}-${i}`}
              className="w-full shrink-0 snap-center h-full"
            >
              <HudCanvas
                study={study}
                missionId={missionIds[i]}
                variant="flagship"
                booted={booted}
                bootDelay={200 + i * 120}
                onHoverChange={handleHoverChange}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
