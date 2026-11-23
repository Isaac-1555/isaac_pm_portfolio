"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/** Word-by-word reveal with small jitter and longer pauses after punctuation. */
export function useStreamText(text: string, active: boolean, onDone: () => void) {
  const tokens = useMemo(() => text.match(/\S+\s*/g) ?? [], [text]);
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!active) return;

    if (reduced) {
      const timer = window.setTimeout(() => {
        setCount(tokens.length);
        doneRef.current = true;
        onDoneRef.current();
      }, 380);
      return () => window.clearTimeout(timer);
    }

    doneRef.current = false;
    let index = 0;
    let timer = 0;

    const step = () => {
      index += 1;
      setCount(index);

      if (index >= tokens.length) {
        if (!doneRef.current) {
          doneRef.current = true;
          window.setTimeout(() => onDoneRef.current(), 120);
        }
        return;
      }

      const token = tokens[index - 1] ?? "";
      const punctuation = /[.!?;:,—]$/.test(token.trim()) ? 150 : 0;
      const delay = 22 + Math.random() * 20 + punctuation;
      timer = window.setTimeout(step, delay);
    };

    timer = window.setTimeout(step, 90);
    return () => window.clearTimeout(timer);
  }, [active, reduced, tokens]);

  return {
    visible: active ? tokens.slice(0, count).join("") : text,
    done: !active || count >= tokens.length,
  };
}
