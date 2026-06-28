import styles from './HeroBackground.module.css';

type ShapeType = 'star4' | 'star5' | 'dot' | 'asteroid' | 'planet' | 'ringed' | 'comet' | 'constellation';

interface Shape {
  type: ShapeType;
  size: number;
  top: string;
  delay: string;
  opacity: number;
  variant?: number;
  rotation?: number;
  detail?: 'bands' | 'craters';
}

interface Layer {
  color: string;
  speedClass: 'slow' | 'mid' | 'fast';
  shapes: Shape[];
}

/* ── Asteroid path variations (6) ── */

const ASTEROID_PATHS = [
  '0,-8 5,-4 8,1 4,6 -2,8 -6,3 -4,-4',
  '0,-7 4,-3 7,2 3,6 -3,7 -6,1 -3,-5',
  '0,-9 6,-5 9,2 5,7 -3,9 -7,3 -5,-6',
  '0,-6 5,-2 7,3 2,7 -4,6 -5,1 -2,-4',
  '0,-8 3,-5 8,0 5,5 -2,8 -7,2 -6,-5',
  '0,-7 6,-3 8,3 4,8 -3,7 -8,1 -4,-6',
];

/* ── Constellation patterns (3) ── */

interface ConstellationPattern {
  dots: [number, number, number][];
  lines: [number, number, number, number][];
}

const CONSTELLATION_PATTERNS: ConstellationPattern[] = [
  {
    dots: [[0, -6, 0.8], [4, 2, 1], [-3, 3, 0.7]],
    lines: [[0, -6, 4, 2], [4, 2, -3, 3]],
  },
  {
    dots: [[-5, -4, 0.9], [5, -4, 0.8], [0, 5, 1], [-2, 1.5, 0.6]],
    lines: [[-5, -4, -2, 1.5], [-2, 1.5, 0, 5], [-2, 1.5, 5, -4]],
  },
  {
    dots: [[0, -5, 1.1], [5, 0, 0.8], [0, 5, 0.9], [-5, 0, 0.8]],
    lines: [[0, -5, 5, 0], [5, 0, 0, 5], [0, 5, -5, 0], [-5, 0, 0, -5]],
  },
];

/* ── SVG path helpers ── */

function star4Path(r: number): string {
  const inner = r * 0.22;
  return `M 0,${-r} L ${inner},${-inner} L ${r},0 L ${inner},${inner} L 0,${r} L ${-inner},${inner} L ${-r},0 L ${-inner},${-inner} Z`;
}

