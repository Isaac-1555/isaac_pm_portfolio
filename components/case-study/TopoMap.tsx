"use client";

import { topoMarkers, type TopoMarkerGroup } from "@/lib/topo-markers";
import { cn } from "@/lib/utils";

const GROUP_STYLES: Record<TopoMarkerGroup, { icon?: string; title: string }> = {
  featured: { icon: "★", title: "Featured case study" },
  work: { title: "Work item" },
  blog: { icon: "✎", title: "Blog post" },
};

export function TopoMap({ activeId }: { activeId?: string }) {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url(/topographic.svg)",
          backgroundSize: "100% auto",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      {topoMarkers.map((marker) => {
        const active = marker.id === activeId;
        const { icon, title } = GROUP_STYLES[marker.group];
        return (
          <div
            key={marker.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
            {marker.group === "work" ? (
              <span
                title={title}
                className={cn(
                  "w-3 h-3 shadow-[0_1px_6px_rgba(0,0,0,0.5)]",
                  active ? "bg-tech scale-125 z-[1]" : "bg-bg-dark/80 border border-white/40",
                )}
              />
            ) : (
              <span
                title={title}
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full border font-tech text-sm leading-none shadow-[0_1px_6px_rgba(0,0,0,0.5)]",
                  active
                    ? "bg-tech border-tech text-white scale-125 z-[1]"
                    : "bg-bg-dark/80 border-white/40 text-white/70",
                )}
              >
                {icon}
              </span>
            )}
            <span
              className={cn(
                "mt-1 px-1.5 py-0.5 text-[10px] font-tech uppercase tracking-widest whitespace-nowrap rounded-sm backdrop-blur-sm",
                active
                  ? "bg-tech text-white font-bold"
                  : "bg-bg-dark/60 text-white/60",
              )}
            >
              {marker.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
