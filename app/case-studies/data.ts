import React from "react";
import BrainCircuitIcon from "@/components/icons/brain-circuit-icon";
import FileDescriptionIcon from "@/components/icons/file-description-icon";
import TerminalIcon from "@/components/icons/terminal-icon";
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
  screenshots: string[]; // URLs
  imageWidth: number;
  imageHeight: number;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "tux",
    title: "Tux",
    subtitle: "Barebones terminal IDE with split panes, session sidebar, and git-aware workflow — built because Warp and VSCode buried the features I needed.",
    company: "Developer Tooling (Personal)",
    role: "Solo Developer & Designer",
    timeline: "1 Day (Initial + 5 Fixes)",
    team: "Solo",
    status: "Open Source (GitHub)",

    context: "I live in the terminal. Warp and VSCode promised the workflow I wanted — split panes, a file explorer, a git tree, session monitoring — but every one of those features was either missing, behind a flag, or three menus deep. I wanted a tool that only had what I needed, in the order I needed it, with a native feel and a small footprint. So I built it.",

    problem: {
      statement: "Modern IDEs and terminals overload on features I don't use, while burying the features I do. Every menu click is a context switch. Every buried feature is friction that compounds over a workday.",
      importance: "The features that actually matter for my workflow are layout, git visibility, file state, and fast terminal access. If a tool can't surface those in under a second, it's slowing me down — even if it has the feature somewhere.",
      constraints: ["Must launch fast — sub-2s cold start target", "Only the features I actually use, nothing else", "Native feel, not a web wrapper in disguise", "Small package size, not a multi-hundred-megabyte bundle"]
    },

    goals: {
      objectives: [
        "Split panes (vertical and horizontal)",
        "Right-side terminal",
        "Left sidebar: file explorer, git tree, terminal sessions",
        "Inline git diffs",
        "Read, write, and edit files with Prettier syntax highlighting",
        "Rust + Tauri for speed and smaller package size"
      ],
      kpis: ["Time from launch to first command", "Package / binary size", "Number of features kept (intentionally small)"]
    },

    research: {
      methods: [
        "Daily driver: Warp + VSCode side-by-side for two weeks before writing any code",
        "PRD written before code (`PRD.md` checked into the repo)",
        "Constraint: every feature must earn its place or get cut"
      ],
      insights: [
        "Most IDE features are inert for me — extensions marketplace, debugger, plugin system, integrated package manager.",
        "The features that actually matter are layout, git state, and file state. Those three cover ~90% of my day.",
        "Tauri gives a native UX with webview flexibility, without the 200MB Electron tax."
      ]
    },

    approach: {
      strategy: "PRD-first, then a single-day scaffold followed by 5 fix commits. Rust backend handles PTY, git ops, and the editor engine. React frontend handles the layout because that's where webview pays off.",
      frameworks: ["Tauri 2", "ghostty-web (terminal rendering)", "CodeMirror (editor)", "@pierre/diffs (diff viewer)", "git2-rs (git operations)"],
      collaboration: "Solo. Daily-driver dogfooding from commit 1 — every feature had to be used the same day it was built."
    },

    solution: {
      description: "A three-pane desktop app. Sessions and the file tree live on the left. The terminal plus editor/diff sit in the middle. Git state lives on the right. Ghostty powers the terminal, CodeMirror powers the editor with Prettier for JS/TS/JSON/HTML/CSS/MD, and @pierre/diffs renders the diff pane. Session state persists across launches.",
      features: [
        "Split panes (vertical and horizontal, resizable)",
        "Right-side terminal powered by Ghostty",
        "Left sidebar: file explorer, git tree, terminal session list",
        "Inline git diffs (unified and side-by-side)",
        "Read / write / edit files with Prettier syntax highlighting",
        "Session persistence across launches",
        "Keyboard-first — every major action has a shortcut"
      ],
      rationale: "Rust + Tauri for sub-2s cold start and a small binary. React only where layout actually needs it (split panes, drag-resize, sidebar collapse). No LSP, no plugin marketplace, no debugger — explicitly out of scope per the PRD."
    },

    execution: {
      roadmap: [
        { label: "PRD", description: "20-section PRD covering layout, terminal, git, editor, persistence, performance targets" },
        { label: "Initial commit", description: "Tauri 2 + React 19 scaffold with all 7 panes wired (App, Sidebar, FileTree, Terminal, GitViewer, Diff, Editor)" },
        { label: "5 fix passes", description: "File explorer → CWD reset → GitViewer → shortcuts + git.rs → backspace keystroke" }
      ],
      challenges: [
        "File explorer: PTY and sidebar state had to be rewired so the tree and the terminals stayed in sync (`7097843`).",
        "CWD reset bug: shell working directory wasn't restoring on session switch, breaking per-session isolation (`de63eac`).",
        "GitViewer stability: two passes to get diffs rendering reliably across staged / unstaged / untracked states (`d10a0a4`, `53678a0`).",
        "Keyboard shortcut layer + dedicated `git.rs` module landed in the same commit to keep the surface area small (`53678a0`).",
        "Backspace keystroke wasn't reaching the shell in the built binary, only in dev. Keymap registration was happening too late (`be3d4d1`)."
      ]
    },

    outcome: {
      quantifiable: [
        "6 commits, 1 day from PRD to working binary",
        "All 5 PRD core features shipped (sessions, terminal, file tree, git, editor, diff, persistence)",
        "Open source on GitHub — full Rust + TS source available"
      ],
      qualitative: [
        "Feels native, not browser-y",
        "No feature I have to ignore or disable",
        "Daily-driver capable for terminal-centric workflows"
      ]
    },

    learnings: {
      takeaways: [
        "Build the tool that fits how you actually work — not how a feature list says it should.",
        "A PRD prevents scope creep better than any framework. It also makes the 'what we cut' conversation easy.",
        "Fix commits tell you where the real work was. The initial scaffold is the easy part."
      ],
      nextSteps: [
        "LSP for syntax-only lint hints (no autocomplete — out of scope by design)",
        "Hunk staging directly in the diff viewer",
        "Fuzzy file search (Cmd+P)",
        "Workspace JSON snapshots for cross-machine restore",
        "UI improvements tailored for terminal-based coding agents (Claude Code, Codex, Aider) — clearer diffs, in-place prompts, agent run state",
        "Better shortcut detection — context-aware keybindings that don't fight with the shell or the agent"
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
    imageHeight: 1800
  },
  {
    id: "satbrain",
    title: "SatBrain",
    subtitle: "AI-Powered Study Assistant transforming documents into interactive learning materials.",
    company: "EdTech Product",
    role: "Product Manager & Lead Developer",
    timeline: "3 Months (MVP)",
    team: "Solo Founder",
    status: "Live Beta",
    
    context: "Students and professionals struggle to digest large volumes of information quickly. SatBrain was conceived to leverage GenAI to automatically transform static documents (PDFs, Audio) into active study aids like quizzes, flashcards, and visual charts.",
    
    problem: {
      statement: "Learners spend 60% of their time organizing and summarizing notes rather than actually studying, leading to inefficient retention.",
      importance: "Reducing the 'time-to-study' enables users to focus on comprehension and recall, significantly improving learning outcomes.",
      constraints: ["Zero-budget for infrastructure", "Need for high-accuracy summaries (low hallucination)", "Real-time processing latency"]
    },
    
    goals: {
      objectives: ["Automate the creation of study materials from raw files.", "Provide visual insights (charts) from text data.", "Ensure sub-5-second response time for AI interactions."],
      kpis: ["User retention rate", "Documents processed per user", "Quiz completion rates"]
    },
    
    research: {
      methods: ["Competitor analysis of Quizlet and Chegg", "User interviews with university students", "Prototype testing with local study groups"],
      insights: ["Students value 'visuals' (charts) almost as much as text summaries.", "Flashcards are the #1 requested feature for retention.", "Audio transcription is a key differentiator for lecture recordings."]
    },
    
    approach: {
      strategy: "Vertical integration of AI services: Use Gemini 1.5 for its large context window to handle entire textbooks in one pass.",
      frameworks: ["RAG (Retrieval Augmented Generation)", "Component-Driven Design (Radix UI)"],
      collaboration: "Direct feedback loop with beta testers for rapid feature iteration."
    },
    
    solution: {
      description: "A comprehensive web platform where users upload content and receive a tailored study dashboard. It includes a document processor, chart generator, and an interactive quiz engine.",
      features: ["Multi-format Upload (PDF, DOCX, MP3)", "AI Summary & Chat", "Auto-generated Vega-Lite Charts", "Flashcard Mode", "Quiz Mode"],
      rationale: "Chosen Tech Stack (Supabase + React + Gemini) allowed for rapid prototyping with enterprise-grade auth and database features out of the box."
    },
    
    execution: {
      roadmap: [
        { label: "Phase 1", description: "Doc upload & Summary" },
        { label: "Phase 2", description: "Quiz & Flashcards" },
        { label: "Phase 3", description: "Visual Charts & Audio" }
      ],
      challenges: ["Handling large PDF files (chunking strategy).", "Ensuring consistent JSON output from LLM for charts (implemented robust validation middleware)."]
    },
    
    outcome: {
      quantifiable: ["Processed 500+ documents in beta", "Reduced study prep time by ~70%", "90% positive feedback on 'Visual Charts' feature"],
      qualitative: ["Users reported 'feeling more prepared' for exams.", "Praised the clean, distraction-free UI."]
    },
    
    learnings: {
      takeaways: ["GenAI is powerful but requires strict guardrails for structured data.", "Visuals stickier than text."],
      nextSteps: ["Mobile app development", "Collaborative study groups", "Integration with Canvas/LMS"]
    },

    icon: BrainCircuitIcon,
    gradient: "from-tech to-bg-accent",
    tags: ["AI/ML", "EdTech", "Full Stack"],
    techStack: ["Next.js", "Supabase", "Vega-Lite", "Tailwind v4", "TypeScript", "Radix UI", "Vercel AI SDK"],
    websiteUrl: "https://satbrain.vercel.app/",
    repoUrl: "https://github.com/Isaac-1555/project_goldmine",
    screenshots: [
      "/Satbrain_Home.png",
      "/Satbrain_Mapview.png"
    ],
    imageWidth: 1919,
    imageHeight: 916
  },
  {
    id: "pocket-resume",
    title: "Pocket Resume",
    subtitle: "Context-aware AI browser extension for tailoring resumes to any job description.",
    company: "Consumer Tool",
    role: "Software Developer & Technical PM",
    timeline: "4 Weeks",
    team: "Solo",
    status: "Live in Store",
    
    context: "The modern job market requires tailoring resumes for every single application to pass ATS filters. Doing this manually is slow and tedious.",
    
    problem: {
      statement: "Job seekers spend hours rewriting resumes for each application, often guessing at keywords.",
      importance: "Tailored resumes have a 2x higher interview callback rate.",
      constraints: ["Must work on any job board (LinkedIn, Indeed, etc.)", "Privacy-first (local data storage)."]
    },
    
    goals: {
      objectives: ["Reduce resume tailoring time from 30 mins to 30 seconds.", "Generate high-quality, ATS-friendly content.", "Seamless browser integration."],
      kpis: ["Active Users", "Resumes Generated", "Time Saved per Application"]
    },
    
    research: {
      methods: ["Analysis of ATS (Applicant Tracking Systems) logic.", "Survey of 50 job seekers about pain points."],
      insights: ["Formatting matters as much as keywords.", "Users rarely trust 'cloud' storage with their personal data."]
    },
    
    approach: {
      strategy: "In-context augmentation: The tool lives *on* the job page, reading the DOM to understand requirements and generating the PDF locally.",
      frameworks: ["Chrome Extension Manifest V3", "Prompt Engineering (Gemini)"],
      collaboration: "Open source community feedback on GitHub."
    },
    
    solution: {
      description: "A Chrome Extension that reads the active tab's job description, takes your 'Master Resume', and rewrites it to match the role's keywords and tone.",
      features: ["One-click Page Analysis", "Gemini 2.5 Flash Integration", "PDF Generation (jsPDF)", "Cover Letter Writer", "Local Data Persistence"],
      rationale: "Browser extension was the only form factor that allowed seamless access to job board content without copy-pasting."
    },
    
    execution: {
      roadmap: [
        { label: "Week 1", description: "Manifest V3 setup & DOM scraping" },
        { label: "Week 2", description: "AI Prompt Tuning" },
        { label: "Week 3", description: "PDF Generation" },
        { label: "Week 4", description: "Store listing" }
      ],
      challenges: ["Scraping dynamic SPAs (LinkedIn/Indeed) required robust DOM observers.", "PDF generation in-browser is tricky (fonts/layout)."]
    },
    
    outcome: {
      quantifiable: ["Live on Chrome Web Store", "Generates resume in <20 seconds", "Supports all major job boards"],
      qualitative: ["Users love the 'Cover Letter' bonus feature.", "High accuracy in keyword matching."]
    },
    
    learnings: {
      takeaways: ["Prompt engineering is a product feature.", "Client-side AI is viable and cheap."],
      nextSteps: ["Add 'Apply' automation", "Resume score analysis", "History tracking"]
    },

    icon: FileDescriptionIcon,
    gradient: "from-warning to-gold",
    tags: ["GenAI", "Chrome Ext", "Productivity"],
    techStack: ["Chrome MV3", "TypeScript", "AI API", "jsPDF", "DOM Scraping", "Tailwind", "Chrome Storage API"],
    websiteUrl: "https://chromewebstore.google.com/detail/pocketresume/mdplmgfkpgalajmchilemiamifoaneip?hl=en-US&utm_source=ext_sidebar",
    repoUrl: "https://github.com/Isaac-1555/pocket-resume",
    screenshots: [
      "/PocketResume_UI.png",
      "/PocketResume_Settings.png"
    ],
    imageWidth: 2880,
    imageHeight: 1576
  }
];
