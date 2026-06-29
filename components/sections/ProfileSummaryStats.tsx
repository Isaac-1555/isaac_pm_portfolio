"use client";

import UnderlineToBackground from "@/components/fancy/text/underline-to-background";

const stats = [
  { value: "5+", label: "Years Exp" },
  { value: "30+", label: "Products Shipped" },
];

export function ProfileSummaryStats() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-8">
      {stats.map((stat) => (
        <UnderlineToBackground
          key={stat.label}
          targetTextColor="#ffffff"
          underlineHeightRatio={0.08}
          className="block pl-4"
        >
          <div className="text-3xl md:text-4xl font-industrial font-bold text-white leading-none">
            {stat.value}
          </div>
          <div className="text-xs md:text-sm font-industrial text-text-secondary uppercase tracking-wide mt-2">
            {stat.label}
          </div>
        </UnderlineToBackground>
      ))}
    </div>
  );
}