function star5Path(r: number): string {
  const outer = r;
  const inner = r * 0.382;
  const sin18 = 0.309;
  const cos18 = 0.9511;
  const sin36 = 0.5878;
  const cos36 = 0.809;
  const sin54 = 0.809;
  const cos54 = 0.5878;
  const sin72 = 0.9511;
  const cos72 = 0.309;

  const pts: [number, number][] = [
    [0, -outer],
    [inner * sin36, -inner * cos36],
    [outer * sin18, -outer * cos18],
    [inner * sin72, inner * cos72],
    [outer * sin54, outer * cos54],
    [0, inner],
    [-outer * sin54, outer * cos54],
    [-inner * sin72, inner * cos72],
    [-outer * sin18, -outer * cos18],
    [-inner * sin36, -inner * cos36],
  ];

  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`).join(' ') + ' Z';
}

/* ── Shape renderers ── */

function renderStar4(size: number, color: string, opacity: number) {
  const r = size;
  const dim = r * 2;
  return (
    <svg width={dim} height={dim} viewBox={`${-r} ${-r} ${dim} ${dim}`} aria-hidden="true">
      <path d={star4Path(r)} fill={color} opacity={opacity} />
    </svg>
  );
}

function renderStar5(size: number, color: string, opacity: number) {
  const r = size;
  const dim = r * 2;
  return (
    <svg width={dim} height={dim} viewBox={`${-r} ${-r} ${dim} ${dim}`} aria-hidden="true">
      <path d={star5Path(r)} fill={color} opacity={opacity} />
    </svg>
  );
}

function renderDot(size: number, color: string, opacity: number) {
  const dim = size * 2 + 2;
  return (
    <svg width={dim} height={dim} viewBox={`${-size - 1} ${-size - 1} ${dim} ${dim}`} aria-hidden="true">
      <circle r={size} fill={color} opacity={opacity} />
    </svg>
  );
}

function renderAsteroid(size: number, color: string, opacity: number, variant: number) {
  const r = size;
  const pad = 3;
  const dim = (r + pad) * 2;
  return (
    <svg width={dim} height={dim} viewBox={`${-r - pad} ${-r - pad} ${dim} ${dim}`} aria-hidden="true">
      <polygon points={ASTEROID_PATHS[variant % ASTEROID_PATHS.length]} fill={color} opacity={opacity} />
    </svg>
  );
}

function renderPlanet(size: number, color: string, opacity: number, detail?: 'bands' | 'craters') {
  const r = size;
  const dim = (r + 2) * 2;
  const darkerColor = color; // bands/craters use same color with lower opacity

  return (
    <svg width={dim} height={dim} viewBox={`${-r - 2} ${-r - 2} ${dim} ${dim}`} aria-hidden="true">
      <circle r={r} fill={color} opacity={opacity} />
      {detail === 'bands' && (
        <>
          <ellipse cx={0} cy={-r * 0.3} rx={r * 0.85} ry={r * 0.08} fill={darkerColor} opacity={opacity * 0.6} />
          <ellipse cx={0} cy={r * 0.2} rx={r * 0.9} ry={r * 0.07} fill={darkerColor} opacity={opacity * 0.5} />
          <ellipse cx={0} cy={r * 0.5} rx={r * 0.75} ry={r * 0.06} fill={darkerColor} opacity={opacity * 0.4} />
        </>
      )}
      {detail === 'craters' && (
        <>
          <circle cx={-r * 0.35} cy={-r * 0.25} r={r * 0.18} fill={darkerColor} opacity={opacity * 0.45} />
          <circle cx={r * 0.4} cy={r * 0.15} r={r * 0.13} fill={darkerColor} opacity={opacity * 0.4} />
          <circle cx={r * 0.05} cy={-r * 0.5} r={r * 0.15} fill={darkerColor} opacity={opacity * 0.35} />
          <circle cx={-r * 0.2} cy={r * 0.45} r={r * 0.1} fill={darkerColor} opacity={opacity * 0.35} />
        </>
      )}
    </svg>
  );
}

function renderRinged(
  size: number,
  color: string,
  opacity: number,
  rotation: number,
  detail?: 'bands' | 'craters',
) {
  const r = size;
  const rx = r * 1.8;
  const ry = r * 0.25;
  const pad = 4;
  const dim = (r + rx + pad) * 2;

  return (
    <svg width={dim} height={dim} viewBox={`${-rx - r - pad} ${-r - rx - pad} ${dim} ${dim}`} aria-hidden="true">
      <g transform={`rotate(${rotation})`}>
        <ellipse cx={0} cy={0} rx={rx} ry={ry} fill="none" stroke={color} strokeWidth={0.8} opacity={opacity * 0.7} />
        <circle r={r} fill={color} opacity={opacity} />
        {detail === 'bands' && (
          <>
            <ellipse cx={0} cy={-r * 0.3} rx={r * 0.85} ry={r * 0.08} fill={color} opacity={opacity * 0.6} />
            <ellipse cx={0} cy={r * 0.2} rx={r * 0.9} ry={r * 0.07} fill={color} opacity={opacity * 0.5} />
          </>
        )}
        {detail === 'craters' && (
          <>
            <circle cx={-r * 0.3} cy={-r * 0.2} r={r * 0.15} fill={color} opacity={opacity * 0.4} />
            <circle cx={r * 0.35} cy={r * 0.1} r={r * 0.12} fill={color} opacity={opacity * 0.35} />
          </>
        )}
      </g>
    </svg>
  );
}

function renderComet(size: number, color: string, opacity: number, rotation: number) {
  const headR = size * 0.35;
  const tailW = size * 0.25;
  const tailL = size * 2;
  const pad = 4;
  const totalW = headR + tailL + pad * 2;
  const totalH = Math.max(headR * 2, tailW * 3) + pad * 2;

  return (
    <svg width={totalW} height={totalH} viewBox={`${-tailL - pad} ${-totalH / 2} ${totalW} ${totalH}`} aria-hidden="true">
      <g transform={`rotate(${rotation})`}>
        <path
          d={`M ${headR},0 L ${-headR},${-tailW} L ${-tailL},${-tailW * 0.5} L ${-tailL * 1.15},0 L ${-tailL},${tailW * 0.5} L ${-headR},${tailW} Z`}
          fill={color}
          opacity={opacity * 0.8}
        />
        <circle cx={headR} cy={0} r={headR} fill={color} opacity={opacity} />
      </g>
    </svg>
  );
}

function renderConstellation(size: number, color: string, opacity: number, variant: number) {
  const pattern = CONSTELLATION_PATTERNS[variant % CONSTELLATION_PATTERNS.length];
  const scale = size / 8;
  const maxDim = 36;
  return (
    <svg width={maxDim} height={maxDim} viewBox={`${-maxDim / 2} ${-maxDim / 2} ${maxDim} ${maxDim}`} aria-hidden="true">
      <g transform={`scale(${scale})`}>
        {pattern.lines.map(([x1, y1, x2, y2], i) => (
          <line key={`l-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={0.6} opacity={opacity * 0.8} />
        ))}
        {pattern.dots.map(([cx, cy, cr], i) => (
          <circle key={`d-${i}`} cx={cx} cy={cy} r={cr} fill={color} opacity={opacity} />
        ))}
      </g>
    </svg>
  );
}

