"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { MosaicOverlay } from "./MosaicOverlay";
import type {
  MosaicAnimationHandle,
  MosaicOverlayOptions,
  MosaicOrigin,
} from "./MosaicOverlay";

export type RouteTransitionOptions = Readonly<{
  mosaic?: MosaicOverlayOptions;
  settleDelay?: number;
}>;

const DEFAULT_MOSAIC: MosaicOverlayOptions = {
  columns: 7,
  rows: 5,
  duration: 340,
  stagger: 520,
  rotation: 9,
  origin: "center",
};

function normalizeMosaic(options?: MosaicOverlayOptions): MosaicOverlayOptions {
  return { ...DEFAULT_MOSAIC, ...(options ?? {}) };
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

type ClickPosition = Readonly<{ x: number; y: number }>;

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

  const mosaicOptions = normalizeMosaic(options?.mosaic);
  const origin = (mosaicOptions.origin as MosaicOrigin | undefined) ?? "center";
  const settleDelay = options?.settleDelay ?? 200;

  const overlayRef = useRef<MosaicAnimationHandle | null>(null);
  const [overlay, setOverlay] = useState<{
    key: number;
    clickPosition?: ClickPosition;
  } | null>(null);
  const pendingTargetRef = useRef<string | null>(null);
  const originalPathnameRef = useRef<string | null>(null);
  const runningRef = useRef(false);

  const runTransition = useCallback(
    (destination: string, clickPosition?: ClickPosition) => {
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
      setOverlay({ key: Date.now(), clickPosition });
    },
    [reducedMotion, router, pathname],
  );

  useEffect(() => {
    if (!overlay) {
      return;
    }

    const destination = pendingTargetRef.current;
    if (!destination) {
      return;
    }

    let cancelled = false;

    const commit = async () => {
      try {
        await overlayRef.current?.cover();
        if (cancelled || pendingTargetRef.current !== destination) {
          return;
        }
        router.push(destination);
      } catch {
        if (!cancelled) {
          setOverlay(null);
          runningRef.current = false;
        }
      }
    };

    void commit();

    return () => {
      cancelled = true;
    };
  }, [overlay, router]);

  useEffect(() => {
    if (!overlay || !pendingTargetRef.current) {
      return;
    }

    const target = new URL(pendingTargetRef.current, window.location.href);

    if (pathname !== originalPathnameRef.current && pathname !== target.pathname) {
      pendingTargetRef.current = null;
      originalPathnameRef.current = null;
      queueMicrotask(() => {
        setOverlay(null);
        runningRef.current = false;
      });
      return;
    }

    if (pathname !== target.pathname) {
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
      runTransition(destination, { x: event.clientX, y: event.clientY });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [runTransition]);

  return (
    <>
      {children}
      {overlay && (
        <MosaicOverlay
          key={overlay.key}
          ref={overlayRef}
          options={{ ...mosaicOptions, origin }}
          clickPosition={origin === "cursor" ? overlay.clickPosition : undefined}
        />
      )}
    </>
  );
}
