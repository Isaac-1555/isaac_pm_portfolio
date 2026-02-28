"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AstronautSvg } from "./AstronautSvg";

/* ── Configuration ── */

interface PointOfInterest {
  sectionId: string;
  message: string;
}

interface PageTourConfig {
  sections: readonly string[];
  pois: PointOfInterest[];
}

const TOUR_CONFIGS: Record<string, PageTourConfig> = {
  "/": {
    sections: ["mission-home-hero", "mission-home-featured", "mission-home-about"],
    pois: [
      { sectionId: "mission-home-featured", message: "Check out these flagship projects!" },
      { sectionId: "mission-home-about", message: "Here\u2019s the profile \u2014 years of impact at a glance!" },
      { sectionId: "mission-home-hero", message: "Back to base \u2014 grab the resume up here!" },
    ],
  },
  "/work": {
    sections: ["mission-work-header", "mission-work-flagship", "mission-work-technical"],
    pois: [
      { sectionId: "mission-work-flagship", message: "Flagship case studies \u2014 click any card to dive deeper!" },
      { sectionId: "mission-work-technical", message: "Technical prototypes & labs \u2014 explore the repos!" },
      { sectionId: "mission-work-header", message: "Back to the top \u2014 ready for another tour!" },
    ],
  },
};

const OTHER_PAGE_MESSAGES = [
  "Just exploring over here\u2026",
  "Nice page! I\u2019ll keep looking around.",
  "I give tours on bigger pages \u2014 try the home or works page!",
];

/** Pages where the mascot is completely hidden (no restore button either). */
const HIDDEN_PAGES = new Set(["/experience"]);

const PM_QUIPS = [
  "Identifying pain points\u2026",
  "Collecting research documents\u2026",
  "Ideating solutions\u2026",
  "Building roadmap\u2026",
  "Being agile\u2026",
  "Refining backlogs\u2026",
  "Reviewing PRD\u2026",
  "Time for stand-ups!",
  "Let\u2019s do some A/B testing",
  "Now what did I learn from that\u2026",
  "What\u2019s the next step?",
  "It depends\u2026",
  "Let\u2019s play some poker",
  "I found my ideal customer!",
  "Let\u2019s build the MVP",
  "What\u2019s the GTM strategy?",
];

const FUNNY_QUIPS = [
  "I\u2019m not a real astronaut!",
  "Why am I T-posing\u2026",
];

type MascotState = "idle" | "running" | "presenting";

/* ── Helpers ── */

const readStoredFlag = (key: string, fallback = false) => {
  if (typeof window === "undefined") return fallback;
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return fallback;
  }
};

/* ── Component ── */

