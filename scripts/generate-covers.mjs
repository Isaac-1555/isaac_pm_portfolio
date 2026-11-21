/**
 * Generates the product cover art in public/covers.
 * Pure vector SVG — no raster, no AI, sharp at any zoom.
 *
 * Usage: node scripts/generate-covers.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const font = readFileSync(join(root, "app/fonts/devgothic.ttf")).toString("base64");

const C = {
  paper: "#C4C8C3",
  paper2: "#B5B9B5",
  ink: "#2B3233",
  slate: "#3E4C4D",
  slate2: "#354143",
  accent: "#5A6366",
  coral: "#F25F5C",
  gold: "#E07A5F",
  green: "#8B9E6B",
  teal: "#4A7C7E",
  divider: "#7A8082",
  cream: "#D9DCD5",
};

const W = 1600;
const H = 1000;

/** deterministic pseudo random so regenerating gives identical art */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** hand-drawn looking topographic contour rings */
function contours(cx, cy, seed, count = 9, step = 34, base = 60) {
  const rand = rng(seed);
  const paths = [];
  for (let ring = 0; ring < count; ring++) {
    const r = base + ring * step + rand() * 10;
    const wobble = 0.16 + rand() * 0.1;
    const phase = rand() * Math.PI * 2;
    let d = "";
    const points = 72;
    for (let i = 0; i <= points; i++) {
      const a = (i / points) * Math.PI * 2;
      const rr =
        r *
        (1 +
          wobble * Math.sin(a * 3 + phase) +
          wobble * 0.55 * Math.sin(a * 7 - phase * 1.7) +
          wobble * 0.3 * Math.sin(a * 11 + phase * 0.6));
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr * 0.78;
      d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    paths.push(`<path d="${d}Z" fill="none" stroke="${C.ink}" stroke-width="1" opacity="0.16"/>`);
  }
  return paths.join("");
}

function grid() {
  const lines = [];
  for (let x = 80; x <= 860; x += 52) {
    lines.push(`<line x1="${x}" y1="86" x2="${x}" y2="902" />`);
  }
  for (let y = 86; y <= 902; y += 52) {
    lines.push(`<line x1="80" y1="${y}" x2="860" y2="${y}" />`);
  }
  return `<g stroke="${C.ink}" stroke-width="0.6" opacity="0.07">${lines.join("")}</g>`;
}

function ticks() {
  const out = [];
  for (let x = 80; x <= 860; x += 26) {
    const long = (x - 80) % 130 === 0;
    out.push(
      `<line x1="${x}" y1="${long ? 56 : 62}" x2="${x}" y2="70" stroke="${C.ink}" stroke-width="1" opacity="0.5"/>`,
    );
  }
  return `<g>${out.join("")}</g>`;
}

function crosshair(x, y, size = 20, color = C.coral) {
  return `<g stroke="${color}" stroke-width="1.4" opacity="0.9">
    <line x1="${x - size}" y1="${y}" x2="${x + size}" y2="${y}"/>
    <line x1="${x}" y1="${y - size}" x2="${x}" y2="${y + size}"/>
    <circle cx="${x}" cy="${y}" r="${size * 0.42}" fill="none"/>
  </g>`;
}

function barcode(x, y, seed) {
  const rand = rng(seed);
  let g = "";
  let cursor = x;
  while (cursor < x + 220) {
    const w = 1 + Math.floor(rand() * 3);
    const gap = 2 + Math.floor(rand() * 4);
    g += `<rect x="${cursor}" y="${y}" width="${w}" height="30" fill="${C.cream}" opacity="0.8"/>`;
    cursor += w + gap;
  }
  return g;
}

function wordmark(parts, y = 690, size = 104) {
  const spans = parts
    .map((p) => `<tspan fill="${p.fill}">${p.text}</tspan>`)
    .join("");
  return `<text x="80" y="${y}" font-family="DevGothic" font-size="${size}" letter-spacing="1.5" fill="${C.ink}">${spans}</text>`;
}

function stats(items) {
  const cell = 780 / 3;
  return `<g>
    <line x1="80" y1="300" x2="860" y2="300" stroke="${C.ink}" stroke-width="1" opacity="0.4"/>
    ${items
      .map(
        ([value, label], i) => `
      <text x="${80 + i * cell}" y="372" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="42" letter-spacing="0" fill="${i === 1 ? C.coral : C.ink}">${value}</text>
      <text x="${80 + i * cell}" y="400" font-family="DevGothic" font-size="11" letter-spacing="2.6" fill="${C.ink}" opacity="0.6">${label}</text>`,
      )
      .join("")}
    <line x1="80" y1="428" x2="860" y2="428" stroke="${C.ink}" stroke-width="1" opacity="0.4"/>
    ${[1, 2]
      .map(
        (i) => `<line x1="${80 + i * cell - 18}" y1="300" x2="${80 + i * cell - 18}" y2="428" stroke="${C.ink}" stroke-width="1" opacity="0.18"/>`,
      )
      .join("")}
  </g>`;
}

const panel = (label, art, footer) => `
  <g>
    <rect x="930" y="90" width="600" height="6" fill="${C.coral}"/>
    <rect x="946" y="112" width="568" height="762" fill="none" stroke="${C.cream}" stroke-width="1" opacity="0.18"/>
    <text x="962" y="142" font-family="DevGothic" font-size="14" letter-spacing="3.4" fill="${C.cream}" opacity="0.75">${label}</text>
    <text x="1498" y="142" text-anchor="end" font-family="DevGothic" font-size="13" letter-spacing="2.6" fill="${C.gold}" opacity="0.9">SCHEMATIC</text>
    <line x1="946" y1="158" x2="1514" y2="158" stroke="${C.cream}" stroke-width="1" opacity="0.2"/>
    ${art}
    <line x1="962" y1="790" x2="1498" y2="790" stroke="${C.cream}" stroke-width="1" opacity="0.2"/>
    <text x="962" y="826" font-family="DevGothic" font-size="12" letter-spacing="2.2" fill="${C.cream}" opacity="0.72">${footer}</text>
    ${barcode(1268, 842, label.length * 97)}
    <text x="1268" y="884" font-family="DevGothic" font-size="9" letter-spacing="2.6" fill="${C.cream}" opacity="0.45">REV.${label.length}.26</text>
    ${crosshair(1500, 176, 9, C.gold)}
    ${crosshair(960, 770, 9, C.teal)}
  </g>`;

/* ───────────────────────── illustrations ───────────────────────── */

const tuxArt = `
  <g>
    <rect x="972" y="188" width="516" height="518" rx="4" fill="${C.ink}" stroke="${C.cream}" stroke-width="1" opacity="0.98"/>
    <rect x="972" y="188" width="516" height="36" rx="4" fill="${C.slate2}"/>
    <circle cx="994" cy="206" r="5" fill="${C.coral}"/>
    <circle cx="1012" cy="206" r="5" fill="${C.gold}"/>
    <circle cx="1030" cy="206" r="5" fill="${C.green}"/>
    <text x="1230" y="211" text-anchor="middle" font-family="DevGothic" font-size="13" letter-spacing="3" fill="${C.cream}" opacity="0.7">TUX — WORKSPACE</text>
    <rect x="972" y="224" width="152" height="482" fill="${C.slate2}"/>
    <text x="992" y="252" font-family="DevGothic" font-size="12" letter-spacing="3" fill="${C.cream}" opacity="0.65">EXPLORER</text>
    ${[0, 1, 2, 3, 4, 5, 6]
      .map((i) => `<rect x="${992 + (i % 3 === 0 ? 0 : 12)}" y="${272 + i * 26}" width="${86 - (i % 3) * 10}" height="5" fill="${C.divider}" opacity="${0.5 + (i % 3) * 0.12}"/>`)
      .join("")}
    <line x1="1124" y1="224" x2="1124" y2="706" stroke="${C.divider}" stroke-width="1" opacity="0.5"/>
    <text x="1144" y="252" font-family="DevGothic" font-size="12" letter-spacing="2.6" fill="${C.cream}" opacity="0.65">APP.TSX</text>
    ${[
      [C.teal, 72, 0],
      [C.cream, 118, 8],
      [C.gold, 96, 0],
      [C.cream, 140, 8],
      [C.coral, 64, 0],
      [C.cream, 110, 8],
      [C.green, 88, 0],
      [C.cream, 132, 8],
      [C.teal, 76, 0],
      [C.cream, 104, 8],
      [C.gold, 92, 0],
      [C.cream, 126, 8],
      [C.teal, 68, 0],
      [C.cream, 98, 8],
      [C.green, 84, 0],
      [C.cream, 116, 8],
    ]
      .map(([fill, w, indent], i) => `<rect x="${1144 + indent}" y="${272 + i * 24}" width="${w}" height="6" fill="${fill}" opacity="0.72"/>`)
      .join("")}
    <line x1="1308" y1="224" x2="1308" y2="706" stroke="${C.divider}" stroke-width="1" opacity="0.5"/>
    <text x="1324" y="252" font-family="DevGothic" font-size="12" letter-spacing="2.6" fill="${C.cream}" opacity="0.65">TERMINAL — 01</text>
    <text x="1324" y="284" font-family="DevGothic" font-size="14" fill="${C.green}">$ npm run dev</text>
    <text x="1324" y="308" font-family="DevGothic" font-size="12" fill="${C.cream}" opacity="0.6">starting tux...</text>
    <text x="1324" y="330" font-family="DevGothic" font-size="12" fill="${C.cream}" opacity="0.6">pty ready</text>
    <rect x="1324" y="344" width="9" height="14" fill="${C.green}"/>
    <text x="1324" y="392" font-family="DevGothic" font-size="12" fill="${C.gold}">git status</text>
    <text x="1324" y="414" font-family="DevGothic" font-size="12" fill="${C.cream}" opacity="0.55">main ↑2</text>
    <text x="1324" y="436" font-family="DevGothic" font-size="12" fill="${C.cream}" opacity="0.55">M  src/App</text>
    <text x="1324" y="458" font-family="DevGothic" font-size="12" fill="${C.cream}" opacity="0.55">A  DiffPane</text>
    <rect x="1324" y="486" width="160" height="1" fill="${C.divider}" opacity="0.5"/>
    <text x="1324" y="514" font-family="DevGothic" font-size="12" letter-spacing="2" fill="${C.cream}" opacity="0.45">SESSIONS</text>
    ${[0, 1, 2]
      .map((i) => `<rect x="1324" y="${528 + i * 26}" width="${118 - i * 14}" height="6" fill="${C.teal}" opacity="${0.8 - i * 0.2}"/>`)
      .join("")}
    <text x="972" y="742" font-family="DevGothic" font-size="12" letter-spacing="2.8" fill="${C.cream}" opacity="0.65">SPLIT PANES · PTY · GIT STATE · DIFFS</text>
  </g>`;

const satbrainArt = `
  <g>
    <circle cx="1250" cy="442" r="128" fill="${C.teal}" opacity="0.22"/>
    <circle cx="1250" cy="442" r="128" fill="none" stroke="${C.cream}" stroke-width="1" opacity="0.35"/>
    <ellipse cx="1250" cy="442" rx="210" ry="86" fill="none" stroke="${C.gold}" stroke-width="1" opacity="0.45" transform="rotate(-18 1250 442)"/>
    <ellipse cx="1250" cy="442" rx="196" ry="112" fill="none" stroke="${C.cream}" stroke-width="1" opacity="0.25" transform="rotate(32 1250 442)"/>
    <circle cx="1250" cy="442" r="46" fill="${C.ink}" stroke="${C.cream}" stroke-width="1.5"/>
    <path d="M1218 442c0-18 14-32 32-32s32 14 32 32-14 32-32 32" fill="none" stroke="${C.gold}" stroke-width="2"/>
    <circle cx="1250" cy="442" r="7" fill="${C.coral}"/>
    <rect x="970" y="268" width="156" height="204" rx="3" fill="${C.ink}" stroke="${C.cream}" stroke-width="1"/>
    <rect x="970" y="268" width="156" height="26" fill="${C.slate2}"/>
    <text x="986" y="286" font-family="DevGothic" font-size="11" letter-spacing="2" fill="${C.cream}" opacity="0.65">PDF / AUDIO</text>
    ${[0, 1, 2, 3, 4, 5]
      .map((i) => `<rect x="986" y="${314 + i * 22}" width="${[118, 92, 128, 74, 112, 96][i]}" height="5" fill="${C.divider}" opacity="0.65"/>`)
      .join("")}
    <path d="M1126 370 H1170" stroke="${C.gold}" stroke-width="1.5" stroke-dasharray="5 4"/>
    <path d="M1330 370 H1374" stroke="${C.gold}" stroke-width="1.5" stroke-dasharray="5 4"/>
    <rect x="1374" y="300" width="140" height="176" rx="3" fill="${C.ink}" stroke="${C.cream}" stroke-width="1"/>
    <text x="1390" y="324" font-family="DevGothic" font-size="11" letter-spacing="2" fill="${C.cream}" opacity="0.65">INSIGHT</text>
    <rect x="1392" y="380" width="18" height="66" fill="${C.teal}"/>
    <rect x="1418" y="352" width="18" height="94" fill="${C.gold}"/>
    <rect x="1444" y="332" width="18" height="114" fill="${C.green}"/>
    <rect x="1470" y="398" width="18" height="48" fill="${C.coral}"/>
    <line x1="1392" y1="446" x2="1488" y2="446" stroke="${C.cream}" stroke-width="1" opacity="0.5"/>
    <g>
      <rect x="1064" y="566" width="128" height="66" rx="3" fill="${C.ink}" stroke="${C.cream}" stroke-width="1"/>
      <text x="1078" y="590" font-family="DevGothic" font-size="10" letter-spacing="2" fill="${C.cream}" opacity="0.6">QUIZ</text>
      <text x="1078" y="612" font-family="DevGothic" font-size="18" fill="${C.gold}">12 Q</text>
    </g>
    <g>
      <rect x="1208" y="566" width="128" height="66" rx="3" fill="${C.ink}" stroke="${C.cream}" stroke-width="1"/>
      <text x="1222" y="590" font-family="DevGothic" font-size="10" letter-spacing="2" fill="${C.cream}" opacity="0.6">CARDS</text>
      <text x="1222" y="612" font-family="DevGothic" font-size="18" fill="${C.teal}">28</text>
    </g>
    <g>
      <rect x="1352" y="566" width="128" height="66" rx="3" fill="${C.ink}" stroke="${C.cream}" stroke-width="1"/>
      <text x="1366" y="590" font-family="DevGothic" font-size="10" letter-spacing="2" fill="${C.cream}" opacity="0.6">SUMMARY</text>
      <text x="1366" y="612" font-family="DevGothic" font-size="18" fill="${C.green}">READY</text>
    </g>
    <text x="970" y="742" font-family="DevGothic" font-size="12" letter-spacing="2.8" fill="${C.cream}" opacity="0.65">RAG · QUICK · FLASHCARDS · CHARTS</text>
  </g>`;

const pocketResumeArt = `
  <g>
    <rect x="1078" y="220" width="344" height="474" rx="2" fill="${C.paper2}" opacity="0.55"/>
    <rect x="1066" y="206" width="344" height="474" rx="2" fill="${C.cream}" stroke="${C.ink}" stroke-width="1"/>
    <text x="1092" y="246" font-family="DevGothic" font-size="22" letter-spacing="2.4" fill="${C.ink}">POCKETRESUME</text>
    <text x="1092" y="266" font-family="DevGothic" font-size="10" letter-spacing="2.4" fill="${C.accent}">TAILORED · ATS SAFE</text>
    <line x1="1092" y1="284" x2="1384" y2="284" stroke="${C.ink}" stroke-width="1" opacity="0.35"/>
    <rect x="1092" y="300" width="120" height="8" fill="${C.ink}" opacity="0.8"/>
    ${[0, 1, 2]
      .map((i) => `<rect x="1092" y="${322 + i * 14}" width="${[260, 232, 198][i]}" height="5" fill="${C.accent}" opacity="0.55"/>`)
      .join("")}
    <rect x="1092" y="380" width="92" height="7" fill="${C.coral}"/>
    ${[0, 1, 2, 3]
      .map((i) => `<rect x="1092" y="${402 + i * 13}" width="${[272, 248, 262, 214][i]}" height="5" fill="${C.ink}" opacity="0.38"/>`)
      .join("")}
    <rect x="1092" y="470" width="112" height="7" fill="${C.coral}"/>
    ${[0, 1, 2, 3, 4]
      .map((i) => `<rect x="1092" y="${492 + i * 13}" width="${[258, 238, 268, 222, 246][i]}" height="5" fill="${C.ink}" opacity="0.38"/>`)
      .join("")}
    <rect x="1236" y="580" width="92" height="7" fill="${C.coral}"/>
    ${[0, 1, 2]
      .map((i) => `<rect x="1236" y="${602 + i * 13}" width="${[110, 92, 104][i]}" height="5" fill="${C.ink}" opacity="0.38"/>`)
      .join("")}
    <rect x="1180" y="592" width="68" height="32" fill="none" stroke="${C.teal}" stroke-width="1.5" stroke-dasharray="4 3"/>
    <g transform="translate(1214 608)">
      <path d="M0 0l12 20-12-5-12 5z" fill="${C.teal}"/>
    </g>
    <g transform="translate(1148 486)">
      <path d="M0 0l12 20-12-5-12 5z" fill="${C.coral}"/>
    </g>
    <rect x="1116" y="440" width="62" height="26" fill="none" stroke="${C.coral}" stroke-width="1.5" stroke-dasharray="4 3"/>
    <g transform="translate(1352 330)">
      <path d="M0 0l12 20-12-5-12 5z" fill="${C.gold}"/>
    </g>
    <g transform="translate(1408 520) rotate(-11)">
      <rect x="-118" y="-26" width="236" height="52" rx="2" fill="none" stroke="${C.coral}" stroke-width="3"/>
      <text x="0" y="7" text-anchor="middle" font-family="DevGothic" font-size="24" letter-spacing="3" fill="${C.coral}">FREE FOREVER</text>
    </g>
    <text x="970" y="742" font-family="DevGothic" font-size="12" letter-spacing="2.8" fill="${C.cream}" opacity="0.65">ON-DEVICE · NO API KEY · NO UPLOAD</text>
  </g>`;

const notebucketArt = `
  <g>
    <circle cx="1250" cy="450" r="228" fill="none" stroke="${C.cream}" stroke-width="1" opacity="0.15"/>
    <circle cx="1250" cy="450" r="184" fill="none" stroke="${C.teal}" stroke-width="1" opacity="0.4"/>
    <circle cx="1250" cy="450" r="140" fill="none" stroke="${C.cream}" stroke-width="1" opacity="0.2" stroke-dasharray="6 6"/>
    ${Array.from({ length: 12 })
      .map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return `<circle cx="${(1250 + Math.cos(a) * 184).toFixed(1)}" cy="${(450 + Math.sin(a) * 184).toFixed(1)}" r="3" fill="${i % 3 === 0 ? C.gold : C.teal}" opacity="0.8"/>`;
      })
      .join("")}
    <rect x="1168" y="180" width="264" height="540" rx="26" fill="${C.ink}" stroke="${C.cream}" stroke-width="1.5"/>
    <rect x="1182" y="204" width="236" height="492" rx="18" fill="${C.slate2}"/>
    <text x="1200" y="238" font-family="DevGothic" font-size="17" letter-spacing="2" fill="${C.cream}">NOTEBUCKET</text>
    <circle cx="1396" cy="232" r="7" fill="${C.green}"/>
    <rect x="1200" y="254" width="200" height="28" rx="3" fill="${C.ink}" stroke="${C.divider}" stroke-width="1"/>
    <text x="1212" y="273" font-family="DevGothic" font-size="11" fill="${C.cream}" opacity="0.45">SEARCH BY MEANING</text>
    <rect x="1200" y="300" width="94" height="82" rx="3" fill="${C.teal}"/>
    <text x="1212" y="330" font-family="DevGothic" font-size="12" fill="${C.cream}">WORK</text>
    <text x="1212" y="348" font-family="DevGothic" font-size="10" fill="${C.ink}" opacity="0.65">24 NOTES</text>
    <rect x="1306" y="300" width="94" height="82" rx="3" fill="${C.gold}"/>
    <text x="1318" y="330" font-family="DevGothic" font-size="12" fill="${C.ink}">RECIPES</text>
    <text x="1318" y="348" font-family="DevGothic" font-size="10" fill="${C.ink}" opacity="0.65">12 NOTES</text>
    <rect x="1200" y="394" width="94" height="82" rx="3" fill="${C.green}"/>
    <text x="1212" y="424" font-family="DevGothic" font-size="12" fill="${C.ink}">TRAVEL</text>
    <text x="1212" y="442" font-family="DevGothic" font-size="10" fill="${C.ink}" opacity="0.65">8 NOTES</text>
    <rect x="1306" y="394" width="94" height="82" rx="3" fill="${C.coral}"/>
    <text x="1318" y="424" font-family="DevGothic" font-size="12" fill="${C.ink}">PERSONAL</text>
    <text x="1318" y="442" font-family="DevGothic" font-size="10" fill="${C.ink}" opacity="0.65">31 NOTES</text>
    <rect x="1200" y="488" width="200" height="46" rx="3" fill="${C.ink}" stroke="${C.divider}" stroke-width="1"/>
    <text x="1214" y="516" font-family="DevGothic" font-size="12" fill="${C.cream}" opacity="0.7">UNSORTED</text>
    <path d="M1198 650h204" stroke="${C.divider}" stroke-width="1" opacity="0.5"/>
    <text x="1200" y="674" font-family="DevGothic" font-size="9" letter-spacing="2" fill="${C.cream}" opacity="0.45">ALL LOCAL · NO NETWORK</text>
    <text x="970" y="742" font-family="DevGothic" font-size="12" letter-spacing="2.8" fill="${C.cream}" opacity="0.65">BGE-SMALL · COSINE ROUTING · 100% OFFLINE</text>
  </g>`;

const mytubeArt = `
  <g>
    <circle cx="1250" cy="430" r="236" fill="none" stroke="${C.cream}" stroke-width="1" opacity="0.16"/>
    <circle cx="1250" cy="430" r="190" fill="none" stroke="${C.coral}" stroke-width="1" opacity="0.28" stroke-dasharray="2 9"/>
    ${crosshair(1250, 430, 250, C.cream)}
    <rect x="1150" y="160" width="300" height="556" rx="28" fill="${C.ink}" stroke="${C.cream}" stroke-width="1.5"/>
    <rect x="1166" y="178" width="268" height="520" rx="20" fill="#222828"/>
    <rect x="1182" y="204" width="236" height="286" rx="4" fill="${C.slate2}"/>
    <circle cx="1300" cy="336" r="44" fill="${C.coral}"/>
    <path d="M1288 314l34 22-34 22z" fill="${C.cream}"/>
    <rect x="1182" y="204" width="236" height="26" fill="${C.ink}" opacity="0.7"/>
    <text x="1196" y="222" font-family="DevGothic" font-size="10" letter-spacing="2" fill="${C.cream}" opacity="0.7">FULLSCREEN · PIP</text>
    <g transform="translate(1352 210)">
      <rect x="0" y="0" width="56" height="34" rx="2" fill="${C.ink}" stroke="${C.green}" stroke-width="1"/>
      <rect x="4" y="4" width="48" height="26" fill="${C.green}" opacity="0.35"/>
    </g>
    <rect x="1182" y="506" width="236" height="38" rx="3" fill="${C.slate2}" stroke="${C.divider}" stroke-width="1"/>
    <text x="1196" y="530" font-family="DevGothic" font-size="10" letter-spacing="2" fill="${C.cream}" opacity="0.55">BACKGROUND · ON</text>
    <rect x="1182" y="556" width="236" height="38" rx="3" fill="${C.slate2}" stroke="${C.divider}" stroke-width="1"/>
    <text x="1196" y="580" font-family="DevGothic" font-size="10" letter-spacing="2" fill="${C.cream}" opacity="0.55">SLEEP TIMER · 45M</text>
    <rect x="1176" y="618" width="248" height="56" rx="4" fill="${C.ink}"/>
    <g fill="${C.cream}" opacity="0.85">
      <path d="M1196 638l16 10-16 10z"/>
      <circle cx="1250" cy="648" r="9" fill="none" stroke="${C.cream}" stroke-width="2"/>
      <path d="M1244 650l4 4 8-10" fill="none" stroke="${C.teal}" stroke-width="2"/>
      <rect x="1288" y="638" width="18" height="18" rx="2" fill="none" stroke="${C.cream}" stroke-width="2"/>
      <path d="M1288 644h18" stroke="${C.cream}" stroke-width="2"/>
      <path d="M1330 640l14 9-14 9z" fill="${C.coral}"/>
      <path d="M1356 640l-14 9 14 9z" fill="${C.coral}" opacity="0.5"/>
    </g>
    <g transform="translate(1436 430) rotate(-14)">
      <rect x="-56" y="-22" width="112" height="44" rx="3" fill="${C.coral}"/>
      <text x="0" y="7" text-anchor="middle" font-family="DevGothic" font-size="19" letter-spacing="2" fill="${C.ink}">NO ADS</text>
    </g>
    <path d="M1390 392l92 76" stroke="${C.coral}" stroke-width="5"/>
    <text x="970" y="742" font-family="DevGothic" font-size="12" letter-spacing="2.8" fill="${C.cream}" opacity="0.65">4 TABS · AD BLOCK · PIP · FULLSCREEN · WIDGET</text>
  </g>`;

/* ───────────────────────── covers ───────────────────────── */

const covers = [
  {
    slug: "tux",
    stats: [["3", "OPERATING SYSTEMS"], ["11", "THEMES BUILT IN"], ["1", "BINARY, NO WRAPPER"]],
    index: "01",
    category: "DEVELOPER TOOLING",
    kicker: "NATIVE DESKTOP SHELL",
    parts: [{ text: "Tux", fill: C.ink }],
    subtitle: ["TERMINAL-FIRST WORKSPACE", "FOR PEOPLE WHO LIVE IN THE SHELL"],
    status: "v1.0.0 · CROSS-PLATFORM",
    meta: "RUST · TAURI 2 · REACT 19",
    panelLabel: "TUX / WORKSPACE",
    art: tuxArt,
    footer: "SPLIT PANES · GIT · EDITOR",
    seed: 7,
  },
  {
    slug: "satbrain",
    stats: [["4", "STUDY OUTPUTS"], ["1", "DOCUMENT IN"], ["0", "MANUAL CARDS"]],
    index: "02",
    category: "EDTECH PRODUCT",
    kicker: "DOCUMENT INTELLIGENCE",
    parts: [
      { text: "Sat", fill: C.ink },
      { text: "Brain", fill: C.gold },
    ],
    subtitle: ["DOCUMENTS BECOME ACTIVE STUDY", "NOTES, QUIZZES, CARDS, CHARTS"],
    status: "LIVE BETA",
    meta: "REACT · GEMINI · SUPABASE",
    panelLabel: "SATBRAIN / PIPELINE",
    art: satbrainArt,
    footer: "RAG · QUIZ · FLASHCARDS",
    seed: 19,
  },
  {
    slug: "pocket-resume",
    stats: [["3", "ATS LAYOUTS"], ["1", "CLICK TO PDF"], ["0", "UPLOADS"]],
    index: "03",
    category: "CONSUMER TOOL",
    kicker: "ON-DEVICE RESUME ENGINE",
    parts: [
      { text: "Pocket", fill: C.ink },
      { text: "Resume", fill: C.coral },
    ],
    subtitle: ["FREE FOREVER. NO ACCOUNT.", "ONE CLICK. ONE TAILORED PDF."],
    status: "v11.0 · 4,000+ USERS",
    meta: "CHROME MV3 · ON-DEVICE · JS",
    panelLabel: "POCKETRESUME / SHEET",
    art: pocketResumeArt,
    footer: "NO UPLOAD · NO API KEY · NO TRIAL",
    seed: 31,
  },
  {
    slug: "notebucket",
    stats: [["384", "EMBEDDING DIMS"], ["100%", "OFFLINE"], ["0", "NETWORK CALLS"]],
    index: "05",
    category: "ANDROID APP",
    kicker: "LOCAL-FIRST NOTE ROUTING",
    parts: [
      { text: "Note", fill: C.ink },
      { text: "Bucket", fill: C.teal },
    ],
    subtitle: ["NOTES THAT ORGANIZE", "THEMSELVES BY MEANING"],
    status: "v0.3.2 · OFFLINE",
    meta: "KOTLIN · COMPOSE · LLAMA.CPP",
    panelLabel: "NOTEBUCKET / ROUTER",
    art: notebucketArt,
    footer: "BGE-SMALL · ZERO NETWORK CALLS",
    seed: 43,
  },
  {
    slug: "mytube",
    stats: [["4", "SURFACES"], ["0", "ADS"], ["24+", "ANDROID API"]],
    index: "04",
    category: "ANDROID APP",
    kicker: "MEDIA SHELL",
    parts: [
      { text: "My", fill: C.ink },
      { text: "Tube", fill: C.coral },
    ],
    subtitle: ["FOUR SURFACES. ZERO ADS.", "ONE NATIVE SHELL."],
    status: "v2.11.3 · OPEN SOURCE",
    meta: "KOTLIN · COMPOSE · WEBVIEW",
    panelLabel: "MYTUBE / PLAYER",
    art: mytubeArt,
    footer: "BACKGROUND · PIP · FULLSCREEN",
    seed: 59,
  },
];

mkdirSync(join(root, "public/covers"), { recursive: true });

for (const c of covers) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${c.parts.map((p) => p.text).join("")} product cover">
  <title>${c.parts.map((p) => p.text).join("")} — ${c.kicker}</title>
  <defs>
    <style>
      @font-face {
        font-family: "DevGothic";
        src: url(data:font/ttf;base64,${font}) format("truetype");
        font-weight: 400;
        font-style: normal;
      }
    </style>
    <pattern id="dots" width="7" height="7" patternUnits="userSpaceOnUse">
      <circle cx="1.4" cy="1.4" r="0.9" fill="${C.ink}"/>
    </pattern>
    <pattern id="lines" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="9" stroke="${C.ink}" stroke-width="0.7"/>
    </pattern>
    <clipPath id="panelClip"><rect x="930" y="90" width="600" height="800" rx="3"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="${C.paper}"/>
  <g opacity="0.55">${contours(140, 980, c.seed, 10, 40, 120)}</g>
  <g opacity="0.4">${contours(1500, 40, c.seed + 11, 8, 34, 90)}</g>
  ${grid()}
  ${ticks()}

  <rect x="0" y="0" width="12" height="${H}" fill="${C.coral}"/>
  <rect x="80" y="86" width="22" height="22" fill="${C.coral}"/>
  <text x="116" y="104" font-family="DevGothic" font-size="15" letter-spacing="3.2" fill="${C.ink}">MSSN-${c.index} / PRODUCT DOSSIER / 2026</text>
  <text x="860" y="104" text-anchor="end" font-family="DevGothic" font-size="14" letter-spacing="2.6" fill="${C.ink}" opacity="0.7">${c.status}</text>

  <text x="80" y="188" font-family="DevGothic" font-size="15" letter-spacing="4" fill="${C.coral}">${c.category}</text>
  <text x="80" y="218" font-family="DevGothic" font-size="13" letter-spacing="3" fill="${C.ink}" opacity="0.65">${c.kicker}</text>
  ${crosshair(820, 202, 14, C.teal)}
  ${stats(c.stats)}

  <text x="850" y="664" text-anchor="end" font-family="DevGothic" font-size="300" letter-spacing="4" fill="${C.ink}" opacity="0.06">${c.index}</text>
  ${wordmark(c.parts, 700, 108)}
  ${c.subtitle
    .map(
      (line, i) =>
        `<text x="82" y="${760 + i * 34}" font-family="DevGothic" font-size="24" letter-spacing="3.4" fill="${C.ink}" opacity="0.82">${line}</text>`,
    )
    .join("")}

  <line x1="80" y1="856" x2="860" y2="856" stroke="${C.ink}" stroke-width="1.5" opacity="0.5"/>
  <text x="80" y="890" font-family="DevGothic" font-size="14" letter-spacing="3.2" fill="${C.ink}" opacity="0.8">${c.meta}</text>
  <text x="860" y="890" text-anchor="end" font-family="DevGothic" font-size="13" letter-spacing="2.6" fill="${C.coral}">isaac-1555</text>

  <g clip-path="url(#panelClip)">
    <rect x="930" y="90" width="600" height="800" fill="${C.slate}"/>
    <rect x="930" y="90" width="600" height="800" fill="url(#lines)" opacity="0.08"/>
    <rect x="930" y="90" width="600" height="800" fill="url(#dots)" opacity="0.05"/>
  </g>
  ${panel(c.panelLabel, c.art, c.footer)}

  <text x="80" y="952" font-family="DevGothic" font-size="11" letter-spacing="3.4" fill="${C.ink}" opacity="0.5">CALGARY · AB · CA</text>
  <text x="860" y="952" text-anchor="end" font-family="DevGothic" font-size="11" letter-spacing="3.4" fill="${C.ink}" opacity="0.5">SHEET 1 OF 1 · VECTOR MASTER</text>
</svg>
`;
  writeFileSync(join(root, `public/covers/${c.slug}.svg`), svg);
  console.log(`wrote public/covers/${c.slug}.svg (${(svg.length / 1024).toFixed(1)} KB)`);
}
