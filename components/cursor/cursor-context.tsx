"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { CursorVariant } from "./cursor-types";
import { createSpring } from "./cursor-spring";

const MAGNETISM_RADIUS = 60;
const MAX_PULL = 10;
const HYSTERESIS_BONUS = 1.3;
const SWITCH_THRESHOLD = 1.15;
const SPRING_STIFFNESS = 120;
const SPRING_DAMPING = 16;
const SPRING_MASS = 0.15;

interface TargetRecord {
  el: Element;
  rect: DOMRect;
  cx: number;
  cy: number;
  type: "button" | "spotlight" | "disabled";
}

interface CursorContextValue {
  variant: CursorVariant;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  followerRef: React.MutableRefObject<{ x: number; y: number }>;
  magnetismOffsetRef: React.MutableRefObject<{ x: number; y: number }>;
  targetRect: DOMRect | null;
  isReducedMotion: boolean;
  hidden: boolean;
}

const Ctx = createContext<CursorContextValue | null>(null);

export function useCursor(): CursorContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCursor must be used within CursorProvider");
  return ctx;
}

interface Props {
  children: ReactNode;
}

export function CursorProvider({ children }: Props) {
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const followerRef = useRef({ x: -1000, y: -1000 });
  const magnetismOffsetRef = useRef({ x: 0, y: 0 });
  const springX = useRef(createSpring(-1000, SPRING_STIFFNESS, SPRING_DAMPING, SPRING_MASS));
  const springY = useRef(createSpring(-1000, SPRING_STIFFNESS, SPRING_DAMPING, SPRING_MASS));
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [hidden, setHidden] = useState(true);
  const [isTouchDevice] = useState(() => {
    if (typeof window === "undefined") return false;
    return matchMedia("(hover: none) and (pointer: coarse)").matches;
  });
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const pathname = usePathname();
  const targetsRef = useRef<TargetRecord[]>([]);
  const rafRef = useRef<number>(0);
  const activeTargetEl = useRef<Element | null>(null);
  const variantRef = useRef<CursorVariant>("default");
  const springInitialized = useRef(false);
  const enteredRef = useRef<Element | null>(null);

  const scanTargets = () => {
    const els: NodeListOf<Element> = document.querySelectorAll(
      "[data-cursor-target], [data-cursor-spotlight]"
    );
    const records: TargetRecord[] = [];
    for (const el of els) {
      const rect = el.getBoundingClientRect();
      records.push({
        el,
        rect,
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        type: el.hasAttribute("data-cursor-spotlight")
          ? "spotlight"
          : el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true"
            ? "disabled"
            : "button",
      });
    }
    targetsRef.current = records;
  };

  const refreshTargetRects = () => {
    for (const t of targetsRef.current) {
      const r = t.el.getBoundingClientRect();
      t.rect = r;
      t.cx = r.left + r.width / 2;
      t.cy = r.top + r.height / 2;
    }
  };

  useEffect(() => {
    if (isTouchDevice) return;

    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMQ = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    rmq.addEventListener("change", handleMQ);

    scanTargets();

    const ro = new ResizeObserver(() => refreshTargetRects());
    for (const t of targetsRef.current) {
      if (t.el instanceof Element) ro.observe(t.el);
    }

    const handleScroll = () => refreshTargetRects();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (hidden) setHidden(false);
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHidden((h) => !h);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("keydown", handleKey);
      rmq.removeEventListener("change", handleMQ);
    };
  }, [hidden, isTouchDevice, pathname]);

  useEffect(() => {
    if (isTouchDevice || isReducedMotion) return;

    let lastTime = performance.now();
    springInitialized.current = false;

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      if (!springInitialized.current) {
        springX.current.snap(mx);
        springY.current.snap(my);
        followerRef.current = { x: mx, y: my };
        springInitialized.current = true;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const targets = targetsRef.current;

      let bestTarget: TargetRecord | null = null;
      let bestScore = 0;

      for (const t of targets) {
        const dx = mx - t.cx;
        const dy = my - t.cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const halfDiag = Math.sqrt(t.rect.width ** 2 + t.rect.height ** 2) / 2;
        const radius = halfDiag + MAGNETISM_RADIUS;

        if (dist > radius) continue;

        let score = 1 - dist / radius;
        if (t.type === "disabled") score *= 0.5;

        const active = activeTargetEl.current;
        if (active && t.el === active) score *= HYSTERESIS_BONUS;

        if (score > bestScore) {
          bestScore = score;
          bestTarget = t;
        }
      }

      const mag = magnetismOffsetRef.current;
      if (bestTarget && bestScore > 0) {
        const active = activeTargetEl.current;
        if (active && bestTarget.el !== active) {
          const lockIdx = targets.findIndex((t) => t.el === active);
          if (lockIdx !== -1) {
            const lt = targets[lockIdx];
            const ldx = mx - lt.cx;
            const ldy = my - lt.cy;
            const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
            const lHD = Math.sqrt(lt.rect.width ** 2 + lt.rect.height ** 2) / 2;
            const lRad = lHD + MAGNETISM_RADIUS;
            const lockedScore = (1 - ldist / lRad) * HYSTERESIS_BONUS;
            if (bestScore < lockedScore * SWITCH_THRESHOLD) {
              bestTarget = lt;
            }
          }
        }
        activeTargetEl.current = bestTarget.el;

        const dx = bestTarget.cx - mx;
        const dy = bestTarget.cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hd = Math.sqrt(bestTarget.rect.width ** 2 + bestTarget.rect.height ** 2) / 2;
        const rad = hd + MAGNETISM_RADIUS;

        if (dist > 0 && dist < rad) {
          const strength = 1 - dist / rad;
          const pull = strength * strength * MAX_PULL;
          mag.x = (dx / dist) * pull;
          mag.y = (dy / dist) * pull;
        } else {
          mag.x = 0;
          mag.y = 0;
        }
      } else {
        activeTargetEl.current = null;
        mag.x = 0;
        mag.y = 0;
      }

      const dotX = mx + mag.x;
      const dotY = my + mag.y;

      const fx = springX.current.update(dotX, dt);
      const fy = springY.current.update(dotY, dt);
      followerRef.current = { x: fx, y: fy };

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isTouchDevice, isReducedMotion]);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseOver = (e: MouseEvent) => {
      const el = (e.target as Element).closest(
        "[data-cursor-target], [data-cursor-spotlight]"
      );
      if (!el) return;
      if (el === enteredRef.current) return;

      enteredRef.current = el;

      const isSpotlight = el.hasAttribute("data-cursor-spotlight");
      const isLoading = el.hasAttribute("data-cursor-loading");
      const isDisabled =
        el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true";

      if (isDisabled) {
        setVariant("disabled");
        setTargetRect(null);
        return;
      }
      if (isLoading) {
        setVariant("loading");
        setTargetRect(el.getBoundingClientRect());
        return;
      }
      if (isSpotlight) {
        setVariant("spotlight");
        setTargetRect(el.getBoundingClientRect());
        return;
      }
      setVariant("button");
      setTargetRect(el.getBoundingClientRect());
    };

    const handleMouseOut = (e: MouseEvent) => {
      const el = enteredRef.current;
      if (!el) return;
      const related = e.relatedTarget as Element | null;
      if (related && el.contains(related)) return;

      enteredRef.current = null;
      setVariant("default");
      setTargetRect(null);
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      enteredRef.current = null;
    };
  }, [isTouchDevice]);

  useEffect(() => {
    variantRef.current = variant;
  }, [variant]);

  useEffect(() => {
    const id = "cursor-none-override";
    if (isTouchDevice || hidden) {
      document.getElementById(id)?.remove();
      return;
    }
    const style = document.createElement("style");
    style.id = id;
    style.textContent =
      "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [hidden, isTouchDevice]);

  const ctx: CursorContextValue = {
    variant,
    mouseRef,
    followerRef,
    magnetismOffsetRef,
    targetRect,
    isReducedMotion: isTouchDevice || isReducedMotion,
    hidden: hidden || isTouchDevice,
  };

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}
