"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "./LenisProvider";

export function ScrollPauseTrigger() {
  const lenisRef = useLenis();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasPausedRef = useRef(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasPausedRef.current) {
          const lenis = lenisRef?.current;
          if (!lenis) return;
          hasPausedRef.current = true;
          lenis.stop();
          setTimeout(() => lenis.start(), 1000);
        }
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [lenisRef]);

  return <div ref={sentinelRef} className="h-px w-full pointer-events-none" />;
}