function ShapeSVG({ shape, color }: { shape: Shape; color: string }) {
  switch (shape.type) {
    case 'star4':
      return renderStar4(shape.size, color, shape.opacity);
    case 'star5':
      return renderStar5(shape.size, color, shape.opacity);
    case 'dot':
      return renderDot(shape.size, color, shape.opacity);
    case 'asteroid':
      return renderAsteroid(shape.size, color, shape.opacity, shape.variant ?? 0);
    case 'planet':
      return renderPlanet(shape.size, color, shape.opacity, shape.detail);
    case 'ringed':
      return renderRinged(shape.size, color, shape.opacity, shape.rotation ?? 15, shape.detail);
    case 'comet':
      return renderComet(shape.size, color, shape.opacity, shape.rotation ?? -10);
    case 'constellation':
      return renderConstellation(shape.size, color, shape.opacity, shape.variant ?? 0);
    default:
      return null;
  }
}

/* ── Layer data ── */

const LAYERS: Layer[] = [
  {
    color: '#1A2525',
    speedClass: 'slow',
    shapes: [
      { type: 'dot', size: 1, top: '3%', delay: '0s', opacity: 0.08 },
      { type: 'dot', size: 1.5, top: '8%', delay: '2s', opacity: 0.1 },
      { type: 'dot', size: 1, top: '16%', delay: '4s', opacity: 0.08 },
      { type: 'dot', size: 2, top: '22%', delay: '6s', opacity: 0.12 },
      { type: 'dot', size: 1, top: '29%', delay: '8s', opacity: 0.09 },
      { type: 'dot', size: 1.5, top: '36%', delay: '10s', opacity: 0.1 },
      { type: 'star4', size: 4, top: '5%', delay: '1s', opacity: 0.12 },
      { type: 'star4', size: 5, top: '19%', delay: '5s', opacity: 0.14 },
      { type: 'star4', size: 3, top: '38%', delay: '9s', opacity: 0.11 },
      { type: 'star4', size: 6, top: '53%', delay: '13s', opacity: 0.15 },
      { type: 'star5', size: 4, top: '12%', delay: '3s', opacity: 0.13 },
      { type: 'star5', size: 5, top: '45%', delay: '7s', opacity: 0.15 },
      { type: 'star5', size: 3, top: '75%', delay: '11s', opacity: 0.12 },
      { type: 'asteroid', size: 5, top: '58%', delay: '15s', opacity: 0.14, variant: 0 },
      { type: 'asteroid', size: 4, top: '71%', delay: '17s', opacity: 0.13, variant: 1 },
      { type: 'planet', size: 4, top: '82%', delay: '19s', opacity: 0.16 },
      { type: 'planet', size: 3, top: '93%', delay: '21s', opacity: 0.15 },
      { type: 'constellation', size: 9, top: '26%', delay: '23s', opacity: 0.12, variant: 0 },
    ],
  },
  {
    color: '#4B5555',
    speedClass: 'mid',
    shapes: [
      { type: 'dot', size: 1.5, top: '2%', delay: '1s', opacity: 0.22 },
      { type: 'dot', size: 2, top: '11%', delay: '4s', opacity: 0.25 },
      { type: 'dot', size: 1.5, top: '24%', delay: '8s', opacity: 0.22 },
      { type: 'dot', size: 2.5, top: '37%', delay: '12s', opacity: 0.28 },
      { type: 'star4', size: 6, top: '7%', delay: '2s', opacity: 0.25 },
      { type: 'star4', size: 7, top: '28%', delay: '6s', opacity: 0.28 },
      { type: 'star4', size: 5, top: '63%', delay: '10s', opacity: 0.24 },
      { type: 'star5', size: 6, top: '15%', delay: '3s', opacity: 0.26 },
      { type: 'star5', size: 7, top: '51%', delay: '9s', opacity: 0.3 },
      { type: 'asteroid', size: 7, top: '34%', delay: '5s', opacity: 0.27, variant: 2 },
      { type: 'asteroid', size: 6, top: '68%', delay: '11s', opacity: 0.25, variant: 3 },
      { type: 'asteroid', size: 8, top: '86%', delay: '15s', opacity: 0.3, variant: 4 },
      { type: 'planet', size: 6, top: '41%', delay: '7s', opacity: 0.32, detail: 'craters' },
      { type: 'planet', size: 7, top: '77%', delay: '13s', opacity: 0.3, detail: 'bands' },
      { type: 'ringed', size: 7, top: '20%', delay: '14s', opacity: 0.3, rotation: 20 },
      { type: 'ringed', size: 6, top: '57%', delay: '18s', opacity: 0.28, rotation: -25 },
      { type: 'comet', size: 8, top: '46%', delay: '16s', opacity: 0.32, rotation: -8 },
      { type: 'constellation', size: 12, top: '73%', delay: '20s', opacity: 0.25, variant: 1 },
    ],
  },
  {
    color: '#7A8484',
    speedClass: 'fast',
    shapes: [
      { type: 'dot', size: 2, top: '5%', delay: '0s', opacity: 0.4 },
      { type: 'dot', size: 2.5, top: '18%', delay: '3s', opacity: 0.45 },
      { type: 'star4', size: 8, top: '10%', delay: '1s', opacity: 0.38 },
      { type: 'star4', size: 10, top: '33%', delay: '5s', opacity: 0.42 },
      { type: 'star4', size: 7, top: '69%', delay: '9s', opacity: 0.36 },
      { type: 'star5', size: 8, top: '25%', delay: '2s', opacity: 0.4 },
      { type: 'star5', size: 10, top: '55%', delay: '7s', opacity: 0.45 },
      { type: 'asteroid', size: 9, top: '15%', delay: '4s', opacity: 0.38, variant: 0 },
      { type: 'asteroid', size: 8, top: '42%', delay: '8s', opacity: 0.4, variant: 2 },
      { type: 'asteroid', size: 10, top: '61%', delay: '10s', opacity: 0.42, variant: 3 },
      { type: 'asteroid', size: 9, top: '81%', delay: '13s', opacity: 0.38, variant: 5 },
      { type: 'planet', size: 9, top: '30%', delay: '6s', opacity: 0.48, detail: 'bands' },
      { type: 'planet', size: 8, top: '74%', delay: '12s', opacity: 0.5, detail: 'craters' },
      { type: 'ringed', size: 10, top: '48%', delay: '11s', opacity: 0.45, rotation: -30, detail: 'bands' },
      { type: 'ringed', size: 9, top: '88%', delay: '16s', opacity: 0.42, rotation: 35, detail: 'craters' },
      { type: 'comet', size: 11, top: '22%', delay: '14s', opacity: 0.45, rotation: -12 },
      { type: 'comet', size: 10, top: '67%', delay: '17s', opacity: 0.4, rotation: 5 },
      { type: 'constellation', size: 14, top: '39%', delay: '19s', opacity: 0.38, variant: 2 },
    ],
  },
];

/* ── Main component ── */

const SPEED_CLASS_MAP: Record<Layer['speedClass'], string> = {
  slow: styles.driftSlow,
  mid: styles.driftMid,
  fast: styles.driftFast,
};

export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {LAYERS.map((layer) =>
        layer.shapes.map((shape, i) => (
          <div
            key={`${layer.speedClass}-${i}`}
            className={`absolute left-0 ${SPEED_CLASS_MAP[layer.speedClass]}`}
            style={{
              top: shape.top,
              animationDelay: shape.delay,
            }}
          >
            <ShapeSVG shape={shape} color={layer.color} />
          </div>
        )),
      )}
    </div>
  );
}
