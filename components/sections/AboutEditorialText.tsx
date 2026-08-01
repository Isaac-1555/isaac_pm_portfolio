"use client";

import { useEffect, useRef, useState } from "react";
import {
  layout,
  layoutNextLine,
  prepareWithSegments,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";
import { useCursor } from "@/components/cursor/cursor-context";

const ABOUT_TEXT = `I'm a software developer and product builder who's always looking for a better way to do things. My mind gravitates toward inefficiencies, broken workflows, and the question of why something works the way it does. With 5+ years across software development, AI integration, and product management, I turn complex problems into tools that are faster, easier, and more intuitive for the people using them. I'd rather build and test than explain and promise; I let the work speak for itself. And I've learned that good problem-solving isn't just knowing what to build, it's knowing what's worth building.`;

const OBSTACLE_RADIUS = 48;
const OBSTACLE_HPAD = 10;
const OBSTACLE_VPAD = 4;
const MIN_SLOT_WIDTH = 50;
const LINE_HEIGHT_RATIO = 1.82;

type Interval = { left: number; right: number };

type PositionedLine = {
  x: number;
  y: number;
  width: number;
  text: string;
};

type CircleObstacle = {
  cx: number;
  cy: number;
  r: number;
  hPad: number;
  vPad: number;
};

function carveTextLineSlots(base: Interval, blocked: Interval[]): Interval[] {
  let slots = [base];
  for (let blockedIndex = 0; blockedIndex < blocked.length; blockedIndex++) {
    const interval = blocked[blockedIndex];
    const next: Interval[] = [];
    for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
      const slot = slots[slotIndex];
      if (interval.right <= slot.left || interval.left >= slot.right) {
        next.push(slot);
        continue;
      }
      if (interval.left > slot.left) next.push({ left: slot.left, right: interval.left });
      if (interval.right < slot.right) next.push({ left: interval.right, right: slot.right });
    }
    slots = next;
  }
  return slots.filter((slot) => slot.right - slot.left >= MIN_SLOT_WIDTH);
}

function circleIntervalForBand(
  cx: number,
  cy: number,
  r: number,
  bandTop: number,
  bandBottom: number,
  hPad: number,
  vPad: number,
): Interval | null {
  const top = bandTop - vPad;
  const bottom = bandBottom + vPad;
  if (top >= cy + r || bottom <= cy - r) return null;
  const minDy = cy >= top && cy <= bottom ? 0 : cy < top ? top - cy : cy - bottom;
  if (minDy >= r) return null;
  const maxDx = Math.sqrt(r * r - minDy * minDy);
  return { left: cx - maxDx - hPad, right: cx + maxDx + hPad };
}

function layoutLines(
  prepared: PreparedTextWithSegments,
  regionW: number,
  regionH: number,
  lineHeight: number,
  obstacle: CircleObstacle,
  topPad: number,
): PositionedLine[] {
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
  let lineTop = topPad;
  const lines: PositionedLine[] = [];
  let textExhausted = false;

  while (lineTop + lineHeight <= regionH && !textExhausted) {
    const bandTop = lineTop;
    const bandBottom = lineTop + lineHeight;
    const blocked: Interval[] = [];
    const interval = circleIntervalForBand(
      obstacle.cx,
      obstacle.cy,
      obstacle.r,
      bandTop,
      bandBottom,
      obstacle.hPad,
      obstacle.vPad,
    );
    if (interval !== null) blocked.push(interval);

    const slots = carveTextLineSlots({ left: 0, right: regionW }, blocked);
    if (slots.length === 0) {
      lineTop += lineHeight;
      continue;
    }

    const orderedSlots = [...slots].sort((a, b) => a.left - b.left);
    for (let slotIndex = 0; slotIndex < orderedSlots.length; slotIndex++) {
      const slot = orderedSlots[slotIndex];
      const slotWidth = slot.right - slot.left;
      const line = layoutNextLine(prepared, cursor, slotWidth);
      if (line === null) {
        textExhausted = true;
        break;
      }
      lines.push({
        x: Math.round(slot.left),
        y: Math.round(lineTop),
        width: line.width,
        text: line.text,
      });
      cursor = line.end;
    }

    lineTop += lineHeight;
  }

  return lines;
}

function positionedLinesEqual(a: PositionedLine[], b: PositionedLine[]): boolean {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index++) {
    const left = a[index];
    const right = b[index];
    if (left.x !== right.x || left.y !== right.y || left.text !== right.text) return false;
  }
  return true;
}

