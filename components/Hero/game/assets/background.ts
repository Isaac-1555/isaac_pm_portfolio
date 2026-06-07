import { BASE_WIDTH, COLORS } from '../constants';
import { getAssetEntry } from './loader';

interface BgLayer {
  key: string;
  speed: number;
  scrollY: number;
  alpha: number;
}

const LAYERS: BgLayer[] = [
  { key: 'bg-shadows', speed: 12, scrollY: 0, alpha: 0.35 },
  { key: 'bg-stars', speed: 32, scrollY: 0, alpha: 0.5 },
];

export function updateBackground(dt: number): void {
  for (const layer of LAYERS) {
    layer.scrollY += layer.speed * dt;
    const entry = getAssetEntry(layer.key);
    if (entry && entry.img.naturalHeight > 0) {
      const scale = BASE_WIDTH / entry.img.naturalWidth;
      const drawH = entry.img.naturalHeight * scale;
      if (drawH > 0) {
        const m = layer.scrollY % drawH;
        layer.scrollY = m;
      }
    }
  }
}

export function resetBackground(): void {
  for (const layer of LAYERS) {
    layer.scrollY = 0;
  }
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  height: number
): void {
  ctx.fillStyle = COLORS.bgDark;
  ctx.fillRect(0, 0, BASE_WIDTH, height);
  for (const layer of LAYERS) {
    const entry = getAssetEntry(layer.key);
    if (!entry || entry.img.naturalWidth === 0) continue;
    ctx.globalAlpha = layer.alpha;
    const scale = BASE_WIDTH / entry.img.naturalWidth;
    const drawH = entry.img.naturalHeight * scale;
    const drawW = BASE_WIDTH;
    const offsetY = -((layer.scrollY % drawH + drawH) % drawH);
    let y = offsetY;
    while (y < height) {
      ctx.drawImage(entry.img, 0, 0, entry.img.naturalWidth, entry.img.naturalHeight, 0, y, drawW, drawH);
      y += drawH;
    }
  }
  ctx.globalAlpha = 1;
}
