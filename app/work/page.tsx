import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import RightChevron from "@/components/icons/right-chevron";
import BrainCircuitIcon from "@/components/icons/brain-circuit-icon";
import ScanBarcodeIcon from "@/components/icons/scan-barcode-icon";
import TravelBag from "@/components/icons/travel-bag";
import FileDescriptionIcon from "@/components/icons/file-description-icon";
import GamepadIcon from "@/components/icons/gamepad-icon";
import RadioIcon from "@/components/icons/radio-icon";
import SparklesIcon from "@/components/icons/sparkles-icon";
import YoutubeIcon from "@/components/icons/youtube-icon";
import CodeIcon from "@/components/icons/code-icon";
import TerminalIcon from "@/components/icons/terminal-icon";
import SendIcon from "@/components/icons/send-icon";
import PlayIcon from "@/components/icons/play-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import { AccentWord } from "@/components/ui/AccentWord";

const flagshipProjects = [
  {
    id: "satbrain",
    title: "SatBrain",
    company: "AI Study Platform",
    role: "Software Developer & Product Manager",
    description: "Led product strategy for a data-centric decision-support platform. Synthesized quantitative data into actionable insights for users.",
    metrics: ["+30% Adoption", "Data-Driven"],
    tags: ["AI/ML", "Product Strategy", "Dashboard"],
    href: "/case-studies/satbrain",
    gradient: "from-tech to-bg-accent",
    image: "/Satbrain_Home.png",
    icon: BrainCircuitIcon,
  },
  {
    id: "tux",
    title: "Tux",
    company: "Developer Tooling (Personal)",
    role: "Solo Developer & Designer",
    description: "Barebones terminal IDE with split panes, session sidebar, and git-aware workflow. Built because Warp and VSCode buried the features I actually needed.",
    metrics: ["Rust + Tauri", "Open Source"],
    tags: ["Rust", "Tauri", "IDE", "Terminal"],
    href: "/case-studies/tux",
    gradient: "from-slate-900 to-bg-dark",
    image: "/Tux_UI.png",
    icon: TerminalIcon,
  },
  {
    id: "pocket-resume",
    title: "Pocket Resume",
    company: "Consumer Tool",
    role: "Software Developer & Technical PM",
    description: "AI-powered tool that tailors resumes to job descriptions. Demonstrates rapid prototyping and LLM integration skills.",
    metrics: ["AI Engineering", "Prototype"],
    tags: ["GenAI", "Technical PM", "React"],
    href: "/case-studies/pocket-resume",
    gradient: "from-warning to-gold",
    image: "/PocketResume_UI.png",
    icon: FileDescriptionIcon,
  },
];

const technicalProjects = [
  {
    id: "barcode-lists",
    title: "Barcode-Lists",
    role: "Developer",
    description: "Chrome extension for saving and reusing barcodes across scans. Lightweight, keyboard-first, built for inventory workflows.",
    tags: ["Chrome Extension", "JavaScript", "Productivity"],
    href: "https://github.com/Isaac-1555/Barcode-Lists",
    icon: ScanBarcodeIcon,
  },
  {
    id: "phone-barcode",
    title: "Phone-Barcode-scanner",
    role: "Developer",
    description: "Mobile companion app that scans barcodes and pushes them straight to the Barcode-Lists extension.",
    tags: ["TypeScript", "Mobile", "Barcode"],
    href: "https://github.com/Isaac-1555/Phone-Barcode-scanner",
    icon: ScanBarcodeIcon,
  },
  {
    id: "ez-resume",
    title: "Ez-Resume",
    role: "Developer",
    description: "No-AI resume builder that generates clean, structured resumes in under a minute. Speed over smarts.",
    tags: ["Chrome Extension", "JavaScript", "Resume"],
    href: "https://github.com/Isaac-1555/Ez-Resume",
    icon: FileDescriptionIcon,
  },
  {
    id: "summarease",
    title: "Summarease",
    role: "Developer",
    description: "Turns long audio and conversations into the format you want — summaries, action items, transcripts.",
    tags: ["JavaScript", "Audio", "AI"],
    href: "https://github.com/Isaac-1555/summarease_v1",
    icon: RadioIcon,
  },
  {
    id: "anickie",
    title: "Anickie",
    role: "Developer",
    description: "Rust app for anime lovers that fetches and plays episodes. Fast, native, no browser.",
    tags: ["Rust", "Anime", "Streaming"],
    href: "https://github.com/Isaac-1555/Anickie",
    icon: PlayIcon,
  },
  {
    id: "coachgg",
    title: "CoachGG",
    role: "Full-Stack Dev",
    description: "Platform helping amateur esports players level up — coaching, team management, and analytics in one place.",
    tags: ["Esports", "JavaScript", "Platform"],
    href: "https://github.com/Isaac-1555/coachgg",
    icon: GamepadIcon,
  },
  {
    id: "betteryt",
    title: "BetterYT",
    role: "Developer",
    description: "Chrome extension that fixes YouTube recommendations with custom category chips and curated feeds.",
    tags: ["Chrome Extension", "JavaScript", "AI"],
    href: "https://github.com/Isaac-1555/BetterYT",
    icon: YoutubeIcon,
  },
  {
    id: "d4c",
    title: "D4C",
    role: "Developer",
    description: "Personalized coding agent forked from pi, tuned for my own workflow and preferences.",
    tags: ["TypeScript", "AI", "Coding Agent"],
    href: "https://github.com/Isaac-1555/D4C",
    icon: CodeIcon,
  },
  {
    id: "pigeon",
    title: "Pigeon",
    role: "Developer",
    description: "Notification system for small businesses — keeps customers in the loop on job status automatically.",
    tags: ["TypeScript", "B2B", "Notifications"],
    href: "https://github.com/Isaac-1555/Pigeon",
    icon: SendIcon,
  },
];

