import React from "react";
import BrainCircuitIcon from "@/components/icons/brain-circuit-icon";
import FileDescriptionIcon from "@/components/icons/file-description-icon";
import ScanBarcodeIcon from "@/components/icons/scan-barcode-icon";
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
  websiteUrl: string;
  repoUrl: string;
  screenshots: string[]; // URLs
}

export const caseStudies: CaseStudy[] = [
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
    gradient: "from-blue-900 to-indigo-900",
    tags: ["AI/ML", "EdTech", "Full Stack"],
    websiteUrl: "https://satbrain.vercel.app/",
    repoUrl: "https://github.com/Isaac-1555/project_goldmine",
    screenshots: [
      "/Satbrain_Home.png",
      "/Satbrain_Mapview.png"
    ]
  },
  {
    id: "barcode-lists",
    title: "Barcode Lists",
    subtitle: "Internal Chrome Extension for Calgary Coop that streamlines barcode management with shared access and AI-powered extraction.",
    company: "Calgary Coop (Internal Tool)",
    role: "Product Manager & Developer",
    timeline: "2 Weeks",
    team: "Solo Dev",
    status: "Live in Chrome Web Store",
    
    context: "Calgary Coop store personnel scan barcodes every Monday as part of inventory operations. Previously, these barcodes were tracked manually or lost between shifts, causing repeated work and data inconsistency across staff members. Barcode Lists was built as an internal Chrome Extension to centralize barcode storage, enable shared access across all store personnel, and use AI to handle complex image and spreadsheet extraction.",
    
    problem: {
      statement: "Store personnel had no centralized system to save and reuse scanned barcodes. Data was siloed per individual, leading to duplicate scans, lost records, and wasted operational time.",
      importance: "Accurate barcode tracking is critical for inventory management at scale. Errors cascade into stock discrepancies, ordering issues, and wasted labor hours across multiple store locations.",
      constraints: ["Must work within Chrome browser (no native app install).", "Shared data access requires authentication to protect store data.", "Must handle noisy inputs: invoice numbers, extra spaces, and complex image formats."]
    },
    
    goals: {
      objectives: ["Provide a shared, persistent barcode storage system accessible by all authorized personnel.", "Automate barcode extraction from images and spreadsheets using AI/OCR.", "Eliminate manual cleanup by intelligently filtering invoice numbers and whitespace."],
      kpis: ["Time saved per scanning session", "Data accuracy (clean barcodes vs raw input)", "User adoption across store personnel"]
    },
    
    research: {
      methods: ["On-site observation of Monday scanning workflows at Calgary Coop.", "Interviews with store personnel about pain points in barcode tracking.", "Analysis of existing barcode data formats (images, spreadsheets, handwritten lists)."],
      insights: ["Personnel often re-scan barcodes that were already captured by a colleague on a different shift.", "Images from scanners often contain invoice numbers mixed with barcodes, causing manual sorting.", "A shared login system was the top-requested feature to enable cross-shift collaboration."]
    },
    
    approach: {
      strategy: "Build a lightweight Chrome Extension with cloud-synced storage and AI-powered OCR to handle the full pipeline: capture, clean, store, and share barcodes.",
      frameworks: ["Chrome Extension Manifest V3", "OCR + AI Image Processing", "Shared State Architecture"],
      collaboration: "Direct feedback loop with Calgary Coop store staff during development and testing."
    },
    
    solution: {
      description: "A Chrome Extension that allows store personnel to save, manage, and share barcode lists. Users log in to access a shared database, so barcodes saved by one person are instantly available to all authorized staff. AI-powered OCR reads complex images and spreadsheets to extract barcode numbers, automatically removing invoice numbers and cleaning whitespace.",
      features: ["Shared Barcode Database with Login Authentication", "AI-Powered Image & Spreadsheet OCR", "Intelligent Barcode Cleaning (removes invoice numbers & spaces)", "Persistent Cloud Storage with Real-Time Sync", "Simple List Management (add, delete, search)"],
      rationale: "Chrome Extension was chosen because all store operations already happen in the browser. No app install friction, and Manifest V3 ensures security and performance."
    },
    
    execution: {
      roadmap: [
        { label: "Week 1", description: "Core extension setup, barcode CRUD, and authentication system" },
        { label: "Week 2", description: "AI/OCR integration for image & spreadsheet extraction, Chrome Web Store deployment" }
      ],
      challenges: ["Extracting clean barcodes from noisy images that mix invoice numbers with actual barcodes (Solved with AI refinement pipeline).", "Ensuring real-time data sync across multiple users logged into the same store account."]
    },
    
    outcome: {
      quantifiable: ["Live on Chrome Web Store (v3.2)", "4 active users across Calgary Coop locations", "Eliminated duplicate scanning across shifts"],
      qualitative: ["Store staff reported significant time savings on Monday scanning workflows.", "AI extraction reduced manual barcode cleanup to near zero."]
    },
    
    learnings: {
      takeaways: ["Internal tools don't need to be complex — they need to be reliable and fit the existing workflow.", "AI-powered data cleaning is a massive force multiplier for operational tools."],
      nextSteps: ["Multi-store rollout across more Calgary Coop locations", "Batch export functionality for inventory systems", "Offline mode for areas with poor connectivity"]
    },

    icon: ScanBarcodeIcon,
    gradient: "from-violet-900 to-purple-900",
    tags: ["Chrome Extension", "AI/OCR", "Internal Tool", "B2B"],
    websiteUrl: "https://chromewebstore.google.com/detail/barcode-lists/colpoghjdbjnmciefnipaefbdflgjifg",
    repoUrl: "https://github.com/Isaac-1555/Barcode-Lists",
    screenshots: [
      "/BarcodeLists_1.png",
      "/BarcodeLists_2.png"
    ]
  },
  {
    id: "pocket-resume",
    title: "Pocket Resume",
    subtitle: "Context-aware AI browser extension for tailoring resumes to any job description.",
    company: "Consumer Tool",
    role: "Software Developer & Technical Product Manager",
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
    gradient: "from-orange-900 to-red-900",
    tags: ["GenAI", "Chrome Ext", "Productivity"],
    websiteUrl: "https://chromewebstore.google.com/detail/pocketresume/mdplmgfkpgalajmchilemiamifoaneip?hl=en-US&utm_source=ext_sidebar",
    repoUrl: "https://github.com/Isaac-1555/pocket-resume",
    screenshots: [
      "/PocketResume_UI.png",
      "/PocketResume_Settings.png"
    ]
  }
];
