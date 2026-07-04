import { type CSSProperties } from "react";
import Image from "next/image";
import type { CaseStudy } from "@/app/case-studies/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FolderContentsProps {
  study: CaseStudy;
  className?: string;
}

const MAX_TECH_BADGES = 4;

const revealStyle = (index: number): CSSProperties =>
  ({ "--reveal-index": index } as CSSProperties);

export function FolderContents({ study, className }: FolderContentsProps) {
  const screenshot = study.screenshots[0];
  const visibleTech = study.techStack.slice(0, MAX_TECH_BADGES);
  const extraTech = study.techStack.length - visibleTech.length;

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden rounded-sm border-2 border-bg-dark shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {/* Screenshot hero — top 60% of card, with smooth fade into the dark panel below */}
      <div className="absolute inset-x-0 top-0 h-[60%] overflow-hidden">
        {screenshot ? (
          <Image
            src={screenshot}
            alt={study.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover object-top"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient}`} />
        )}
        {/* Bottom-up gradient on the screenshot to blend into the dark panel */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-dark to-transparent" />
      </div>

      {/* Dark info panel — bottom 45%, starts 5% before the bottom for overlap with the gradient.
          All overlay text lives here, always on solid dark. */}
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-bg-dark px-3 pt-4 pb-3 sm:px-4 sm:pt-5 sm:pb-4 flex flex-col justify-center">
        <div className="folder-reveal-item" style={revealStyle(0)}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[8px] font-tech uppercase tracking-widest text-text-secondary mb-0.5">
                {study.company}
              </div>
              <h3 className="text-base sm:text-lg font-industrial font-bold uppercase tracking-wide text-white leading-tight">
                {study.title}
              </h3>
              <div className="text-[9px] font-mono text-white/60 uppercase tracking-widest mt-0.5">
                {study.role}
              </div>
            </div>
            <Badge variant="gold" className="shrink-0 text-[8px] px-1.5 py-0">
              {study.status}
            </Badge>
          </div>
        </div>

        <div className="folder-reveal-item mt-2" style={revealStyle(1)}>
          <div className="flex flex-wrap gap-1">
            {visibleTech.map((tech) => (
              <Badge
                key={tech}
                variant="tech"
                className="text-[8px] px-1.5 py-0 bg-tech/80 border-bg-dark/40"
              >
                {tech}
              </Badge>
            ))}
            {extraTech > 0 && (
              <Badge
                variant="outline"
                className="text-[8px] px-1.5 py-0 text-white/70 border-white/30"
              >
                +{extraTech}
              </Badge>
            )}
          </div>
        </div>

        <div className="folder-reveal-item mt-2" style={revealStyle(2)}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-tech uppercase tracking-widest text-white/50">
              {study.timeline}
            </span>
            <span className="text-[9px] font-industrial uppercase tracking-widest text-cta">
              Open Project →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
