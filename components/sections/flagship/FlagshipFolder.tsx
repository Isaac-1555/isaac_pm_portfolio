"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { CaseStudy } from "@/app/case-studies/data";
import { cn } from "@/lib/utils";
import { FolderArt } from "./folderArt";
import { FolderContents } from "./FolderContents";

interface FlagshipFolderProps {
  study: CaseStudy;
  className?: string;
}

type FolderState = "closed" | "open";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isTouch;
}

function FolderBackShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* Back panel with tab. Tab is wider and more prominent now. */}
      <path
        d="M0 10 H32 V2 Q32 0 34 0 H74 Q76 0 76 2 V10 H120 V80 H0 Z"
        fill="var(--color-bg-accent)"
        stroke="var(--color-bg-dark)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* Fold line shadow — a darker strip just below the fold */}
      <rect
        x="0"
        y="10"
        width="120"
        height="2"
        fill="var(--color-bg-dark)"
        opacity="0.35"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function FlagshipFolder({ study, className }: FlagshipFolderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  const [userState, setUserState] = useState<FolderState>("closed");
  const isOpen = reducedMotion || userState === "open";

  const open = useCallback(() => setUserState("open"), []);
  const close = useCallback(() => setUserState("closed"), []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isTouch) return;
      if (!isOpen) {
        e.preventDefault();
        open();
      }
    },
    [isTouch, isOpen, open],
  );

  return (
    <Link
      href={`/case-studies/${study.id}`}
      onClick={handleClick}
      onMouseEnter={isTouch ? undefined : open}
      onMouseLeave={isTouch ? undefined : close}
      onFocus={isTouch ? undefined : open}
      onBlur={isTouch ? undefined : close}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          close();
          e.currentTarget.blur();
        }
      }}
      aria-label={`Open ${study.title} case study`}
      data-icon-hover-trigger
      className={cn(
        "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base rounded-sm",
        className,
      )}
    >
      {/* ── Folder visual area ── */}
      <div className="relative aspect-[4/3] overflow-visible">
        {/* Folder back — silhouette with tab + fold line */}
        <div className="absolute inset-0 z-0">
          <FolderBackShape className="w-full h-full drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)]" />
          {/* Tab label — project name in white */}
          <div className="absolute top-[1%] left-[26%] right-[34%] text-center text-[8px] sm:text-[9px] font-tech font-bold uppercase tracking-wider text-white truncate">
            {study.title}
          </div>
        </div>

        {/* Document peek — thin paper edge sticking out from inside the folder.
            Visible above the cover, suggesting a document is tucked inside. */}
        <div className="absolute left-[8%] right-[8%] top-[10%] h-[3%] z-[5] bg-bg-base/90 border-l border-r border-bg-dark/40 shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
          <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_8px,rgba(0,0,0,0.08)_8px,rgba(0,0,0,0.08)_9px)]" />
        </div>

        {/* Folder cover — the front pocket face. Fades + lifts on hover. */}
        <div
          className={cn(
            "absolute inset-x-0 top-[12%] bottom-0 z-10 overflow-hidden border-2 border-bg-dark",
            `bg-gradient-to-br ${study.gradient}`,
            "transition-all duration-500 ease-out",
            isOpen && "opacity-0 -translate-y-3 scale-[0.97] pointer-events-none",
          )}
        >
          {/* Inner shadow at top edge — makes the cover look slightly raised at the fold */}
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-black/30 to-transparent" />
          {/* Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="absolute inset-0 diagonal-stripes opacity-[0.08]" />
          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center p-6">
            <FolderArt study={study} />
          </div>
        </div>

        {/* Extracted card — 16:9 screenshot, rises out of the folder on hover.
            Extends well beyond folder bounds for a dominant visual. */}
        <div
          className={cn(
            "absolute -left-[10%] -right-[10%] top-0 aspect-video z-20",
            "transition-all duration-[600ms] ease-out",
            isOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-[0.85] pointer-events-none",
          )}
        >
          <FolderContents study={study} />
        </div>
      </div>
    </Link>
  );
}
