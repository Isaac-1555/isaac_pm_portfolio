"use client";

import Link from "next/link";
import { KidMascot } from "./mascot";
import { useStreamText } from "./use-stream-text";
import type { ChatMessage } from "@/lib/assistant/types";

type MessageProps = {
  message: ChatMessage;
  onDone: (id: string) => void;
  onAnnounce: (text: string) => void;
  onNavigate: () => void;
};

export function Message({ message, onDone, onAnnounce, onNavigate }: MessageProps) {
  const streaming = message.role === "assistant" && Boolean(message.streaming);
  const { visible } = useStreamText(message.text, streaming, () => {
    onDone(message.id);
    onAnnounce(message.text);
  });

  const shown = streaming ? visible : message.text;
  const typing = streaming && visible.length < message.text.length;

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] border-2 border-text-primary bg-cta px-3.5 py-2.5 text-sm leading-relaxed text-text-primary shadow-[2px_2px_0_rgba(43,50,51,0.2)]">
          {message.text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5">
      <span
        aria-hidden
        className="mt-1 grid h-7 w-7 shrink-0 place-items-center"
      >
        <KidMascot still state="ready" className="h-7 w-7" />
      </span>
      <div className="min-w-0 max-w-[86%]">
        <div
          aria-hidden={streaming || undefined}
          className="border-2 border-text-primary/30 bg-[#F7F4EA] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-text-primary"
        >
          <p className="whitespace-pre-wrap">
            {shown}
            {typing ? <span className="kid-caret ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-text-primary" /> : null}
          </p>
        </div>

        {!streaming && message.actions?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.actions.map((action) => {
              const internal =
                action.href.startsWith("/") &&
                !action.href.match(/\.(pdf|apk)(\?|$)/) &&
                !action.href.includes("?");
              const className =
                "inline-flex items-center gap-1.5 border-2 border-text-primary/40 bg-white/60 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-text-primary transition-colors hover:border-cta hover:bg-cta/15";

              if (internal) {
                return (
                  <Link key={action.href + action.label} href={action.href} onClick={onNavigate} className={className}>
                    {action.label} <span aria-hidden>→</span>
                  </Link>
                );
              }

              const download = action.href.match(/\.(pdf|apk)(\?|$)/);
              return (
                <a
                  key={action.href + action.label}
                  href={action.href}
                  target={action.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={action.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  download={download ? "" : undefined}
                  className={className}
                >
                  {action.label} <span aria-hidden>↗</span>
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
