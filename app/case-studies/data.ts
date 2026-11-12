import React from "react";
import BrainCircuitIcon from "@/components/icons/brain-circuit-icon";
import FileDescriptionIcon from "@/components/icons/file-description-icon";
import TerminalIcon from "@/components/icons/terminal-icon";
import BucketIcon from "@/components/icons/bucket-icon";
import type { AnimatedIconProps } from "@/components/icons/types";

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  company: string; // Product/Client
  role: string;
  timeline: string;
  team: string;
  status: string;
  
  // Section 1: Context
  context: string;
  
  // Section 2: Problem
  problem: {
    statement: string;
    importance: string;
    constraints: string[];
  };
  
  // Section 3: Goals
  goals: {
    objectives: string[];
    kpis: string[];
  };
  
  // Section 4: Research
  research: {
    methods: string[];
    insights: string[];
  };
  
  // Section 5: Approach
  approach: {
    strategy: string;
    frameworks: string[];
    collaboration: string;
  };
  
  // Section 6: Solution
  solution: {
    description: string;
    features: string[];
    rationale: string;
  };
  
  // Section 7: Execution
  execution: {
    roadmap: { label: string; description: string }[];
    challenges: string[];
  };
  
  // Section 8: Outcome
  outcome: {
    quantifiable: string[];
    qualitative: string[];
  };
  
  // Section 9: Learnings
  learnings: {
    takeaways: string[];
    nextSteps: string[];
  };

  // Metadata
  icon: React.ComponentType<AnimatedIconProps>;
  gradient: string;
  tags: string[];
  techStack: string[];
  websiteUrl: string;
  repoUrl: string;
  /** Optional APK download URL (prefer GitHub Releases — not public/) */
  apkUrl?: string;
  /** Human size label shown on download button, e.g. "43 MB" */
  apkSizeLabel?: string;
  /** Optional SHA-256 of the APK for verify-after-download */
  apkSha256?: string;
  screenshots: string[]; // URLs
  imageWidth: number;
  imageHeight: number;
  /** Dedicated image for cursor-follow / featured previews (optional) */
  previewImage?: string;
  /** Optional aspect ratio for the preview image */
  previewWidth?: number;
  previewHeight?: number;
  /** How carousel images fit: 'cover' (default, crops) or 'contain' (full frame) */
  carouselFit?: "cover" | "contain";
}

