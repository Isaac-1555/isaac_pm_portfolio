import React from "react";
import BrainCircuitIcon from "@/components/icons/brain-circuit-icon";
import FileDescriptionIcon from "@/components/icons/file-description-icon";
import TerminalIcon from "@/components/icons/terminal-icon";
import BucketIcon from "@/components/icons/bucket-icon";
import YoutubeIcon from "@/components/icons/youtube-icon";
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
  /** Requirement line shown under the APK download button */
  apkRequirement?: string;
  screenshots: string[]; // URLs
  imageWidth: number;
  imageHeight: number;
  /** Dedicated image for cursor-follow / featured previews (optional) */
  previewImage?: string;
  /** Optional aspect ratio for the preview image */
  previewWidth?: number;
  previewHeight?: number;
  /** Vector cover used on cards and previews (optional) */
  coverImage?: string;
  /** How carousel images fit: 'cover' (default, crops) or 'contain' (full frame) */
  carouselFit?: "cover" | "contain";
  /** Optional aspect ratio override for the screenshot grid */
  screenshotAspect?: string;
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
    previewHeight: 1750,
    coverImage: "/covers/tux.svg"
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
    previewHeight: 941,
    coverImage: "/covers/satbrain.svg"
  },
  {
    id: "pocket-resume",
    title: "Pocket Resume",
    subtitle: "Chrome extension that turns one saved resume into a tailored PDF for every job posting — free forever, no account, and an on-device engine with no API key, no upload, and no rate limit.",
    company: "Consumer Tool",
    role: "Solo Developer & Operator",
    timeline: "Ongoing · v11.0 Shipped",
    team: "Solo",
    status: "Live · Free · 4,000+ Users",

    context: "The modern job market expects a tailored resume for every application to clear ATS filters. Producing those variations manually is slow, repetitive, and easy to do badly. The first version leaned on the user's own AI provider key — which worked, but made the first-run experience depend on someone else's quota, pricing, and uptime. The engine now runs on-device, the interface is paper and ink, and v11 removed the last gate: the product is free forever and no account is needed.",

    problem: {
      statement: "Job seekers spend hours rewriting a resume for each application, guessing at the keywords individual ATS systems prioritize — and most tools ask for an API key, an account, or a subscription before they show anything useful.",
      importance: "Resume tailoring is the highest-leverage step in the application pipeline — the difference between a generic submission and a targeted one directly affects screening outcomes. If the first run needs a key, a signup, and a wait, most users never see the value.",
      constraints: ["Must operate on any job board (LinkedIn, Indeed, Greenhouse, Lever, Ashby)", "Free forever — every core feature works without an account, trial, or paywall", "Privacy-first: resume data stays in the browser unless the user opts into cloud sync", "No dependency on a third-party AI provider or its quota"]
    },

    goals: {
      objectives: ["Reduce resume tailoring from 30 minutes to a single click.", "Generate ATS-friendly content that never invents experience.", "Work with zero setup — no API key, no signup, no credits, no trial.", "Keep every feature free, with cloud sync as the only optional account.", "Track applications, fill forms, and re-download PDFs without leaving the panel."],
      kpis: ["Users who complete a first generation while signed out", "Time from page load to PDF", "Resumes generated per active user", "Supporter conversion (optional tip jar)", "Return rate after the first generation"]
    },

    research: {
      methods: [
        "Analysis of ATS (Applicant Tracking Systems) parsing behavior.",
        "Interviews and feedback loops with active job seekers.",
        "Reading the product's own failure modes: weekly active users fell from 70 to 27 while the bug backlog grew.",
        "Post-v9 funnel review of where a completed install still failed to produce a PDF."
      ],
      insights: [
        "Formatting matters as much as keywords in ATS screening.",
        "Users are reluctant to store personal employment data in cloud services.",
        "A quota error looks exactly like a broken product — the failure was indistinguishable from a bug.",
        "The fastest path to value is a no-key, no-wait download. Everything else is optional.",
        "An account wall is another version of the same failure: it delays the first useful result without improving it.",
        "Corrections should be taught once. A job title or employer fixed in the review dialog should never be retyped."
      ]
    },

    approach: {
      strategy: "Deterministic on-device alignment: the extension reads the job posting and the stored profile, then selects, reorders, trims, and repairs the user's own wording. It never rewrites their bullets and reverts any number that is not present in the profile. A review dialog confirms the title, company, location, and recipient before anything is saved; corrections train local company, title, and location directories. The same deterministic rules drive the form filler, so the whole run needs no network call and no account.",
      frameworks: ["Chrome Extension Manifest V3", "Vanilla JS + HTML/CSS (no framework, no bundler for app code)", "Chrome Side Panel API + draggable PDF shelf", "Deterministic parser + JD aligner + O*NET skill lexicon", "Local company, job-title, and location directories (O*NET + GeoNames lists)", "jsPDF (PDF generation)", "Clerk (optional sync + Supporter) + Convex (optional resume sync)", "esbuild for the cloud-sync bundle only"],
      collaboration: "Open source on GitHub, with a public changelog and an issue-driven backlog."
    },

    solution: {
      description: "A Chrome extension that lives in the side panel, parses a pasted resume into a structured, editable profile, reads the active tab's job description, and rebuilds a print-ready PDF around the matching content — then keeps the file on a shelf for attaching, re-downloading, or tracking.",
      features: [
        "Free forever, no account — generation, cover letters, Form Filler, and the Job Tracker all work signed out",
        "On-device resume engine — deterministic alignment, no API key, no upload, no rate limit",
        "Side panel with a draggable PDF shelf — attach a resume to an application form or drag it onto the page",
        "Job details review before saving — edit the title, company, location, and recipient; corrections are remembered",
        "Directories that learn — company, job title, and location corrections resolve locally on the next posting",
        "Form Filler — fills saved answers and resume details into application forms, never submits, never overwrites",
        "Paper-and-ink interface with an Ink theme, hairline rules, and a build simulation that rebuilds the sheet",
        "3 layouts: Professional, Double Sided (one page, never clips), Academic CV (multi-page)",
        "One cover letter per resume, with company, role, and recipient filled from the posting",
        "Job Tracker: pipeline board + analytics, free without an account",
        "Quick Download — re-download a saved resume as a clean professional PDF without reading a page",
        "Multi-profile — up to 3 master resumes, duplicate one into a free slot, switch in one click",
        "Optional cloud sync (Clerk + Convex); the Supporter plan is an optional tip jar that unlocks nothing",
        "Long-resume warning before a two-page PDF is saved"
      ],
      rationale: "The extension form factor was the only one that grants access to job board content without copy-pasting. Moving the engine on-device removed the API-key wall, the quota failure mode, and the privacy problem in one move. The side panel keeps the PDF next to the form it belongs on, and making every feature free removed the last step between install and a finished resume."
    },

    execution: {
      roadmap: [
        { label: "v1.0 (Jan 2026)", description: "Manifest V3 setup, DOM scraping, multi-provider AI, PDF generation, Chrome Web Store launch" },
        { label: "Aug–Sep 2026", description: "Bug spiral — weekly users drop from 70 to 27 as the core flows break" },
        { label: "v9.0.1 (Oct 17, 2026)", description: "Bug backlog cleared, Quick Download added, landing page rebuilt for search intent — 495 weekly users, then 4,000+ within two days" },
        { label: "v10.5–10.8 (Nov 2026)", description: "Cover letter per resume, single-page Double Sided layout, Academic CV pagination, on-device engine, long-resume warning" },
        { label: "v10.9–11.0 (Nov 2026)", description: "Review dialog and learned directories, Form Filler, side panel + PDF shelf, paper-and-ink redesign, free forever with an optional Supporter tip jar" }
      ],
      challenges: [
        "Scraping dynamic SPAs (LinkedIn/Indeed) required robust DOM observers.",
        "In-browser PDF generation needed careful handling of fonts, layout, and page fitting.",
        "The Double Sided layout had to be measured before rendering, then tightened progressively — spacing, bullet length, then section priority — so nothing silently falls off the page edge.",
        "Academic CV pagination had to keep an entry header attached to its first bullet and reserve room for right-aligned dates.",
        "Skill extraction matched job-description prose too loosely — 'reduce the backlog' became the REDUCE computer-algebra system and 'excel at demos' became Microsoft Excel. Ambiguous terms now need case evidence before they can be pulled in.",
        "Application forms hide controls inside custom design systems and cross-origin iframes; the filler had to detect radio groups, map saved answers, and leave consent boxes and honeypots alone.",
        "Free-tier quotas on the AI path turned provider limits into apparent product failures. The fix was not better error copy — it was removing the provider from the core path and removing the paywall entirely."
      ]
    },

    outcome: {
      quantifiable: [
        "4,000+ job seekers have used PocketResume",
        "Tailored PDF generated on-device in about a second — no API key, no upload, no waiting on a server",
        "3 ATS-ready layouts, each with its own fit and pagination rules",
        "Free forever — every feature works signed out, including the Job Tracker and Form Filler",
        "Supporter plan at $4/month or $47/year adds a badge and unlocks nothing",
        "60+ documented releases from v1.0 to v11.0"
      ],
      qualitative: [
        "Users trust the output because it never rewrites their words or invents metrics",
        "No signup, no key, no credit card in the path to a finished PDF",
        "The paper-and-ink redesign made the panel feel like a document tool instead of a dashboard",
        "Cover letters and form filling became the features people mention most"
      ]
    },

    learnings: {
      takeaways: ["Reliability is a growth feature — a quota error that looks like a bug costs more users than any missing feature.", "Deterministic software can be a better product than a probabilistic one, not just a cheaper one.", "Prompt engineering became a product feature in its own right — then became unnecessary once the rules were explicit.", "A paywall is a first-run failure. Removing it made the product easier to explain and easier to trust."],
      nextSteps: ["Rebuild the ATS score checker without an AI dependency", "More layout coverage for specific industries", "Retention instrumentation beyond weekly active users", "Keep the privacy promise as the user base grows"]
    },

    icon: FileDescriptionIcon,
    gradient: "from-warning to-gold",
    tags: ["Chrome Extension", "On-Device", "Free", "Product"],
    techStack: ["Chrome MV3", "Vanilla JavaScript", "Chrome Side Panel API", "jsPDF", "Clerk", "Convex", "Chrome Storage API", "Deterministic Align Engine", "O*NET + GeoNames Directories"],
    websiteUrl: "https://pocket-resume.xyz",
    repoUrl: "https://github.com/Isaac-1555/pocket-resume",
    screenshots: [
      "/PocketResume_Store_1.png",
      "/PocketResume_Store_2.png",
      "/PocketResume_Store_3.png",
      "/PocketResume_Store_4.png",
      "/PocketResume_Store_5.png"
    ],
    imageWidth: 1280,
    imageHeight: 800,
    previewImage: "/covers/pocket-resume.svg",
    previewWidth: 1600,
    previewHeight: 1000,
    coverImage: "/covers/pocket-resume.svg"
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
    apkRequirement: "Android 12+ · arm64 only",
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
    coverImage: "/covers/notebucket.svg",
    carouselFit: "contain"
  },
  {
    id: "mytube",
    title: "MyTube",
    subtitle: "All-in-one Android shell for YouTube, YouTube Music, Movies and Anime — four isolated WebView profiles, hosts-based ad blocking, background playback, and a player layer rebuilt against YouTube's current DOM.",
    company: "Android App",
    role: "Solo Android Developer",
    timeline: "May – Nov 2026 · v2.11.3",
    team: "Solo",
    status: "Open Source · v2.11.3",

    context: "YouTube's own apps split the experience across YouTube, YouTube Music, and Movies, while Anime lives on unofficial mirrors. Each surface ships its own ads, its own playback rules, and its own idea of what should keep playing when the screen turns off. MyTube wraps all four in one Android shell: Kotlin and Jetpack Compose around WebViews, with native ad blocking, a real media session, and player behaviour that survives the site changing underneath it.",

    problem: {
      statement: "A single media app for YouTube, Music, Movies, and Anime either does not exist or asks the user to accept ads, lose background playback, and give up the fullscreen and PiP behaviour they already expect from a native player.",
      importance: "Music and long-form video are background activities. If playback stops when the screen locks, or the notification has no working controls, the app fails at the exact moment it is supposed to be useful. Fullscreen and PiP are not extras — they are the difference between a browser tab and a media app.",
      constraints: ["Android 7.0 (API 24) and newer", "No root and no modified YouTube APK", "Per-tab WebView profiles so Movies and Anime cookies never mix with the main session", "Fullscreen and PiP must work inside a WebView that gates native APIs behind a user gesture", "Every release signed with the same certificate and shipped as a GitHub APK"]
    },

    goals: {
      objectives: [
        "Put YouTube, YouTube Music, Movies, and Anime in one app with isolated profiles",
        "Block ads with a hosts list and scriptlets that update themselves",
        "Keep audio playing with the screen off and publish real media controls",
        "Support Picture-in-Picture, rotate-to-fullscreen, a sleep timer, screen lock, and a home-screen widget",
        "Stay working as YouTube changes its player DOM"
      ],
      kpis: [
        "Playback continues with the app backgrounded or the screen off",
        "Dropped frames in the PiP window",
        "Fullscreen controls reachable on the first try",
        "Release cadence against YouTube player changes"
      ]
    },

    research: {
      methods: [
        "Player archaeology: mapping the static hosts, overlay layers, and fullscreen element YouTube actually ships",
        "WebView behaviour tests against Android 7 through 16, including Chromium's visibility callback",
        "Media session and notification testing on a Pixel running Android 16",
        "Filter-list and scriptlet iteration against feed, pre-roll, mid-roll, and pop-up ads"
      ],
      insights: [
        "YouTube's player is a chain of static host elements around one absolutely positioned overlay. Giving those hosts a position to raise their z-index makes a zero-height host the containing block — the controls exist but paint into nothing.",
        "requestFullscreen() and orientation locks are gated behind a transient user gesture, which evaluateJavascript cannot manufacture. A touch dispatched through the normal input pipeline is indistinguishable from a real one.",
        "YouTube pauses its own player on entering PiP and again after every play. Resuming it from the app turns into a fight that reads as stutter, then a re-buffer.",
        "Chromium reads page visibility from a callback. If the app does not override it, the browser pauses media whenever the window goes away.",
        "The first <video> in the document is not always the current one after a player rebuild."
      ]
    },

    approach: {
      strategy: "A native shell that owns layout, playback state, and system integration, while the WebView owns the site. Ads are removed with hosts rules plus uBlock-style scriptlets. Player behaviour is decided natively where possible: the app taps YouTube's own fullscreen button through the input pipeline instead of faking fullscreen, refuses the pause YouTube issues in a PiP window, and reports the page as visible while background playback is meant to run. Injected rules only touch what changed, never the player itself.",
      frameworks: ["Kotlin + Jetpack Compose", "AndroidX WebKit / WebView with per-tab profiles", "MediaSession + MediaBrowserService foreground playback", "DataStore preferences + Room where persistence is needed", "Hosts-file blocking + uBlock-style scriptlets + auto-updating filter list", "Injected JavaScript/CSS bridge for player state and page chrome", "Gradle 9.7.1, AGP 9.4.1, minSdk 24 / targetSdk 36", "Signed release APKs published through GitHub Releases"],
      collaboration: "Solo. Release notes and the README are written alongside each build so the player work stays reproducible."
    },

    solution: {
      description: "An Android app with four tabs — YouTube, YouTube Music, Movies, Anime — each with its own WebView profile. A foreground media service keeps audio alive, publishes metadata and transport controls to the notification and lock screen, and a home-screen widget mirrors playback. Player fixes are layered: fullscreen is handed to YouTube, PiP is guarded against YouTube's own pauses, and page chrome is hidden without hiding the controls.",
      features: [
        "Four tabs in one app — YouTube, YouTube Music, Movies and Anime",
        "Isolated WebView profiles for Movies and Anime, so cookies and storage never mix",
        "Ad blocking — hosts rules plus scriptlets, with a filter list that updates itself",
        "Background playback through a foreground media service",
        "Rich media controls — artwork, title, play/pause, real previous/next, stop, lock-screen and Android 13+ tint",
        "Home-screen media widget with artwork, title and transport controls",
        "Picture-in-Picture — manual and optional auto-PiP, with page chrome hidden",
        "Rotate to fullscreen landscape with YouTube's own controls, seek bar, and double-tap seek",
        "Sleep timer from 1 to 120 minutes with a snap wheel",
        "Screen lock that freezes the page and ignores touches, including inside fullscreen",
        "Edge-swipe navigation and an auto-hiding bottom bar",
        "Configurable Movies and Anime sources when a mirror rotates"
      ],
      rationale: "A native media shell is the only way to get a real MediaSession, reliable background playback, and system PiP without forking YouTube. Keeping the site in WebViews preserves the exact YouTube experience — comments, recommendations, library, sign-in — while the native layer supplies the behaviour the mobile web player does not. Rebuilding the player layer against the shipped DOM, rather than against an imagined one, is what made fullscreen and PiP stable."
    },

    execution: {
      roadmap: [
        { label: "v1.0 (May 31, 2026)", description: "Initial WebView shell, ad blocking, background playback, YouTube Music tab" },
        { label: "v2.0–2.8 (Jun–Oct 2026)", description: "YouTube nav, per-tab profiles, Movies and Anime, edge-swipe, auto-hide bar, configurable sources, settings" },
        { label: "v2.9 (Oct 2026)", description: "Home-screen media widget, real MediaBrowserService, notification and scrubber fixes" },
        { label: "v2.10 (Oct 2026)", description: "Rotate-to-fullscreen rebuilt around YouTube's own fullscreen button, with a fullscreen lock" },
        { label: "v2.11 (Nov 2026)", description: "Fullscreen and PiP rebuilt against the current player DOM; PiP pause fight removed; visibility callback overridden" },
        { label: "v2.11.3 (Nov 20, 2026)", description: "YouTube controls restored in fullscreen; page pin released when YouTube owns fullscreen" }
      ],
      challenges: [
        "YouTube's DOM changes without notice; every player fix had to be written against the shipped element tree, not a stable API.",
        "Fullscreen inside a WebView is gated behind a user gesture, so the app dispatches a real touch to YouTube's fullscreen control instead of calling requestFullscreen().",
        "The PiP window stuttered because YouTube and the app fought over pause. The app now refuses the page's pause inside PiP unless the user asked for it.",
        "Chromium paused media whenever the window went away until the page's visibility callback was overridden.",
        "Ad blocking had to cover feed ads, pre-roll, mid-roll, pop-ups, and ad navigation without hiding the video itself.",
        "A mode left on once could keep the page stripped for the rest of the session; every fullscreen and PiP exit now fully restores the page.",
        "Shipping a signed APK meant a local keystore, a strict versionCode bump on every release, and signature verification on each build."
      ]
    },

    outcome: {
      quantifiable: [
        "4 tabs with isolated profiles — YouTube, YouTube Music, Movies, Anime",
        "11 tagged releases from v2.0 to v2.11.3, 50 commits",
        "Android 7.0+ (API 24–36), 12 MB signed release APK",
        "0 dropped frames in 1,151 frames during the on-device PiP test",
        "Verified on a Pixel running Android 16",
        "Sleep timer from 1 to 120 minutes; 3 fullscreen modes"
      ],
      qualitative: [
        "Music and video keep playing with the screen off",
        "Notification, lock screen, Bluetooth, and the home-screen widget all drive the same session",
        "Fullscreen and PiP feel like the YouTube app, with its own controls intact",
        "No ads in the feed or the player, including mid-rolls"
      ]
    },

    learnings: {
      takeaways: [
        "The site is the API. Player work has to target the DOM that ships today, then be re-tested after every YouTube change.",
        "Do not fight the platform for control. Handing fullscreen back to YouTube and refusing its PiP pause worked better than imitating either.",
        "A WebView shell is only convincing when the native layer owns media state and system integration.",
        "Test on a device. Emulator WebView behaviour hid the PiP, visibility, and touch bugs."
      ],
      nextSteps: [
        "SponsorBlock and return-youtube-dislike integration",
        "Playlist and queue management outside the site",
        "Per-tab gesture controls and a tablet layout",
        "Automated player-DOM canaries that flag a broken selector before a release"
      ]
    },

    icon: YoutubeIcon,
    gradient: "from-tech to-slate-900",
    tags: ["Android", "Kotlin", "Media", "Open Source"],
    techStack: ["Kotlin", "Jetpack Compose", "AndroidX WebKit", "MediaSession", "MediaBrowserService", "DataStore", "Room", "Gradle 9.7.1"],
    websiteUrl: "https://github.com/Isaac-1555/MyTube_Android/releases/latest",
    repoUrl: "https://github.com/Isaac-1555/MyTube_Android",
    apkUrl: "https://github.com/Isaac-1555/MyTube_Android/releases/download/v2.11.3/MyTube-v2.11.3-release.apk",
    apkSizeLabel: "12 MB",
    apkRequirement: "Android 7.0+ · universal APK",
    apkSha256: "c4e3aca44ddb98f646fcd6c21be96f9ffcce0b80ef29da46f5973305ccd86b96",
    screenshots: [
      "/MyTube_Youtube.png",
      "/MyTube_YTMusic.png",
      "/MyTube_Settings.png",
      "/MyTube_SleepTimer.png"
    ],
    imageWidth: 540,
    imageHeight: 1200,
    previewImage: "/covers/mytube.svg",
    previewWidth: 1600,
    previewHeight: 1000,
    coverImage: "/covers/mytube.svg",
    carouselFit: "contain",
    screenshotAspect: "4 / 5"
  }
];
