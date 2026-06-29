/* eslint-disable react-hooks/purity */
"use client"

import React, { useMemo, useRef } from "react"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/hooks/use-debounced-dimensions"

interface AnimatedGradientProps {
  colors: string[]
  speed?: number
  blur?: "light" | "medium" | "heavy"
}

// Deterministic pseudo-random based on index for SSR/CSR stability.
const seeded = (i: number, salt: number) => {
  const x = Math.sin(i * 9301 + salt * 49297) * 233280
  return x - Math.floor(x)
}

const randomInt = (min: number, max: number, i: number, salt: number) => {
  return Math.floor(seeded(i, salt) * (max - min + 1)) + min
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  colors,
  speed = 5,
  blur = "light",
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)

  const circleSize = useMemo(
    () => Math.max(dimensions.width, dimensions.height),
    [dimensions.width, dimensions.height]
  )

  const blurClass =
    blur === "light"
      ? "blur-2xl"
      : blur === "medium"
        ? "blur-3xl"
        : "blur-[100px]"

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div className={cn(`absolute inset-0`, blurClass)}>
        {colors.map((color, index) => {
          const animationProps = {
            animation: `background-gradient ${speed}s infinite ease-in-out`,
            animationDuration: `${speed}s`,
            top: `${seeded(index, 1) * 50}%`,
            left: `${seeded(index, 2) * 50}%`,
            "--tx-1": seeded(index, 3) - 0.5,
            "--ty-1": seeded(index, 4) - 0.5,
            "--tx-2": seeded(index, 5) - 0.5,
            "--ty-2": seeded(index, 6) - 0.5,
            "--tx-3": seeded(index, 7) - 0.5,
            "--ty-3": seeded(index, 8) - 0.5,
            "--tx-4": seeded(index, 9) - 0.5,
            "--ty-4": seeded(index, 10) - 0.5,
          } as React.CSSProperties

          return (
            <svg
              key={index}
              className={cn("absolute", "animate-background-gradient")}
              width={circleSize * randomInt(0.5, 1.5, index, 11)}
              height={circleSize * randomInt(0.5, 1.5, index, 12)}
              viewBox="0 0 100 100"
              style={animationProps}
            >
              <circle cx="50" cy="50" r="50" fill={color} />
            </svg>
          )
        })}
      </div>
    </div>
  )
}

export default AnimatedGradient
