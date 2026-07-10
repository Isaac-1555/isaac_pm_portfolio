"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { motion, useInView, UseInViewOptions, Variants } from "motion/react";

import { cn } from "@/lib/utils";

type TextTag = "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const motionText: Record<TextTag, React.ComponentType<{ className?: string; layout?: boolean; children?: React.ReactNode }>> = {
  p: motion.p,
  span: motion.span,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
};

interface MediaBetweenTextProps {
  firstText: string;
  secondText: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  mediaContainerClassName?: string;
  fallbackUrl?: string;
  as?: TextTag;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  alt?: string;
  triggerType?: "hover" | "ref" | "inView";
  containerRef?: React.RefObject<HTMLDivElement | null>;
  useInViewOptionsProp?: UseInViewOptions;
  animationVariants?: {
    initial: Variants["initial"];
    animate: Variants["animate"];
  };
  className?: string;
  leftTextClassName?: string;
  rightTextClassName?: string;
}

export type MediaBetweenTextRef = {
  animate: () => void;
  reset: () => void;
};

export const MediaBetweenText = forwardRef<
  MediaBetweenTextRef,
  MediaBetweenTextProps
>(
  (
    {
      firstText,
      secondText,
      mediaUrl,
      mediaType,
      mediaContainerClassName,
      fallbackUrl,
      as = "p",
      autoPlay = true,
      loop = true,
      muted = true,
      playsInline = true,
      alt,
      triggerType = "hover",
      containerRef,
      useInViewOptionsProp = {
        once: true,
        amount: 0.5,
        root: containerRef,
      },
      animationVariants = {
        initial: { width: 0, opacity: 1 },
        animate: {
          width: "auto",
          opacity: 1,
          transition: { duration: 0.4, type: "spring", bounce: 0 },
        },
      },
      className,
      leftTextClassName,
      rightTextClassName,
    },
    ref,
  ) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const inViewResult = useInView(
      componentRef || containerRef,
      useInViewOptionsProp,
    );
    const isInView = triggerType === "inView" ? inViewResult : false;
    const [isHovered, setIsHovered] = useState(false);

    useImperativeHandle(ref, () => ({
      animate: () => setIsAnimating(true),
      reset: () => setIsAnimating(false),
    }));

    const shouldAnimate =
      triggerType === "hover"
        ? isHovered
        : triggerType === "inView"
          ? isInView
          : triggerType === "ref"
            ? isAnimating
            : false;

    const TextComponent = motionText[as];

    return (
      <div
        className={cn("flex", className)}
        ref={componentRef}
        onMouseEnter={() => triggerType === "hover" && setIsHovered(true)}
        onMouseLeave={() => triggerType === "hover" && setIsHovered(false)}
      >
        <TextComponent layout className={leftTextClassName}>
          {firstText}
        </TextComponent>
        <motion.div
          className={mediaContainerClassName}
          variants={animationVariants}
          initial="initial"
          animate={shouldAnimate ? "animate" : "initial"}
        >
          {mediaType === "video" ? (
            <video
              className="w-full h-full object-cover"
              autoPlay={autoPlay}
              loop={loop}
              muted={muted}
              playsInline={playsInline}
              poster={fallbackUrl}
            >
              <source src={mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={mediaUrl}
              alt={alt || `${firstText} ${secondText}`}
              width={64}
              height={64}
              unoptimized
              className="w-full h-full object-cover"
            />
          )}
        </motion.div>
        <TextComponent layout className={rightTextClassName}>
          {secondText}
        </TextComponent>
      </div>
    );
  },
);

MediaBetweenText.displayName = "MediaBetweenText";

export default MediaBetweenText;
