import type { ProgressInfo } from "./types";

/**
 * Aggregates Transformers.js download events into one 0..1 value.
 * v4 emits `progress_total`; older versions only report per-file bytes, so the
 * fallback weights each file by its total size.
 */
export function createProgressAggregator(
  onProgress: (value: number) => void,
  initial = 0,
) {
  const files = new Map<string, { loaded: number; total: number }>();
  let last = initial;

  return (info: ProgressInfo) => {
    let value: number | null = null;

    if (info.status === "progress_total" && typeof info.progress === "number") {
      value = info.progress / 100;
      if (info.files) {
        for (const [name, file] of Object.entries(info.files)) {
          files.set(name, { loaded: file.loaded, total: file.total });
        }
      }
    } else if (info.file) {
      const previous = files.get(info.file);
      const total = info.total ?? previous?.total ?? 0;
      const loaded = info.loaded ?? previous?.loaded ?? 0;
      files.set(info.file, { loaded, total });
      value = aggregate(files);
    }

    if (value === null || !Number.isFinite(value)) return;
    const next = Math.min(1, Math.max(last, Math.max(0, value)));
    if (next === last && next !== 1) return;
    if (next - last < 0.004 && next !== 1) return;
    last = next;
    onProgress(next);
  };
}

function aggregate(files: Map<string, { loaded: number; total: number }>) {
  let loaded = 0;
  let total = 0;
  for (const file of files.values()) {
    loaded += file.loaded;
    total += file.total;
  }
  if (total <= 0) {
    // Byte totals are not available yet. Fall back to file completion count.
    let done = 0;
    for (const file of files.values()) {
      if (file.loaded > 0 && file.loaded >= file.total && file.total > 0) done += 1;
    }
    return files.size ? done / files.size : 0;
  }
  return loaded / total;
}
