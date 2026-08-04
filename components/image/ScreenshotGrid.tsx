"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lightbox, type GalleryItem } from "./Lightbox";

interface ScreenshotGridProps {
  items: GalleryItem[];
  /** CSS aspect-ratio string, e.g. "2880 / 1800". Falls back to 16/9. */
  aspect?: string;
  fit?: "cover" | "contain";
  sizes?: string;
}

export function ScreenshotGrid({
  items,
  aspect = "16 / 9",
  fit = "cover",
  sizes,
}: ScreenshotGridProps) {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <motion.button
            key={item.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Enlarge ${item.alt}`}
            initial={false}
            whileHover="hover"
            className="group relative block w-full overflow-hidden rounded-sm border border-divider bg-bg-dark text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta cursor-zoom-in"
            style={{ aspectRatio: aspect }}
            data-cursor-view
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={sizes ?? "(max-width: 640px) 100vw, 50vw"}
              className={cn(
                "transition-transform duration-500 ease-out",
                fit === "contain" ? "object-contain p-2" : "object-cover group-hover:scale-[1.03]",
              )}
            />
            <motion.span
              variants={{
                hover: { opacity: 1 },
              }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-sm bg-bg-base/85 backdrop-blur px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-text-primary"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
              </svg>
              View
            </motion.span>
            <span className="absolute bottom-2 left-2 z-10 rounded-sm bg-bg-base/85 backdrop-blur px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-text-primary">
              {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </motion.button>
        ))}
      </div>

      <Lightbox
        items={items}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </>
  );
}
