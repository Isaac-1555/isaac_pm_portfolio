// Builds the semantic index from content/assistant/qa.json.
// Usage: npm run assistant:embed
//
// Output is deterministic: sorted entries, fixed precision, no timestamps.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { env, pipeline } from "@huggingface/transformers";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const model = JSON.parse(await readFile(resolve(root, "content/assistant/model.json"), "utf8"));
const qa = JSON.parse(await readFile(resolve(root, "content/assistant/qa.json"), "utf8"));

const ids = new Set();
const sections = new Set(["projects", "about", "contact"]);
let answerWarnings = 0;

if (!Array.isArray(qa)) throw new Error("qa.json must be an array");

for (const entry of qa) {
  if (!entry.id || ids.has(entry.id)) throw new Error(`Duplicate or missing id: ${entry.id}`);
  ids.add(entry.id);
  if (!Array.isArray(entry.questions) || entry.questions.length < 1 || entry.questions.length > 6) {
    throw new Error(`${entry.id}: questions must contain 1-6 phrasings`);
  }
  if (!entry.answer || typeof entry.answer !== "string") {
    throw new Error(`${entry.id}: answer is required`);
  }
  const words = entry.answer.trim().split(/\s+/).length;
  if (words > 60) {
    answerWarnings += 1;
    console.warn(`  warn ${entry.id}: ${words} words (target <= 60)`);
  }
  for (const follow of entry.followUps ?? []) {
    if (!qa.some((candidate) => candidate.id === follow)) {
      throw new Error(`${entry.id}: unknown followUp "${follow}"`);
    }
  }
  for (const section of entry.sections ?? []) {
    if (!sections.has(section)) throw new Error(`${entry.id}: unknown section "${section}"`);
  }
}

const modelDir = resolve(root, "public/models", model.version);
env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = `${modelDir}/`;
env.useBrowserCache = false;

console.log(`Loading ${model.id} from public/models/${model.version}/ ...`);
const extractor = await pipeline("feature-extraction", model.id, { dtype: model.dtype });

let totalPhrasings = 0;
const entries = [];

for (const entry of [...qa].sort((a, b) => a.id.localeCompare(b.id))) {
  const vectors = [];
  const phrasings = [...entry.questions];
  if (entry.chip && !phrasings.includes(entry.chip)) phrasings.push(entry.chip);
  for (const question of phrasings) {
    const output = await extractor(question, { pooling: "mean", normalize: true });
    const vector = Array.from(output.data, (value) => Number(value.toFixed(5)));
    if (vector.length !== model.dim) {
      throw new Error(`${entry.id}: expected ${model.dim} dims, got ${vector.length}`);
    }
    vectors.push(vector);
    totalPhrasings += 1;
  }
  entries.push({ id: entry.id, vectors });
}

const output = {
  model: model.id,
  revision: model.revision,
  version: model.version,
  dim: model.dim,
  entries,
};

await mkdir(resolve(root, "public/assistant"), { recursive: true });
const target = resolve(root, "public/assistant/embeddings.json");
await writeFile(target, JSON.stringify(output));

const bytes = Buffer.byteLength(JSON.stringify(output));
console.log(
  `Wrote ${entries.length} entries / ${totalPhrasings} vectors (${(bytes / 1024).toFixed(0)} KB) -> public/assistant/embeddings.json`,
);
if (answerWarnings) console.log(`${answerWarnings} answer(s) over 60 words.`);