export function AstronautMascot() {
  const pathname = usePathname() || "/";
  const shouldReduceMotion = useReducedMotion();
  const activeTour = TOUR_CONFIGS[pathname] ?? null;
  const isPageHidden = HIDDEN_PAGES.has(pathname);

  /* --- State --- */
  const [mascotState, setMascotState] = useState<MascotState>("idle");
  const [xTarget, setXTarget] = useState(40);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [bubbleMessage, setBubbleMessage] = useState<string | null>(null);
  const [isHidden, setIsHidden] = useState(() =>
    readStoredFlag("astronaut-mascot-hidden")
  );
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [activeSection, setActiveSection] = useState<string>("");

  /* --- Refs --- */
  const currentXRef = useRef(40);
  const guideTargetRef = useRef<PointOfInterest | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);
  const lastPoiIndexRef = useRef(-1);
  const quipTimerRef = useRef<number | null>(null);
  const pmQuipIndexRef = useRef(0);

  /* --- Pose --- */
  const pose: "mascot-idle" | "mascot-running" | "mascot-presenting" =
    shouldReduceMotion
      ? "mascot-idle"
      : mascotState === "running"
        ? "mascot-running"
        : mascotState === "presenting"
          ? "mascot-presenting"
          : "mascot-idle";

  /* ── Effects: Environment ── */

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleVis = () => setIsDocumentVisible(!document.hidden);
    handleVis();
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, []);

  /* ── Effect: Persist hidden ── */

  useEffect(() => {
    try {
      localStorage.setItem("astronaut-mascot-hidden", isHidden ? "1" : "0");
    } catch {
      /* no-op */
    }
  }, [isHidden]);

  /* ── Effect: Reset on route change ── */

  useEffect(() => {
    guideTargetRef.current = null;
    lastPoiIndexRef.current = -1;
    if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current);
    if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current);
    if (quipTimerRef.current) window.clearTimeout(quipTimerRef.current);
    const tour = TOUR_CONFIGS[pathname] ?? null;
    const t = window.setTimeout(() => {
      setActiveSection(tour ? tour.sections[0] : "");
      setBubbleMessage(null);
      setMascotState("idle");
    }, 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  /* ── Effect: Section tracking (pages with tour) ── */

  useEffect(() => {
    if (!activeTour) return;

    const scores = new Map<string, number>();
    const els = activeTour.sections
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          /* Use visible pixel height instead of intersectionRatio so large
             sections that fill the viewport always outscore small headers. */
          scores.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRect.height : 0
          );
        }
        const [best] = [...scores.entries()].sort((a, b) => b[1] - a[1]);
        if (best && best[1] > 0) setActiveSection(best[0]);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75], rootMargin: "-15% 0px -30% 0px" }
    );

    for (const el of els) {
      scores.set(el.id, 0);
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, [activeTour]);

  /* ── Effect: Idle wander scheduling ── */

  useEffect(() => {
    if (
      mascotState !== "idle" ||
      shouldReduceMotion ||
      !isDocumentVisible ||
      isHidden
    )
      return;

    /* Idle 10-15 s, then take a short stroll (nearby hop → ~1-2 s of spring movement) */
    const delay = 10000 + Math.random() * 5000;
    const timer = window.setTimeout(() => {
      /* Clear any active quip bubble before walking */
      setBubbleMessage(null);
      if (bubbleTimerRef.current) {
        window.clearTimeout(bubbleTimerRef.current);
        bubbleTimerRef.current = null;
      }

      const minX = 16;
      const maxX = Math.max(minX + 40, viewportWidth - 80);
      const cur = currentXRef.current;

      /* Pick direction away from the nearest edge so the hop never clamps
         to the same position (which would freeze the state machine). */
      const spaceLeft = cur - minX;
      const spaceRight = maxX - cur;
      let hopDir: number;
      if (spaceRight < 80) {
        hopDir = -1;
      } else if (spaceLeft < 80) {
        hopDir = 1;
      } else {
        hopDir = Math.random() < 0.5 ? -1 : 1;
      }

      const available = hopDir > 0 ? spaceRight : spaceLeft;
      const hopDistance =
        80 + Math.random() * Math.max(0, Math.min(170, available - 80));
      const nextX = Math.max(
        minX,
        Math.min(maxX, Math.floor(cur + hopDir * hopDistance))
      );

      setDirection(nextX >= cur ? "right" : "left");
      currentXRef.current = nextX;
      setXTarget(nextX);
      setMascotState("running");
    }, delay);

    return () => window.clearTimeout(timer);
  }, [mascotState, isDocumentVisible, isHidden, shouldReduceMotion, viewportWidth]);

  /* ── Handlers ── */

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (bubbleTimerRef.current) {
      window.clearTimeout(bubbleTimerRef.current);
      bubbleTimerRef.current = null;
    }
    if (quipTimerRef.current) {
      window.clearTimeout(quipTimerRef.current);
      quipTimerRef.current = null;
    }
  }, []);

  const handleXAnimationComplete = useCallback(() => {
    if (guideTargetRef.current) {
      const poi = guideTargetRef.current;
      guideTargetRef.current = null;
      setMascotState("presenting");
      setBubbleMessage(poi.message);

      clearTimers();
      idleTimerRef.current = window.setTimeout(() => {
        setMascotState("idle");
        setBubbleMessage(null);
      }, 5000);
    } else {
      setMascotState("idle");
    }
  }, [clearTimers]);

  const handleClick = useCallback(() => {
    clearTimers();
    setBubbleMessage(null);

    if (!activeTour) {
      /* Pages without a tour: show a reaction + brief message */
      const msg =
        OTHER_PAGE_MESSAGES[
          Math.floor(Math.random() * OTHER_PAGE_MESSAGES.length)
        ];
      setMascotState("presenting");
      setBubbleMessage(msg);
      idleTimerRef.current = window.setTimeout(() => {
        setMascotState("idle");
        setBubbleMessage(null);
      }, 3500);
      return;
    }

    /* Pages with a tour: guide to next POI */
    let nextPoiIndex: number;
    if (lastPoiIndexRef.current < 0) {
      /* First click: seed from current section */
      const sectionIdx = activeTour.sections.indexOf(activeSection);
      nextPoiIndex = Math.max(0, sectionIdx);
    } else {
      /* Subsequent clicks: always advance */
      nextPoiIndex = (lastPoiIndexRef.current + 1) % activeTour.pois.length;
    }
    lastPoiIndexRef.current = nextPoiIndex;
    const poi = activeTour.pois[nextPoiIndex];

    guideTargetRef.current = poi;
    setMascotState("running");

    const el = document.getElementById(poi.sectionId);
    if (el) {
      /* Scroll so the section heading sits ~30% from the viewport top.
         This keeps the section content visible around the mascot at the bottom. */
      const rect = el.getBoundingClientRect();
      const scrollTarget = window.scrollY + rect.top - window.innerHeight * 0.3;
      window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
    }

    /* Move astronaut to a natural position in the viewport */
    const nextX = Math.max(
      20,
      Math.min(viewportWidth - 80, viewportWidth * 0.15 + Math.random() * viewportWidth * 0.5)
    );
    setDirection(nextX >= currentXRef.current ? "right" : "left");
    currentXRef.current = nextX;
    setXTarget(nextX);
  }, [activeSection, activeTour, clearTimers, viewportWidth]);

  const handleDoubleClick = useCallback(() => {
    setIsHidden(true);
  }, []);

  /* ── Effect: Idle quips (every 10 s, shown for 7 s) ── */

  useEffect(() => {
    if (
      mascotState !== "idle" ||
      bubbleMessage ||
      !isDocumentVisible ||
      isHidden
    )
      return;

    quipTimerRef.current = window.setTimeout(() => {
      /* ~20 % chance of a funny quip; otherwise cycle through PM quips */
      let quip: string;
      if (Math.random() < 0.2) {
        quip = FUNNY_QUIPS[Math.floor(Math.random() * FUNNY_QUIPS.length)];
      } else {
        quip = PM_QUIPS[pmQuipIndexRef.current];
        pmQuipIndexRef.current =
          (pmQuipIndexRef.current + 1) % PM_QUIPS.length;
      }
      setBubbleMessage(quip);
      bubbleTimerRef.current = window.setTimeout(() => {
        setBubbleMessage(null);
      }, 7000);
    }, 10000);

    return () => {
      if (quipTimerRef.current) window.clearTimeout(quipTimerRef.current);
    };
  }, [mascotState, bubbleMessage, isDocumentVisible, isHidden]);

  /* ── Effect: sync xTarget ref ── */

  useEffect(() => {
    currentXRef.current = xTarget;
  }, [xTarget]);

  /* ── Render ── */

  if (isPageHidden) return null;

  if (isHidden) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsHidden(false);
          setMascotState("idle");
        }}
        className="fixed bottom-4 right-4 z-40 rounded-full border-2 border-bg-dark bg-bg-base/95 px-3 py-2 text-xs font-industrial uppercase tracking-wider text-text-primary shadow-lg backdrop-blur transition-colors hover:border-cta hover:text-cta"
        aria-label="Restore astronaut mascot"
      >
        Restore Guide
      </button>
    );
  }

  const bubbleAlignClass =
    xTarget > viewportWidth - 280
      ? "right-0 origin-bottom-right"
      : "left-0 origin-bottom-left";

  return (
    <LazyMotion features={domAnimation}>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
        <m.div
          className="relative w-fit pointer-events-auto"
          animate={{ x: xTarget }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            mass: 0.8,
          }}
          onAnimationComplete={handleXAnimationComplete}
        >
          {/* Speech bubble */}
          {bubbleMessage && (
            <m.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`absolute -top-10 w-max max-w-[min(75vw,16rem)] rounded-full border-2 border-bg-dark bg-bg-base/95 px-3 py-1.5 text-[11px] font-tech text-text-primary shadow-md backdrop-blur ${bubbleAlignClass}`}
            >
              {bubbleMessage}
            </m.div>
          )}

          {/* Astronaut */}
          <m.button
            type="button"
            aria-label="Astronaut guide — click to tour sections"
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            className="relative mb-1 block cursor-pointer rounded-xl p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cta"
            whileTap={{ scale: 0.95 }}
            style={{ scaleX: direction === "right" ? 1 : -1 }}
          >
            <AstronautSvg pose={pose} className="w-16 drop-shadow-md" />
          </m.button>
        </m.div>
      </div>
    </LazyMotion>
  );
}
