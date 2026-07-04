import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TravelBag from "@/components/icons/travel-bag";
import ScanBarcodeIcon from "@/components/icons/scan-barcode-icon";
import FileDescriptionIcon from "@/components/icons/file-description-icon";
import GamepadIcon from "@/components/icons/gamepad-icon";
import RadioIcon from "@/components/icons/radio-icon";
import SparklesIcon from "@/components/icons/sparkles-icon";
import YoutubeIcon from "@/components/icons/youtube-icon";
import CodeIcon from "@/components/icons/code-icon";
import SendIcon from "@/components/icons/send-icon";
import PlayIcon from "@/components/icons/play-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import { AccentWord } from "@/components/ui/AccentWord";
import { FlagshipFolders } from "@/components/sections/FlagshipFolders";

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
        <FlagshipFolders />
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
