"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import FileDescriptionIcon from "@/components/itshover/file-description-icon";

const GARBAGE = "asjdh@#kasjd haksjdh kajshd89 2873612 !@#$%^^&*()asdlkajsdo";
const CLEAN_LINES = ["Name: Alex Doe", "Role: Senior Engineer", "• 5+ yrs React"];

function shuffledGarbage(len: number) {
  const out: string[] = [];
  for (let i = 0; i < len; i++) {
    out.push(GARBAGE[Math.floor(Math.random() * GARBAGE.length)]);
  }
  return out.join("");
}

export function PocketResumeAnimation() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"garbage" | "clean">("garbage");
  const [text, setText] = useState(GARBAGE.slice(0, 28));

  useEffect(() => {
    if (reduced) return;
    const total = 4400;
    const toggleAt = total / 2;
    const phaseInterval = window.setInterval(() => {
      setPhase((p) => (p === "garbage" ? "clean" : "garbage"));
    }, toggleAt);
    const scrambleInterval = window.setInterval(() => {
      setText(shuffledGarbage(28));
    }, 90);
    return () => {
      window.clearInterval(phaseInterval);
      window.clearInterval(scrambleInterval);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <div className="flex w-full h-full items-center justify-center text-[var(--color-bg-base)]">
        <FileDescriptionIcon size={64} />
      </div>
    );
  }

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="relative w-28 h-32">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "garbage" ? (
            <motion.div
              key="garbage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-sm border border-[var(--color-bg-base)]/40 bg-[var(--color-bg-base)]/10 p-2 flex flex-col gap-1 text-[var(--color-bg-base)] overflow-hidden"
            >
              <div className="font-mono text-[8px] leading-tight break-all tracking-tight">
                {text}
              </div>
              <div className="font-mono text-[8px] leading-tight break-all tracking-tight">
                {text}
              </div>
              <div className="font-mono text-[8px] leading-tight break-all tracking-tight">
                {text}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="clean"
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -6 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 rounded-sm border border-[var(--color-bg-base)]/50 bg-[var(--color-bg-base)]/15 p-2 flex flex-col items-center gap-1.5 text-[var(--color-bg-base)]"
            >
              <FileDescriptionIcon size={36} />
              <div className="flex flex-col gap-1 w-full px-1">
                {CLEAN_LINES.map((line) => (
                  <div
                    key={line}
                    className="h-1 w-full rounded-full bg-[var(--color-bg-base)]/60"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
