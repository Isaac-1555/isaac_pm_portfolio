"use client";

import { useState, useEffect, useRef } from "react";

interface AnimatedTextProps {
  text: string;
}

const SCRAMBLE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function AnimatedText({ text }: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTextRef = useRef(text);

  useEffect(() => {
    if (text !== prevTextRef.current) {
      prevTextRef.current = text;
      setIsAnimating(true);
      
      const chars = text.split("");
      
      let step = 0;
      const maxSteps = 4;
      
      const tick = () => {
        step++;
        
        if (step >= maxSteps) {
          setDisplayText(text);
          setIsAnimating(false);
          return;
        }
        
        const scrambled = chars.map((targetChar, i) => {
          const charProgress = i / chars.length;
          if (step / maxSteps > charProgress) {
            return targetChar;
          }
          return SCRAMBLE_LETTERS[Math.floor(Math.random() * SCRAMBLE_LETTERS.length)];
        }).join("");
        
        setDisplayText(scrambled);
      };
      
      const intervalId = setInterval(tick, 110);
      tick();
      
      return () => clearInterval(intervalId);
    }
  }, [text]);

  return (
    <span className={isAnimating ? "animate-pulse" : ""}>
      {displayText}
    </span>
  );
}