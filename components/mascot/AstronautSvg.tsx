interface AstronautSvgProps {
  pose: "mascot-idle" | "mascot-running" | "mascot-presenting";
  className?: string;
}

export function AstronautSvg({ pose, className }: AstronautSvgProps) {
  return (
    <svg
      viewBox="0 0 56 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${pose} ${className ?? ""}`}
      aria-hidden="true"
    >
      {/* Backpack (behind body) — card / bg-accent */}
      <rect x="39" y="31" width="10" height="20" rx="3" fill="#B5B9B5" stroke="#3E4C4D" strokeWidth="1.5" />
      <rect x="41" y="35" width="6" height="2" rx="0.5" fill="#5A6366" />
      <rect x="41" y="39" width="6" height="2" rx="0.5" fill="#5A6366" />
      <rect x="41" y="43" width="6" height="2" rx="0.5" fill="#5A6366" />

      {/* Left leg — suit: bg-base, boots: bg-accent */}
      <g className="mascot-leg-l">
        <rect x="18" y="54" width="9" height="11" rx="4" fill="#C4C8C3" stroke="#3E4C4D" strokeWidth="1.5" />
        <rect x="16" y="62" width="13" height="8" rx="3" fill="#5A6366" stroke="#3E4C4D" strokeWidth="1.5" />
        <rect x="16" y="67" width="13" height="3" rx="1" fill="#3E4C4D" />
      </g>

      {/* Right leg */}
      <g className="mascot-leg-r">
        <rect x="29" y="54" width="9" height="11" rx="4" fill="#C4C8C3" stroke="#3E4C4D" strokeWidth="1.5" />
        <rect x="27" y="62" width="13" height="8" rx="3" fill="#5A6366" stroke="#3E4C4D" strokeWidth="1.5" />
        <rect x="27" y="67" width="13" height="3" rx="1" fill="#3E4C4D" />
      </g>

      {/* Body — suit: bg-base */}
      <rect x="15" y="30" width="26" height="25" rx="5" fill="#C4C8C3" stroke="#3E4C4D" strokeWidth="2" />

      {/* Suit center line */}
      <line x1="28" y1="31" x2="28" y2="54" stroke="#B5B9B5" strokeWidth="0.5" />

      {/* Belt — bg-accent / bg-dark */}
      <rect x="15" y="50" width="26" height="5" rx="1" fill="#5A6366" stroke="#3E4C4D" strokeWidth="1" />
      <rect x="25" y="50" width="6" height="5" rx="1" fill="#3E4C4D" />

      {/* Chest panel — bg-dark / text-primary + indicator lights: cta, success, tech */}
      <rect x="20" y="34" width="16" height="10" rx="2" fill="#3E4C4D" />
      <rect x="22" y="36" width="12" height="6" rx="1" fill="#2B3233" />
      <circle cx="25" cy="39" r="1.5" fill="#F25F5C" />
      <circle cx="29" cy="39" r="1.5" fill="#8B9E6B" />
      <circle cx="33" cy="39" r="1.5" fill="#4A7C7E" />

      {/* Collar — card */}
      <rect x="21" y="28" width="14" height="4" rx="2" fill="#B5B9B5" stroke="#3E4C4D" strokeWidth="1" />

      {/* Left arm — suit: bg-base, glove: card */}
      <g className="mascot-arm-l">
        <rect x="3" y="33" width="14" height="8" rx="4" fill="#C4C8C3" stroke="#3E4C4D" strokeWidth="1.5" />
        <ellipse cx="5" cy="37" rx="4" ry="4.5" fill="#B5B9B5" stroke="#3E4C4D" strokeWidth="1.5" />
      </g>

      {/* Right arm */}
      <g className="mascot-arm-r">
        <rect x="39" y="33" width="14" height="8" rx="4" fill="#C4C8C3" stroke="#3E4C4D" strokeWidth="1.5" />
        <ellipse cx="51" cy="37" rx="4" ry="4.5" fill="#B5B9B5" stroke="#3E4C4D" strokeWidth="1.5" />
      </g>

      {/* Helmet outer — card */}
      <circle cx="28" cy="17" r="14" fill="#B5B9B5" stroke="#3E4C4D" strokeWidth="2" />
      {/* Helmet inner shading — bg-base */}
      <circle cx="28" cy="17" r="12" fill="#C4C8C3" />

      {/* Visor — tech */}
      <ellipse cx="28" cy="19" rx="10" ry="8.5" fill="#4A7C7E" stroke="#3E4C4D" strokeWidth="1" />

      {/* Visor reflections */}
      <ellipse cx="24" cy="15" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-10 24 15)" />
      <ellipse cx="33" cy="22" rx="2" ry="1" fill="white" opacity="0.12" />

      {/* Antenna — cta */}
      <line x1="28" y1="3" x2="28" y2="6" stroke="#3E4C4D" strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="2" r="2.5" fill="#F25F5C" stroke="#3E4C4D" strokeWidth="0.5" />
      <circle cx="28" cy="2" r="1" fill="#E07A5F" opacity="0.6" />
    </svg>
  );
}
