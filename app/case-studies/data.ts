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
    subtitle: "Terminal-first IDE focused on split panes, session management, and git visibility — built after Warp and VSCode buried the features a terminal-centric workflow depends on.",
    company: "Developer Tooling (Personal)",
    role: "Solo Developer & Designer",
    timeline: "1 Day (Initial + 5 Fixes)",
    team: "Solo",
    status: "Open Source (GitHub)",

    context: "The daily development environment was a combination of Warp and VSCode. Both shipped split panes, a file explorer, a git tree, and session monitoring as secondary concerns — missing, hidden behind flags, or buried several menus deep. Tux was built to expose only the features a terminal-centric workflow actually uses, in a predictable order, with a native feel and a small footprint.",

    problem: {
      statement: "Modern IDEs and terminals prioritize feature breadth over feature access. The capabilities that matter most — layout, git visibility, file state, fast terminal access — sit behind menus and flags, creating friction that compounds across a full workday.",
      importance: "Layout, git state, and file state account for the majority of daily interactions. If a tool cannot surface those in under a second, it acts as a tax on every task — even when the feature technically exists somewhere.",
      constraints: ["Sub-2s cold start target", "Only used features ship — no speculative functionality", "Native feel — not a web wrapper", "Small binary size, not a multi-hundred-megabyte bundle"]
    },

    goals: {
      objectives: [
        "Split panes (vertical and horizontal)",
        "Right-side terminal",
        "Left sidebar: file explorer, git tree, terminal sessions",
        "Inline git diffs",
        "File reading, writing, and editing with CodeMirror highlighting and Prettier formatting",
        "Rust + Tauri for performance and binary size"
      ],
      kpis: ["Time from launch to first command", "Package / binary size", "Feature count held intentionally small"]
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
        "Tauri delivers native UX with webview flexibility, without the ~200MB Electron overhead."
      ]
    },

    approach: {
      strategy: "PRD-first development: a single-day scaffold followed by 5 targeted fix commits. The Rust backend owns PTY, git operations, and the editor engine; the React frontend owns layout, where the webview pays for itself.",
      frameworks: ["Tauri 2", "ghostty-web (terminal rendering)", "CodeMirror (editor)", "@pierre/diffs (diff viewer)", "git2-rs (git operations)"],
      collaboration: "Solo. Dogfooding from the first commit — every feature entered daily use the same day it was built."
    },

    solution: {
      description: "A three-pane desktop app. Sessions and the file tree occupy the left pane. The terminal plus editor/diff sit in the middle. Git state lives on the right. Ghostty powers the terminal; CodeMirror powers the editor with Prettier formatting for JS/TS/JSON/HTML/CSS/MD; @pierre/diffs renders the diff pane. Session state persists across launches.",
      features: [
        "Split panes (vertical and horizontal, resizable)",
        "Right-side terminal powered by Ghostty",
        "Left sidebar: file explorer, git tree, terminal session list",
        "Inline git diffs (unified and side-by-side)",
        "File editing with CodeMirror highlighting and Prettier formatting",
        "Session persistence across launches",
        "Keyboard-first — every major action has a shortcut"
      ],
      rationale: "Rust + Tauri for sub-2s cold start and a small binary. React only where layout genuinely requires it (split panes, drag-resize, sidebar collapse). No LSP, no plugin marketplace, no debugger — explicitly out of scope per the PRD."
    },

    execution: {
      roadmap: [
        { label: "PRD", description: "20-section PRD covering layout, terminal, git, editor, persistence, performance targets" },
        { label: "Initial commit", description: "Tauri 2 + React 19 scaffold with all 7 panes wired (App, Sidebar, FileTree, Terminal, GitViewer, Diff, Editor)" },
        { label: "5 fix passes", description: "File explorer → CWD reset → GitViewer → shortcuts + git.rs → backspace keystroke" }
      ],
      challenges: [
        "File explorer: PTY and sidebar state required rewiring so the tree and terminals stayed in sync (`7097843`).",
        "CWD reset bug: shell working directory failed to restore on session switch, breaking per-session isolation (`de63eac`).",
        "GitViewer stability: two passes required to render diffs reliably across staged / unstaged / untracked states (`d10a0a4`, `53678a0`).",
        "Keyboard shortcut layer and dedicated `git.rs` module landed in the same commit to keep surface area small (`53678a0`).",
        "Backspace keystrokes reached the shell in dev but not in the built binary — keymap registration was happening too late (`be3d4d1`)."
      ]
    },

    outcome: {
      quantifiable: [
        "Terminal, editor, and git state visible at a glance — no menu navigation",
        "Single binary replaces a two-tool setup (Warp + VSCode) for daily sessions",
        "Dogfooded from the first commit: every feature entered daily use the day it shipped"
      ],
      qualitative: [
        "Feels native, not browser-like",
        "No features shipped that require ignoring or disabling",
        "Daily-driver capable for terminal-centric workflows"
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
    techStack: ["Rust", "Tauri 2", "React 19", "TypeScript", "Ghostty", "CodeMirror", "@pierre/diffs", "Vite", "git2-rs"],
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
      frameworks: ["RAG (Retrieval Augmented Generation) for document grounding", "Supabase for auth, storage, and persistence", "Radix UI for a component-driven frontend"],
      collaboration: "Direct feedback loop with beta testers driving rapid feature iteration."
    },
    
    solution: {
      description: "A web platform where users upload source material and receive a tailored study dashboard — document processor, chart generator, and an interactive quiz engine.",
      features: ["Multi-format Upload (PDF, DOCX, MP3)", "AI Summary & Chat", "Auto-generated Vega-Lite Charts", "Flashcard Mode", "Quiz Mode"],
      rationale: "Supabase + React + Gemini enabled rapid prototyping while providing enterprise-grade auth and database behavior out of the box."
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
      nextSteps: ["Mobile app development", "Collaborative study groups", "Integration with Canvas/LMS"]
    },

    icon: BrainCircuitIcon,
    gradient: "from-tech to-bg-accent",
    tags: ["AI/ML", "EdTech", "Full Stack"],
    techStack: ["Next.js", "Supabase", "Gemini 1.5", "Vercel AI SDK", "Vega-Lite", "Radix UI", "TypeScript", "Tailwind v4"],
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
    subtitle: "Context-aware browser extension that rewrites a master resume to match any job description.",
    company: "Consumer Tool",
    role: "Software Developer & Technical PM",
    timeline: "4 Weeks",
    team: "Solo",
    status: "Live in Store",
    
    context: "The modern job market expects a tailored resume for every application to clear ATS filters. Producing those variations manually is slow, repetitive, and easy to do badly.",
    
    problem: {
      statement: "Job seekers spend hours rewriting a resume for each application, guessing at the keywords individual ATS systems prioritize.",
      importance: "Resume tailoring is the highest-leverage step in the application pipeline — the difference between a generic submission and a targeted one directly affects screening outcomes.",
      constraints: ["Must operate on any job board (LinkedIn, Indeed, etc.)", "Privacy-first: all data stays local to the browser"]
    },
    
    goals: {
      objectives: ["Reduce resume tailoring from 30 minutes to 30 seconds.", "Generate high-quality, ATS-friendly content.", "Integrate seamlessly into the browsing workflow."],
      kpis: ["Active Users", "Resumes Generated", "Time Saved per Application"]
    },
    
    research: {
      methods: ["Analysis of ATS (Applicant Tracking Systems) parsing behavior.", "Interviews and feedback loops with active job seekers."],
      insights: ["Formatting matters as much as keywords in ATS screening.", "Users are reluctant to store personal employment data in cloud services."]
    },
    
    approach: {
      strategy: "In-context augmentation: the tool operates directly on the job page, reading the DOM to understand requirements and generating the tailored PDF locally — no copy-pasting, no data leaving the device.",
      frameworks: ["Chrome Extension Manifest V3", "Prompt engineering (Gemini 2.5 Flash)"],
      collaboration: "Open source community feedback on GitHub."
    },
    
    solution: {
      description: "A Chrome extension that reads the active tab's job description, takes the user's master resume, and rewrites it to match the role's keywords and tone.",
      features: ["One-click Page Analysis", "Gemini 2.5 Flash Integration", "PDF Generation (jsPDF)", "Cover Letter Writer", "Local Data Persistence"],
      rationale: "A browser extension was the only form factor that granted seamless access to job board content without copy-pasting — and local processing satisfied the privacy constraint outright."
    },
    
    execution: {
      roadmap: [
        { label: "Week 1", description: "Manifest V3 setup & DOM scraping" },
        { label: "Week 2", description: "AI prompt tuning" },
        { label: "Week 3", description: "PDF generation" },
        { label: "Week 4", description: "Store listing" }
      ],
      challenges: ["Scraping dynamic SPAs (LinkedIn/Indeed) required robust DOM observers.", "In-browser PDF generation needed careful handling of fonts and layout."]
    },
    
    outcome: {
      quantifiable: ["Live on Chrome Web Store", "Generates a tailored resume in under 20 seconds", "Supports all major job boards"],
      qualitative: ["Consistently cited the cover letter feature as unexpected value.", "Strong accuracy in keyword matching reported by users."]
    },
    
    learnings: {
      takeaways: ["Prompt engineering functions as a product feature in its own right.", "Client-side AI is viable and cost-effective at consumer scale."],
      nextSteps: ["Application automation", "Resume score analysis", "History tracking"]
    },

    icon: FileDescriptionIcon,
    gradient: "from-warning to-gold",
    tags: ["GenAI", "Chrome Extension", "Productivity"],
    techStack: ["Chrome MV3", "TypeScript", "Gemini 2.5 Flash", "jsPDF", "DOM Scraping", "Tailwind", "Chrome Storage API"],
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
    timeline: "8 Days (Spike → v0.3.0)",
    team: "Solo",
    status: "Open Source (GitHub)",

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
        "llama.cpp via NDK + CMake (inference runtime)"
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
        { label: "Day 8", description: "v0.3.0: onboarding flow, voice removal, MIT license" }
      ],
      challenges: [
        "Replacing the LLM classifier with BGE embedding routing mid-development required rewriting the core sort pipeline",
        "The JNI bridge between Kotlin and llama.cpp required careful memory management for 384-dim float arrays",
        "Background draft auto-commit demanded ProcessLifecycleObserver + WorkManager coordination to avoid data loss",
        "Disambiguation at cosine margin ≤ 0.03 — too ambiguous to auto-route, too close to ignore"
      ]
    },

    outcome: {
      quantifiable: [
        "20 commits across 8 days (spike → v0.3.0 release)",
        "4 Room tables: folders, notes, drafts, attachments",
        "33MB BGE model bundled in APK assets",
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
