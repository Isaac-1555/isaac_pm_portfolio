import type { EmbeddingsFile, RankedEntry } from "./types";

export function dot(a: ArrayLike<number>, b: ArrayLike<number>) {
  let sum = 0;
  const length = Math.min(a.length, b.length);
  for (let i = 0; i < length; i += 1) sum += a[i] * b[i];
  return sum;
}

/**
 * Best cosine score per entry, then all entries ranked high to low.
 * Vectors are normalized at build time, so cosine is a dot product.
 */
export function rankEntries(query: ArrayLike<number>, embeddings: EmbeddingsFile): RankedEntry[] {
  const best = new Map<string, number>();

  for (const entry of embeddings.entries) {
    for (const vector of entry.vectors) {
      const score = dot(query, vector);
      const previous = best.get(entry.id);
      if (previous === undefined || score > previous) best.set(entry.id, score);
    }
  }

  return [...best.entries()]
    .map(([entryId, score]) => ({ entryId, score }))
    .sort((a, b) => b.score - a.score);
}
