"use client";

import { useEffect, useRef } from "react";
import { useCursor } from "./cursor-context";

export function Cursor() {
  const {
    variant,
    mouseRef,
    followerRef,
    magnetismOffsetRef,
    targetRect,
    isReducedMotion,
    hidden,
  } = useCursor();

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const variantRef = useRef(variant);

  useEffect(() => {
    variantRef.current = variant;
  }, [variant]);

  useEffect(() => {
    if (isReducedMotion || hidden) return;

    function tick() {
      const mx = mouseRef.current.x + magnetismOffsetRef.current.x;
      const my = mouseRef.current.y + magnetismOffsetRef.current.y;
      const fx = followerRef.current.x;
      const fy = followerRef.current.y;

      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }

      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isReducedMotion, hidden, variant, mouseRef, followerRef, magnetismOffsetRef]);

  if (isReducedMotion || hidden) return null;

  const cursorStyle =
    "fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform";

  const frameVisible = variant === "button" && targetRect;

  return (
    <>
      <div
        ref={dotRef}
        className={cursorStyle}
        style={{ mixBlendMode: "exclusion" }}
      >
        <div className="w-[7px] h-[7px] bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {variant !== "button" ? (
        <div
          ref={ringRef}
          className={cursorStyle + " z-[9998]"}
          style={{ mixBlendMode: "exclusion" }}
        >
          {variant === "spotlight" ? (
            <div className="w-[100px] h-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 bg-white/10 shadow-[0_0_40px_rgba(255,255,255,0.12)]" />
          ) : variant === "loading" ? (
            <div
              className="w-[30px] h-[30px] rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-transparent border-t-white animate-spin"
              style={{ animationDuration: "1.8s" }}
            />
          ) : variant === "disabled" ? (
            <div className="w-[30px] h-[30px] rounded-full -translate-x-1/2 -translate-y-1/2 border border-white opacity-20" />
          ) : (
            <div className="w-[30px] h-[30px] rounded-full -translate-x-1/2 -translate-y-1/2 border border-white" />
          )}
        </div>
      ) : (
        <div
          ref={ringRef}
          className={cursorStyle + " z-[9998]"}
          style={{ mixBlendMode: "exclusion" }}
        >
          <div className="w-[30px] h-[30px] rounded-full -translate-x-1/2 -translate-y-1/2 border border-white opacity-0 scale-50 transition-all duration-200" />
        </div>
      )}

      {frameVisible && (
        <div
          className="fixed pointer-events-none z-[9997] will-change-[top,left,width,height]"
          style={{
            left: targetRect.left,
            top: targetRect.top,
            width: targetRect.width,
            height: targetRect.height,
            transition:
              "left 0.25s ease-out, top 0.25s ease-out, width 0.25s ease-out, height 0.25s ease-out",
            mixBlendMode: "exclusion",
          }}
        >
          <div className="absolute -top-[3px] -left-[3px] w-3.5 h-3.5 border-t-[2px] border-l-[2px] border-white" style={{ animation: "cornerIn 0.2s ease-out both" }} />
          <div className="absolute -top-[3px] -right-[3px] w-3.5 h-3.5 border-t-[2px] border-r-[2px] border-white" style={{ animation: "cornerIn 0.2s ease-out both" }} />
          <div className="absolute -bottom-[3px] -left-[3px] w-3.5 h-3.5 border-b-[2px] border-l-[2px] border-white" style={{ animation: "cornerIn 0.2s ease-out both" }} />
          <div className="absolute -bottom-[3px] -right-[3px] w-3.5 h-3.5 border-b-[2px] border-r-[2px] border-white" style={{ animation: "cornerIn 0.2s ease-out both" }} />
        </div>
      )}
    </>
  );
}
