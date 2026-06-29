"use client";

import AnimatedGradient from "@/components/fancy/background/animated-gradient-with-svg";

export function ProfileSummaryBackground() {
  return (
    <AnimatedGradient
      colors={["#3E4C4D", "#5A6366", "#7A8082", "#3E4C4D"]}
      speed={6}
      blur="medium"
    />
  );
}