export const caseStudies: CaseStudy[] = [
  {
    id: "tux",
    title: "Tux",
    subtitle: "Terminal-first desktop workspace — multi-session PTY terminals, file explorer, live git state, an editor with diffs, and signed CI releases for macOS, Windows, and Linux.",
    company: "Developer Tooling (Personal)",
    role: "Solo Developer & Designer",
    timeline: "Ongoing · v1.0.0 Shipped",
    team: "Solo",
    status: "Open Source · v1.0.0",

    context: "The daily development environment was a combination of Warp and VSCode. Both shipped split panes, a file explorer, a git tree, and session monitoring as secondary concerns — missing, hidden behind flags, or buried several menus deep. Tux was built to expose only the features a terminal-centric workflow actually uses, in a predictable order, with a native feel and a small footprint. What started as a one-day scaffold is now a released, cross-platform desktop app.",

    problem: {
      statement: "Modern IDEs and terminals prioritize feature breadth over feature access. The capabilities that matter most — layout, git visibility, file state, fast terminal access — sit behind menus and flags, creating friction that compounds across a full workday.",
      importance: "Layout, git state, and file state account for the majority of daily interactions. If a tool cannot surface those in under a second, it acts as a tax on every task — even when the feature technically exists somewhere.",
      constraints: ["Sub-2s cold start target", "Only used features ship — no speculative functionality", "Native feel — not a web wrapper", "Small binary size, not a multi-hundred-megabyte bundle"]
    },

    goals: {
      objectives: [
        "Split panes (vertical and horizontal) with multi-session PTY terminals",
        "Right-side terminal and left sidebar: file explorer, git tree, terminal sessions",
        "Inline git diffs and a CodeMirror editor with syntax highlighting",
        "Themeable, rebindable, keyboard-first — every major action has a shortcut",
        "Rust + Tauri for performance and binary size",
        "One-command releases for macOS, Windows, and Linux"
      ],
      kpis: ["Time from launch to first command", "Package / binary size", "Feature count held intentionally small", "Release availability across platforms"]
    },

    research: {
      methods: [
        "Daily-driver evaluation: Warp + VSCode side-by-side for two weeks before development began",
        "PRD written before any code (`PRD.md` checked into the repo)",
        "Explicit cut criterion: every feature must earn its place or be removed"
      ],
      insights: [
        "Most IDE features went unused across the two-week window — extensions marketplace, debugger, plugin system, integrated package manager.",
        "Layout, git state, and file state covered roughly 90% of daily usage. Those three justified the entire build.",
        "Tauri delivers native UX with webview flexibility, without the ~200MB Electron overhead.",
        "Shell-aware tooling (OSC 7999, SIXEL, kitty graphics) is what makes AI coding agents usable inside a terminal — a feature worth more than any plugin marketplace."
      ]
    },

    approach: {
      strategy: "PRD-first development: a single-day scaffold followed by 5 targeted fix commits, then a slow climb to v1.0.0. The Rust backend owns PTY, git operations, and the editor engine; the React frontend owns layout, where the webview pays for itself. Releases are built by a GitHub Actions matrix on every `v*` tag.",
      frameworks: ["Tauri 2", "xterm.js 6 with WebGL renderer", "CodeMirror 6 (editor)", "@pierre/diffs (diff viewer)", "portable-pty (PTY sessions)", "git2-rs (git operations)", "GitHub Actions release matrix"],
      collaboration: "Solo. Dogfooding from the first commit — every feature entered daily use the same day it was built."
    },

    solution: {
      description: "A three-pane desktop app. Sessions and the file tree occupy the left pane. The terminal plus editor/diff sit in the middle. Git state lives on the right. xterm.js with a WebGL renderer powers the terminal; CodeMirror powers the editor; @pierre/diffs renders the diff pane. Session state, cwd, theme, and keybindings all persist across launches.",
      features: [
        "Split panes (vertical and horizontal, resizable)",
        "Multi-session PTY terminals running the user's real login shell",
        "Left sidebar: file explorer with git status overlays, git tree, terminal session list",
        "Inline git diffs (unified and side-by-side)",
        "File editing with CodeMirror highlighting",
        "11 built-in theme presets plus a custom theme builder that recolors UI, terminal, and editor live",
        "Fully rebindable keymap with inline conflict detection",
        "Shell integration (OSC 7999) for live command and cwd-aware tab titles",
        "Inline graphics support (SIXEL / kitty protocols) so agent TUIs like opencode and Claude Code render inside the pane",
        "Session, cwd, theme, keymap, and window state persist across launches"
      ],
      rationale: "Rust + Tauri for sub-2s cold start and a small binary. React only where layout genuinely requires it (split panes, drag-resize, sidebar collapse). No LSP, no plugin marketplace, no debugger — explicitly out of scope per the PRD."
    },

    execution: {
      roadmap: [
        { label: "PRD", description: "20-section PRD covering layout, terminal, git, editor, persistence, performance targets" },
        { label: "Initial commit", description: "Tauri 2 + React 19 scaffold with all 7 panes wired (App, Sidebar, FileTree, Terminal, GitViewer, Diff, Editor)" },
        { label: "5 fix passes", description: "File explorer → CWD reset → GitViewer → shortcuts + git.rs → backspace keystroke" },
        { label: "v1.0.0", description: "Theme system, rebindable keymap, shell integration, inline graphics, and a CI release matrix for macOS, Windows, and Linux" }
      ],
      challenges: [
        "File explorer: PTY and sidebar state required rewiring so the tree and terminals stayed in sync (`7097843`).",
        "CWD reset bug: shell working directory failed to restore on session switch, breaking per-session isolation (`de63eac`).",
        "GitViewer stability: two passes required to render diffs reliably across staged / unstaged / untracked states (`d10a0a4`, `53678a0`).",
        "Backspace keystrokes reached the shell in dev but not in the built binary — keymap registration was happening too late (`be3d4d1`).",
        "Unsigned release binaries: Gatekeeper and SmartScreen both block first launch, so the release notes now ship the exact commands that clear the quarantine flag.",
        "Inline graphics: agent TUIs only render correctly when the terminal advertises the right color and image capabilities — `TERM=xterm-256color`, `COLORTERM=truecolor`, and `TERM_PROGRAM=ghostty` had to be set explicitly."
      ]
    },

    outcome: {
      quantifiable: [
        "v1.0.0 published with a macOS universal build, Windows installer + MSI, and Linux .deb, .rpm, and .AppImage",
        "28 commits from one-day scaffold to shipped release",
        "11 built-in themes plus a custom theme builder, recoloring UI, terminal, and editor live",
        "Every shortcut rebindable, with conflicts detected before a binding is saved",
        "Single binary replaces a two-tool setup (Warp + VSCode) for daily sessions"
      ],
      qualitative: [
        "Feels native, not browser-like",
        "No features shipped that require ignoring or disabling",
        "Daily-driver capable for terminal-centric workflows, including AI coding agents"
      ]
    },

    learnings: {
      takeaways: [
        "Tools built around observed daily usage outperform tools assembled from a standard feature list.",
        "A written PRD prevents scope creep more effectively than any framework choice — and makes cut decisions straightforward.",
        "Fix commits reveal where the real engineering effort went. The initial scaffold is the easy part."
      ],
      nextSteps: [
        "LSP for syntax-only lint hints (no autocomplete — out of scope by design)",
        "Hunk staging directly in the diff viewer",
        "Fuzzy file search (Cmd+P)",
        "Workspace JSON snapshots for cross-machine restore",
        "UI improvements tailored for terminal-based coding agents (Claude Code, Codex, Aider) — clearer diffs, in-place prompts, agent run state",
        "Context-aware shortcut detection that does not conflict with the shell or agent"
      ]
    },

    icon: TerminalIcon,
    gradient: "from-slate-900 to-bg-dark",
    tags: ["Rust", "Tauri", "IDE", "Terminal", "Dev Tool"],
    techStack: ["Rust", "Tauri 2", "React 19", "TypeScript", "xterm.js 6", "CodeMirror 6", "@pierre/diffs", "Vite", "portable-pty", "git2-rs"],
    websiteUrl: "https://github.com/Isaac-1555/Tux",
    repoUrl: "https://github.com/Isaac-1555/Tux",
    screenshots: [
      "/Tux_UI.png",
      "/Tux_Panes.png"
    ],
    imageWidth: 2880,
    imageHeight: 1800,
    previewImage: "/Tux_Preview.png",
    previewWidth: 2880,
    previewHeight: 1750
  },
  {
    id: "satbrain",
    title: "SatBrain",
    subtitle: "AI study assistant that converts documents into interactive learning materials — summaries, quizzes, flashcards, and visual charts.",
    company: "EdTech Product",
    role: "Product Manager & Lead Developer",
    timeline: "3 Months (MVP)",
    team: "Solo Founder",
    status: "Live Beta",
    
    context: "Students and professionals spend significant effort digesting large volumes of material before actual studying begins. SatBrain applies generative AI to that overhead: static documents (PDFs, audio) are automatically converted into active study aids — quizzes, flashcards, and visual charts.",
    
    problem: {
      statement: "Learners spend 60% of their study time organizing and summarizing notes rather than studying, which reduces effective retention per hour invested.",
      importance: "Compressing time-to-study shifts user attention from preparation to comprehension and recall, directly improving learning outcomes.",
      constraints: ["Zero infrastructure budget", "High-accuracy summaries with low hallucination tolerance", "Near-real-time processing latency"]
    },
    
    goals: {
      objectives: ["Automate study material creation from raw files.", "Generate visual insights (charts) from document content.", "Keep AI interactions under 5 seconds end-to-end."],
      kpis: ["User retention rate", "Documents processed per user", "Quiz completion rates"]
    },
    
    research: {
      methods: ["Competitor analysis of Quizlet and Chegg", "User interviews with university students", "Prototype testing with local study groups"],
      insights: ["Students valued visual outputs (charts) nearly as much as text summaries.", "Flashcards were the most requested retention feature.", "Audio transcription is the key differentiator for lecture recordings."]
    },
    
    approach: {
      strategy: "Vertical integration of AI services, built around the Gemini 1.5 family — its large context window allows entire textbooks to be processed in a single pass instead of fragmented chunk-by-chunk inference.",
      frameworks: ["Gemini API for summaries, quizzes, and flashcards (@google/generative-ai)", "Supabase for auth, storage, and persistence", "Radix Themes + Radix primitives for a component-driven frontend"],
      collaboration: "Direct feedback loop with beta testers driving rapid feature iteration."
    },
    
    solution: {
      description: "A web platform where users upload source material and receive a tailored study dashboard — document processor, chart generator, and an interactive quiz engine.",
      features: ["Multi-format Upload (PDF, DOCX, MP3)", "AI Summary & Chat", "Auto-generated Vega-Lite Charts", "Flashcard Mode", "Quiz Mode"],
      rationale: "A Vite + React SPA with Supabase and the Gemini API enabled rapid prototyping while providing enterprise-grade auth and database behavior out of the box."
    },
    
    execution: {
      roadmap: [
        { label: "Phase 1", description: "Document upload & AI summaries" },
        { label: "Phase 2", description: "Quiz & flashcard engines" },
        { label: "Phase 3", description: "Visual charts & audio input" }
      ],
      challenges: ["Large PDF ingestion required a chunking strategy.", "Consistent JSON output from the LLM for chart generation was enforced via robust validation middleware."]
    },
    
    outcome: {
      quantifiable: ["Processed 500+ documents in beta", "Reduced study prep time by ~70%", "90% positive feedback on the visual charts feature"],
      qualitative: ["Users reported feeling more prepared for exams.", "The clean, distraction-free UI drew consistent praise."]
    },
    
    learnings: {
      takeaways: ["Generative AI requires strict guardrails when the output is structured data.", "Visualizations drive stronger engagement than plain text summaries."],
      nextSteps: ["Rust + Tauri desktop rewrite — offline-first with Google OAuth", "Mobile app development", "Collaborative study groups", "Integration with Canvas/LMS"]
    },

    icon: BrainCircuitIcon,
    gradient: "from-tech to-bg-accent",
    tags: ["AI/ML", "EdTech", "React", "Vite"],
    techStack: ["React 18", "Vite", "TypeScript", "Supabase", "Gemini API", "Radix Themes", "Vega-Lite", "d3", "react-router v7"],
    websiteUrl: "https://satbrain.vercel.app/",
    repoUrl: "https://github.com/Isaac-1555/project_goldmine",
    screenshots: [
      "/Satbrain_Home.png",
      "/Satbrain_Mapview.png"
    ],
    imageWidth: 1919,
    imageHeight: 916,
    previewImage: "/SatBrain_Preview_v2.png",
    previewWidth: 1672,
    previewHeight: 941
  },
  {
    id: "pocket-resume",
    title: "Pocket Resume",
    subtitle: "Chrome extension that turns one saved resume into a tailored PDF for every job posting — an on-device engine with no API key, no upload, and no rate limit.",
    company: "Consumer Tool",
    role: "Solo Developer & Operator",
    timeline: "Ongoing · v10.8 Shipped",
    team: "Solo",
    status: "Live · 4,000+ Users",

    context: "The modern job market expects a tailored resume for every application to clear ATS filters. Producing those variations manually is slow, repetitive, and easy to do badly. The first version of PocketResume leaned on the user's own AI provider key — which worked, but made the first-run experience depend on someone else's quota, pricing, and uptime.",

    problem: {
      statement: "Job seekers spend hours rewriting a resume for each application, guessing at the keywords individual ATS systems prioritize — and every AI-powered tool they reach for asks for an API key before it shows them anything useful.",
      importance: "Resume tailoring is the highest-leverage step in the application pipeline — the difference between a generic submission and a targeted one directly affects screening outcomes. If the first run needs a key, a provider choice, and a wait, most users never see the value.",
      constraints: ["Must operate on any job board (LinkedIn, Indeed, etc.)", "Privacy-first: resume data stays in the browser unless the user opts into cloud sync", "No hard dependency on a third-party AI provider or its quota"]
    },

    goals: {
      objectives: ["Reduce resume tailoring from 30 minutes to a single click.", "Generate ATS-friendly content that never invents experience.", "Work with zero setup — no API key, no signup, no credits.", "Track applications in one place instead of a spreadsheet."],
      kpis: ["Users who complete a first generation", "Time from page load to PDF", "Resumes generated per active user", "Free-to-paid conversion"]
    },

    research: {
      methods: [
        "Analysis of ATS (Applicant Tracking Systems) parsing behavior.",
        "Interviews and feedback loops with active job seekers.",
        "Reading the product's own failure modes: weekly active users fell from 70 to 27 while the bug backlog grew."
      ],
      insights: [
        "Formatting matters as much as keywords in ATS screening.",
        "Users are reluctant to store personal employment data in cloud services.",
        "A quota error looks exactly like a broken product — the failure was indistinguishable from a bug.",
        "The fastest path to value is a no-key, no-wait download. Everything else is optional."
      ]
    },

    approach: {
      strategy: "Deterministic on-device alignment: the extension reads the job posting and the stored profile, then selects, reorders, trims, and repairs the user's own wording. It never rewrites their bullets and reverts any number that is not present in the profile, so the output is trustworthy and the whole run needs no network call.",
      frameworks: ["Chrome Extension Manifest V3", "Vanilla JS + HTML/CSS (no framework, no bundler for app code)", "Deterministic parser + JD aligner + O*NET skill lexicon", "jsPDF (PDF generation)", "Clerk (auth & pricing) + Convex (optional resume sync)", "esbuild for the cloud-sync bundle only"],
      collaboration: "Open source on GitHub, with a public changelog and an issue-driven backlog."
    },

    solution: {
      description: "A Chrome extension that parses a pasted resume into a structured, editable profile, reads the active tab's job description, and rebuilds a print-ready PDF around the matching content — plus a job tracker card for every application.",
      features: [
        "On-device resume engine — deterministic alignment, no API key, no upload, no rate limit",
        "Local parser: paste a resume once, fix it in an editable form",
        "3 layouts: Professional, Double Sided (one page, never clips), Academic CV (multi-page)",
        "One cover letter per resume, with company, role, and recipient filled from the posting",
        "Job Tracker: pipeline board + analytics, with no extra requests",
        "Quick Download — re-download a saved resume as a clean professional PDF without reading a page",
        "Multi-profile — up to 3 master resumes, switched in one click",
        "Resume Health Check (opt-in beta) — flags weak action verbs, missing metrics, tense drift, filler",
        "Optional cloud sync (Clerk + Convex) and a Pro plan for sync, tracker, and generation",
        "Long-resume warning before a two-page PDF is saved"
      ],
      rationale: "The extension form factor was the only one that grants access to job board content without copy-pasting. Moving the engine on-device removed the API-key wall, the quota failure mode, and the privacy problem in one move — and made the product fast enough that the wait disappeared."
    },

    execution: {
      roadmap: [
        { label: "v1.0 (Jan 2026)", description: "Manifest V3 setup, DOM scraping, multi-provider AI, PDF generation, Chrome Web Store launch" },
        { label: "Aug–Sep 2026", description: "Bug spiral — weekly users drop from 70 to 27 as the core flows break" },
        { label: "v9.0.1 (Oct 17, 2026)", description: "Bug backlog cleared, Quick Download added, landing page rebuilt for search intent — 495 weekly users, then 4,000+ within two days" },
        { label: "v10.5–10.8 (Nov 2026)", description: "Cover letter per resume, single-page Double Sided layout, Academic CV pagination, on-device engine, long-resume warning" }
      ],
      challenges: [
        "Scraping dynamic SPAs (LinkedIn/Indeed) required robust DOM observers.",
        "In-browser PDF generation needed careful handling of fonts, layout, and page fitting.",
        "The Double Sided layout had to be measured before rendering, then tightened progressively — spacing, bullet length, then section priority — so nothing silently falls off the page edge.",
        "Academic CV pagination had to keep an entry header attached to its first bullet and reserve room for right-aligned dates.",
        "Skill extraction matched job-description prose too loosely — 'reduce the backlog' became the REDUCE computer-algebra system and 'excel at demos' became Microsoft Excel. Ambiguous terms now need case evidence before they can be pulled in.",
        "Free-tier quotas on the AI path turned provider limits into apparent product failures, so the free path became deterministic and the paid path became a Pro plan."
      ]
    },

    outcome: {
      quantifiable: [
        "4,000+ job seekers have used PocketResume",
        "Tailored PDF generated on-device in about a second — no API key, no upload, no waiting on a server",
        "3 ATS-ready layouts, each with its own fit and pagination rules",
        "Job Tracker pipeline board with analytics, no extra API calls",
        "Pro plan at $4/month or $47/year, with a 7-day trial",
        "20+ shipped versions from the first release to v10.8"
      ],
      qualitative: [
        "Users trust the output because it never rewrites their words or invents metrics",
        "No signup, no key, no credit card in the path to a finished PDF",
        "Cover letters became the feature people mention most"
      ]
    },

    learnings: {
      takeaways: ["Reliability is a growth feature — a quota error that looks like a bug costs more users than any missing feature.", "Deterministic software can be a better product than a probabilistic one, not just a cheaper one.", "Prompt engineering became a product feature in its own right — then became unnecessary once the rules were explicit."],
      nextSteps: ["Rebuild the ATS score checker and form filler without an AI dependency", "More layout coverage for specific industries", "Retention instrumentation beyond weekly active users", "Keep the privacy promise as the user base grows"]
    },

    icon: FileDescriptionIcon,
    gradient: "from-warning to-gold",
    tags: ["Chrome Extension", "On-Device", "Product"],
    techStack: ["Chrome MV3", "Vanilla JavaScript", "jsPDF", "Clerk", "Convex", "Chrome Storage API", "Deterministic Align Engine", "O*NET Skill Vocabulary"],
    websiteUrl: "https://pocket-resume.xyz",
    repoUrl: "https://github.com/Isaac-1555/pocket-resume",
    screenshots: [
      "/PocketResume_UI.png",
      "/PocketResume_Settings.png"
    ],
    imageWidth: 2880,
    imageHeight: 1576,
    previewImage: "/PocketResume_Preview.png",
    previewWidth: 1536,
    previewHeight: 1024
  },
  {
    id: "notebucket",
    title: "NoteBucket",
    subtitle: "Local-first Android note organizer — BGE-small embeddings + llama.cpp route notes into folders by semantic similarity. 100% offline.",
    company: "Android App",
    role: "Solo Developer",
    timeline: "Spike → v0.3.2 (Shipped)",
    team: "Solo",
    status: "Open Source · v0.3.2",

    context: "Note-taking apps rely on cloud sync, require accounts, or depend on keyword-based folders. NoteBucket organizes notes by meaning rather than keywords and runs entirely on-device with zero network calls.",

    problem: {
      statement: "Manual folder management breaks down at scale: notes pile into a single bucket, or organizing consumes more time than writing.",
      importance: "Semantic routing removes organizational friction entirely — the user writes; the app files. No manual step remains between capturing a note and storing it correctly.",
      constraints: [
        "100% offline — no cloud, no accounts, no analytics",
        "On-device inference only (BGE-small via llama.cpp JNI)",
        "Android arm64-v8a only (emulator not supported)",
        "Model + app must fit a reasonable APK size"
      ]
    },

    goals: {
      objectives: [
        "Embed notes on-device and route to folders by cosine similarity",
        "Semantic search with folder + date range filters",
        "Crash-safe draft persistence",
        "File/image attachments",
        "Hidden folders + bulk operations"
      ],
      kpis: [
        "Routing accuracy (correct folder assignment)",
        "Inference latency per note",
        "APK size with bundled model"
      ]
    },

    research: {
      methods: [
        "On-device embedding model evaluation: BGE-small (33M, 384-dim) vs MiniLM vs custom fine-tunes",
        "LLM-based classification prototyped first, then replaced with embedding routing for speed and privacy",
        "Cosine similarity thresholds tested against manual folder assignments"
      ],
      insights: [
        "BGE-small delivers 384-dim embeddings at ~33MB — small enough to bundle in the APK, accurate enough for folder routing",
        "LLM classification was too slow and privacy-incompatible for an offline-first app",
        "Ambiguous notes (margin ≤ 0.03 between top-2 folders) call for a disambiguation dialog, not a guess"
      ]
    },

    approach: {
      strategy: "Spike-first development: prove BGE + llama.cpp JNI on Android on day 1, then build the full app around it. Every feature is additive to the core embedding pipeline.",
      frameworks: [
        "Jetpack Compose + Material 3 (UI)",
        "Room (persistence: folders, notes, drafts, attachments, embeddings as BLOB)",
        "Hilt (DI)",
        "WorkManager + ProcessLifecycleObserver (background draft commits)",
        "Coil (image loading)",
        "llama.cpp via NDK + CMake (inference runtime)",
        "NDK 28.2 + CMake 3.22 (llama.cpp and ggml built from source via submodule)"
      ],
      collaboration: "Solo. PRD-driven — architecture decisions were locked before implementation began."
    },

    solution: {
      description: "A standalone Android app that embeds each note on-device (BGE-small-en-v1.5, 384-dim, L2-normalized), cosine-scores it against folder name embeddings, and files it automatically. Ambiguous matches surface a disambiguation dialog; unmatched notes land in 'Unsorted'. Drafts persist to Room on every keystroke and auto-commit after 1 minute in the background.",
      features: [
        "On-device note routing via BGE-small embeddings + cosine similarity",
        "Semantic search with folder + date range filters (top-5 results)",
        "Crash-safe drafts (persisted to Room, debounced 500ms, auto-commit in background)",
        "File/image attachments (internal storage, Coil thumbnails)",
        "Hidden folders + bulk move/delete",
        "10 folder color options, rename, recolor",
        "Settings: threshold slider, theme mode, model reload, storage stats"
      ],
      rationale: "Kotlin + Jetpack Compose for a native Android experience. Room for structured persistence with embeddings stored as BLOBs. llama.cpp over JNI for on-device inference with no cloud dependency. Hilt for DI; WorkManager for reliable background draft commits."
    },

    execution: {
      roadmap: [
        { label: "Day 1", description: "Spike: BGE-small + llama.cpp JNI scaffold on Android" },
        { label: "Day 2", description: "Full app: pages, onboarding, Room persistence, folder/note CRUD" },
        { label: "Days 3-4", description: "BGE routing, UI overhaul (dark mode, folder colors, notion-style editor)" },
        { label: "Day 5", description: "Search with filters, note input UX, disambiguation dialog, bulk ops" },
        { label: "Days 6-7", description: "Hidden folders, settings, UI polish, keyboard fixes" },
        { label: "Day 8", description: "v0.3.0: onboarding flow, voice removal, MIT license" },
        { label: "Release pipeline", description: "Local signing config plus R8 minify and resource shrink — signed arm64-v8a APK published to GitHub Releases (v0.3.2)" }
      ],
      challenges: [
        "Replacing the LLM classifier with BGE embedding routing mid-development required rewriting the core sort pipeline",
        "The JNI bridge between Kotlin and llama.cpp required careful memory management for 384-dim float arrays",
        "Background draft auto-commit demanded ProcessLifecycleObserver + WorkManager coordination to avoid data loss",
        "Disambiguation at cosine margin ≤ 0.03 — too ambiguous to auto-route, too close to ignore",
        "Shipping a signed build meant a local keystore, R8 minification, and compiling llama.cpp plus ggml from source through NDK and CMake — the first clean release build takes several minutes"
      ]
    },

    outcome: {
      quantifiable: [
        "24 commits from one-day spike to the v0.3.2 release",
        "4 Room tables: folders, notes, drafts, attachments",
        "33MB BGE-small model bundled in APK assets (Q4_K_M ~25MB variant supported)",
        "41 MB release APK, R8-minified and resource-shrunk, arm64-v8a (Android 12+)",
        "Zero network permissions — fully offline"
      ],
      qualitative: [
        "Notes route to the correct folder without manual organization",
        "Semantic search finds notes by meaning, not keywords",
        "The draft system is crash-safe — no lost work"
      ]
    },

    learnings: {
      takeaways: [
        "Embedding-based routing is faster and more privacy-preserving than LLM classification for this use case",
        "On-device ML is viable at the right model size (33MB BGE-small, not a 7B LLM)",
        "Ambiguity calls for a UI solution (disambiguation dialog), not a higher threshold"
      ],
      nextSteps: [
        "Export/import notes across devices",
        "Widget for quick note capture",
        "Tags system alongside folder routing",
        "Folder embedding fine-tuning from user corrections"
      ]
    },

    icon: BucketIcon,
    gradient: "from-cyan-900 to-slate-900",
    tags: ["Android", "On-Device AI", "Local-First"],
    techStack: ["Kotlin", "Jetpack Compose", "Material 3", "Room", "Hilt", "llama.cpp", "BGE-small", "WorkManager", "Coil", "NDK/CMake"],
    websiteUrl: "https://github.com/Isaac-1555/NoteBucket",
    repoUrl: "https://github.com/Isaac-1555/NoteBucket",
    apkUrl: "https://github.com/Isaac-1555/NoteBucket/releases/download/v0.3.2/app-release.apk",
    apkSizeLabel: "41 MB",
    apkSha256: "b280d28990c92cb17911d6eb80191531e95cc7d75ca2f0378bca1859924c157b",
    screenshots: [
      "/NoteBucket_Hero.png",
      "/NoteBucket_Dashboard.jpeg",
      "/NoteBucket_Editor.jpeg",
      "/NoteBucket_Settings.jpeg"
    ],
    imageWidth: 1536,
    imageHeight: 1024,
    previewImage: "/NoteBucket_Preview_v2.png",
    previewWidth: 1920,
    previewHeight: 1080,
    carouselFit: "contain"
  }
];
