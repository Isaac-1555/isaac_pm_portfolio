/// <reference lib="webworker" />

import * as ort from "onnxruntime-web";
import { env, pipeline } from "@huggingface/transformers";
import { ASSISTANT, MODEL } from "../lib/assistant/config";
import { createProgressAggregator } from "../lib/assistant/progress";
import { rankEntries } from "../lib/assistant/similarity";
import type { EmbeddingsFile, WorkerIn, WorkerOut } from "../lib/assistant/types";

type Extractor = (
  text: string,
  options: { pooling: "mean"; normalize: boolean },
) => Promise<{ data: Float32Array | number[] }>;

const scope = self as unknown as {
  postMessage: (message: WorkerOut) => void;
  addEventListener: (
    type: "message",
    listener: (event: MessageEvent<WorkerIn>) => void,
  ) => void;
};

let extractor: Extractor | null = null;
let embeddings: EmbeddingsFile | null = null;
let loading: Promise<void> | null = null;

function post(message: WorkerOut) {
  scope.postMessage(message);
}

async function isModelCached() {
  if (typeof caches === "undefined") return false;
  try {
    const names = await caches.keys();
    for (const name of names) {
      const cache = await caches.open(name);
      const requests = await cache.keys();
      const urls = requests
        .map((request) => {
          try {
            return new URL(request.url).pathname;
          } catch {
            return "";
          }
        })
        .filter((path) => path.includes(`/models/${MODEL.version}/`));
      const ready = ["/config.json", "/tokenizer.json", "/onnx/"].every((part) =>
        urls.some((path) => path.endsWith(part) || path.includes(part)),
      );
      if (ready) return true;
    }
  } catch {
    // Private modes can reject Cache API access. Treat as uncached.
  }
  return false;
}

async function load() {
  if (extractor && embeddings) {
    post({ type: "ready" });
    return;
  }

  const cached = await isModelCached();
  post({ type: "progress", value: cached ? 1 : 0, cached });

  const report = createProgressAggregator((value) => {
    post({ type: "progress", value, cached });
  }, cached ? 1 : 0);

  // onnxruntime-web reads its own env. Transformers.js spreads that env into
  // env.backends.onnx when the backend initializes, so set both when available.
  ort.env.wasm.wasmPaths = ASSISTANT.wasmPath;
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;

  const onnxBackend = env.backends.onnx as {
    wasm?: { wasmPaths?: string; numThreads?: number; proxy?: boolean };
  };
  if (onnxBackend.wasm) {
    onnxBackend.wasm.wasmPaths = ASSISTANT.wasmPath;
    onnxBackend.wasm.numThreads = 1;
    onnxBackend.wasm.proxy = false;
  }

  env.allowLocalModels = true;
  env.allowRemoteModels = false;
  env.localModelPath = ASSISTANT.modelPath;
  env.useBrowserCache = true;

  const pipe = await pipeline("feature-extraction", MODEL.id, {
    dtype: MODEL.dtype as "q8",
    progress_callback: report,
  });
  extractor = pipe as unknown as Extractor;

  const response = await fetch(ASSISTANT.embeddingsPath);
  if (!response.ok) {
    throw new Error(`Could not load the assistant index (${response.status}).`);
  }
  const data = (await response.json()) as EmbeddingsFile;
  if (data.model !== MODEL.id || data.version !== MODEL.version) {
    throw new Error("Assistant index does not match the loaded model.");
  }
  embeddings = data;

  post({ type: "progress", value: 1, cached });
  post({ type: "ready" });
}

async function query(id: number, text: string) {
  if (!extractor || !embeddings) {
    throw new Error("The semantic model is not ready.");
  }

  const input = MODEL.queryPrefix ? `${MODEL.queryPrefix}${text}` : text;
  const output = await extractor(input, { pooling: "mean", normalize: true });
  const vector = Array.from(output.data as ArrayLike<number>);
  const ranked = rankEntries(vector, embeddings);
  const top = ranked[0];

  post({
    type: "result",
    id,
    entryId: top?.entryId ?? null,
    score: top?.score ?? 0,
    runnerUp: ranked[1]?.entryId,
    alternatives: ranked.slice(0, 4),
  });
}

scope.addEventListener("message", (event) => {
  const message = event.data;

  if (message.type === "load") {
    if (!loading) {
      loading = load().catch((error: unknown) => {
        loading = null;
        post({
          type: "error",
          message: error instanceof Error ? error.message : "The assistant model failed to load.",
        });
      });
    }
    return;
  }

  if (message.type === "query") {
    void query(message.id, message.text).catch((error: unknown) => {
      post({
        type: "error",
        message: error instanceof Error ? error.message : "The assistant could not answer.",
      });
    });
  }
});
