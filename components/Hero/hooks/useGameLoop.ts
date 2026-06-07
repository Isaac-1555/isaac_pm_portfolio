'use client';

import { useEffect, useRef } from 'react';

export function useGameLoop(
  callback: (dt: number, time: number) => void,
  isActive: boolean
) {
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const cbRef = useRef(callback);

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isActive) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const rawDt = (now - lastTimeRef.current) / 1000;
      const dt = Math.min(rawDt, 0.05);
      lastTimeRef.current = now;
      cbRef.current(dt, now);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [isActive]);
}
