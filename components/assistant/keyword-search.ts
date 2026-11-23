import qaJson from "@/content/assistant/qa.json";
import type { QAEntry, RankedEntry, SectionId } from "@/lib/assistant/types";

export const QA = qaJson as QAEntry[];
export const QA_BY_ID = new Map(QA.map((entry) => [entry.id, entry]));

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "can", "could",
  "did", "do", "does", "for", "from", "had", "has", "have", "he", "her", "him",
  "his", "how", "i", "if", "in", "into", "is", "it", "its", "just", "me", "my",
  "of", "on", "or", "our", "she", "so", "that", "the", "their", "them", "then",
  "there", "these", "they", "this", "to", "was", "we", "were", "what", "when",
  "where", "which", "who", "why", "will", "with", "would", "you", "your", "about",
  "tell", "please", "give", "show", "know", "want", "like", "any", "some",
]);

const SYNONYMS: Record<string, string> = {
  cv: "resume",
  resumes: "resume",
  résumé: "resume",
  coop: "coop",
  "co-op": "coop",
  calgary: "calgary",
  ai: "ai",
  "artificial": "ai",
  "intelligence": "ai",
  llm: "ai",
  chatbot: "assistant",
  bot: "assistant",
  portfolio: "work",
  projects: "project",
  apps: "app",
  applications: "app",
  websites: "website",
  jobs: "job",
  roles: "role",
  companies: "company",
  technologies: "technology",
  tech: "technology",
  stack: "technology",
  frameworks: "framework",
  languages: "language",
  certs: "certification",
  certificates: "certification",
  credentials: "certification",
  schooling: "education",
  school: "education",
  college: "education",
  university: "education",
  degree: "education",
  hire: "hire",
  hiring: "hire",
  available: "availability",
  remote: "remote",
  located: "location",
  based: "location",
  city: "location",
  email: "contact",
  reach: "contact",
  linkedin: "contact",
  github: "github",
};

const OFF_TOPIC = [
  "weather", "forecast", "temperature", "rain", "snow",
  "stock price", "stock market", "sports score", "lottery",
  "news headline", "recipe", "translate this", "homework",
  "write me code", "write code for", "joke",
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stem(token: string) {
  if (token.length > 5 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
  if (token.length > 4 && token.endsWith("ed")) return token.slice(0, -2);
  if (token.length > 4 && token.endsWith("es")) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s")) return token.slice(0, -1);
  return token;
}

function tokenize(text: string) {
  const tokens: string[] = [];
  for (const raw of normalize(text).split(" ")) {
    if (!raw || STOPWORDS.has(raw)) continue;
    const mapped = SYNONYMS[raw] ?? raw;
    const token = stem(mapped);
    if (token.length > 1) tokens.push(token);
  }
  return tokens;
}

type IndexedEntry = {
  entry: QAEntry;
  weights: Map<string, number>;
  questions: string[];
};

const indexed: IndexedEntry[] = QA.map((entry) => {
  const weights = new Map<string, number>();
  const add = (text: string, weight: number) => {
    for (const token of tokenize(text)) {
      weights.set(token, Math.max(weights.get(token) ?? 0, weight));
    }
  };

  for (const question of entry.questions) add(question, 3);
  add(entry.answer, 1);
  add(entry.topic, 2);
  add(entry.id.replace(/-/g, " "), 2);
  add(entry.actions?.map((action) => action.label).join(" ") ?? "", 1);

  return {
    entry,
    weights,
    questions: entry.questions.map((question) => normalize(question)),
  };
});

const documentFrequency = new Map<string, number>();
for (const item of indexed) {
  for (const token of item.weights.keys()) {
    documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
  }
}

function idf(token: string) {
  return Math.log((indexed.length + 1) / ((documentFrequency.get(token) ?? 0) + 1)) + 1;
}

export function isLikelyOffTopic(text: string) {
  const normalized = ` ${normalize(text)} `;
  return OFF_TOPIC.some((phrase) => normalized.includes(` ${normalize(phrase)} `));
}

export function searchKeyword(text: string): RankedEntry[] {
  const queryTokens = [...new Set(tokenize(text))];
  if (!queryTokens.length) return [];

  const normalizedQuery = normalize(text);
  const totalIdf = queryTokens.reduce((sum, token) => sum + idf(token), 0) || 1;
  const ranked: RankedEntry[] = [];

  for (const item of indexed) {
    let matchedIdf = 0;
    let matched = 0;

    for (const token of queryTokens) {
      const weight = item.weights.get(token);
      if (!weight) continue;
      matched += 1;
      matchedIdf += idf(token) * Math.min(1, weight / 3);
    }

    if (!matched) continue;

    let score = matchedIdf / totalIdf;

    // Phrase-level bonuses make exact phrasings win over loose token overlap.
    if (item.questions.some((question) => question === normalizedQuery)) score += 0.35;
    else if (item.questions.some((question) => question.includes(normalizedQuery) || normalizedQuery.includes(question))) {
      score += 0.18;
    }

    ranked.push({ entryId: item.entry.id, score: Math.min(1, score) });
  }

  return ranked.sort((a, b) => b.score - a.score);
}

export function searchKeywordBest(text: string): RankedEntry | null {
  return searchKeyword(text)[0] ?? null;
}

export function getEntry(id: string | null | undefined) {
  if (!id) return null;
  return QA_BY_ID.get(id) ?? null;
}

const SECTION_PICKS: Record<SectionId, string[]> = {
  projects: ["intro", "pocket-resume", "tux", "notebucket", "mytube", "side-projects"],
  about: ["intro", "current-role", "experience-years", "skills", "product-management", "leadership"],
  contact: ["availability", "contact", "location", "hiring", "resume"],
};

export function entriesForSection(section: SectionId, limit = 3) {
  const candidates = QA.filter((entry) => entry.sections?.includes(section) && entry.topic !== "easter-egg");
  const picked = SECTION_PICKS[section]
    .map((id) => candidates.find((entry) => entry.id === id))
    .filter((entry): entry is QAEntry => Boolean(entry));
  const preferred = [...picked, ...candidates.filter((entry) => entry.topic !== "meta" && !picked.includes(entry))];
  return preferred.slice(0, limit);
}

export function followUpEntries(entry: QAEntry | null, limit = 2) {
  if (!entry?.followUps?.length) return [];
  return entry.followUps
    .map((id) => QA_BY_ID.get(id))
    .filter((candidate): candidate is QAEntry => Boolean(candidate))
    .slice(0, limit);
}

export function topicEntries(limit = 2) {
  const ids = ["intro", "pocket-resume", "experience-years", "contact", "skills"];
  return ids.map((id) => QA_BY_ID.get(id)).filter((entry): entry is QAEntry => Boolean(entry)).slice(0, limit);
}
