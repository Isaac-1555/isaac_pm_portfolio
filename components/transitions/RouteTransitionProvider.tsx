"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { DissolveOverlay } from "./DissolveOverlay";
import type {
  DissolveAnimationHandle,
  DissolveOverlayOptions,
} from "./DissolveOverlay";

export type RouteTransitionOptions = Readonly<{
  dissolve?: DissolveOverlayOptions;
  settleDelay?: number;
}>;

const DEFAULT_DISSOLVE: DissolveOverlayOptions = {
  duration: 680,
  grainSize: 7,
  softness: 0.12,
};

function normalizeDissolve(
  options?: DissolveOverlayOptions,
): DissolveOverlayOptions {
  return { ...DEFAULT_DISSOLVE, ...(options ?? {}) };
}

function isModifiedClick(event: MouseEvent): boolean {
  return (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  );
}

export function RouteTransitionProvider({
  children,
  options,
}: Readonly<{
  children: ReactNode;
  options?: RouteTransitionOptions;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion() ?? false;

  const dissolveOptions = normalizeDissolve(options?.dissolve);
  const settleDelay = options?.settleDelay ?? 200;

  const overlayRef = useRef<DissolveAnimationHandle | null>(null);
  const [overlay, setOverlay] = useState<{ key: number } | null>(null);
  const pendingTargetRef = useRef<string | null>(null);
  const originalPathnameRef = useRef<string | null>(null);
  const runningRef = useRef(false);

  const runTransition = useCallback(
    (destination: string) => {
      if (runningRef.current) {
        return;
      }
      runningRef.current = true;

      if (reducedMotion) {
        router.push(destination);
        runningRef.current = false;
        return;
      }

      originalPathnameRef.current = pathname;
      pendingTargetRef.current = destination;
      setOverlay({ key: Date.now() });
    },
    [reducedMotion, router, pathname],
  );

  const handleCovered = useCallback(() => {
    const destination = pendingTargetRef.current;
    if (!destination) {
      return;
    }
    router.push(destination);
  }, [router]);

  useEffect(() => {
    if (!overlay || !pendingTargetRef.current) {
      return;
    }

    const target = new URL(pendingTargetRef.current, window.location.href);
    const destination = target.pathname + target.search + target.hash;

    if (pathname !== originalPathnameRef.current && pathname !== destination) {
      pendingTargetRef.current = null;
      originalPathnameRef.current = null;
      queueMicrotask(() => {
        setOverlay(null);
        runningRef.current = false;
      });
      return;
    }

    if (pathname !== destination) {
      return;
    }

    pendingTargetRef.current = null;
    originalPathnameRef.current = null;

    const reveal = async () => {
      if (reducedMotion) {
        setOverlay(null);
        runningRef.current = false;
        return;
      }

      await new Promise<void>((resolve) => setTimeout(resolve, settleDelay));
      await overlayRef.current?.reveal();
      setOverlay(null);
      runningRef.current = false;
    };

    void reveal();
  }, [pathname, overlay, reducedMotion, settleDelay]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isModifiedClick(event)) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) {
        return;
      }

      const destination =
        url.pathname + url.search + url.hash;
      const current =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      if (destination === current) {
        return;
      }

      event.preventDefault();
      runTransition(destination);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [runTransition]);

  return (
    <>
      {children}
      {overlay && (
        <DissolveOverlay
          key={overlay.key}
          ref={overlayRef}
          options={dissolveOptions}
          onCovered={handleCovered}
        />
      )}
    </>
  );
}
