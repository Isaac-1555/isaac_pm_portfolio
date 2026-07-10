"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import TerminalIcon from "@/components/itshover/terminal-icon";

const STAGE_DURATION = 1100;
const STAGES = [1, 2, 3, 1] as const;

export function TuxAnimation() {
  const reduced = useReducedMotion();
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    if (reduced) return;
    let index = 0;
    const interval = window.setInterval(() => {
      index = (index + 1) % STAGES.length;
      setCount(STAGES[index]);
    }, STAGE_DURATION);
    return () => window.clearInterval(interval);
  }, [reduced]);

  if (reduced) {
    return (
      <div className="flex w-full h-full items-center justify-center text-[var(--color-bg-base)]">
        <TerminalIcon size={56} />
      </div>
    );
  }

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="relative h-24 w-full max-w-[180px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {Array.from({ length: count }).map((_, i) => {
            const slots = count;
            const positions =
              slots === 1
                ? [0.5]
                : slots === 2
                  ? [0.3, 0.7]
                  : [0.18, 0.5, 0.82];
            const xPct = positions[i] ?? 0.5;
            return (
              <motion.div
                key={`${count}-${i}`}
                initial={{ opacity: 0, scale: 0.6, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: -8 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-bg-base)]"
                style={{ left: `${xPct * 100}%` }}
              >
                <TerminalIcon size={slots === 1 ? 64 : slots === 2 ? 52 : 44} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
