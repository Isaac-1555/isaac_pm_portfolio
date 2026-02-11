import { Brain, Utensils, Bot, LucideIcon } from "lucide-react";

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
    roadmap: string;
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
  icon: LucideIcon;
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
      roadmap: "Phase 1: Doc upload & Summary. Phase 2: Quiz & Flashcards. Phase 3: Visual Charts & Audio.",
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

    icon: Brain,
    gradient: "from-blue-900 to-indigo-900",
    tags: ["AI/ML", "EdTech", "Full Stack"],
    websiteUrl: "https://satbrain.vercel.app/",
    repoUrl: "https://github.com/Isaac-1555/project_goldmine",
    screenshots: [
      "/placeholder-satbrain-1.png",
      "/placeholder-satbrain-2.png",
      "/placeholder-satbrain-3.png"
    ]
  },
  {
    id: "restostar",
    title: "Restostar",
    subtitle: "Turning restaurant feedback into 5-star reviews while managing critical issues privately.",
    company: "SaaS Product",
    role: "Product Manager & Systems Architect",
    timeline: "2 Months",
    team: "Solo Dev",
    status: "MVP Launch",
    
    context: "New restaurant owners often fail because one bad public review can tank their reputation. Restostar provides a buffer, funnelling happy guests to Google/TripAdvisor and unhappy ones to a private resolution channel.",
    
    problem: {
      statement: "Restaurants have no control over whether a guest complains privately or publicly. Public complaints cause permanent brand damage.",
      importance: "A half-star increase in rating can lead to a 19% increase in bookings during peak hours.",
      constraints: ["Must be extremely simple for non-tech savvy guests (QR code only).", "Mobile-first experience is non-negotiable."]
    },
    
    goals: {
      objectives: ["Increase the volume of positive public reviews.", "Decrease the ratio of negative public reviews.", "Provide owners with actionable operational data."],
      kpis: ["Conversion rate (Scan to Review)", "NPS Score", "Private vs Public feedback ratio"]
    },
    
    research: {
      methods: ["Market analysis of reputation management tools (often too expensive for small biz).", "Interviews with 5 local restaurant owners."],
      insights: ["Owners are busy; they need 'set and forget' tools.", "Guests are willing to leave feedback if it takes less than 30 seconds."]
    },
    
    approach: {
      strategy: "The 'Feedback Funnel': A binary psychological choice (Good vs Bad) that routes the user flow accordingly.",
      frameworks: ["Hook Model (Trigger -> Action -> Reward)", "Mobile-First Design"],
      collaboration: "Iterated on the UI with a local café partner."
    },
    
    solution: {
      description: "A web-based QR landing page system. 'Good' experience? One-tap link to Google Maps review. 'Bad' experience? A simple form that emails the owner immediately.",
      features: ["Smart Routing Algorithm", "Instant Owner Alerts", "Review Template Generation", "Feedback Analytics Dashboard"],
      rationale: "Web-based (no app download) reduces friction to near zero, essential for casual dining contexts."
    },
    
    execution: {
      roadmap: "Week 1-2: Core Routing Logic. Week 3-4: Dashboard & Analytics. Week 5-6: Beta Test.",
      challenges: ["Email deliverability for alerts (Solved with transactional email service).", "preventing spam submissions (Added rate limiting)."]
    },
    
    outcome: {
      quantifiable: ["MVP deployed to local pilot location", "Captured 15+ critical feedback items privately in first month", "Zero negative public reviews during pilot"],
      qualitative: ["Owner reported feeling 'more in control' of their reputation.", "Staff used feedback to correct service issues same-day."]
    },
    
    learnings: {
      takeaways: ["Speed is everything in feedback.", "Negative feedback is actually valuable data if captured privately."],
      nextSteps: ["Multi-location support for chains", "SMS follow-ups", "POS integration"]
    },

    icon: Utensils,
    gradient: "from-emerald-900 to-teal-900",
    tags: ["SaaS", "B2B", "Reputation Mgmt"],
    websiteUrl: "https://restostar.vercel.app/",
    repoUrl: "https://github.com/Isaac-1555/Restostar",
    screenshots: [
      "/placeholder-restostar-1.png",
      "/placeholder-restostar-2.png"
    ]
  },
  {
    id: "pocket-resume",
    title: "Pocket Resume",
    subtitle: "Context-aware AI browser extension for tailoring resumes to any job description.",
    company: "Consumer Tool",
    role: "Technical Product Manager",
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
      roadmap: "Week 1: Manifest V3 setup & DOM scraping. Week 2: AI Prompt Tuning. Week 3: PDF Generation. Week 4: Store listing.",
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

    icon: Bot,
    gradient: "from-orange-900 to-red-900",
    tags: ["GenAI", "Chrome Ext", "Productivity"],
    websiteUrl: "https://chromewebstore.google.com/detail/pocketresume/mdplmgfkpgalajmchilemiamifoaneip?hl=en-US&utm_source=ext_sidebar",
    repoUrl: "https://github.com/Isaac-1555/pocket-resume",
    screenshots: [
      "/placeholder-pocketresume-1.png",
      "/placeholder-pocketresume-2.png"
    ]
  }
];
