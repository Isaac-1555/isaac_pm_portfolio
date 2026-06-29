"use client"

import { useEffect, useMemo, useRef } from "react"
import Gravity, { MatterBody } from "@/components/fancy/physics/gravity"

interface TechPillFieldProps {
  techStack: string[]
}

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 9301 + salt * 49297) * 233280
  return x - Math.floor(x)
}

export function TechPillField({ techStack }: TechPillFieldProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const layout = useMemo(
    () =>
      techStack.map((tech, i) => {
        const count = techStack.length
        const xPct = ((i + 0.5) / count) * 92 + seeded(i, 1) * 6
        const yPct = -4 + seeded(i, 2) * 10
        const angle = (seeded(i, 3) - 0.5) * 50
        return { tech, xPct, yPct, angle }
      }),
    [techStack]
  )

  useEffect(() => {
    if (!wrapperRef.current) return
    const wrapper = wrapperRef.current
    const onWheel = (e: WheelEvent) => {
      // canvas consumes wheel as a scroll target; manually forward to page
      window.scrollBy({ top: e.deltaY, left: e.deltaX, behavior: "auto" })
    }
    wrapper.addEventListener("wheel", onWheel, { passive: true })
    return () => wrapper.removeEventListener("wheel", onWheel)
  }, [techStack])

  if (!techStack || techStack.length === 0) return null

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className="absolute inset-0 z-[1] overflow-hidden pointer-events-auto touch-pan-y [&_canvas]:touch-pan-y [&_canvas]:overflow-visible"
    >
      <Gravity
        gravity={{ x: 0, y: 1 }}
        addTopWall={false}
        grabCursor
        stopWhenSettled
        className="!pointer-events-auto touch-pan-y [&_canvas]:overflow-visible"
      >
        {layout.map(({ tech, xPct, yPct, angle }) => (
          <MatterBody
            key={tech}
            x={`${xPct}%`}
            y={`${yPct}%`}
            angle={angle}
            matterBodyOptions={{
              friction: 0.3,
              restitution: 0.15,
              density: 0.002,
              isStatic: false,
            }}
          >
            <span className="inline-block whitespace-nowrap border-2 border-cta bg-white/95 text-bg-dark px-4 py-2 rounded-full font-tech uppercase tracking-widest text-xs sm:text-sm font-bold shadow-2xl select-none">
              {tech}
            </span>
          </MatterBody>
        ))}
      </Gravity>
    </div>
  )
}
