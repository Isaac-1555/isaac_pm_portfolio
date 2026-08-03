"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { caseStudies, type CaseStudy } from "@/app/case-studies/data";
import { cn } from "@/lib/utils";

const FLAGSHIP_IDS = ["satbrain", "tux", "pocket-resume", "notebucket"] as const;

function pick(id: string): CaseStudy {
  const found = caseStudies.find((c) => c.id === id);
  if (!found) throw new Error(`Case study not found: ${id}`);
  return found;
}

const PREVIEW_OFFSET = 28;
const VIEWPORT_MARGIN = 16;

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

export function FeaturedPreviews() {
  const reduced = useReducedMotion() ?? false;
  const isTouch = useIsTouchDevice();
  const studies = FLAGSHIP_IDS.map(pick);

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 22, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 160, damping: 22, mass: 0.5 });
  const followX = reduced ? x : springX;
  const followY = reduced ? y : springY;

  const positionCard = useCallback(
    (mx: number, my: number) => {
      const el = cardRef.current;
      const w = el?.offsetWidth ?? 320;
      const h = el?.offsetHeight ?? 180;

      let px = mx + PREVIEW_OFFSET;
      let py = my + PREVIEW_OFFSET;
      if (px + w > window.innerWidth - VIEWPORT_MARGIN) {
        px = mx - w - PREVIEW_OFFSET;
      }
      if (py + h > window.innerHeight - VIEWPORT_MARGIN) {
        py = my - h - PREVIEW_OFFSET;
      }
      px = Math.max(VIEWPORT_MARGIN, Math.min(px, window.innerWidth - w - VIEWPORT_MARGIN));
      py = Math.max(VIEWPORT_MARGIN, Math.min(py, window.innerHeight - h - VIEWPORT_MARGIN));

      x.set(px);
      y.set(py);
    },
    [x, y],
  );

  useEffect(() => {
    if (isTouch) return;

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!activeIdRef.current) return;
      positionCard(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [isTouch, positionCard]);

  useEffect(() => {
    if (!activeId) return;
    const raf = requestAnimationFrame(() =>
      positionCard(mouseRef.current.x, mouseRef.current.y),
    );
    return () => cancelAnimationFrame(raf);
  }, [activeId, positionCard]);

  const active = studies.find((s) => s.id === activeId) ?? null;

  return (
    <div onMouseLeave={() => setActiveId(null)}>
      <ul className="divide-y divide-divider/60">
        {studies.map((study, i) => (
          <li key={study.id}>
            <Link
              href={`/case-studies/${study.id}`}
              data-cursor-target
              data-fp-row
              onMouseEnter={() => setActiveId(study.id)}
              onFocus={() => setActiveId(study.id)}
              onBlur={() => setActiveId(null)}
              className={cn(
                "group flex items-baseline gap-4 sm:gap-8 px-1 py-5 sm:py-6 opacity-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
              )}
              data-reveal-hide
            >
              <span className="shrink-0 font-mono text-xs text-text-secondary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-industrial text-2xl sm:text-4xl font-bold uppercase tracking-wide text-text-primary transition-colors group-hover:text-cta">
                {study.title}
              </span>
              <span className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-text-secondary">
                {study.status}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-cta transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  <path d="M9 6l6 6l-6 6" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div
        aria-hidden
        className="pointer-events-none fixed -left-[10000px] top-0 z-[-50] opacity-0"
      >
        {studies.map((s) =>
          s.previewImage ? (
            <div
              key={s.id}
              className="relative w-[320px]"
              style={{
                aspectRatio: `${s.previewWidth ?? s.imageWidth} / ${s.previewHeight ?? s.imageHeight}`,
              }}
            >
              <Image
                src={s.previewImage}
                alt=""
                fill
                sizes="320px"
                loading="eager"
              />
            </div>
          ) : null,
        )}
      </div>

      <AnimatePresence>
        {active && !isTouch && (
          <motion.div
            key={active.id}
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ x: followX, y: followY }}
            className="pointer-events-none fixed left-0 top-0 z-[9000] w-[320px] will-change-transform"
          >
            <div
              style={{ aspectRatio: `${active.previewWidth ?? active.imageWidth} / ${active.previewHeight ?? active.imageHeight}` }}
              className="relative w-full overflow-hidden rounded-sm border border-divider bg-bg-dark shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
            >
              {active.previewImage && (
                <Image
                  src={active.previewImage}
                  alt={active.title}
                  fill
                  sizes="320px"
                  className="object-cover object-top"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
