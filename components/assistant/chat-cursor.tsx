"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "./use-stream-text";

type Kind = "default" | "button" | "text";

/**
 * Cursor used inside the native chat dialog. It is rendered in the dialog's
 * top layer so it stays above the panel, unlike the site-wide cursor.
 */
export function ChatCursor({ enabled }: { enabled: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [kind, setKind] = useState<Kind>("default");
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!enabled || reduced) return;

    const point = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      point.x = event.clientX;
      point.y = event.clientY;
      setVisible(true);

      const target = event.target as Element | null;
      const interactive = target?.closest("button, a, [role='button']");
      const text = target?.closest("input, textarea, select");
      setKind(text ? "text" : interactive ? "button" : "default");
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      ring.x += (point.x - ring.x) * 0.22;
      ring.y += (point.y - ring.y) * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(frame);
    };
  }, [enabled, reduced]);

  if (!enabled || reduced) return null;

  return (
    <div
      aria-hidden
      data-kind={kind}
      className={cn(
        "pointer-events-none fixed inset-0 z-[300] transition-opacity duration-150",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        ref={dotRef}
        className={cn(
          "absolute rounded-full bg-text-primary shadow-[0_0_0_2px_rgba(242,95,92,0.55)] transition-[width,height] duration-150",
          kind === "button" ? "h-2 w-2" : "h-1.5 w-1.5",
          kind === "text" ? "hidden" : "block",
        )}
      />
      <div
        ref={ringRef}
        className={cn(
          "absolute border-2 border-cta transition-[width,height,border-radius,background-color] duration-150",
          kind === "button"
            ? "h-9 w-9 rounded-full bg-cta/15"
            : kind === "text"
              ? "h-6 w-3 rounded-[1px] border-x-0 border-t-0 border-b-0 bg-transparent"
              : "h-6 w-6 rounded-full bg-transparent",
        )}
      >
        {kind === "text" ? <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-cta" /> : null}
      </div>
    </div>
  );
}
