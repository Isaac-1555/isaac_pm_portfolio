"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AccentWord } from "@/components/ui/AccentWord";
import RightChevron from "@/components/icons/right-chevron";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import type { CaseStudy } from "@/app/case-studies/data";
import { cn } from "@/lib/utils";

interface FeaturedWorkClientProps {
  studies: CaseStudy[];
  missionIds: readonly string[];
}

const EASE = [0.4, 0, 0.2, 1] as const;
const DUR = 0.75;

export function FeaturedWorkClient({
  studies,
  missionIds,
}: FeaturedWorkClientProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [booted, setBooted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const isAnyOpen = openIndex !== null;
  const handleToggle = (i: number) =>
    setOpenIndex((cur) => (cur === i ? null : i));

  return (
    <section
      ref={sectionRef}
      id="mission-home-featured"
      data-booted={booted ? "true" : "false"}
      className="relative h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-4rem)] flex flex-col overflow-hidden bg-bg-base"
    >
      <div className="container mx-auto px-6 md:px-8 py-6 md:py-10 relative z-10 flex flex-col min-h-0 flex-1">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-4 shrink-0">
          <div>
            <h2 className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium uppercase tracking-tight text-text-primary">
              Featured <AccentWord text="Works" />
            </h2>
            <p className="mt-2 text-xs md:text-sm font-mono text-text-secondary uppercase tracking-widest">
              {isAnyOpen ? "Selected case file" : "Select a project"}
              <span className="text-cta">_</span>
            </p>
          </div>
          <Link
            href="/work"
            className="hidden md:block shrink-0"
            aria-label="View full portfolio"
          >
            <Button
              variant="outline"
              data-icon-hover-trigger
              className="text-text-primary border-divider before:bg-text-primary hover:text-bg-base font-mono uppercase tracking-widest text-xs"
            >
              View Full Portfolio
              <IconHoverWrapper hoverTrigger="closest">
                <RightChevron size={14} className="ml-2" />
              </IconHoverWrapper>
            </Button>
          </Link>
        </header>

        <div className="flex-1 min-h-0 flex flex-col md:block">
          <div className="relative h-full w-full">
            <div className="hidden md:block absolute inset-0">
              {/* Background hints — fade out when a project opens */}
              <motion.span
                initial={false}
                animate={{ opacity: isAnyOpen ? 0 : 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest text-text-secondary pointer-events-none select-none whitespace-nowrap z-0"
              >
                Click to see project →
              </motion.span>
              <motion.span
                initial={false}
                animate={{ opacity: isAnyOpen ? 0 : 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-widest text-text-secondary pointer-events-none select-none whitespace-nowrap z-0"
              >
                ← Click to see project
              </motion.span>
              <DesktopAccordion
                studies={studies}
                missionIds={missionIds}
                openIndex={openIndex}
                onToggle={handleToggle}
              />
            </div>
            <div className="md:hidden h-full relative">
              <MobileAccordion
                studies={studies}
                missionIds={missionIds}
                openIndex={openIndex}
                onToggle={handleToggle}
              />
              <motion.div
                initial={false}
                animate={{ opacity: isAnyOpen ? 0 : 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                aria-hidden
                className="pointer-events-none select-none absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0 flex flex-col items-center gap-2"
              >
                <motion.span
                  aria-hidden
                  className="font-mono text-[10px] uppercase tracking-widest text-text-secondary"
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 1.6,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M6 10V2M2 6l4-4 4 4" />
                  </svg>
                </motion.span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                  Click see project
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Desktop accordion ───────────────────────── */

function DesktopAccordion({
  studies,
  missionIds,
  openIndex,
  onToggle,
}: {
  studies: CaseStudy[];
  missionIds: readonly string[];
  openIndex: number | null;
  onToggle: (i: number) => void;
}) {
  return (
    <div className="flex h-full w-full items-stretch justify-center gap-3">
      {studies.map((study, i) => (
        <DesktopColumn
          key={study.id}
          study={study}
          missionId={missionIds[i]}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => onToggle(i)}
        />
      ))}
    </div>
  );
}

function DesktopColumn({
  study,
  missionId,
  index,
  isOpen,
  onToggle,
}: {
  study: CaseStudy;
  missionId: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      transition={{ layout: { duration: DUR, ease: EASE } }}
      style={{ willChange: "width, transform" }}
      className={cn(
        "relative h-full shrink-0 rounded-sm border border-divider bg-bg-accent/5 overflow-hidden transition-colors duration-300",
        "group",
        isOpen
          ? "w-[clamp(760px,62vw,980px)] shrink-0 border-cta/40"
          : "w-[56px] shrink-0 hover:border-cta/60"
      )}
    >
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-0 z-10"
          >
            <OpenPanel
              study={study}
              missionId={missionId}
              index={index}
              onClose={onToggle}
            />
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            type="button"
            onClick={onToggle}
            aria-label={`Open ${study.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute left-0 inset-y-0 w-[56px] z-10 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
          >
            <span className="font-mono uppercase tracking-widest text-sm text-text-primary whitespace-nowrap -rotate-90 select-none group-hover:text-cta transition-colors">
              {study.title}
            </span>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-text-secondary">
              {String(index + 1).padStart(2, "0")}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ───────────────────────── Mobile accordion ───────────────────────── */

function MobileAccordion({
  studies,
  missionIds,
  openIndex,
  onToggle,
}: {
  studies: CaseStudy[];
  missionIds: readonly string[];
  openIndex: number | null;
  onToggle: (i: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 h-full">
      {studies.map((study, i) => (
        <MobileRow
          key={study.id}
          study={study}
          missionId={missionIds[i]}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => onToggle(i)}
        />
      ))}
    </div>
  );
}

function MobileRow({
  study,
  missionId,
  index,
  isOpen,
  onToggle,
}: {
  study: CaseStudy;
  missionId: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      transition={{ layout: { duration: DUR, ease: EASE } }}
      className={cn(
        "relative rounded-sm border border-divider bg-bg-accent/5 overflow-hidden transition-colors",
        isOpen
          ? "flex-1 min-h-0 border-cta/40"
          : "h-12 shrink-0"
      )}
    >
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-0 z-10"
          >
            <OpenPanel
              study={study}
              missionId={missionId}
              index={index}
              onClose={onToggle}
            />
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            type="button"
            onClick={onToggle}
            aria-label={`Open ${study.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-x-0 top-0 h-12 z-10 flex items-center justify-between px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
          >
            <span className="font-mono uppercase tracking-widest text-xs text-text-primary">
              {study.title}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
              {String(index + 1).padStart(2, "0")} / 04
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ───────────────────────── Shared open panel ───────────────────────── */

function OpenPanel({
  study,
  missionId,
  index,
  onClose,
}: {
  study: CaseStudy;
  missionId: string;
  index: number;
  onClose: () => void;
}) {
  const screenshot = study.screenshots[0];
  const stats = study.outcome.quantifiable;

  return (
    <div className="w-full h-full flex flex-col md:flex-row md:items-stretch gap-3 md:gap-5 bg-bg-base p-3 md:p-0">
      {/* Screenshot frame — aspect-matched to image (no letterbox bars) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        style={{ aspectRatio: `${study.imageWidth} / ${study.imageHeight}` }}
        className="relative order-1 self-stretch md:self-center md:flex-1 min-w-0 max-h-full rounded-sm overflow-hidden bg-bg-dark border border-divider"
      >
        {screenshot && (
          <Image
            src={screenshot}
            alt={study.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 980px"
            priority
          />
        )}
        <div className="absolute top-2 left-2 font-mono text-[9px] uppercase tracking-widest text-text-primary bg-bg-base/80 backdrop-blur px-1.5 py-0.5 rounded-sm">
          {missionId}
        </div>
      </motion.div>

      {/* Right content */}
      <div className="order-2 md:w-[300px] md:shrink-0 md:h-full min-w-0 flex flex-col justify-between p-4 md:p-5 md:overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <motion.h3
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: DUR, ease: EASE }}
              className="font-mono text-xl md:text-2xl font-medium uppercase tracking-tight text-text-primary origin-left will-change-transform"
            >
              {study.title}
            </motion.h3>
            <p className="mt-1 font-mono text-[11px] text-text-secondary leading-snug">
              {study.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
              {String(index + 1).padStart(2, "0")} / 04
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta rounded-sm p-0.5"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M2 2L12 12M12 2L2 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Outcomes + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          className="mt-4 md:mt-6"
        >
          <div className="font-mono text-[9px] uppercase tracking-widest text-text-secondary mb-1.5">
            Outcomes
          </div>
          <ul className="space-y-1 mb-4">
            {stats.map((s, i) => (
              <li
                key={i}
                className="flex gap-2 font-mono text-[11px] text-text-primary leading-snug"
              >
                <span className="text-cta shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
          <Button
            asChild
            size="sm"
            className="font-mono gap-1.5 text-[11px] tracking-widest"
          >
            <Link href={`/case-studies/${study.id}`}>
              View case study <RightChevron size={12} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
