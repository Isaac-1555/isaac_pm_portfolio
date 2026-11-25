# Portfolio AI Assistant: Technical Spec

Nov 22, 2026 · @Isaac Judah Beniel Daniel Sudakar

## Overview

We are adding a chat assistant to the portfolio that answers questions about Isaac's work using on-device semantic search, with no AI service, no API calls and no server cost. A glowing eye mascot sits at the bottom right of every page. Hovering near it or clicking it starts a power-on animation that is driven by the real progress of the model download. Once it is awake, clicking it opens a chat panel with suggested questions. Replies appear after a short fake "typing..." delay and then stream in word by word.

The assistant is not generative. Every answer is written by Isaac in advance. The browser embeds the visitor's question with a small model, finds the closest pre-written question by meaning, and returns its answer. This handles loose phrasing ("have you led teams?") that plain keyword matching would miss.

The mascot takes inspiration from a cold, red-lensed machine eye, but should be an original design with its own name and look, not a copy of a film character.

## Goals and non-goals

The feature succeeds if visitors get a correct, charming answer in under a second after the model is warm, and the rest of the site never gets slower because of it.

**Goals**

- Answer questions about projects, experience, skills, availability and contact with pre-written answers.
- Run entirely in the browser: no API keys, no backend calls, no per-visit cost.
- Add zero weight to the initial page load; download the model only on intent.
- Keep the main thread free so scrolling, GSAP and Lenis animations never stutter.
- Make the boot animation reflect real download progress, and play a short version when the model is cached.
- Degrade gracefully to keyword search when the model cannot load.

**Non-goals**

- No generative text and no calls to any LLM provider.
- No conversation memory beyond the current session.
- No analytics on question text in the first version.
- No test framework in the first version, since the project has none.

## User experience

The experience has five states, and the mascot and chat panel move through them in order.

1. **Dormant.** The eye is a dim ember at the bottom right. Nothing has been downloaded.
2. **Waking.** The visitor hovers near the eye (desktop) or taps it (touch). The model starts loading in a Web Worker and the eye powers on in step with download progress. A cached model produces a 600 to 800 ms boot.
3. **Ready.** The eye is fully lit and tracks the cursor. Clicking it opens the chat panel with a greeting and suggested questions.
4. **Answering.** The visitor asks or taps a chip. The lens pulses for a fake typing delay of 500 to 1200 ms, then the answer streams in.
5. **Idle.** After about a minute of inactivity the eye dims to an ember again. The model stays in memory until the tab closes.

**Suggested questions.** The panel shows three or four chips at a time. They depend on the section the visitor is viewing (Projects, About, Contact) and refresh after every answer with relevant follow-ups, so the chat never dead-ends.

**Streaming.** Answers are pre-written, so streaming is a reveal: roughly 20 to 40 ms per word with small random jitter and a longer pause after punctuation. Answers may end with link buttons (for example "Open Pocket Resume") that scroll to or open the relevant section.

**Free typing and weak matches.** If the best match falls below the confidence threshold, the assistant says it is not sure, suggests topics, and offers Isaac's email. A hidden set of easter eggs answers playful questions in Isaac's own voice.

## The mascot

The mascot is a single SVG and CSS component, about 96 px wide on desktop and 64 px on mobile, fixed to the bottom right with a high z-index. It needs an original name before launch; "the Watcher" is a placeholder.

**Visual design.** A dark circular housing with a metallic rim, a deep red glass lens, and a soft radial glow. Use SVG gradients for the lens and CSS variables for glow intensity, so the whole power level is controlled by one number from 0 to 1.

**States and what drives them**

| State | Glow level | Trigger | Motion |
| --- | --- | --- | --- |
| Dormant | 0.05 | Page load | Faint slow pulse |
| Waking | 0.05 to 1.0 | Hover near, or tap | Glow follows download progress |
| Ready | 1.0 | Progress complete | Pupil tracks cursor, occasional blink |
| Thinking | 1.0 | Question sent | Scanning ring that speeds up, then settles |
| Idle | 0.15 | 60 s of inactivity | Dims to ember |
| Error | 0.3, amber | Model load failed | Flicker, then steady amber |

**Boot animation tied to download progress**

