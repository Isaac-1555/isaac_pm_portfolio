import { AssetEntry } from './loader';

export interface AnimState {
  t: number;
  paused?: boolean;
  speed?: number;
}

export function tickAnim(state: AnimState, dt: number): void {
  if (state.paused) return;
  state.t += dt * (state.speed ?? 1);
}

export function getFrameIndex(entry: AssetEntry, state: AnimState): number {
  const frames = entry.config.frames ?? 1;
  if (frames <= 1) return 0;
  const fps = entry.config.fps ?? 8;
  const total = state.t * fps;
  if (entry.config.loop !== false) {
    return Math.floor(total) % frames;
  }
  return Math.min(frames - 1, Math.floor(total));
}

export function getFrameRect(
  entry: AssetEntry,
  frame: number
): { x: number; y: number; w: number; h: number } {
  const fw = entry.config.fw ?? entry.img.naturalWidth;
  const fh = entry.config.fh ?? entry.img.naturalHeight;
  const cols = entry.config.cols ?? Math.max(1, Math.floor(entry.img.naturalWidth / fw));
  const col = frame % cols;
  const row = Math.floor(frame / cols);
  return {
    x: col * fw,
    y: row * fh,
    w: fw,
    h: fh,
  };
}
