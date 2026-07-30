"use client";

import { useState } from "react";
import { debounce } from "lodash";
import { AnimationOptions, motion, stagger, useAnimate } from "motion/react";

interface LetterSwapPingPongProps {
  label: string;
  reverse?: boolean;
  transition?: AnimationOptions;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | number;
  className?: string;
  onClick?: () => void;
}

const LetterSwapPingPong = ({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
}: LetterSwapPingPongProps) => {
  const [scope, animate] = useAnimate();
  const [isHovered, setIsHovered] = useState(false);

  const mergeTransition = (baseTransition: AnimationOptions) => ({
    ...baseTransition,
    delay: stagger(staggerDuration, {
      from: staggerFrom,
    }),
  });

  const hoverStart = debounce(
    () => {
      if (isHovered) return;
      setIsHovered(true);

      animate(
        ".letter",
        { y: reverse ? "100%" : "-100%" },
        mergeTransition(transition),
      );

      animate(
        ".letter-secondary",
        {
          top: "0%",
        },
        mergeTransition(transition),
      );
    },
    100,
    { leading: true, trailing: true },
  );

  const hoverEnd = debounce(
    () => {
      setIsHovered(false);

      animate(
        ".letter",
        {
          y: 0,
        },
        mergeTransition(transition),
      );

      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        mergeTransition(transition),
      );
    },
    100,
    { leading: true, trailing: true },
  );

  return (
    <motion.span
      className={`inline-flex items-center relative overflow-hidden ${className}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => (
        <span className="whitespace-pre relative flex" key={i} aria-hidden>
          <motion.span className="relative letter" style={{ top: 0 }}>
            {letter}
          </motion.span>
          <motion.span
            className="absolute letter-secondary"
            style={{ top: reverse ? "-100%" : "100%" }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default LetterSwapPingPong;
