"use client";

import { useState } from "react";

import Floating, { FloatingElement } from "@/components/fancy/image/parallax-floating";
import { cn } from "@/lib/utils";

export function FooterParallax() {
  const [colorful, setColorful] = useState(false);
  const toggle = () => setColorful((v) => !v);

  return (
    <Floating
      sensitivity={2}
      easingFactor={0.08}
      onClick={toggle}
      className="absolute inset-0 z-10 cursor-pointer"
      role="button"
      aria-pressed={colorful}
      aria-label="Toggle footer artwork color"
    >
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/2">
        <FloatingElement depth={1.5} className="left-0 top-1/2 -translate-y-1/2 w-full">
          <img
            src="/adam.svg"
            alt=""
            draggable={false}
            className={cn(
              "block w-full h-auto select-none pointer-events-none transition-[filter,opacity] duration-500 footer-svg-mask [clip-path:inset(0_0_0_50%)]",
              colorful ? "footer-svg-colorful opacity-90" : "opacity-75"
            )}
            style={{ aspectRatio: "444 / 484.8", ...(!colorful ? { filter: "grayscale(1) brightness(1.5)" } : {}) }}
          />
        </FloatingElement>

        <FloatingElement depth={-1.5} className="left-0 top-1/2 -translate-y-1/2 w-full">
          <img
            src="/adam.svg"
            alt=""
            draggable={false}
            className={cn(
              "block w-full h-auto select-none pointer-events-none transition-[filter,opacity] duration-500 footer-svg-mask [clip-path:inset(0_50%_0_0)]",
              colorful ? "footer-svg-colorful opacity-90" : "opacity-75"
            )}
            style={{ aspectRatio: "444 / 484.8", ...(!colorful ? { filter: "grayscale(1) brightness(1.5)" } : {}) }}
          />
        </FloatingElement>
      </div>
    </Floating>
  );
}