1. Transformers.js reports progress per file. The worker aggregates all file events into one value from 0 to 1, weighted by file size, and posts it to the main thread.
2. The main thread does not set the glow directly. Each animation frame it moves the displayed level toward the target (a lerp of roughly 0.1 per frame), so the glow rises smoothly instead of jumping.
3. Cached visits are detected by checking the Cache API for the model files before loading. If they are cached, skip the download phase and play a fixed 600 to 800 ms boot.
4. At 1.0, play a short bloom and settle into the Ready state.
5. Optional boot log lines in the chat panel unlock at 25, 50, 75 and 100 percent (for example "loading memory", "indexing projects", "ready").

**Cursor tracking.** The pupil offset follows the pointer with a slight lag and is clamped to a small radius. Use a single `pointermove` listener on `window`, throttled with `requestAnimationFrame`, and only while the state is Ready.

**Trigger zone.** On desktop, the hover trigger is a transparent area about 160 px around the eye, so the model starts loading just before the visitor reaches it. On touch devices, only a tap starts it. If `navigator.connection?.saveData` is true, loading waits for an explicit click, never a hover.

## Architecture

The main thread owns the interface and the state machine. The Web Worker owns everything heavy. They talk only through typed messages, listed under key interfaces below.

&#91;embedded content: architecture · main thread, worker and build step\]

The build script turns qa.json into embeddings.json once. At run time the main thread sends each question to the worker, which embeds it and replies with the best match and a score. If the model is not ready, or fails to load, the keyword matcher answers instead, so the chat always responds.

## Semantic search pipeline

The heavy work happens once on Isaac's machine. The visitor's browser only embeds one short question and compares it to saved vectors.

**Model.** A small quantized sentence embedding model, such as all-MiniLM-L6-v2 or bge-small, run through Transformers.js. Expect roughly 25 to 35 MB to download once. Final model choice is decided in Phase 4 by testing match quality on real questions.

