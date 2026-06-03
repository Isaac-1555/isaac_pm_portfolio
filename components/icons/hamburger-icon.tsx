"use client";
import { forwardRef, useImperativeHandle, useEffect, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

interface HamburgerIconProps extends AnimatedIconProps {
  isOpen?: boolean;
}

const HamburgerIcon = forwardRef<AnimatedIconHandle, HamburgerIconProps>(
  (
    {
      size = 24,
      color = "currentColor",
      strokeWidth = 2,
      className = "",
      isOpen = false,
    },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      await animate(
        "svg",
        { scale: 1.1 },
        { duration: 0.15, ease: "easeOut" },
      );
    }, [animate]);

    const stop = useCallback(() => {
      animate("svg", { scale: 1 }, { duration: 0.15, ease: "easeOut" });
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    useEffect(() => {
      if (isOpen) {
        animate(
          ".hamburger-top",
          { rotate: 45, y: 5 },
          { duration: 0.3, ease: "easeInOut" },
        );
        animate(
          ".hamburger-mid",
          { opacity: 0, scaleX: 0 },
          { duration: 0.2, ease: "easeInOut" },
        );
        animate(
          ".hamburger-bot",
          { rotate: -45, y: -5 },
          { duration: 0.3, ease: "easeInOut" },
        );
      } else {
        animate(
          ".hamburger-top",
          { rotate: 0, y: 0 },
          { duration: 0.3, ease: "easeInOut" },
        );
        animate(
          ".hamburger-mid",
          { opacity: 1, scaleX: 1 },
          { duration: 0.2, ease: "easeInOut" },
        );
        animate(
          ".hamburger-bot",
          { rotate: 0, y: 0 },
          { duration: 0.3, ease: "easeInOut" },
        );
      }
    }, [isOpen, animate]);

    const handleHoverStart = () => start();
    const handleHoverEnd = () => stop();

    return (
      <motion.div
        ref={scope}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        className={`flex items-center justify-center ${className}`}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cursor-pointer"
        >
          <g className="hamburger-top" style={{ transformOrigin: "12px 7px" }}>
            <line x1="5" y1="7" x2="19" y2="7" />
          </g>
          <g className="hamburger-mid" style={{ transformOrigin: "12px 12px" }}>
            <line x1="5" y1="12" x2="19" y2="12" />
          </g>
          <g className="hamburger-bot" style={{ transformOrigin: "12px 17px" }}>
            <line x1="5" y1="17" x2="19" y2="17" />
          </g>
        </motion.svg>
      </motion.div>
    );
  },
);

HamburgerIcon.displayName = "HamburgerIcon";
export default HamburgerIcon;
