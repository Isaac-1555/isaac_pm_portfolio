"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import FileDescriptionIcon from "@/components/itshover/file-description-icon";

const NOTES = [
  { id: 1, w: "w-16", rot: -5 },
  { id: 2, w: "w-14", rot: 3 },
  { id: 3, w: "w-16", rot: -1 },
] as const;

function BucketShape() {
  return (
    <svg
      viewBox="0 0 48 44"
      className="w-16 h-[58px]"
      fill="none"
      stroke="var(--color-bg-base)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4a20 20 0 0 1 36 0" />
      <line x1="8" y1="10" x2="40" y2="10" />
      <path d="M10 10l2.5 28a2 2 0 0 0 2 2h19a2 2 0 0 0 2-2l2.5-28" />
      <path d="M14 16l1 18" opacity="0.3" />
      <path d="M24 14l1 20" opacity="0.3" />
      <path d="M34 16l-1 18" opacity="0.3" />
    </svg>
  );
}

export function NotebucketAnimation() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const interval = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % NOTES.length);
    }, 2200);
    return () => window.clearInterval(interval);
  }, [reduced]);

  if (reduced) {
    return (
      <div className="flex w-full h-full items-center justify-center text-[var(--color-bg-base)]">
        <FileDescriptionIcon size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-1">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: -16, scale: 0.6, rotate: NOTES[activeIndex].rot - 8 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: NOTES[activeIndex].rot }}
          exit={{ opacity: 0, y: 10, scale: 0.5, rotate: NOTES[activeIndex].rot + 10 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          className={`flex flex-col items-center gap-1 rounded-sm border border-[var(--color-bg-base)]/50 bg-[var(--color-bg-base)]/15 px-2 py-1.5 text-[var(--color-bg-base)] ${NOTES[activeIndex].w} origin-bottom`}
        >
          <FileDescriptionIcon size={18} />
          <div className="h-1 w-full rounded-full bg-[var(--color-bg-base)]/40" />
          <div className="h-1 w-3/4 rounded-full bg-[var(--color-bg-base)]/30" />
        </motion.div>
      </AnimatePresence>
      <motion.div
        className="text-[var(--color-bg-base)]"
        animate={{ y: [0, -1.5, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <BucketShape />
      </motion.div>
    </div>
  );
}