export default function WorkPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div id="mission-work-header" className="mb-16">
        <h1 className="text-4xl md:text-6xl font-industrial font-bold uppercase tracking-widest text-text-primary mb-4">
          Selected <AccentWord text="Works" />
        </h1>
        <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">
          A collection of product initiatives, from enterprise workflow transformations to AI-powered prototypes.
        </p>
      </div>

      {/* Flagship Section */}
      <section id="mission-work-flagship" className="mb-24">
        <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 flex items-center gap-2">
          <TravelBag size={20} className="text-cta" /> Flagship Case Studies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flagshipProjects.map((project) => {
            const Icon = project.icon;
            return (
              <Link
                key={project.id}
                href={project.href}
                className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta rounded-sm"
              >
                <Card
                  data-icon-hover-trigger
                  className="h-full flex flex-col hover:border-cta transition-colors"
                >
                  <div data-cursor-spotlight className={`h-48 w-full bg-gradient-to-br ${project.gradient} relative overflow-hidden flex items-center justify-center`}>
                    {project.image ? (
                      <>
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <IconHoverWrapper
                          hoverTrigger="closest"
                          className="transition-transform group-hover:scale-110 [&_svg]:transition-colors group-hover:[&_svg]:text-white/40"
                        >
                          <Icon size={64} color="rgba(255,255,255,0.2)" />
                        </IconHoverWrapper>
                      </>
                    )}
                    <Badge variant="outline" className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white border-white/20 z-10">
                      {project.company}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="group-hover:text-cta transition-colors text-xl">
                      {project.title}
                    </CardTitle>
                    <div className="text-xs font-mono text-text-secondary uppercase tracking-widest mt-1">
                      {project.role}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow space-y-6">
                    <p className="text-text-secondary leading-relaxed text-sm">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {project.metrics.map((metric) => (
                        <div key={metric} className="bg-bg-accent/10 border border-bg-dark/20 p-2 text-center rounded-sm">
                          <div className="text-gold font-bold font-industrial text-[10px] whitespace-nowrap">{metric}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="mt-auto pt-6 border-t border-divider/50">
                    <div className="w-full inline-flex items-center justify-center group-hover:bg-cta group-hover:text-white transition-all uppercase tracking-widest font-industrial border-2 border-transparent h-10 px-4 py-2 rounded-sm">
                      View Project
                      <IconHoverWrapper hoverTrigger="closest">
                        <RightChevron size={16} className="ml-2" />
                      </IconHoverWrapper>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Technical Projects Section */}
      <section id="mission-work-technical">
        <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 flex items-center gap-2">
          <SparklesIcon size={20} className="text-cta" /> Technical Prototypes & Labs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicalProjects.map((project) => {
            const Icon = project.icon;
            return (
              <a key={project.id} href={project.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                <Card
                  data-icon-hover-trigger
                  className="group h-full flex flex-col hover:border-cta transition-colors bg-bg-accent/5"
                >
                  <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg group-hover:text-cta transition-colors">
                        {project.title}
                      </CardTitle>
                      <div className="text-xs font-mono text-text-secondary uppercase tracking-widest mt-1">
                        {project.role}
                      </div>
                    </div>
                    <IconHoverWrapper hoverTrigger="closest">
                      <Icon size={24} className="text-text-secondary transition-colors group-hover:text-cta" />
                    </IconHoverWrapper>
                  </CardHeader>
                  
                  <CardContent className="flex-grow pt-2">
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px] border-divider text-text-secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
