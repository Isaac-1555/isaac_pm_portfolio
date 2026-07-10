import type { CaseStudy } from "@/app/case-studies/data";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import { cn } from "@/lib/utils";
import { SatbrainAnimation } from "./FolderAnimations/SatbrainAnimation";
import { TuxAnimation } from "./FolderAnimations/TuxAnimation";
import { PocketResumeAnimation } from "./FolderAnimations/PocketResumeAnimation";

interface FolderArtProps {
  study: CaseStudy;
  className?: string;
}

/**
 * Per-project animation registry.
 *
 * Each entry is a React component that renders a custom animated scene
 * inside the folder cover. Components are responsible for handling their
 * own reduced-motion fallback (via `useReducedMotion` from motion/react).
 *
 * To override or add new animations, add an entry keyed by `study.id`:
 *
 *   const ANIMATION_REGISTRY: Record<string, React.ComponentType> = {
 *     satbrain: SatbrainAnimation,
 *     tux: TuxAnimation,
 *     "pocket-resume": PocketResumeAnimation,
 *   };
 *
 * If a study has no animation registered, the project's default icon from
 * `data.ts` is rendered as a placeholder that animates on hover via
 * IconHoverWrapper.
 */

type AnimationComponent = React.ComponentType;

const ANIMATION_REGISTRY: Record<string, AnimationComponent> = {
  satbrain: SatbrainAnimation,
  tux: TuxAnimation,
  "pocket-resume": PocketResumeAnimation,
};

export function FolderArt({ study, className }: FolderArtProps) {
  const Animation = ANIMATION_REGISTRY[study.id];

  if (Animation) {
    return (
      <div
        role="img"
        aria-label={`${study.title} animated illustration`}
        className={cn("flex items-center justify-center w-full h-full", className)}
      >
        <Animation />
      </div>
    );
  }

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
