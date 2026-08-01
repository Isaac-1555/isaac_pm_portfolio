"use client"

import {
  ElementType,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { motion, Transition, useInView, UseInViewOptions } from "motion/react"

import { cn } from "@/lib/utils"

type HighlightDirection = "ltr" | "rtl" | "ttb" | "btt"

type TextHighlighterProps = {
  children: React.ReactNode
  as?: ElementType
  triggerType?: "hover" | "ref" | "inView" | "auto"
  transition?: Transition
  useInViewOptions?: UseInViewOptions
  className?: string
  highlightColor?: string
  highlightTextColor?: string
  direction?: HighlightDirection
} & React.HTMLAttributes<HTMLElement>

export type TextHighlighterRef = {
  animate: (direction?: HighlightDirection) => void
  reset: () => void
}

export const TextHighlighter = forwardRef<
  TextHighlighterRef,
  TextHighlighterProps
>(
  (
    {
      children,
      as = "span",
      triggerType = "inView",
      transition = { type: "spring", duration: 1, delay: 0, bounce: 0 },
      useInViewOptions = {
        once: true,
        initial: false,
        amount: 0.1,
      },
      className,
      highlightColor = "hsl(25, 90%, 80%)",
      highlightTextColor,
      direction = "ltr",
      ...props
    },
    ref
  ) => {
    const componentRef = useRef<HTMLDivElement>(null)
    const [isAnimating, setIsAnimating] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [currentDirection, setCurrentDirection] =
      useState<HighlightDirection>(direction)

    useEffect(() => {
      setCurrentDirection(direction)
    }, [direction])

    const inViewResult = useInView(componentRef, useInViewOptions)
    const isInView = triggerType === "inView" ? inViewResult : false

    useImperativeHandle(ref, () => ({
      animate: (animationDirection?: HighlightDirection) => {
        if (animationDirection) {
          setCurrentDirection(animationDirection)
        }
        setIsAnimating(true)
      },
      reset: () => setIsAnimating(false),
    }))

    const shouldAnimate =
      triggerType === "hover"
        ? isHovered
        : triggerType === "inView"
          ? isInView
          : triggerType === "ref"
            ? isAnimating
            : triggerType === "auto"
              ? true
              : false

    const ElementTag = as || "span"

    const animatedSize = useMemo(() => {
      switch (currentDirection) {
        case "ltr": return shouldAnimate ? "100% 100%" : "0% 100%"
        case "rtl": return shouldAnimate ? "100% 100%" : "0% 100%"
        case "ttb": return shouldAnimate ? "100% 100%" : "100% 0%"
        case "btt": return shouldAnimate ? "100% 100%" : "100% 0%"
        default: return shouldAnimate ? "100% 100%" : "0% 100%"
      }
    }, [shouldAnimate, currentDirection])
    const initialSize = useMemo(() => {
      switch (currentDirection) {
        case "ltr": return "0% 100%"
        case "rtl": return "0% 100%"
        case "ttb": return "100% 0%"
        case "btt": return "100% 0%"
        default: return "0% 100%"
      }
    }, [currentDirection])
    const backgroundPosition = useMemo(() => {
      switch (currentDirection) {
        case "ltr": return "0% 0%"
        case "rtl": return "100% 0%"
        case "ttb": return "0% 0%"
        case "btt": return "0% 100%"
        default: return "0% 0%"
      }
    }, [currentDirection])

    const highlightStyle = {
      backgroundImage: `linear-gradient(${highlightColor}, ${highlightColor})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: backgroundPosition,
      boxDecorationBreak: "clone",
      WebkitBoxDecorationBreak: "clone",
    } as React.CSSProperties

    return (
      <ElementTag
        ref={componentRef}
        onMouseEnter={() => triggerType === "hover" && setIsHovered(true)}
        onMouseLeave={() => triggerType === "hover" && setIsHovered(false)}
        {...props}
      >
        <motion.span
          className={cn("inline", className)}
          style={highlightStyle}
          animate={{
            backgroundSize: animatedSize,
            ...(highlightTextColor ? { color: highlightTextColor } : {}),
          }}
          initial={{
            backgroundSize: initialSize,
            ...(highlightTextColor ? { color: "currentColor" } : {}),
          }}
          transition={transition}
        >
          {children}
        </motion.span>
      </ElementTag>
    )
  }
)

TextHighlighter.displayName = "TextHighlighter"
