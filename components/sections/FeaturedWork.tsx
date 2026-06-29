import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccentWord } from "@/components/ui/AccentWord";
import Link from "next/link";
import Image from "next/image";
import RightChevron from "@/components/icons/right-chevron";
import BrainCircuitIcon from "@/components/icons/brain-circuit-icon";
import ScanBarcodeIcon from "@/components/icons/scan-barcode-icon";
import FileDescriptionIcon from "@/components/icons/file-description-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";

const projects = [
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
    id: "barcode-lists",
    title: "Barcode Lists",
    company: "Calgary Coop (Internal)",
    role: "PM & Developer",
    description: "Internal Chrome Extension for Calgary Coop. AI-powered barcode extraction with shared access across store personnel.",
    metrics: ["Live in Store", "AI/OCR"],
    tags: ["Chrome Ext", "AI", "Internal Tool"],
    href: "/case-studies/barcode-lists",
    gradient: "from-bg-accent to-divider",
    image: "/BarcodeLists_1.png",
    icon: ScanBarcodeIcon,
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

export function FeaturedWork() {
  return (
      <section id="mission-home-featured" className="py-16 md:py-24 bg-bg-base">
      <div className="container mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div>
            <Badge variant="warning" className="mb-3">
              Selected Case Studies
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-industrial font-bold uppercase tracking-wide md:tracking-widest text-text-primary">
              Featured <AccentWord text="Works" />
            </h2>
          </div>
          <Link href="/work" className="hidden md:block">
            <Button variant="outline" data-icon-hover-trigger>
              View Full Portfolio
              <IconHoverWrapper hoverTrigger="closest">
                <RightChevron size={16} className="ml-2" />
              </IconHoverWrapper>
            </Button>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => {
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
                  {/* Card Image Header */}
                  <div data-cursor-spotlight className={`h-40 w-full bg-gradient-to-br ${project.gradient} relative overflow-hidden flex items-center justify-center`}>
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
                          <Icon size={48} color="rgba(255,255,255,0.2)" />
                        </IconHoverWrapper>
                      </>
                    )}
                    <Badge variant="outline" className="absolute top-3 right-3 bg-black/50 backdrop-blur text-white border-white/20 text-xs z-10">
                      {project.company}
                    </Badge>
                  </div>

                  {/* Card Header */}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg md:text-xl group-hover:text-cta transition-colors">
                      {project.title}
                    </CardTitle>
                    <div className="text-xs font-mono text-text-secondary uppercase tracking-wide mt-1">
                      {project.role}
                    </div>
                  </CardHeader>

                  {/* Card Content */}
                  <CardContent className="flex-grow space-y-4">
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-2">
                      {project.metrics.map((metric) => (
                        <div key={metric} className="bg-bg-accent/10 border border-bg-dark/20 p-2 text-center rounded-sm">
                          <div className="text-gold font-bold font-industrial text-[10px] whitespace-nowrap">{metric}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Card Footer */}
                  <CardFooter className="mt-auto pt-4 border-t border-divider/50">
                    <div className="w-full inline-flex items-center justify-center text-sm group-hover:bg-cta group-hover:text-white transition-all uppercase tracking-widest font-industrial border-2 border-transparent h-10 px-4 py-2 rounded-sm">
                      View Details
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
        
        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/work">
            <Button variant="outline" className="w-full" data-icon-hover-trigger>
              View Full Portfolio
              <IconHoverWrapper hoverTrigger="closest">
                <RightChevron size={16} className="ml-2" />
              </IconHoverWrapper>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
