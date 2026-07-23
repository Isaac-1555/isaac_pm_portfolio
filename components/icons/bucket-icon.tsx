"use client";
"use strict";

import { forwardRef, useImperativeHandle, useCallback } from "react";
import type { AnimatedIconHandle, AnimatedIconProps } from "./types";
import { motion, useAnimate } from "motion/react";

const BucketIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (
    { size = 24, color = "currentColor", strokeWidth = 2, className = "" },
    ref,
  ) => {
    const [scope, animate] = useAnimate();

    const startAnimation = useCallback(() => {
      // Notes peeking out — slide up and wobble
      animate(
        ".note-left",
        { y: [0, -3, 0], rotate: [0, -5, 0] },
        { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
      );
      animate(
        ".note-right",
        { y: [0, -3, 0], rotate: [0, 5, 0] },
        { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 },
      );

      // Bucket body subtle pulse
      animate(
        ".bucket-body",
        { scaleY: [1, 1.02, 1] },
        { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      );

      // Handle swing
      animate(
        ".bucket-handle",
        { rotate: [0, -8, 8, 0] },
        { duration: 2, repeat: Infinity, ease: "easeInOut" },
      );
    }, [animate]);

    const stopAnimation = useCallback(() => {
      animate(".note-left", { y: 0, rotate: 0 }, { duration: 0.3 });
      animate(".note-right", { y: 0, rotate: 0 }, { duration: 0.3 });
      animate(".bucket-body", { scaleY: 1 }, { duration: 0.3 });
      animate(".bucket-handle", { rotate: 0 }, { duration: 0.3 });
    }, [animate]);

    useImperativeHandle(ref, () => ({
      startAnimation,
      stopAnimation,
    }));

    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        onMouseEnter={startAnimation}
        onMouseLeave={stopAnimation}
      >
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
        >
          {/* Handle */}
          <motion.path
            className="bucket-handle"
            d="M4 8a8 8 0 0 1 16 0"
            style={{ transformOrigin: "12px 8px" }}
          />
          {/* Bucket body */}
          <motion.path
            className="bucket-body"
            d="M5 8h14l1.5 12a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2Z"
            style={{ transformOrigin: "12px 16px" }}
          />
          {/* Note peeking left */}
          <motion.path
            className="note-left"
            d="M8 8V5a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v3"
            style={{ transformOrigin: "9px 6px" }}
          />
          {/* Note peeking right */}
          <motion.path
            className="note-right"
            d="M14 8V5a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v3"
            style={{ transformOrigin: "15px 6px" }}
          />
          {/* Rim line */}
          <line x1="5" y1="8" x2="19" y2="8" />
        </motion.svg>
      </div>
    );
  },
);

BucketIcon.displayName = "BucketIcon";

export default BucketIcon;
