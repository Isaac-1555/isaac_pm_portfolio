"use client";

import { useEffect, useState } from "react";
import type { VariantProps } from "class-variance-authority";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { AnimatedText } from "@/components/ui/split-flap";
import { CornerBrackets } from "./CornerBrackets";

export { CornerBrackets };

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const STATUS_KEYWORDS: Array<{ keys: string[]; variant: BadgeVariant }> = [
  { keys: ["live", "store", "deployed", "shipping"], variant: "success" },
  { keys: ["beta", "preview", "wip"], variant: "warning" },
  { keys: ["open source", "github", "public"], variant: "tech" },
  { keys: ["archived", "deprecated"], variant: "secondary" },
];

export function statusToVariant(status: string): BadgeVariant {
  const lower = status.toLowerCase();
  for (const { keys, variant } of STATUS_KEYWORDS) {
    if (keys.some((k) => lower.includes(k))) return variant;
  }
  return "tech";
}

const bootStyle = (offset: number) =>
  ({ "--boot-delay": `${offset}ms` } as React.CSSProperties);

/* AnimatedText scrambles when its `text` prop changes.
   Defer the text by one tick so scramble fires on initial boot
   AND on rotation remount (HudCanvas keyed by study id). */
function SplitFlapGate({ text, booted }: { text: string; booted: boolean }) {
  const [deferred, setDeferred] = useState("");
  useEffect(() => {
    if (!booted) return;
    const t = setTimeout(() => setDeferred(text), 60);
    return () => clearTimeout(t);
  }, [booted, text]);
  return <AnimatedText text={deferred} />;
}

/* ── Mission ID pill (top-left) ── */
export function MissionIdPill({
  missionId,
  bootDelay,
}: {
  missionId: string;
  bootDelay: number;
}) {
  return (
    <div
      className="boot-reveal hud-blur absolute top-3 left-3 z-[3] px-2.5 py-1 font-tech uppercase tracking-widest text-[10px] text-white border border-cta/40 rounded-sm"
      style={bootStyle(bootDelay)}
    >
      <span className="text-cta">{missionId}</span>
      <span className="text-white/50 mx-1.5">{"//"}</span>
      <span className="text-white/80">ACTIVE</span>
    </div>
  );
}

/* ── Status pill (top-right) ── */
export function StatusPill({
  status,
  bootDelay,
}: {
  status: string;
  bootDelay: number;
}) {
  return (
    <div
      className="boot-reveal absolute top-3 right-3 z-[3]"
      style={bootStyle(bootDelay + 80)}
    >
      <Badge
        variant={statusToVariant(status)}
        className="text-[10px] px-2 py-0.5 hud-blur border-bg-dark/40"
      >
        {status}
      </Badge>
    </div>
  );
}

/* ── Edge ticks (ruler marks along screenshot border) ── */
export function EdgeTicks({ color = "var(--color-cta)" }: { color?: string }) {
  const tickStyle = (position: React.CSSProperties): React.CSSProperties => ({
    ...position,
    background: color,
    opacity: 0.55,
  });
  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden>
      <span className="hud-edge-tick" style={tickStyle({ top: 0, left: "20%", width: 1, height: 6 })} />
      <span className="hud-edge-tick" style={tickStyle({ top: 0, left: "50%", width: 1, height: 8 })} />
      <span className="hud-edge-tick" style={tickStyle({ top: 0, left: "80%", width: 1, height: 6 })} />
      <span className="hud-edge-tick" style={tickStyle({ bottom: 0, left: "20%", width: 1, height: 6 })} />
      <span className="hud-edge-tick" style={tickStyle({ bottom: 0, left: "50%", width: 1, height: 8 })} />
      <span className="hud-edge-tick" style={tickStyle({ bottom: 0, left: "80%", width: 1, height: 6 })} />
      <span className="hud-edge-tick" style={tickStyle({ left: 0, top: "20%", height: 1, width: 6 })} />
      <span className="hud-edge-tick" style={tickStyle({ left: 0, top: "50%", height: 1, width: 8 })} />
      <span className="hud-edge-tick" style={tickStyle({ left: 0, top: "80%", height: 1, width: 6 })} />
      <span className="hud-edge-tick" style={tickStyle({ right: 0, top: "20%", height: 1, width: 6 })} />
      <span className="hud-edge-tick" style={tickStyle({ right: 0, top: "50%", height: 1, width: 8 })} />
      <span className="hud-edge-tick" style={tickStyle({ right: 0, top: "80%", height: 1, width: 6 })} />
    </div>
  );
}

/* ── Reticle (center crosshair, hover-driven) ── */
export function Reticle({ size = 56 }: { size?: number }) {
  return (
    <div
      className="hud-reticle absolute inset-0 z-[2] flex items-center justify-center pointer-events-none"
      aria-hidden
    >
      <div
        className="relative flex items-center justify-center rounded-full border border-cta/70"
        style={{ width: size, height: size }}
      >
        <div className="absolute w-px bg-cta/70" style={{ height: size * 0.4 }} />
        <div className="absolute h-px bg-cta/70" style={{ width: size * 0.4 }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-cta" />
      </div>
    </div>
  );
}

/* ── Scanline overlay (boot + hover sweep) ── */
export function Scanline({ bootDelay }: { bootDelay: number }) {
  return (
    <div
      className="hud-scanline z-[3]"
      style={bootStyle(bootDelay)}
      aria-hidden
    />
  );
}

/* ── KPI bar (bottom-left, backdrop-blur) ── */
export function KpiBar({
  kpis,
  bootDelay,
  variant,
}: {
  kpis: string[];
  bootDelay: number;
  variant: "flagship" | "satellite";
}) {
  const labelSize =
    variant === "flagship" ? "text-[8px]" : "text-[7px]";
  const valueSize =
    variant === "flagship" ? "text-[10px]" : "text-[9px]";
  return (
    <div
      className="boot-slide-up hud-blur absolute bottom-3 left-3 z-[3] flex gap-3 px-3 py-2 border border-cta/40 rounded-sm"
      style={bootStyle(bootDelay)}
    >
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className="flex flex-col gap-0.5 min-w-0 max-w-[180px]"
        >
          <div className={`font-tech ${labelSize} uppercase tracking-widest text-white/50`}>
            KPI-{String(i + 1).padStart(2, "0")}
          </div>
          <div className={`text-gold font-industrial font-bold ${valueSize} leading-tight line-clamp-2 uppercase tracking-wide`}>
            {kpi}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Title block (bottom-right, SplitFlap scramble on boot) ── */
export function TitleBlock({
  title,
  subtitle,
  bootDelay,
  variant,
  booted,
}: {
  title: string;
  subtitle: string;
  bootDelay: number;
  variant: "flagship" | "satellite";
  booted: boolean;
}) {
  const titleSize =
    variant === "flagship"
      ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
      : "text-xl sm:text-2xl md:text-3xl";
  return (
    <div
      className="boot-reveal absolute bottom-3 right-3 z-[3] max-w-[60%] text-right"
      style={bootStyle(bootDelay + 240)}
    >
      <h3
        className={`font-industrial font-bold uppercase tracking-wide md:tracking-widest text-white leading-none ${titleSize} drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]`}
      >
        <SplitFlapGate text={title} booted={booted} />
      </h3>
      {variant === "flagship" && (
        <p className="mt-2 text-xs sm:text-sm text-white/80 font-tech uppercase tracking-widest line-clamp-2 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
