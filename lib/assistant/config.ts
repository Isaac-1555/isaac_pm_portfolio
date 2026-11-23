import modelConfig from "@/content/assistant/model.json";
import type { AssistantConfig } from "./types";

export const MODEL = modelConfig;

export const ASSISTANT: AssistantConfig = {
  name: "K.I.D",
  fullName: "Knowledge Integration Daemon",
  greeting:
    "K.I.D — Knowledge Integration Daemon — is Isaac's on-device assistant. Ask about his work, experience, or how to reach him. Everything runs in this browser.",
  modelPath: `/models/${MODEL.version}/`,
  wasmPath: "/assistant/ort/",
  embeddingsPath: "/assistant/embeddings.json",
  thresholds: { direct: 0.6, weak: 0.4 },
  keywordThresholds: { direct: 0.58, weak: 0.34 },
  boot: { idleMs: 60_000, bloomMs: 700 },
};

export const MODEL_CACHE_NAME = "transformers-cache";
