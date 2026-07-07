"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ScrambleTextProps {
  text: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  className?: string;
  scrambledClassName?: string;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  scrambleSpeed = 50,
  maxIterations = 10,
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARS,
  sequential = false,
  revealDirection = "start",
  className,
  scrambledClassName,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set<number>());

  useEffect(() => {
    const localRevealed = new Set<number>();
    const textLength = text.length;
    const pool = useOriginalCharsOnly
      ? Array.from(new Set(text.split(""))).filter((c) => c !== " ")
      : characters.split("");

    setIsScrambling(true);

    const getNextIndex = () => {
      switch (revealDirection) {
        case "end":
          return textLength - 1 - localRevealed.size;
        case "center": {
          const middle = Math.floor(textLength / 2);
          const offset = Math.floor(localRevealed.size / 2);
          return localRevealed.size % 2 === 0
            ? middle + offset
            : middle - offset - 1;
        }
        default:
          return localRevealed.size;
      }
    };

    const renderText = () => {
      if (useOriginalCharsOnly) {
        const remaining: string[] = [];
        for (let i = 0; i < textLength; i++) {
          if (text[i] !== " " && !localRevealed.has(i)) {
            remaining.push(text[i]);
          }
        }
        for (let i = remaining.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }
        let r = 0;
        return text
          .split("")
          .map((c, i) => {
            if (c === " ") return " ";
            if (localRevealed.has(i)) return text[i];
            return remaining[r++];
          })
          .join("");
      }
      return text
        .split("")
        .map((c, i) => {
          if (c === " ") return " ";
          if (localRevealed.has(i)) return text[i];
          return pool[Math.floor(Math.random() * pool.length)];
        })
        .join("");
    };

    let currentIteration = 0;

    const interval = setInterval(() => {
      if (sequential) {
        if (localRevealed.size < textLength) {
          localRevealed.add(getNextIndex());
          setRevealedIndices(new Set(localRevealed));
          setDisplayText(renderText());
        } else {
          clearInterval(interval);
          setDisplayText(text);
          setIsScrambling(false);
        }
      } else {
        setDisplayText(renderText());
        currentIteration++;
        if (currentIteration >= maxIterations) {
          clearInterval(interval);
          setDisplayText(text);
          setIsScrambling(false);
        }
      }
    }, scrambleSpeed);

    return () => clearInterval(interval);
  }, [text, scrambleSpeed, maxIterations, useOriginalCharsOnly, characters, sequential, revealDirection]);

  return (
    <motion.span className={cn("inline-block whitespace-pre-wrap", className)}>
      <span className="sr-only">{displayText}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => (
          <span
            key={index}
            className={cn(
              !isScrambling || revealedIndices.has(index)
                ? className
                : scrambledClassName
            )}
          >
            {char}
          </span>
        ))}
      </span>
    </motion.span>
  );
};

export default ScrambleText;