**Build time (npm script, runs on Isaac's machine)**

1. Read `content/assistant/qa.json`.
2. For each entry, embed every phrasing in `questions` (so one answer can be reached by many wordings).
3. Normalize the vectors and write them to `public/assistant/embeddings.json` along with entry ids.
4. Re-run whenever the content or the model changes. The output stores the model name so a mismatch is caught at load time.

**Run time (inside the Web Worker)**

1. Load the model and the embeddings file when the visitor wakes the assistant.
2. Embed the visitor's question.
3. Compute cosine similarity against every stored vector. With normalized vectors this is a dot product, and a few hundred vectors take well under a millisecond.
4. Take the best score per entry, then the top match.
5. Compare to the thresholds below and return the entry id, the score and, if useful, the runner-up.

**Confidence thresholds (starting values, tuned in Phase 4)**

| Best score | Behavior |
| --- | --- |
| 0.60 or higher | Answer directly |
| 0.40 to 0.60 | Answer, then show chips for the two nearest topics ("Did you mean...") |
| Below 0.40 | Fallback reply with topic chips and the contact link |

**Keyword fallback.** A small Fuse.js or hand-rolled keyword matcher runs on the main thread from the first moment the chat opens. It answers while the model is still loading, and takes over completely if the model fails or the device is low on memory. The visitor never sees a dead chat.

## Content model

All answers live in one JSON file, so updating the assistant never touches component code. Each entry carries several phrasings of the question, one answer, optional actions, and follow-up chips.

```json
{
  "id": "pocket-resume",
  "topic": "projects",
  "questions": [
    "Tell me about Pocket Resume",
    "What is your AI resume project?",
    "Have you built anything with AI?"
  ],
  "answer": "Pocket Resume is a full-stack AI resume tool I built end to end...",
  "actions": [{ "label": "Open Pocket Resume", "href": "#projects" }],
  "followUps": ["tech-stack", "barcode-lists"],
  "sections": ["projects"]
}
```

**Fields**

| Field | Purpose |
| --- | --- |
| `id` | Stable key used by follow-ups and embeddings |
| `topic` | Grouping for chips and analytics later |
| `questions` | Three to six phrasings, each embedded separately |
| `answer` | First-person text, one to four short sentences |
| `actions` | Optional link buttons shown under the answer |
| `followUps` | Entry ids offered as chips after this answer |
| `sections` | Page sections where this entry may appear as a suggested chip |

**Coverage for launch (about 25 entries).** Introduction, current role, background and education, each portfolio project, tech stack, product management approach, certifications, availability and hiring, location, how to contact, how this assistant works, and three to five easter eggs.

**Writing rules.** Answers are written in Isaac's voice, stay under about 60 words, and each includes something specific (a number, a technology, an outcome). Keep factual claims in sync with the rest of the site.

**Hidden space-cinema archive.** A separate, lazily loaded easter-egg layer runs before keyword and semantic matching. It holds 200+ call-and-response pairs in `content/assistant/space-quotes.json`: the visitor says a recognizable line and K.I.D replies with the film's next line in its own voice, with no source label. The archive never enters the embedding index, so it cannot dilute real project answers. Validate changes with `npm run assistant:quotes`.

## Performance budget and loading strategy

The rule is that a visitor who never touches the eye pays almost nothing. The figures below are targets to verify on real devices, not guarantees.

| Metric | Target |
| --- | --- |
| Added JavaScript before first interaction | Under 8 KB gzipped (mascot, chat shell, keyword matcher) |
| Model and runtime download | Only after intent; about 25 to 35 MB model plus a few MB of WASM |
| Impact on Lighthouse performance score | No measurable change |
| Main thread blocking from the model | None; all inference in a Web Worker |
| Frame rate during boot animation | 60 fps on a mid-range laptop, 30 fps or better on a mid-range phone |
| Answer latency once warm | Under 150 ms desktop, under 500 ms phone, before the fake typing delay |
| Repeat visit boot | 600 to 800 ms, no network |

**Loading rules**

- Load the assistant with `next/dynamic` (`ssr: false`) so none of it reaches the server render or the initial bundle. Only the tiny eye button ships eagerly.
- Import Transformers.js inside the worker only, never in a component.
- Self-host the model files under `public/models/` instead of relying on a third-party CDN, and set long cache headers in `next.config` so they are served from the browser cache after the first visit.
- Request persistent storage (`navigator.storage.persist()`) after a successful load to reduce cache eviction.
- Skip hover preloading on `saveData` and on connections reported as `2g` or `slow-2g`.
- Pause the cursor tracking and glow animation when the tab is hidden (`visibilitychange`).
- Keep GSAP and Lenis out of the assistant. Use CSS and Framer Motion only, so the mascot does not compete with page-wide scroll animation for the main thread.

**Memory.** Expect about 100 to 200 MB of RAM while the model is loaded. If the worker fails to initialize or reports an out-of-memory error, switch to keyword-only mode and show the Error state.

## Accessibility, mobile and reduced motion

**Accessibility**

- The eye is a real `<button>` with an accessible name ("Ask Isaac's assistant") and a visible focus ring. Enter and Space wake and open it.
- The chat panel is a `<dialog>` or an element with `role="dialog"`, with focus moved into the input on open, focus trapped inside, Escape to close, and focus returned to the eye on close.
- The message list uses `aria-live="polite"`. Streamed text is announced once the reply finishes, not word by word, so screen readers are not flooded.
- Colour is never the only signal: Error and Thinking states also change a text label.
- Suggested chips are buttons in a labelled group, reachable by Tab.

**Reduced motion.** When `prefers-reduced-motion: reduce` is set, replace the boot animation, cursor tracking, pulses and bloom with a simple fade between dim and lit. Replies appear in full without word-by-word streaming, after a short fixed delay.

**Sound.** Off by default. If a startup hum is added, it plays only after an explicit click on a mute-toggle that starts in the muted state, and never autoplays.

**Mobile**

- The eye shrinks to about 64 px and sits above any bottom navigation, using `env(safe-area-inset-bottom)`.
- The chat opens as a bottom sheet at full width and about 70 percent of viewport height, with the input above the on-screen keyboard (use `visualViewport` to avoid the keyboard covering it).
- There is no hover wake. A tap starts loading, and a small "Tap to wake" label appears once after the first scroll.
- While the sheet is open, lock page scroll and tell Lenis to stop so the two do not fight.

## File structure and key interfaces

Everything lives under one feature folder so it can be removed or disabled in one step. Paths assume the App Router and the existing `cn()` helper in `lib/utils.ts`.

```text
content/assistant/
  qa.json                  # source of truth for answers
scripts/
  build-embeddings.mjs     # npm run assistant:embed
public/assistant/
  embeddings.json          # generated, committed
public/models/             # self-hosted model files
components/assistant/
  assistant-root.tsx       # client entry, loaded via next/dynamic
  eye.tsx                  # mascot SVG, states, cursor tracking
  chat-panel.tsx           # dialog, messages, input, chips
  message.tsx              # streamed message with action buttons
  use-assistant.ts         # state machine and worker bridge
  use-stream-text.ts       # word-by-word reveal with jitter
  keyword-search.ts        # fallback matcher
workers/
  assistant.worker.ts      # Transformers.js, embeddings, similarity
lib/assistant/
  types.ts                 # shared types
  progress.ts              # aggregates per-file download progress
```

**Key types**

```ts
type AssistantState =
  | "dormant" | "waking" | "ready" | "thinking" | "idle" | "error";

type QAEntry = {
  id: string;
  topic: string;
  questions: string[];
  answer: string;
  actions?: { label: string; href: string }[];
  followUps?: string[];
  sections?: string[];
};

type WorkerIn =
  | { type: "load" }
  | { type: "query"; id: number; text: string };

type WorkerOut =
  | { type: "progress"; value: number; cached: boolean }
  | { type: "ready" }
  | { type: "result"; id: number; entryId: string | null; score: number; runnerUp?: string }
  | { type: "error"; message: string };
```

**Integration notes for this stack**

- Mount `assistant-root` once in `app/layout.tsx`, inside a client wrapper, so the eye persists across route changes.
- Create the worker with `new Worker(new URL("../../workers/assistant.worker.ts", import.meta.url), { type: "module" })`, which Next.js bundles correctly.
- Style with Tailwind v4 tokens from `@theme` (add `--color-eye-glow` and `--color-eye-housing`), and use Framer Motion for the panel open and close springs.
- Scroll-aware chips read the current section from an `IntersectionObserver` over elements with `data-section` attributes. Do not read scroll position through GSAP or Lenis.

## Build phases

Each phase ends in something that works on its own, so the feature can ship after Phase 3 if needed. Later phases only improve it.

| Phase | What gets built | Done when |
| --- | --- | --- |
| 1. Shell | Eye SVG with idle animation, chat panel UI, open and close, focus handling, mobile sheet | Panel opens and closes with keyboard and touch; no layout shift; Lighthouse unchanged |
| 2. Keyword assistant | `qa.json` with about 25 entries, keyword matcher, fake typing delay, word-by-word streaming | Ten sample questions return the right answer; fallback reply works |
| 3. Chips and context | Suggested chips by section, follow-up chips, action buttons that scroll to sections | Chips change as the visitor scrolls; every answer has a next step |
| 4. Semantic search | Worker, build-time embeddings script, thresholds, self-hosted model | Test list of 40 varied questions reaches 90 percent correct top match; no main-thread jank in a performance trace |
| 5. Boot animation | Aggregated progress, lerped glow, cached-visit short boot, hover trigger zone | Animation tracks a throttled network; cached boot is under 1 s |
| 6. Polish | Easter eggs, idle dimming, boot log lines, optional sound, tooltip on first visit, reduced-motion path | Passes keyboard-only and screen reader walkthrough; reduced motion verified |

**Testing without a test framework.** Keep a `content/assistant/test-questions.json` file of questions and their expected entry ids. Add a small script (`npm run assistant:check`) that runs them through the same worker logic in Node and prints accuracy. This is the only automated check needed for Phase 4.

## Risks, edge cases and open questions

**Risks**

| Risk | Effect | Mitigation |
| --- | --- | --- |
| Model download is large on mobile data | Visitors resent the cost, or abandon boot | Load only on explicit intent; honor `saveData`; show size in the wake tooltip on touch |
| Safari or older browsers lack features the worker needs | Assistant never wakes | Feature-detect WebAssembly and module workers; fall back to keyword mode silently |
| Low-memory phones kill the tab | Page reloads mid-chat | Keyword mode on devices reporting low `deviceMemory`; keep the model out of memory when idle for a long time |
| Wrong match gives a confident bad answer | Hurts credibility | Thresholds, "did you mean" chips, and a test question set |
| Answers drift out of date as the portfolio changes | Visitors see stale facts | Keep all answers in one file and add "update assistant" to the new-project checklist |
| Mascot looks like a copy of a film character | Legal and originality concerns | Original name, shape and palette; any film references limited to short, attributed one-liners rather than scene transcripts |
| Animation competes with GSAP and Lenis | Scroll stutter | CSS-only animation, `will-change` on the glow layer only, hidden-tab pause |

**Open questions**

- [ ] What is the mascot's name and any backstory for greetings?
- [ ] Should unanswered questions be sent to Isaac (email form or Upstash Redis log), and is that acceptable for privacy?
- [ ] Is sound wanted at all, or should the first release be silent?
- [ ] Which model wins on real questions: all-MiniLM-L6-v2 or bge-small? Decide in Phase 4.
- [ ] Should the assistant appear on every page or only the home page and project pages?
