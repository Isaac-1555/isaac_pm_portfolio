"use client";

import { useEffect, useRef } from "react";

const COME_BACK_TITLE = "Come back 🥺";
const WELCOME_BACK_TITLE = "Welcome back 😄";

export function TabTitleManager() {
  const originalTitle = useRef<string>("");
  const restoreTimer = useRef<number | null>(null);

  useEffect(() => {
    originalTitle.current = document.title;

    const onBlur = () => {
      if (restoreTimer.current) {
        window.clearTimeout(restoreTimer.current);
        restoreTimer.current = null;
      }
      if (
        document.title !== COME_BACK_TITLE &&
        document.title !== WELCOME_BACK_TITLE
      ) {
        originalTitle.current = document.title;
      }
      document.title = COME_BACK_TITLE;
    };

    const onFocus = () => {
      if (restoreTimer.current) {
        window.clearTimeout(restoreTimer.current);
      }
      document.title = WELCOME_BACK_TITLE;
      restoreTimer.current = window.setTimeout(() => {
        document.title = originalTitle.current;
        restoreTimer.current = null;
      }, 2000);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        onBlur();
      } else {
        onFocus();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      if (restoreTimer.current) {
        window.clearTimeout(restoreTimer.current);
      }
    };
  }, []);

  return null;
}
