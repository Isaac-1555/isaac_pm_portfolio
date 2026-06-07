import { AssetEntry } from './loader';
import { AnimState, getFrameIndex, getFrameRect } from './animations';

export interface DrawSpriteOpts {
  alpha?: number;
  scale?: number;
  rotation?: number;
  flipY?: boolean;
  tint?: string;
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  entry: AssetEntry,
  cx: number,
  cy: number,
  opts: DrawSpriteOpts = {}
): void {
  if (!entry || !entry.img.complete || entry.img.naturalWidth === 0) return;
  const rect = getFrameRect(entry, 0);
  const w = rect.w;
  const h = rect.h;
  const scale = opts.scale ?? 1;
  const dw = w * scale;
  const dh = h * scale;
  ctx.save();
  ctx.globalAlpha = opts.alpha ?? 1;
  if (opts.rotation) {
    ctx.translate(cx, cy);
    ctx.rotate(opts.rotation);
    ctx.translate(-cx, -cy);
  }
  if (opts.flipY) {
    ctx.translate(cx, cy);
    ctx.scale(1, -1);
    ctx.translate(-cx, -cy);
  }
  ctx.drawImage(entry.img, rect.x, rect.y, rect.w, rect.h, cx - dw / 2, cy - dh / 2, dw, dh);
  ctx.restore();
}

export function drawAnimated(
  ctx: CanvasRenderingContext2D,
  entry: AssetEntry,
  anim: AnimState,
  cx: number,
  cy: number,
  opts: DrawSpriteOpts = {}
): void {
  if (!entry || !entry.img.complete || entry.img.naturalWidth === 0) return;
  const frame = getFrameIndex(entry, anim);
  const rect = getFrameRect(entry, frame);
  const w = rect.w;
  const h = rect.h;
  const scale = opts.scale ?? 1;
  const dw = w * scale;
  const dh = h * scale;
  ctx.save();
  ctx.globalAlpha = opts.alpha ?? 1;
  if (opts.rotation) {
    ctx.translate(cx, cy);
    ctx.rotate(opts.rotation);
    ctx.translate(-cx, -cy);
  }
  ctx.drawImage(entry.img, rect.x, rect.y, rect.w, rect.h, cx - dw / 2, cy - dh / 2, dw, dh);
  ctx.restore();
}

export function getFrameSize(entry: AssetEntry): { w: number; h: number } {
  const fw = entry.config.fw ?? entry.img.naturalWidth;
  const fh = entry.config.fh ?? entry.img.naturalHeight;
  return { w: fw, h: fh };
}
