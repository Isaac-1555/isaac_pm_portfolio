"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { AssistantState } from "@/lib/assistant/types";
import { KidMascot } from "./mascot";
import { usePrefersReducedMotion } from "./use-stream-text";

type EyeProps = {
  state: AssistantState;
  progress: number;
  panelOpen: boolean;
  sectionId: string;
  canPreload: () => boolean;
  onWake: () => void;
  onOpen: () => void;
  onBootComplete: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
};

const TARGET: Record<AssistantState, number> = {
  dormant: 0.05,
  waking: 0,
  ready: 1,
  thinking: 1,
  idle: 0.15,
  error: 0.3,
};

export function Eye({
  state,
  progress,
  panelOpen,
  sectionId,
  canPreload,
  onWake,
  onOpen,
  onBootComplete,
  buttonRef,
}: EyeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const bootReported = useRef(false);
  const [tip, setTip] = useState(false);
  const [touch] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  });
  const reducedMotion = usePrefersReducedMotion();

  const target = state === "waking" ? Math.max(0.05, progress) : TARGET[state];

  useEffect(() => {
    bootReported.current = false;
  }, [state]);

  // Move the displayed glow toward the target. The main thread never jumps the
  // power level straight to the download value.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = reducedMotion;
    let display = Number.parseFloat(root.style.getPropertyValue("--glow") || "0.05");
    let frame = 0;

    const tick = () => {
      if (!document.hidden) {
        display += (target - display) * (reduced ? 1 : 0.1);
        if (Math.abs(target - display) < 0.002) display = target;
        root.style.setProperty("--glow", display.toFixed(3));
      }

      if (state === "waking" && target >= 0.995 && display >= 0.985 && !bootReported.current) {
        bootReported.current = true;
        onBootComplete();
      }

      if (Math.abs(target - display) > 0.001 || state === "waking") {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [target, state, onBootComplete, reducedMotion]);

  // Hover preload: a distance check instead of a transparent overlay, so the
  // page underneath stays clickable.
  useEffect(() => {
    if (state !== "dormant" || !canPreload()) return;
    const button = buttonRef.current;
    if (!button) return;

    let frame = 0;
    let last = 0;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const now = performance.now();
      if (now - last < 90) return;
      last = now;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = button.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
        if (distance <= 160) onWake();
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [state, canPreload, onWake, buttonRef]);

  // Pupil follows the pointer only while ready. One listener, rAF throttled.
  useEffect(() => {
    if (state !== "ready" || reducedMotion) return;
    const pupil = pupilRef.current;
    const root = rootRef.current;
    if (!pupil || !root) return;

    const targetPoint = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const button = buttonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(event.clientY - cy, event.clientX - cx);
      const distance = Math.min(1, Math.hypot(event.clientX - cx, event.clientY - cy) / 220);
      targetPoint.x = Math.cos(angle) * distance * 4;
      targetPoint.y = Math.sin(angle) * distance * 4;
    };

    const tick = () => {
      if (!document.hidden) {
        current.x += (targetPoint.x - current.x) * 0.12;
        current.y += (targetPoint.y - current.y) * 0.12;
        root.style.setProperty("--pupil-x", `${current.x.toFixed(2)}px`);
        root.style.setProperty("--pupil-y", `${current.y.toFixed(2)}px`);
      }
      frame = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(frame);
      root.style.setProperty("--pupil-x", "0px");
      root.style.setProperty("--pupil-y", "0px");
    };
  }, [state, buttonRef, reducedMotion]);

  useEffect(() => {
    try {
      if (localStorage.getItem("kid-tip-seen")) return;
    } catch {
      return;
    }
    const show = () => setTip(true);
    const timer = window.setTimeout(show, 3200);
    const onScroll = () => {
      if (window.scrollY > 40) show();
    };
    if (touch) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [touch]);

  const dismissTip = () => {
    setTip(false);
    try {
      localStorage.setItem("kid-tip-seen", "1");
    } catch {
      // storage may be unavailable
    }
  };

  useEffect(() => {
    if (!tip) return;
    const timer = window.setTimeout(() => {
      setTip(false);
      try {
        localStorage.setItem("kid-tip-seen", "1");
      } catch {
        // storage may be unavailable
      }
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [tip]);

  const label =
    state === "waking"
      ? `K.I.D is waking, ${Math.round(progress * 100)} percent`
      : state === "ready"
        ? "Open K.I.D, Isaac's assistant"
        : state === "thinking"
          ? "K.I.D is thinking"
          : state === "idle"
            ? "Wake K.I.D, Isaac's assistant"
            : state === "error"
              ? "Open K.I.D in keyword mode"
              : "Ask K.I.D, Isaac's assistant";

  return (
    <div
      ref={rootRef}
      data-state={state}
      data-section-id={sectionId}
      style={{ "--glow": "0.05", "--pupil-x": "0px", "--pupil-y": "0px" } as React.CSSProperties}
      className={cn(
        "kid-eye-root fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[70] transition-opacity duration-200 md:right-6 md:bottom-6",
        panelOpen && "pointer-events-none opacity-0",
      )}
    >
      {tip && !panelOpen ? (
        <div className="pointer-events-none absolute bottom-full right-0 mb-3 w-max max-w-[220px] rounded-sm border border-eye-rim/60 bg-eye-housing px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bg-base shadow-lg">
          {touch ? "Tap to wake · ~50 MB" : "Ask K.I.D"}
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={panelOpen}
        aria-controls="kid-chat-panel"
        onFocus={() => {
          if (state === "dormant" && canPreload()) onWake();
        }}
        onPointerDown={(event) => {
          if (event.pointerType === "touch" && state === "dormant") onWake();
        }}
        onClick={() => {
          dismissTip();
          onOpen();
        }}
        className={cn(
          "kid-eye group relative grid h-16 w-16 place-items-center rounded-full outline-none transition-transform duration-300 md:h-24 md:w-24",
          "focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-4 focus-visible:ring-offset-bg-base",
          state === "ready" && "hover:scale-[1.04]",
        )}
      >
        <span
          aria-hidden
          className="absolute inset-[-18px] rounded-full bg-[radial-gradient(circle,var(--color-eye-glow)_0%,transparent_68%)] opacity-[calc(var(--glow)*0.32)] blur-md"
        />
        <KidMascot state={state} pupilRef={pupilRef} className="h-full w-full" />

        <span
          aria-live="polite"
          className="pointer-events-none absolute bottom-full right-0 mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary"
        >
          {state === "error" ? "Keyword mode" : state === "thinking" ? "Thinking" : ""}
        </span>
      </button>
    </div>
  );
}
