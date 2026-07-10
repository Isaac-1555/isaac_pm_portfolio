"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import FileDescriptionIcon from "@/components/itshover/file-description-icon";
import Volume2Icon from "@/components/itshover/volume-2-icon";
import CameraIcon from "@/components/itshover/camera-icon";

const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz#@$%&*+=?/<>[]{}";
const FINAL_TEXT = "notes";

function scramble(length: number) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }
  return out;
}

export function SatbrainAnimation() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [scrambled, setScrambled] = useState("aaaaa");

  useEffect(() => {
    if (reduced) return;
    const totalStages = 4;
    const stageInterval = window.setInterval(() => {
      setStage((s) => (s + 1) % totalStages);
    }, 1400);
    const scrambleInterval = window.setInterval(() => {
      setScrambled(scramble(FINAL_TEXT.length));
    }, 120);
    return () => {
      window.clearInterval(stageInterval);
      window.clearInterval(scrambleInterval);
    };
  }, [reduced]);

  const inputsVisible = stage < 2;
  const notesVisible = stage >= 2;

  if (reduced) {
    return (
      <div className="flex w-full h-full items-center justify-center gap-3 text-[var(--color-bg-base)]">
        <FileDescriptionIcon size={28} />
        <Volume2Icon size={28} />
        <CameraIcon size={28} />
      </div>
    );
  }

  return (
    <div className="flex w-full h-full items-center justify-center gap-2">
      <motion.div
        className="flex flex-col items-center gap-1.5 text-[var(--color-bg-base)]"
        animate={{
          opacity: inputsVisible ? 1 : 0,
          x: inputsVisible ? 0 : -12,
          scale: inputsVisible ? 1 : 0.85,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <FileDescriptionIcon size={26} />
        <Volume2Icon size={26} />
        <CameraIcon size={26} />
      </motion.div>

      <motion.div
        className="h-8 w-px bg-[var(--color-bg-base)]/40"
        animate={{ opacity: inputsVisible ? 0.4 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative w-24 h-28 rounded-sm border border-[var(--color-bg-base)]/40 bg-[var(--color-bg-base)]/10 flex flex-col items-center justify-center gap-1 px-2 text-[var(--color-bg-base)]"
        animate={{
          opacity: notesVisible ? 1 : 0,
          x: notesVisible ? 0 : 12,
          scale: notesVisible ? 1 : 0.85,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="flex items-center gap-1 w-full">
          <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-bg-base)]/70" />
          <div className="h-1 flex-1 rounded-full bg-[var(--color-bg-base)]/40" />
        </div>
        <div className="font-mono text-[10px] tracking-widest uppercase text-center break-all leading-tight">
          {scrambled}
        </div>
        <div className="h-1 w-full rounded-full bg-[var(--color-bg-base)]/30" />
        <div className="h-1 w-3/4 rounded-full bg-[var(--color-bg-base)]/30" />
        <div className="h-1 w-1/2 rounded-full bg-[var(--color-bg-base)]/30" />
      </motion.div>
    </div>
  );
}
