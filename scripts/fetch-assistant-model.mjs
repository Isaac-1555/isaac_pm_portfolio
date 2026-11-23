// One-time asset fetcher for the on-device assistant.
// Usage: npm run assistant:model
//
// Downloads the pinned sentence-embedding model into public/models/<version>/
// and copies the ONNX Runtime WASM runtime into public/assistant/ort/.
// Both are committed so production deploys do not depend on Hugging Face.

import { createWriteStream } from "node:fs";
import { mkdir, readFile, stat, copyFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const root = new URL("..", import.meta.url);
const model = JSON.parse(
  await readFile(new URL("../content/assistant/model.json", import.meta.url), "utf8"),
);

const modelRoot = new URL(
  `../public/models/${model.version}/${model.id}/`,
  import.meta.url,
);
const ortRoot = new URL("../public/assistant/ort/", import.meta.url);

await mkdir(modelRoot, { recursive: true });
await mkdir(ortRoot, { recursive: true });

const base = `https://huggingface.co/${model.id}/resolve/${model.revision}/`;

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "unknown";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function download(file) {
  const target = new URL(file, modelRoot);
  await mkdir(dirname(fileURLToPath(target)), { recursive: true });
  const url = base + file;

  const head = await fetch(url, { method: "HEAD" });
  if (!head.ok) throw new Error(`HEAD ${url} failed: ${head.status}`);
  const expected = Number(head.headers.get("content-length") ?? 0);

  try {
    const existing = await stat(target);
    if (expected > 0 && existing.size === expected) {
      console.log(`  skip ${file} (${formatBytes(expected)})`);
      return;
    }
  } catch {
    // not downloaded yet
  }

  console.log(`  fetch ${file} (${formatBytes(expected)})`);
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`GET ${url} failed: ${res.status}`);

  await pipeline(Readable.fromWeb(res.body), createWriteStream(target));
  const written = await stat(target);
  if (expected > 0 && written.size !== expected) {
    throw new Error(`${file}: expected ${expected} bytes, got ${written.size}`);
  }
}

console.log(`Model: ${model.id} @ ${model.revision.slice(0, 10)} (${model.version})`);
for (const file of model.files) {
  await download(file);
}

// Transformers.js loads onnxruntime-web from a local wasmPaths directory when
// configured in the worker. The default WASM backend needs these two files.
const require = createRequire(import.meta.url);
const ortDist = dirname(require.resolve("onnxruntime-web"));
const wanted = [
  "ort-wasm-simd-threaded.wasm",
  "ort-wasm-simd-threaded.mjs",
  "ort-wasm-simd-threaded.asyncify.wasm",
  "ort-wasm-simd-threaded.asyncify.mjs",
];

for (const file of wanted) {
  const source = join(ortDist, file);
  try {
    await stat(source);
  } catch {
    console.warn(`  warn: missing ${source}`);
    continue;
  }
  await copyFile(source, new URL(file, ortRoot));
  console.log(`  copy ${file}`);
}

// Extra safety: surface any ort wasm files that are present but not copied.
const present = (await readdir(ortDist)).filter((f) => f.endsWith(".wasm"));
console.log(`  ort wasm available: ${present.join(", ")}`);
console.log(`\nRoot: ${root.pathname}`);
