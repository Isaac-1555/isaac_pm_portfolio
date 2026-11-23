"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/scroll/LenisProvider";
import { useCursor } from "@/components/cursor/cursor-context";
import { ASSISTANT } from "@/lib/assistant/config";
import type { AssistantMode, AssistantState, ChatMessage, QAEntry } from "@/lib/assistant/types";
import { Chips } from "./chips";
import { ChatCursor } from "./chat-cursor";
import { KidMascot } from "./mascot";
import { Message } from "./message";
import { usePrefersReducedMotion } from "./use-stream-text";

type ChatPanelProps = {
  open: boolean;
  state: AssistantState;
  status: string;
  mode: AssistantMode;
  progress: number;
  messages: ChatMessage[];
  chips: QAEntry[];
  chipsLabel: string;
  bootLog: string[];
  muted: boolean;
  onToggleSound: () => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onAsk: (text: string) => void;
  onStreamComplete: (id: string) => void;
};

export function ChatPanel({
  open,
  state,
  status,
  mode,
  progress,
  messages,
  chips,
  chipsLabel,
  bootLog,
  muted,
  onToggleSound,
  returnFocusRef,
  onClose,
  onAsk,
  onStreamComplete,
}: ChatPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [coarse] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  });
  const lenis = useLenis();
  const { setHidden } = useCursor();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    let frame = 0;

    if (open) {
      if (!dialog.open) dialog.showModal();
      frame = window.requestAnimationFrame(() => setVisible(true));
      const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(focusTimer);
      };
    }

    frame = window.requestAnimationFrame(() => setVisible(false));
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const instance = lenis?.current;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    instance?.stop();
    setHidden(true);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.paddingRight = "";
      instance?.start();
      setHidden(false);
    };
  }, [open, lenis, setHidden]);

  useEffect(() => {
    if (!open) return;
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setKeyboardOffset(viewport.width < 768 ? offset : 0);
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;

    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        list.scrollTop = list.scrollHeight;
      });
    };

    const observer = new MutationObserver(() => {
      const distance = list.scrollHeight - list.scrollTop - list.clientHeight;
      if (distance < 180) scroll();
    });
    observer.observe(list, { childList: true, subtree: true, characterData: true });
    scroll();
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [open]);

  // Force the newest message into view, including the user's question while
  // K.I.D is still thinking, and the assistant reply as soon as it appears.
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const frame = window.requestAnimationFrame(() => {
      list.scrollTop = list.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, messages.length, state]);

  const announce = (value: string) => {
    setAnnouncement("");
    window.requestAnimationFrame(() => setAnnouncement(value));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = text.trim();
    if (!value || state === "thinking") return;
    setText("");
    onAsk(value);
  };

  const close = () => {
    onClose();
  };

  const statusTone =
    state === "error"
      ? "bg-eye-amber"
      : state === "waking"
        ? "bg-cta animate-pulse"
        : state === "thinking"
          ? "bg-cta animate-pulse"
          : state === "idle"
            ? "bg-text-secondary/40"
            : "bg-success";

  const streaming = messages.some((message) => message.role === "assistant" && message.streaming);

  return (
    <dialog
      ref={dialogRef}
      id="kid-chat-panel"
      data-lenis-prevent
      aria-labelledby="kid-chat-title"
      aria-describedby="kid-chat-desc"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
      className="kid-dialog fixed inset-0 z-[100] m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 text-bg-base outline-none backdrop:bg-transparent"
    >
      <AnimatePresence onExitComplete={() => {
        if (!open && dialogRef.current?.open) dialogRef.current.close();
        if (!open) returnFocusRef.current?.focus();
      }}>
        {visible ? (
          <div
            className={cn(
              "fixed inset-0 flex items-end justify-center md:items-end md:justify-end",
              !reduced && !coarse && "kid-chat-cursor-none",
            )}
            style={{ paddingBottom: keyboardOffset }}
          >
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              onClick={close}
              className="absolute inset-0 bg-text-primary/35 backdrop-blur-[1px]"
            />

            <div className="relative flex w-full flex-col md:mr-6 md:mb-28 md:w-[390px]">
              <motion.div
                aria-hidden
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.72 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.8 }}
                transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 300, damping: 22 }}
                className="pointer-events-none absolute -top-[4.5rem] right-2 z-[130] h-16 w-16 md:-top-[6.5rem] md:right-3 md:h-20 md:w-20"
                style={
                  {
                    "--glow": state === "waking" ? Math.max(0.05, progress) : state === "idle" ? 0.15 : state === "error" ? 0.3 : 1,
                    "--pupil-x": "0px",
                    "--pupil-y": "0px",
                  } as React.CSSProperties
                }
              >
                <KidMascot state={state} className="h-full w-full" />
              </motion.div>

              <motion.div
                key="panel"
                ref={panelRef}
                role="document"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.985 }}
                transition={reduced ? { duration: 0.15 } : { type: "spring", stiffness: 380, damping: 34 }}
                style={keyboardOffset ? { maxHeight: `calc(100dvh - ${keyboardOffset + 16}px)` } : undefined}
                className={cn(
                  "kid-console relative flex h-[70dvh] max-h-[calc(100dvh-1rem)] w-full flex-col overflow-hidden border-2 border-text-primary text-text-primary shadow-[6px_6px_0_rgba(43,50,51,0.28)]",
                  "rounded-t-md md:h-[560px] md:max-h-[calc(100dvh-9rem)] md:rounded-sm",
                )}
              >
              <header className="relative z-10 flex items-center justify-between border-b-2 border-text-primary bg-[#E4E0D4] px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center">
                    <KidMascot still state="ready" className="h-8 w-8" />
                  </span>
                  <div className="min-w-0">
                    <h2 id="kid-chat-title" className="truncate font-industrial text-sm uppercase tracking-[0.18em] text-text-primary">
                      {ASSISTANT.name}
                    </h2>
                    <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-text-secondary">
                      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", statusTone)} />
                      {status}
                      {mode === "keyword" && state !== "waking" ? <span className="text-text-secondary/60">· offline index</span> : null}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={onToggleSound}
                    aria-label={muted ? "Enable assistant sound" : "Mute assistant sound"}
                    aria-pressed={!muted}
                    className="grid h-8 w-8 place-items-center border-2 border-text-primary/60 bg-[#F7F4EA] text-text-primary transition-colors hover:border-cta hover:bg-cta hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
                  >
                    {muted ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                        <path d="M2 5.5h2L7 3v8L4 8.5H2z" />
                        <path d="M9 5l3 3M12 5l-3 3" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
                        <path d="M2 5.5h2L7 3v8L4 8.5H2z" />
                        <path d="M9.2 4.8a3 3 0 010 4.4M11 3a5.5 5.5 0 010 8" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close assistant"
                    className="grid h-8 w-8 place-items-center border-2 border-text-primary/60 bg-[#F7F4EA] text-text-primary transition-colors hover:border-cta hover:bg-cta hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <path d="M2 2l8 8M10 2l-8 8" />
                    </svg>
                  </button>
                </div>
              </header>

              <p id="kid-chat-desc" className="sr-only">
                Ask questions about Isaac&apos;s projects, experience, skills, availability and contact details.
              </p>

              <div
                ref={listRef}
                role="log"
                aria-live="off"
                className="relative z-10 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-color:rgba(43,50,51,0.22)_transparent] [scrollbar-width:thin]"
              >
                {bootLog.length && (state === "waking" || state === "error") ? (
                  <div className="border-2 border-text-primary/35 bg-[#F7F4EA] p-3 font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary">
                    {bootLog.map((line) => (
                      <p key={line} className="flex items-center gap-2">
                        <span aria-hidden className="text-cta">›</span>
                        {line}
                      </p>
                    ))}
                    {state === "waking" ? <p className="mt-1 text-cta">{Math.round(progress * 100)}%</p> : null}
                  </div>
                ) : null}

                {state === "thinking" && !streaming ? (
                  <div className="flex items-center gap-2.5" role="status">
                    <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center">
                      <KidMascot state="thinking" className="h-7 w-7" />
                    </span>
                    <span className="flex items-center gap-1.5 border-2 border-text-primary/30 bg-[#F7F4EA] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-secondary">
                      K.I.D is thinking
                      <span className="flex gap-1" aria-hidden>
                        <span className="kid-dot h-1 w-1 rounded-full bg-cta" />
                        <span className="kid-dot h-1 w-1 rounded-full bg-cta [animation-delay:150ms]" />
                        <span className="kid-dot h-1 w-1 rounded-full bg-cta [animation-delay:300ms]" />
                      </span>
                    </span>
                  </div>
                ) : null}

                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    onDone={onStreamComplete}
                    onAnnounce={announce}
                    onNavigate={close}
                  />
                ))}
              </div>

              <div className="relative z-10 border-t-2 border-text-primary bg-[#E4E0D4] px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-3">
                <div className="mb-3">
                  <Chips chips={chips} label={chipsLabel} disabled={state === "thinking"} onAsk={onAsk} />
                </div>

                <form onSubmit={submit} className="flex items-center gap-2">
                  <label htmlFor="kid-chat-input" className="sr-only">
                    Ask K.I.D a question
                  </label>
                  <input
                    ref={inputRef}
                    id="kid-chat-input"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    maxLength={300}
                    autoComplete="off"
                    placeholder="Ask..."
                    className="min-w-0 flex-1 border-2 border-text-primary/60 bg-[#F7F4EA] px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:border-cta focus:outline-none focus:ring-2 focus:ring-cta/20"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim() || state === "thinking"}
                    aria-label="Send question"
                    className="grid h-10 w-10 shrink-0 place-items-center border-2 border-text-primary bg-text-primary text-[#EDEAE1] transition-colors hover:border-cta hover:bg-cta hover:text-white disabled:cursor-not-allowed disabled:border-text-primary/25 disabled:bg-text-primary/20 disabled:text-text-primary/35"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <path d="M2 7h9M7.5 3.5L11 7l-3.5 3.5" />
                    </svg>
                  </button>
                </form>

              </div>

              <div aria-live="polite" aria-atomic="true" className="sr-only">
                {announcement}
              </div>
            </motion.div>
            </div>

            <ChatCursor enabled={!reduced && !coarse} />
          </div>
        ) : null}
      </AnimatePresence>
    </dialog>
  );
}
