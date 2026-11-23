export type AssistantState =
  | "dormant"
  | "waking"
  | "ready"
  | "thinking"
  | "idle"
  | "error";

export type AssistantMode = "keyword" | "semantic";

export type QAAction = {
  label: string;
  href: string;
};

export type QAEntry = {
  id: string;
  topic: string;
  questions: string[];
  answer: string;
  chip?: string;
  actions?: QAAction[];
  followUps?: string[];
  sections?: Array<"projects" | "about" | "contact">;
};

export type SectionId = "projects" | "about" | "contact";

export type EmbeddingsFile = {
  model: string;
  revision: string;
  version: string;
  dim: number;
  entries: Array<{ id: string; vectors: number[][] }>;
};

export type RankedEntry = {
  entryId: string;
  score: number;
};

export type WorkerIn =
  | { type: "load" }
  | { type: "query"; id: number; text: string };

export type WorkerOut =
  | { type: "progress"; value: number; cached: boolean }
  | { type: "ready" }
  | {
      type: "result";
      id: number;
      entryId: string | null;
      score: number;
      runnerUp?: string;
      alternatives: RankedEntry[];
    }
  | { type: "error"; message: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: QAAction[];
  streaming?: boolean;
};

export type ProgressInfo = {
  status?: string;
  file?: string;
  loaded?: number;
  total?: number;
  progress?: number;
  files?: Record<string, { loaded: number; total: number }>;
};

export type AssistantConfig = {
  name: string;
  fullName: string;
  greeting: string;
  modelPath: string;
  wasmPath: string;
  embeddingsPath: string;
  thresholds: { direct: number; weak: number };
  keywordThresholds: { direct: number; weak: number };
  boot: { idleMs: number; bloomMs: number };
};