export function AboutEditorialText() {
  const { isReducedMotion, hidden } = useCursor();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const hiddenRef = useRef(hidden);
  const [ready, setReady] = useState(false);
  const didReadyRef = useRef(false);

  useEffect(() => {
    hiddenRef.current = hidden;
  }, [hidden]);

  useEffect(() => {
    if (isReducedMotion) return;
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return;

    const HEADROOM = (OBSTACLE_RADIUS + OBSTACLE_HPAD) * 2 + OBSTACLE_VPAD;

    let cancelled = false;
    let raf = 0;
    let fontsReady = false;
    let prepared: PreparedTextWithSegments | null = null;
    let font = "";
    let lineHeight = 0;
    let preparedWidth = 0;
    let regionH = 0;
    let appliedFont = "";
    let prevLines: PositionedLine[] = [];
    const spans: HTMLSpanElement[] = [];

    document.fonts.ready.then(() => {
      if (cancelled) return;
      fontsReady = true;
    });

    const provisional = wrapper.querySelector("p");
    if (provisional) {
      const h = provisional.getBoundingClientRect().height;
      if (h > 0) wrapper.style.height = `${Math.ceil(h + HEADROOM)}px`;
    }

    const handlePointer = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });

    const measureFont = () => {
      const style = getComputedStyle(wrapper);
      const fontSize = parseFloat(style.fontSize) || 16;
      font = `${fontSize}px ${style.fontFamily}`;
      lineHeight = Math.round(fontSize * LINE_HEIGHT_RATIO);
    };

    const prepareForWidth = (width: number) => {
      measureFont();
      prepared = prepareWithSegments(ABOUT_TEXT, font);
      const natural = layout(prepared, width, lineHeight);
      regionH = natural.height + HEADROOM;
      preparedWidth = width;
      wrapper.style.height = `${Math.ceil(regionH)}px`;
    };

    const syncSpans = (lines: PositionedLine[]) => {
      if (appliedFont !== font) {
        for (const span of spans) {
          span.style.font = font;
          span.style.lineHeight = `${lineHeight}px`;
        }
        appliedFont = font;
      }
      while (spans.length < lines.length) {
        const span = document.createElement("span");
        span.style.position = "absolute";
        span.style.whiteSpace = "pre";
        span.style.font = font;
        span.style.lineHeight = `${lineHeight}px`;
        span.style.willChange = "transform";
        span.style.transformOrigin = "0 0";
        stage.appendChild(span);
        spans.push(span);
      }
      for (let index = 0; index < spans.length; index++) {
        const span = spans[index];
        const line = lines[index];
        if (!line) {
          if (span.style.display !== "none") span.style.display = "none";
          continue;
        }
        if (span.textContent !== line.text) span.textContent = line.text;
        const transform = `translate3d(${line.x}px, ${line.y}px, 0)`;
        if (span.style.transform !== transform) span.style.transform = transform;
        if (span.style.display !== "") span.style.display = "";
      }
    };

    let smoothX = -1000;
    let smoothY = -1000;
    let lastFrame = 0;

    const loop = (now: number) => {
      if (cancelled) return;
      if (lastFrame > 0) {
        const dt = Math.min((now - lastFrame) / 1000, 0.05);
        const ease = 1 - Math.exp(-8 * dt);
        const mouse = pointerRef.current;
        smoothX += (mouse.x - smoothX) * ease;
        smoothY += (mouse.y - smoothY) * ease;
      }
      lastFrame = now;
      const rect = wrapper.getBoundingClientRect();
      const width = rect.width;

      if (width > 0 && fontsReady && (prepared === null || Math.abs(width - preparedWidth) > 0.5)) {
        prepareForWidth(width);
        prevLines = [];
        if (!didReadyRef.current) {
          didReadyRef.current = true;
          setReady(true);
        }
      }

      if (prepared) {
        const mouse = pointerRef.current;
        const cx = smoothX - rect.left;
        const cy = smoothY - rect.top;
        const mouseInside =
          mouse.x >= rect.left &&
          mouse.x <= rect.right &&
          mouse.y >= rect.top &&
          mouse.y <= rect.bottom;
        const margin = OBSTACLE_RADIUS + OBSTACLE_HPAD;
        const inside =
          !hiddenRef.current &&
          mouseInside &&
          cx >= -margin &&
          cx <= rect.width + margin &&
          cy >= -margin &&
          cy <= rect.height + margin;

        const obstacle: CircleObstacle = {
          cx,
          cy,
          r: inside ? OBSTACLE_RADIUS : 0,
          hPad: OBSTACLE_HPAD,
          vPad: OBSTACLE_VPAD,
        };
        const lines = layoutLines(prepared, width, regionH, lineHeight, obstacle, HEADROOM / 2);
        if (!positionedLinesEqual(prevLines, lines)) {
          syncSpans(lines);
          prevLines = lines;
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handlePointer);
      if (didReadyRef.current) {
        didReadyRef.current = false;
        stage.replaceChildren();
        wrapper.style.height = "";
        setReady(false);
      }
    };
  }, [isReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      data-cursor-wrap
      className="relative max-w-lg text-white font-sans leading-[1.82] text-sm md:text-base"
    >
      {ready ? null : <p className="leading-[1.82] text-sm md:text-base">{ABOUT_TEXT}</p>}
      <div ref={stageRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
