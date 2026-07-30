"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useAnimationControls,
  ValueAnimationTransition,
} from "motion/react";

interface ComesInGoesOutUnderlineProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  className?: string;
  underlineHeightRatio?: number;
  underlinePaddingRatio?: number;
  transition?: ValueAnimationTransition;
}

const ComesInGoesOutUnderline = ({
  children,
  direction = "left",
  className,
  underlineHeightRatio = 0.1,
  underlinePaddingRatio = 0.01,
  transition = {
    duration: 0.4,
    ease: "easeInOut",
  },
}: ComesInGoesOutUnderlineProps) => {
  const controls = useAnimationControls();
  const [blocked, setBlocked] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(
          getComputedStyle(textRef.current).fontSize,
        );
        const underlineHeight = fontSize * underlineHeightRatio;
        const underlinePadding = fontSize * underlinePaddingRatio;
        textRef.current.style.setProperty(
          "--underline-height",
          `${underlineHeight}px`,
        );
        textRef.current.style.setProperty(
          "--underline-padding",
          `${underlinePadding}px`,
        );
      }
    };

    updateUnderlineStyles();
    window.addEventListener("resize", updateUnderlineStyles);

    return () => window.removeEventListener("resize", updateUnderlineStyles);
  }, [underlineHeightRatio, underlinePaddingRatio]);

  const animate = async () => {
    if (blocked) return;
    setBlocked(true);

    await controls.start({
      width: "100%",
      transition,
      transitionEnd: {
        left: direction === "left" ? "auto" : 0,
        right: direction === "left" ? 0 : "auto",
      },
    });

    await controls.start({
      width: 0,
      transition,
      transitionEnd: {
        left: direction === "left" ? 0 : "",
        right: direction === "left" ? "" : 0,
      },
    });

    setBlocked(false);
  };

  return (
    <motion.span
      className={cn("relative inline-block cursor-pointer", className)}
      onHoverStart={animate}
      ref={textRef}
    >
      <span>{children}</span>
      <motion.span
        className={cn("absolute bg-current w-0", {
          "left-0": direction === "left",
          "right-0": direction === "right",
        })}
        style={{
          height: "var(--underline-height)",
          bottom: "calc(1 * var(--underline-padding))",
        }}
        animate={controls}
        aria-hidden="true"
      />
    </motion.span>
  );
};

ComesInGoesOutUnderline.displayName = "ComesInGoesOutUnderline";

export default ComesInGoesOutUnderline;
