"use client";

import { useReducedMotion } from "framer-motion";
import type { Variants, MotionProps } from "framer-motion";

export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

export function useRevealMotion(): boolean {
  return useReducedMotion() ?? false;
}

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: REVEAL_EASE },
  },
};

export const revealSoftVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: REVEAL_EASE },
  },
};

export const viewportOnce = { once: true, margin: "-80px 0px" } as const;
export const viewportEager = { once: true, margin: "-40px 0px" } as const;

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: REVEAL_EASE },
  },
};

export const staggerItemFast: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: REVEAL_EASE },
  },
};

export function revealProps(reduced: boolean): MotionProps {
  if (reduced) {
    return {
      initial: false,
      whileInView: undefined,
      viewport: undefined,
    };
  }
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: viewportOnce,
    variants: revealVariants,
  };
}
