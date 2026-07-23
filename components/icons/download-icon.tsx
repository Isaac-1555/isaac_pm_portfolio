"use client";
import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const DownloadIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const start = useCallback(async () => {
      animate(
        ".download-arrow",
        { y: 3 },
        { duration: 0.3, ease: "easeOut" },
      );
      animate(
        ".download-tray",
        { y: 1 },
        { duration: 0.3, ease: "easeOut" },
      );
    }, [animate]);

    const stop = useCallback(async () => {
      animate(
        ".download-arrow, .download-tray",
        { y: 0 },
        { duration: 0.25, ease: "easeInOut" },
      );
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation: start,
      stopAnimation: stop,
    }));

    return (
      <motion.svg
        ref={scope}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cursor-pointer ${className}`}
        onHoverStart={start}
        onHoverEnd={stop}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />

        <motion.g className="download-tray">
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        </motion.g>
        <motion.g className="download-arrow">
          <path d="M7 11l5 5l5 -5" />
          <path d="M12 4l0 12" />
        </motion.g>
      </motion.svg>
    );
  },
);

DownloadIcon.displayName = "DownloadIcon";
export default DownloadIcon;
