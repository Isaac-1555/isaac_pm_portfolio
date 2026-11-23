"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { SectionId } from "@/lib/assistant/types";

const ORDER: SectionId[] = ["projects", "about", "contact"];

function routeSection(pathname: string): SectionId {
  if (pathname.startsWith("/work") || pathname.startsWith("/case-studies")) return "projects";
  if (pathname.startsWith("/experience")) return "about";
  if (pathname.startsWith("/blog")) return "about";
  return "about";
}

export function useActiveSection() {
  const pathname = usePathname();
  const [section, setSection] = useState<SectionId>(() => routeSection(pathname));

  useEffect(() => {
    const fallback = routeSection(pathname);
    const frame = window.requestAnimationFrame(() => setSection(fallback));

    const elements = ORDER.filter((id) => id !== "contact")
      .map((id) => document.querySelector<HTMLElement>(`[data-section="${id}"]`))
      .filter((element): element is HTMLElement => Boolean(element));

    const ratios = new Map<Element, number>();
    let observer: IntersectionObserver | null = null;
    let atBottom = false;

    if (elements.length) {
      observer = new IntersectionObserver(
        (entries) => {
          if (atBottom) return;
          for (const entry of entries) ratios.set(entry.target, entry.intersectionRatio);
          let best: Element | null = null;
          let bestRatio = 0;
          for (const [element, ratio] of ratios) {
            if (ratio > bestRatio) {
              best = element;
              bestRatio = ratio;
            }
          }
          const next = best?.getAttribute("data-section") as SectionId | undefined;
          if (next && bestRatio > 0.08) setSection(next);
        },
        { rootMargin: "-32% 0px -32% 0px", threshold: [0, 0.08, 0.2, 0.4, 0.6, 0.8] },
      );
      for (const element of elements) observer.observe(element);
    }

    // The footer is sticky and therefore always intersects the viewport.
    // Contact is better inferred from reaching the end of the document.
    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        const doc = document.documentElement;
        const nearBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 120;
        atBottom = nearBottom;
        if (nearBottom) {
          setSection("contact");
        } else if (elements.length) {
          let bestId: SectionId | null = null;
          let bestRatio = 0;
          for (const [element, ratio] of ratios) {
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = element.getAttribute("data-section") as SectionId;
            }
          }
          if (bestId && bestRatio > 0.08) setSection(bestId);
          else setSection(fallback);
        } else {
          setSection(fallback);
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return section;
}
