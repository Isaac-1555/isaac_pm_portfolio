"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ASSISTANT } from "@/lib/assistant/config";
import {
  isSpaceQuoteContinuation,
  isSpaceQuoteRequest,
  matchSpaceQuote,
  randomSpaceQuote,
  relatedSpaceQuotes,
  spaceQuotePrompt,
  spaceQuoteReply,
} from "@/lib/assistant/space-quotes";
import type { SpaceQuote } from "@/lib/assistant/space-quotes";
import type {
  AssistantMode,
  AssistantState,
  ChatMessage,
  QAEntry,
  SectionId,
  WorkerOut,
} from "@/lib/assistant/types";

type KeywordModule = typeof import("./keyword-search");

const FALLBACK_ANSWER =
  "K.I.D is not sure about that one. It knows Isaac's projects, experience, skills, availability and contact details. Try one of the suggestions below, or email Isaac at benisaac1892@gmail.com.";

type Answer = {
  entry: QAEntry | null;
  alternatives: QAEntry[];
  fallback?: boolean;
};

type Pending = {
  resolve: (value: Extract<WorkerOut, { type: "result" }>) => void;
  reject: (reason: Error) => void;
  timer: number;
};

let messageId = 0;

function nextId() {
  messageId += 1;
  return `msg-${messageId}`;
}

function connectionInfo() {
  const navigatorWithHints = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  return navigatorWithHints;
}

