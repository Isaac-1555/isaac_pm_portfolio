"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@/components/scroll/LenisProvider";

export interface GalleryItem {
  src: string;
  alt: string;
}

interface LightboxProps {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

const EASE = [0.4, 0, 0.2, 1] as const;

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const lenisRef = useLenis();
  const open = index !== null;
  const item = open ? items[index] : null;

  useEffect(() => {
    if (!open) return;
    const lenis = lenisRef?.current;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, lenisRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        onNavigate((index - 1 + items.length) % items.length);
      }
      if (e.key === "ArrowRight") {
        onNavigate((index + 1) % items.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onClose, onNavigate]);

  const prev = () => index !== null && onNavigate((index - 1 + items.length) % items.length);
  const next = () => index !== null && onNavigate((index + 1) % items.length);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          key={item.src}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-dark/90 backdrop-blur-sm p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain rounded-sm border-2 border-bg-base/30 bg-bg-dark shadow-2xl"
              draggable={false}
            />
          </motion.div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="absolute top-4 right-4 md:top-6 md:right-6 text-text-primary hover:text-cta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta rounded-sm p-2"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="M2 2L18 18M18 2L2 18" />
            </svg>
          </button>

          <span className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] md:text-xs uppercase tracking-widest text-text-primary bg-bg-base/10 border border-bg-base/20 rounded-sm px-3 py-1.5">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-text-primary hover:text-cta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta rounded-sm p-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-text-primary hover:text-cta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta rounded-sm p-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
