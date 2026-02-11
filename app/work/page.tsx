import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Brain, Utensils, Briefcase, Bot, Gamepad2, Map, Mic, Zap, Layout } from "lucide-react";

const flagshipProjects = [
  {
    id: "satbrain",
    title: "SatBrain",
    company: "AI Study Platform",
    role: "Product Manager",
    description: "Led product strategy for a data-centric decision-support platform. Synthesized quantitative data into actionable insights for users.",
    metrics: ["+30% Adoption", "Data-Driven"],
    tags: ["AI/ML", "Product Strategy", "Dashboard"],
    href: "/case-studies/satbrain",
    gradient: "from-blue-900 to-indigo-900",
    image: "/Satbrain_Home.png",
    icon: Brain,
  },
  {
    id: "restostar",
    title: "Restostar",
    company: "SaaS Product",
    role: "PM & Systems Dev",
    description: "Defined 0-1 MVP strategy for restaurant reputation management. Conducted market research to prioritize high-impact features.",
    metrics: ["MVP Launch", "User Research"],
    tags: ["SaaS", "0-1", "MVP Scope"],
    href: "/case-studies/restostar",
    gradient: "from-emerald-900 to-teal-900",
    image: "/Restostar_Dashboard.png",
    icon: Utensils,
  },
  {
    id: "pocket-resume",
    title: "Pocket Resume",
    company: "Consumer Tool",
    role: "Technical PM",
    description: "AI-powered tool that tailors resumes to job descriptions. Demonstrates rapid prototyping and LLM integration skills.",
    metrics: ["AI Engineering", "Prototype"],
    tags: ["GenAI", "Technical PM", "React"],
    href: "/case-studies/pocket-resume",
    gradient: "from-orange-900 to-red-900",
    image: "/PocketResume_UI.png",
    icon: Bot,
  },
];

const technicalProjects = [
  {
    id: "pocket-resume",
    title: "Pocket Resume",
    role: "Technical PM",
    description: "AI-powered tool that tailors resumes to job descriptions. Demonstrates rapid prototyping and LLM integration.",
    tags: ["GenAI", "React", "Prototype"],
    href: "https://github.com/Isaac-1555/pocket-resume",
    icon: Bot,
  },
  {
    id: "coachgg",
    title: "CoachGG",
    role: "Full-Stack Dev",
    description: "Esports coaching platform helping amateur players reach pro level. Team management and analytics features.",
    tags: ["Esports", "Platform", "Community"],
    href: "https://github.com/Isaac-1555/coachgg",
    icon: Gamepad2,
  },
  {
    id: "project-goldmine",
    title: "Project Goldmine",
    role: "Developer",
    description: "Knowledge map generator that summarizes notes and visualizes connections.",
    tags: ["Visualization", "Knowledge Mgmt"],
    href: "https://github.com/Isaac-1555/project_goldmine",
    icon: Map,
  },
  {
    id: "summarease",
    title: "Summarease",
    role: "Developer",
    description: "Audio summarization tool transforming conversations into structured formats.",
    tags: ["Audio Processing", "AI"],
    href: "https://github.com/Isaac-1555/summarease_v1",
    icon: Mic,
  },
  {
    id: "edhelper",
    title: "EDHelper",
    role: "Developer",
    description: "Deck building assistant for Magic: The Gathering Commander players.",
    tags: ["Gaming", "Utility"],
    href: "https://github.com/Isaac-1555/EDHelper",
    icon: Zap,
  },
  {
    id: "mam",
    title: "MAM Landing",
    role: "Freelance",
    description: "Lead generation and landing page development for a client.",
    tags: ["Frontend", "Marketing"],
    href: "https://github.com/Isaac-1555/MAM",
    icon: Layout,
  },
];

export default function WorkPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-industrial font-bold uppercase tracking-widest text-text-primary mb-4">
          Selected <span className="text-cta">Work</span>
        </h1>
        <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">
          A collection of product initiatives, from enterprise workflow transformations to AI-powered prototypes.
        </p>
      </div>

      {/* Flagship Section */}
      <section className="mb-24">
        <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-cta" /> Flagship Case Studies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flagshipProjects.map((project) => {
            const Icon = project.icon;
            return (
              <Card key={project.id} className="group h-full flex flex-col hover:border-cta transition-colors">
                <div className={`h-48 w-full bg-gradient-to-br ${project.gradient} relative overflow-hidden flex items-center justify-center`}>
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
                      <Icon className="h-16 w-16 text-white/20 group-hover:text-white/40 transition-colors transform group-hover:scale-110 duration-500" />
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
                  <Link href={project.href} className="w-full" target={project.href.startsWith("http") ? "_blank" : "_self"}>
                    <Button variant="ghost" className="w-full group-hover:bg-cta group-hover:text-white transition-all">
                      View Project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Technical Projects Section */}
      <section>
        <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-cta" /> Technical Prototypes & Labs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicalProjects.map((project) => {
            const Icon = project.icon;
            return (
              <a key={project.id} href={project.href} target="_blank" rel="noopener noreferrer" className="block h-full">
                <Card className="group h-full flex flex-col hover:border-cta transition-colors bg-bg-accent/5">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg group-hover:text-cta transition-colors">
                        {project.title}
                      </CardTitle>
                      <div className="text-xs font-mono text-text-secondary uppercase tracking-widest mt-1">
                        {project.role}
                      </div>
                    </div>
                    <Icon className="h-6 w-6 text-text-secondary group-hover:text-cta transition-colors" />
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
