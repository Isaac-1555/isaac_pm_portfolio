"use client";
import { useEffect, useRef, cloneElement, isValidElement, ReactElement } from "react";
import type { AnimatedIconHandle } from "./types";
const ICON_HOVER_TRIGGER_SELECTOR = "[data-icon-hover-trigger]";
type AnimatedIconElementProps = {
  className?: string;
  ref?: React.Ref<AnimatedIconHandle>;
};

interface IconHoverWrapperProps {
  children: React.ReactNode;
  className?: string;
  hoverTrigger?: "self" | "closest";
}

export function IconHoverWrapper({
  children,
  className = "",
  hoverTrigger = "self",
}: IconHoverWrapperProps) {
  const childRef = useRef<AnimatedIconHandle>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const triggerElement =
      hoverTrigger === "closest"
        ? wrapper.closest<HTMLElement>(ICON_HOVER_TRIGGER_SELECTOR) ?? wrapper
        : wrapper;

    const handleMouseEnter = () => {
      childRef.current?.startAnimation();
    };

    const handleMouseLeave = () => {
      childRef.current?.stopAnimation();
    };

    triggerElement.addEventListener("mouseenter", handleMouseEnter);
    triggerElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      triggerElement.removeEventListener("mouseenter", handleMouseEnter);
      triggerElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hoverTrigger]);

  if (isValidElement(children)) {
    const child = children as ReactElement<AnimatedIconElementProps>;

    const childClassName =
      hoverTrigger === "closest"
        ? [child.props.className, "pointer-events-none"].filter(Boolean).join(" ")
        : child.props.className;
    return (
      <div ref={wrapperRef} className={className}>
        {cloneElement(child, {
          ref: childRef,
          ...(hoverTrigger === "closest" ? { className: childClassName } : {}),
        })}
      </div>
    );
  }
  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}

export default IconHoverWrapper;
