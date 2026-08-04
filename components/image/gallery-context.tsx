"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import { Lightbox, type GalleryItem } from "./Lightbox";

interface GalleryContextValue {
  register: (id: string, item: GalleryItem) => void;
  unregister: (id: string) => void;
  open: (id: string) => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext);
  if (!ctx) {
    throw new Error("Figure must be used within a GalleryProvider");
  }
  return ctx;
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, GalleryItem>>({});
  const [openId, setOpenId] = useState<string | null>(null);

  const register = useCallback((id: string, item: GalleryItem) => {
    setItems((prev) => ({ ...prev, [id]: item }));
  }, []);

  const unregister = useCallback((id: string) => {
    setItems((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const order = useMemo(() => Object.keys(items), [items]);
  const list = useMemo(() => order.map((id) => items[id]), [order, items]);
  const openIndex = openId ? order.indexOf(openId) : -1;

  const value = useMemo(
    () => ({ register, unregister, open: setOpenId }),
    [register, unregister],
  );

  return (
    <GalleryContext.Provider value={value}>
      {children}
      <Lightbox
        items={list}
        index={openIndex >= 0 ? openIndex : null}
        onClose={() => setOpenId(null)}
        onNavigate={(i) => setOpenId(order[i])}
      />
    </GalleryContext.Provider>
  );
}

interface FigureProps {
  src: string;
  alt: string;
  caption?: ReactNode;
  priority?: boolean;
  sizes?: string;
}

export function Figure({
  src,
  alt,
  caption,
  priority,
  sizes,
}: FigureProps) {
  const { register, unregister, open } = useGallery();

  useEffect(() => {
    register(src, { src, alt });
    return () => unregister(src);
  }, [src, alt, register, unregister]);

  return (
    <figure className="my-12 -mx-4 md:mx-0">
      <button
        type="button"
        onClick={() => open(src)}
        aria-label={`Enlarge image: ${alt}`}
        className="group relative block w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark bg-bg-dark shadow-lg cursor-zoom-in text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta"
        data-cursor-view
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        <span className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-sm bg-bg-base/85 backdrop-blur px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
          View
        </span>
      </button>
      {caption && (
        <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
