"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Sound is opt-in per page load. Nothing is created until the visitor clicks
 * the speaker toggle, so no autoplay policy is ever triggered.
 */
export function useAssistantSound(active: boolean) {
  const [muted, setMuted] = useState(true);
  const contextRef = useRef<AudioContext | null>(null);
  const playedRef = useRef(false);

  const ensureContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!contextRef.current) {
      const Ctor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      contextRef.current = new Ctor();
    }
    if (contextRef.current.state === "suspended") void contextRef.current.resume();
    return contextRef.current;
  }, []);

  const chime = useCallback(() => {
    const context = ensureContext();
    if (!context) return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(620, now);
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.24);
  }, [ensureContext]);

  const playBoot = useCallback(() => {
    if (muted) return;
    const context = ensureContext();
    if (!context) return;
    const now = context.currentTime;
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.028, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    for (const [frequency, detune] of [[55, 0], [110, 4], [165, -3]] as const) {
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = detune;
      oscillator.connect(gain);
      oscillator.start(now);
      oscillator.stop(now + 1.55);
    }
    gain.connect(context.destination);
  }, [ensureContext, muted]);

  const toggle = useCallback(() => {
    if (muted) {
      ensureContext();
      setMuted(false);
      window.setTimeout(() => chime(), 20);
    } else {
      setMuted(true);
    }
  }, [muted, chime, ensureContext]);

  useEffect(() => {
    if (active && !muted && !playedRef.current) {
      playedRef.current = true;
      playBoot();
    }
  }, [active, muted, playBoot]);

  useEffect(() => {
    return () => {
      void contextRef.current?.close();
      contextRef.current = null;
    };
  }, []);

  return { muted, toggle };
}
