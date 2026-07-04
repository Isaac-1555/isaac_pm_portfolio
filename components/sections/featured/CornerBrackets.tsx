interface CornerBracketsProps {
  size?: number;
  thickness?: number;
  color?: string;
  bootDelay?: number;
  className?: string;
}

export function CornerBrackets({
  size = 16,
  thickness = 2,
  color = "var(--color-cta)",
  bootDelay = 0,
  className = "",
}: CornerBracketsProps) {
  const arm = `${thickness}px solid ${color}`;
  const style = (extra: React.CSSProperties): React.CSSProperties => ({
    width: size,
    height: size,
    "--boot-delay": `${bootDelay}ms`,
    ...extra,
  } as React.CSSProperties);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-[2] ${className}`}
      aria-hidden
    >
      <span
        className="boot-bracket absolute top-0 left-0"
        style={style({ borderTop: arm, borderLeft: arm })}
      />
      <span
        className="boot-bracket absolute top-0 right-0"
        style={style({ borderTop: arm, borderRight: arm })}
      />
      <span
        className="boot-bracket absolute bottom-0 left-0"
        style={style({ borderBottom: arm, borderLeft: arm })}
      />
      <span
        className="boot-bracket absolute bottom-0 right-0"
        style={style({ borderBottom: arm, borderRight: arm })}
      />
    </div>
  );
}