export function useAssistant(section: SectionId) {
  const [state, setState] = useState<AssistantState>("dormant");
  const [mode, setMode] = useState<AssistantMode>("keyword");
  const [progress, setProgress] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chips, setChips] = useState<QAEntry[]>([]);
  const [chipsLabel, setChipsLabel] = useState("Suggested questions");
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [activity, setActivity] = useState(0);

  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef(new Map<number, Pending>());
  const requestRef = useRef(0);
  const loadStartedRef = useRef(false);
  const workerReadyRef = useRef(false);
  const modeRef = useRef<AssistantMode>("keyword");
  const stateRef = useRef<AssistantState>("dormant");
  const messagesRef = useRef<ChatMessage[]>([]);
  const sectionRef = useRef(section);
  const keywordRef = useRef<KeywordModule | null>(null);
  const quoteCatalogRef = useRef<SpaceQuote[] | null>(null);
  const seenQuotesRef = useRef(new Set<string>());
  const lastQuoteRef = useRef<SpaceQuote | null>(null);
  const hasOpenedRef = useRef(false);
  const pendingChipsRef = useRef<{ chips: QAEntry[]; label: string }>({
    chips: [],
    label: "Suggested questions",
  });
  const thinkingRef = useRef(false);
  const bootCompleteRef = useRef(false);
  const cachedRef = useRef(false);
  const readyFallbackRef = useRef(0);

  const loadKeyword = useCallback(async () => {
    if (!keywordRef.current) {
      keywordRef.current = await import("./keyword-search");
    }
    return keywordRef.current;
  }, []);

  const loadQuoteCatalog = useCallback(async () => {
    let catalog = quoteCatalogRef.current;
    if (!catalog) {
      catalog = (await import("./space-quote-data")).SPACE_QUOTES;
      quoteCatalogRef.current = catalog;
    }
    return catalog;
  }, []);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    sectionRef.current = section;
    if (hasOpenedRef.current && !messagesRef.current.some((message) => message.role === "user")) {
      void loadKeyword().then((keyword) => {
        setChips(keyword.entriesForSection(section));
        setChipsLabel("Suggested questions");
      });
    }
  }, [section, loadKeyword]);

  const addBootLine = useCallback((line: string) => {
    setBootLog((current) => (current.includes(line) ? current : [...current, line]));
  }, []);

  const bootLogFor = useCallback(
    (value: number) => {
      if (value >= 0.25) addBootLine("loading memory");
      if (value >= 0.5) addBootLine("indexing projects");
      if (value >= 0.75) addBootLine("calibrating lens");
    },
    [addBootLine],
  );

  const rejectPending = useCallback(() => {
    for (const pending of pendingRef.current.values()) {
      window.clearTimeout(pending.timer);
      pending.reject(new Error("The assistant worker stopped."));
    }
    pendingRef.current.clear();
  }, []);

  const failToKeyword = useCallback(
    (wasLoading: boolean) => {
      rejectPending();
      workerReadyRef.current = false;
      setMode("keyword");
      modeRef.current = "keyword";
      if (wasLoading || stateRef.current === "waking") {
        setState("error");
        stateRef.current = "error";
      }
      workerRef.current?.terminate();
      workerRef.current = null;
    },
    [rejectPending],
  );

  const startLoad = useCallback(() => {
    if (loadStartedRef.current) return;
    loadStartedRef.current = true;

    const nav = connectionInfo();
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;

    if (
      typeof Worker === "undefined" ||
      typeof WebAssembly === "undefined" ||
      lowMemory
    ) {
      setMode("keyword");
      modeRef.current = "keyword";
      setState("ready");
      stateRef.current = "ready";
      return;
    }

    try {
      const worker = new Worker("/assistant/worker.js", { type: "module" });
      workerRef.current = worker;

      worker.onmessage = (event: MessageEvent<WorkerOut>) => {
        const message = event.data;

        if (message.type === "progress") {
          cachedRef.current = message.cached;
          setProgress((current) => Math.max(current, message.value));
          bootLogFor(message.value);
          return;
        }

        if (message.type === "ready") {
          workerReadyRef.current = true;
          setMode("semantic");
          modeRef.current = "semantic";
          setProgress(1);
          addBootLine("ready");
          void navigator.storage?.persist?.().catch?.(() => undefined);
          // If the eye already finished its boot ramp, settle now.
          if (bootCompleteRef.current && stateRef.current === "waking") {
            setState("ready");
            stateRef.current = "ready";
          }
          // Safety net if the animation never reports completion.
          window.clearTimeout(readyFallbackRef.current);
          readyFallbackRef.current = window.setTimeout(() => {
            if (stateRef.current === "waking") {
              setState("ready");
              stateRef.current = "ready";
            }
          }, 10_000);
          return;
        }

        if (message.type === "result") {
          const pending = pendingRef.current.get(message.id);
          if (!pending) return;
          pendingRef.current.delete(message.id);
          window.clearTimeout(pending.timer);
          pending.resolve(message);
          return;
        }

        if (message.type === "error") {
          failToKeyword(!workerReadyRef.current);
        }
      };

      worker.onerror = () => failToKeyword(!workerReadyRef.current);
      worker.onmessageerror = () => failToKeyword(!workerReadyRef.current);

      setState("waking");
      stateRef.current = "waking";
      worker.postMessage({ type: "load" });
    } catch {
      failToKeyword(true);
    }
  }, [addBootLine, bootLogFor, failToKeyword]);

  useEffect(() => {
    return () => {
      window.clearTimeout(readyFallbackRef.current);
      rejectPending();
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [rejectPending]);

  const wake = useCallback(() => {
    if (stateRef.current === "idle") {
      setState("ready");
      stateRef.current = "ready";
      return;
    }
    if (stateRef.current === "dormant") startLoad();
  }, [startLoad]);

  const onBootComplete = useCallback(() => {
    bootCompleteRef.current = true;
    // Cached visits can settle immediately; a first download waits for the
    // worker so the glow reflects the full runtime setup.
    if (stateRef.current === "waking" && (cachedRef.current || workerReadyRef.current)) {
      setState("ready");
      stateRef.current = "ready";
    }
  }, []);

  const canPreload = useCallback(() => {
    const nav = connectionInfo();
    if (nav.connection?.saveData) return false;
    if (["slow-2g", "2g"].includes(nav.connection?.effectiveType ?? "")) return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const openPanel = useCallback(() => {
    setHasOpened(true);
    hasOpenedRef.current = true;
    setPanelOpen(true);
    setActivity((value) => value + 1);

    if (!messagesRef.current.length) {
      const greeting: ChatMessage = {
        id: nextId(),
        role: "assistant",
        text: ASSISTANT.greeting,
      };
      setMessages([greeting]);
      messagesRef.current = [greeting];
    }

    if (stateRef.current === "dormant" || stateRef.current === "error") {
      startLoad();
    } else if (stateRef.current === "idle") {
      setState("ready");
      stateRef.current = "ready";
    }

    if (!messagesRef.current.some((message) => message.role === "user")) {
      void loadKeyword().then((keyword) => {
        setChips(keyword.entriesForSection(sectionRef.current));
        setChipsLabel("Suggested questions");
      });
    }
  }, [loadKeyword, startLoad]);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setActivity((value) => value + 1);
  }, []);

  const querySemantic = useCallback((text: string) => {
    return new Promise<Extract<WorkerOut, { type: "result" }>>((resolve, reject) => {
      const worker = workerRef.current;
      if (!worker) {
        reject(new Error("No worker"));
        return;
      }
      requestRef.current += 1;
      const id = requestRef.current;
      const timer = window.setTimeout(() => {
        pendingRef.current.delete(id);
        reject(new Error("Timed out"));
      }, 5000);
      pendingRef.current.set(id, { resolve, reject, timer });
      worker.postMessage({ type: "query", id, text });
    });
  }, []);

  const resolveAnswer = useCallback(
    async (text: string, keyword: KeywordModule): Promise<Answer> => {
      if (keyword.isLikelyOffTopic(text)) return { entry: null, alternatives: [], fallback: true };

      const keywordMatch = keyword.searchKeyword(text)[0] ?? null;
      const keywordEntry = keyword.getEntry(keywordMatch?.entryId);

      if (workerReadyRef.current) {
        try {
          const result = await querySemantic(text);
          const entry = keyword.getEntry(result.entryId);

          if (entry && result.score >= ASSISTANT.thresholds.direct) {
            return { entry, alternatives: [] };
          }

          if (entry && result.score >= ASSISTANT.thresholds.weak) {
            if (
              keywordMatch &&
              keywordEntry &&
              keywordMatch.score >= ASSISTANT.keywordThresholds.direct &&
              keywordMatch.score > result.score + 0.08
            ) {
              return { entry: keywordEntry, alternatives: [] };
            }
            const alternatives = result.alternatives
              .filter((item) => item.entryId !== entry.id)
              .map((item) => keyword.getEntry(item.entryId))
              .filter((item): item is QAEntry => Boolean(item))
              .slice(0, 2);
            return { entry, alternatives };
          }
        } catch {
          // Fall through to keyword search.
        }
      }

      if (
        keywordMatch &&
        keywordEntry &&
        keywordMatch.score >= ASSISTANT.keywordThresholds.direct
      ) {
        return { entry: keywordEntry, alternatives: [] };
      }

      return { entry: null, alternatives: [], fallback: true };
    },
    [querySemantic],
  );

  const onStreamComplete = useCallback((id: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, streaming: false } : message,
      ),
    );
    setChips(pendingChipsRef.current.chips);
    setChipsLabel(pendingChipsRef.current.label);
    thinkingRef.current = false;
    const nextState = modeRef.current === "semantic" ? "ready" : stateRef.current === "error" ? "error" : "ready";
    setState(nextState);
    stateRef.current = nextState;
  }, []);

  const ask = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || thinkingRef.current) return;

      thinkingRef.current = true;
      setActivity((value) => value + 1);
      setState("thinking");
      stateRef.current = "thinking";

      const userMessage: ChatMessage = {
        id: nextId(),
        role: "user",
        text,
      };
      setMessages((current) => [...current, userMessage]);

      const delay = new Promise((resolve) => {
        window.setTimeout(resolve, 520 + Math.random() * 560);
      });

      // Hidden space-cinema archive runs before normal retrieval so themed
      // phrases never hit the off-topic filter or the semantic index.
      let quotes: SpaceQuote[] = [];
      try {
        quotes = await loadQuoteCatalog();
      } catch {
        quotes = [];
      }

      let quote = matchSpaceQuote(quotes, text)?.quote ?? null;

      if (!quote && lastQuoteRef.current && isSpaceQuoteContinuation(text)) {
        seenQuotesRef.current.add(lastQuoteRef.current.id);
        quote =
          randomSpaceQuote(quotes, seenQuotesRef.current, lastQuoteRef.current.franchise) ??
          randomSpaceQuote(quotes, seenQuotesRef.current) ??
          randomSpaceQuote(quotes);
      }

      if (!quote && isSpaceQuoteRequest(text)) {
        quote = randomSpaceQuote(quotes, seenQuotesRef.current) ?? randomSpaceQuote(quotes);
      }

      if (quote) {
        const matchedQuote = quote;
        seenQuotesRef.current.add(matchedQuote.id);
        lastQuoteRef.current = matchedQuote;

        await delay;

        const related = relatedSpaceQuotes(quotes, matchedQuote, 3);
        pendingChipsRef.current = {
          chips: related.map((candidate) => {
            const prompt = spaceQuotePrompt(candidate);
            return {
              id: `space-quote-${candidate.id}`,
              topic: "easter-egg",
              questions: [prompt],
              answer: candidate.reply,
              chip: prompt.length > 42 ? `${prompt.slice(0, 40)}…` : prompt,
              prompt,
            };
          }),
          label: "More transmissions",
        };

        setMessages((current) => [
          ...current,
          {
            id: nextId(),
            role: "assistant",
            text: spaceQuoteReply(matchedQuote),
            streaming: true,
          },
        ]);
        return;
      }

      lastQuoteRef.current = null;

      const keyword = await loadKeyword();
      const [answer] = await Promise.all([resolveAnswer(text, keyword), delay]);
      const entry = answer.entry;

      const assistantMessage: ChatMessage = {
        id: nextId(),
        role: "assistant",
        text: entry?.answer ?? FALLBACK_ANSWER,
        actions: entry?.actions ?? [
          { label: "Email Isaac", href: "mailto:benisaac1892@gmail.com" },
        ],
        streaming: true,
      };

      if (entry) {
        const followUps = keyword.followUpEntries(entry);
        if (answer.alternatives.length) {
          pendingChipsRef.current = {
            chips: answer.alternatives,
            label: "Did you mean",
          };
        } else if (followUps.length) {
          pendingChipsRef.current = { chips: followUps, label: "Ask next" };
        } else {
          pendingChipsRef.current = {
            chips: keyword.entriesForSection(sectionRef.current),
            label: "Suggested questions",
          };
        }
      } else {
        pendingChipsRef.current = {
          chips: keyword.topicEntries(2),
          label: "Try one of these",
        };
      }

      setMessages((current) => [...current, assistantMessage]);
    },
    [loadKeyword, loadQuoteCatalog, resolveAnswer],
  );

  useEffect(() => {
    if (state !== "ready" || panelOpen) return;
    const timer = window.setTimeout(() => {
      setState("idle");
      stateRef.current = "idle";
    }, ASSISTANT.boot.idleMs);
    return () => window.clearTimeout(timer);
  }, [state, panelOpen, activity]);

  const status =
    state === "waking"
      ? `Waking ${Math.round(progress * 100)}%`
      : state === "thinking"
        ? "Thinking"
        : state === "error"
          ? "Keyword mode"
          : state === "idle"
            ? "Idle"
            : state === "ready"
              ? "Online"
              : "Dormant";

  return {
    state,
    status,
    mode,
    progress,
    panelOpen,
    hasOpened,
    messages,
    chips,
    chipsLabel,
    bootLog,
    wake,
    canPreload,
    openPanel,
    closePanel,
    ask,
    onBootComplete,
    onStreamComplete,
  };
}
