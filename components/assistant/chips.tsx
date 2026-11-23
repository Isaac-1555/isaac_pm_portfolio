"use client";

import type { QAEntry } from "@/lib/assistant/types";

type ChipsProps = {
  chips: QAEntry[];
  label: string;
  disabled?: boolean;
  onAsk: (text: string) => void;
};

export function Chips({ chips, label, disabled, onAsk }: ChipsProps) {
  if (!chips.length) return null;

  return (
    <div className="space-y-2">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-secondary/70">{label}</p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {chips.map((entry) => (
          <button
            key={entry.id}
            type="button"
            disabled={disabled}
            onClick={() => onAsk(entry.chip ?? entry.questions[0] ?? entry.id)}
            className="border-2 border-text-primary/35 bg-[#F7F4EA] px-2.5 py-1 text-left font-mono text-[10px] leading-snug text-text-primary transition-colors hover:border-cta hover:bg-cta/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {entry.chip ?? entry.questions[0] ?? entry.id}
          </button>
        ))}
      </div>
    </div>
  );
}
