"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import type { AssistantState } from "@/lib/assistant/types";

type MascotProps = {
  state: AssistantState;
  pupilRef?: React.Ref<SVGGElement>;
  className?: string;
  still?: boolean;
};

export function KidMascot({ state, pupilRef, className, still }: MascotProps) {
  const rawId = useId().replace(/:/g, "");

  return (
    <div
      data-state={still ? "static" : state}
      className={cn("kid-mascot relative", className)}
      style={still ? ({ "--glow": "0.55", "--pupil-x": "0px", "--pupil-y": "0px" } as React.CSSProperties) : undefined}
    >
      <svg viewBox="0 0 96 96" className="kid-eye-svg h-full w-full overflow-visible" aria-hidden>
        <defs>
          <radialGradient id={`${rawId}-housing`} cx="36%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#596365" />
            <stop offset="55%" stopColor="#242c2e" />
            <stop offset="100%" stopColor="#0b0f10" />
          </radialGradient>
          <linearGradient id={`${rawId}-rim`} x1="15%" y1="5%" x2="85%" y2="95%">
            <stop offset="0%" stopColor="#aab3b3" />
            <stop offset="38%" stopColor="#4a5557" />
            <stop offset="62%" stopColor="#d7dedd" />
            <stop offset="100%" stopColor="#384244" />
          </linearGradient>
          <radialGradient id={`${rawId}-lens`} cx="38%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#ffb0a8" />
            <stop offset="30%" stopColor="#ff4d42" />
            <stop offset="72%" stopColor="#9d1716" />
            <stop offset="100%" stopColor="#3e090b" />
          </radialGradient>
          <radialGradient id={`${rawId}-iris`} cx="46%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#2a0b0c" />
            <stop offset="70%" stopColor="#120708" />
            <stop offset="100%" stopColor="#050304" />
          </radialGradient>
          <radialGradient id={`${rawId}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff5348" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#ff2d24" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#ff2d24" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="48" cy="48" r="45" fill={`url(#${rawId}-rim)`} opacity="0.9" />
        <circle cx="48" cy="48" r="42" fill={`url(#${rawId}-housing)`} />
        <circle cx="48" cy="48" r="34" fill={`url(#${rawId}-glow)`} opacity="var(--glow)" />

        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index / 12) * Math.PI * 2;
          const x1 = 48 + Math.cos(angle) * 36.5;
          const y1 = 48 + Math.sin(angle) * 36.5;
          const x2 = 48 + Math.cos(angle) * 39.5;
          const y2 = 48 + Math.sin(angle) * 39.5;
          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#b9c1c0"
              strokeWidth="1"
              opacity="0.28"
            />
          );
        })}

        <circle cx="48" cy="48" r="29" fill="#160707" />
        <circle
          cx="48"
          cy="48"
          r="27"
          className="kid-lens"
          fill={`url(#${rawId}-lens)`}
          opacity="calc(0.35 + var(--glow)*0.7)"
        />
        <circle cx="48" cy="48" r="16.5" fill={`url(#${rawId}-iris)`} />
        <g
          ref={pupilRef}
          className="kid-pupil"
          style={{ transform: "translate(var(--pupil-x, 0px), var(--pupil-y, 0px))" }}
        >
          <circle cx="48" cy="48" r="8.5" fill="#050203" />
          <circle cx="44.5" cy="44.5" r="2.6" fill="#ffd9d5" opacity="0.9" />
          <circle cx="52" cy="51" r="1.2" fill="#ff8d85" opacity="0.75" />
        </g>

        <path
          d="M25 30 A32 32 0 0 1 63 21"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.18"
        />

        {state === "thinking" ? (
          <circle
            className="kid-scan"
            cx="48"
            cy="48"
            r="33"
            fill="none"
            stroke="#ffb0a8"
            strokeWidth="1.4"
            strokeDasharray="14 190"
            strokeLinecap="round"
            opacity="0.9"
          />
        ) : null}

        {state === "error" ? (
          <circle cx="48" cy="48" r="30" fill="none" stroke="#e0a33e" strokeWidth="2" opacity="0.65" />
        ) : null}
      </svg>
    </div>
  );
}
