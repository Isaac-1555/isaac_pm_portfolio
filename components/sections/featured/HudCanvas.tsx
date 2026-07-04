"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import RightChevron from "@/components/icons/right-chevron";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import type { CaseStudy } from "@/app/case-studies/data";
import {
  CornerBrackets,
  MissionIdPill,
  StatusPill,
  EdgeTicks,
  Reticle,
  Scanline,
  KpiBar,
  TitleBlock,
} from "./HudElements";

interface HudCanvasProps {
  study: CaseStudy;
  missionId: string;
  variant: "flagship" | "satellite";
  booted: boolean;
  bootDelay?: number;
  onHoverChange?: (hovered: boolean) => void;
}

export function HudCanvas({
  study,
  missionId,
  variant,
  booted,
  bootDelay = 0,
  onHoverChange,
}: HudCanvasProps) {
  const screenshot = study.screenshots[0];
  const kpis =
    variant === "flagship"
      ? study.outcome.quantifiable.slice(0, 3)
      : [study.outcome.quantifiable[0]];

  const reticleSize = variant === "flagship" ? 72 : 48;
  const bracketSize = variant === "flagship" ? 20 : 14;

  const onHoverChangeRef = useRef(onHoverChange);
  useEffect(() => {
    onHoverChangeRef.current = onHoverChange;
  }, [onHoverChange]);
  const hoveredRef = useRef(false);

  const handleHover = (h: boolean) => {
    hoveredRef.current = h;
    onHoverChangeRef.current?.(h);
  };

  useEffect(() => {
    return () => {
      if (hoveredRef.current) onHoverChangeRef.current?.(false);
    };
  }, []);

  return (
    <Link
      href={`/case-studies/${study.id}`}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta rounded-sm"
      aria-label={`${study.title} case study`}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div
        data-cursor-spotlight
        className="relative w-full h-full overflow-hidden bg-bg-dark border-2 border-bg-dark shadow-[6px_6px_0px_var(--color-bg-dark)] group-hover:border-cta group-hover:shadow-[8px_8px_0px_var(--color-bg-dark)] transition-all duration-300"
      >
        {/* Screenshot canvas */}
        {screenshot && (
          <Image
            key={study.id}
            src={screenshot}
            alt={study.title}
            fill
            className="rotate-fade object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={
              variant === "flagship"
                ? "100vw"
                : "(max-width: 768px) 100vw, 50vw"
            }
          />
        )}

        {/* Dark gradient overlay for HUD readability (bottom-weighted) */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/30 to-bg-dark/40 pointer-events-none" />

        {/* Persistent subtle grid */}
        <div className="hud-grid absolute inset-0 pointer-events-none opacity-60" />

        {/* HUD overlays */}
        <MissionIdPill missionId={missionId} bootDelay={bootDelay + 240} />
        <StatusPill status={study.status} bootDelay={bootDelay + 240} />

        <EdgeTicks />
        <CornerBrackets
          bootDelay={bootDelay}
          size={bracketSize}
          color="var(--color-cta)"
        />

        <Reticle size={reticleSize} />
        <Scanline bootDelay={bootDelay + 120} />

        <KpiBar
          kpis={kpis}
          bootDelay={bootDelay + 360}
          variant={variant}
        />

        <TitleBlock
          title={study.title}
          subtitle={study.subtitle}
          bootDelay={bootDelay}
          variant={variant}
          booted={booted}
        />

        {/* Hover CTA chip (top-center, appears on hover) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[4] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="hud-blur px-3 py-1.5 border border-cta/50 rounded-sm flex items-center gap-2 text-white font-industrial uppercase tracking-widest text-[10px]">
            Open Case File
            <IconHoverWrapper hoverTrigger="closest">
              <RightChevron size={12} className="text-cta" />
            </IconHoverWrapper>
          </div>
        </div>
      </div>
    </Link>
  );
}
