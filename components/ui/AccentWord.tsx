"use client";

import ScrambleHover from "@/components/fancy/text/scramble-hover";

export function AccentWord({ text }: { text: string }) {
  return (
    <ScrambleHover
      text={text}
      className="text-cta"
      scrambledClassName="text-tech"
    />
  );
}
