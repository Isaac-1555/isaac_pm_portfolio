// Accuracy check for the semantic index.
// Usage: npm run assistant:check
//
// Runs the same query embedding + cosine matching the worker uses, against
// content/assistant/test-questions.json. Exits non-zero below 90% accuracy.

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { env, pipeline } from "@huggingface/transformers";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const model = JSON.parse(await readFile(resolve(root, "content/assistant/model.json"), "utf8"));
const test = JSON.parse(await readFile(resolve(root, "content/assistant/test-questions.json"), "utf8"));
const embeddings = JSON.parse(await readFile(resolve(root, "public/assistant/embeddings.json"), "utf8"));

if (embeddings.model !== model.id || embeddings.version !== model.version) {
  throw new Error(
    `embeddings.json is stale: expected ${model.id}/${model.version}, got ${embeddings.model}/${embeddings.version}`,
  );
}

env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = `${resolve(root, "public/models", model.version)}/`;
env.useBrowserCache = false;

const extractor = await pipeline("feature-extraction", model.id, { dtype: model.dtype });

function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += a[i] * b[i];
  return sum;
}

async function embed(text) {
  const output = await extractor(model.queryPrefix ? model.queryPrefix + text : text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

let correct = 0;
const misses = [];

for (const item of test.questions) {
  const vector = await embed(item.text);
  const best = new Map();

  for (const entry of embeddings.entries) {
    for (const candidate of entry.vectors) {
      const score = dot(vector, candidate);
      if (!best.has(entry.id) || score > best.get(entry.id)) best.set(entry.id, score);
    }
  }

  const ranked = [...best.entries()].sort((a, b) => b[1] - a[1]);
  const [topId, topScore] = ranked[0] ?? [null, 0];
  const predicted = topScore >= 0.4 ? topId : null;
  const ok = predicted === item.expect;

  if (ok) correct += 1;
  else {
    misses.push({
      text: item.text,
      expect: item.expect,
      predicted,
      score: Number(topScore.toFixed(3)),
      runnerUp: ranked[1] ? `${ranked[1][0]} ${ranked[1][1].toFixed(3)}` : "none",
    });
  }
}

const accuracy = correct / test.questions.length;

console.log(`\n${correct}/${test.questions.length} correct (${(accuracy * 100).toFixed(1)}%)`);
if (misses.length) {
  console.table(misses);
}
if (accuracy < 0.9) {
  console.error("Below 90% target. Review the misses and tune content/model/thresholds.");
  process.exit(1);
}
console.log("Accuracy target met.");
await extractor.dispose?.();
process.exit(0);
