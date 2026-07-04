import type { CaseStudy } from "@/app/case-studies/data";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import { cn } from "@/lib/utils";

interface FolderArtProps {
  study: CaseStudy;
  className?: string;
}

/**
 * Per-project pixel art registry.
 *
 * Drop a custom pixel SVG component in here later:
 *
 *   const REGISTRY: Record<string, React.ComponentType<{ className?: string }>> = {
 *     satbrain: SatbrainPixelArt,
 *     tux: TuxPixelArt,
 *     "pocket-resume": PocketResumePixelArt,
 *   };
 *
 * Each entry should be a 32x32 (or 16x16) grid SVG with
 * `shape-rendering="crispEdges"` and CSS-keyframe animation on hover via the
 * `.group:hover` selector. Until then, the project's default icon from
 * `data.ts` is rendered as a placeholder that animates on hover via
 * IconHoverWrapper.
 */

const REGISTRY: Record<string, React.ComponentType<{ className?: string }>> = {};

export function FolderArt({ study, className }: FolderArtProps) {
  const Custom = REGISTRY[study.id];
  if (Custom) return <Custom className={className} />;

  const Icon = study.icon;
  return (
    <IconHoverWrapper
      hoverTrigger="closest"
      className={cn(
        "flex items-center justify-center w-full h-full",
        className,
      )}
    >
      <Icon size={72} color="var(--color-bg-base)" />
    </IconHoverWrapper>
  );
}
