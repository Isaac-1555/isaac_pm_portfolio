"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AstronautMascot = dynamic(
  () => import("./AstronautMascot").then((mod) => mod.AstronautMascot),
  { ssr: false }
);

type IdleCapableWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number;
  cancelIdleCallback?: (id: number) => void;
};

export function MascotMount() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as IdleCapableWindow;
    const fallbackTimer = window.setTimeout(() => setIsReady(true), 1400);

    if (!idleWindow.requestIdleCallback) {
      return () => window.clearTimeout(fallbackTimer);
    }

    const idleId = idleWindow.requestIdleCallback(
      () => {
        window.clearTimeout(fallbackTimer);
        setIsReady(true);
      },
      { timeout: 1800 }
    );

    return () => {
      window.clearTimeout(fallbackTimer);
      if (idleId && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleId);
      }
    };
  }, []);

  if (!isReady) return null;
  return <AstronautMascot />;
}
