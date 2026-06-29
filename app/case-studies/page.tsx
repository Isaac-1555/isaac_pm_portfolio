import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccentWord } from "@/components/ui/AccentWord";
import Link from "next/link";
import RightChevron from "@/components/icons/right-chevron";
import RocketIcon from "@/components/icons/rocket-icon";
import ShieldCheck from "@/components/icons/shield-check";
import TravelBag from "@/components/icons/travel-bag";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";

const projects = [
  {
    id: "orion",
    title: "Project Orion",
    company: "Deep Space Industries",
    role: "Lead PM",
    description: "Architected a real-time telemetry dashboard for mission control operations, reducing decision latency by 40% during critical launch windows.",
    metrics: ["+45% Engagement", "-40% Latency"],
    tags: ["Data Vis", "Real-time", "UX/UI"],
    href: "/case-studies/project-orion",
    gradient: "from-blue-900 to-slate-900",
    icon: RocketIcon,
  },
  {
    id: "aegis",
    title: "Aegis System",
    company: "Defense Corp",
    role: "Product Owner",
    description: "Developed an AI-driven threat detection system integrating 50+ data sources into a unified command interface.",
    metrics: ["99.9% Uptime", "2.3M Users"],
    tags: ["AI/ML", "Security", "Big Data"],
    href: "/case-studies/aegis-system",
    gradient: "from-emerald-900 to-teal-900",
    icon: ShieldCheck,
  },
  {
    id: "nexus",
    title: "Nexus Protocol",
    company: "Global Comm",
    role: "Senior PM",
    description: "Led the 0-1 launch of a decentralized communication protocol, scaling to 100k daily active users in the first quarter.",
    metrics: ["100k DAU", "$2M ARR"],
    tags: ["Web3", "Strategy", "Growth"],
    href: "/case-studies/nexus-protocol",
    gradient: "from-purple-900 to-indigo-900",
    icon: TravelBag,
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-industrial font-bold uppercase tracking-widest text-text-primary mb-4">
          Mission <AccentWord text="Logs" />
        </h1>
        <p className="text-text-secondary max-w-2xl text-lg font-tech uppercase tracking-wide">
          Detailed records of product development cycles, from concept to launch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => {
            const Icon = project.icon;
            return (
            <Card
              key={project.id}
              data-icon-hover-trigger
              className="group h-full flex flex-col hover:border-cta transition-colors"
            >
              <div className={`h-48 w-full bg-gradient-to-br ${project.gradient} relative overflow-hidden flex items-center justify-center`}>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <IconHoverWrapper
                  hoverTrigger="closest"
                  className="transition-transform group-hover:scale-110 [&_svg]:transition-colors group-hover:[&_svg]:text-white/40"
                >
                  <Icon size={64} color="rgba(255,255,255,0.2)" />
                </IconHoverWrapper>
                <Badge variant="outline" className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white border-white/20">
                  {project.company}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="group-hover:text-cta transition-colors">
                  {project.title}
                </CardTitle>
                <div className="text-xs font-mono text-text-secondary uppercase tracking-widest mt-1">
                  {project.role}
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-text-secondary mb-6 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {project.metrics.map((metric) => (
                    <div key={metric} className="bg-bg-accent/10 border border-bg-dark/20 p-2 text-center">
                      <div className="text-gold font-bold font-industrial text-sm">{metric}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="mt-auto pt-6 border-t border-divider/50">
                <Link href={project.href} data-icon-hover-trigger className="w-full">
                  <Button variant="ghost" className="w-full group-hover:bg-cta group-hover:text-white transition-all">
                    Initialize Protocol
                    <IconHoverWrapper hoverTrigger="closest">
                      <RightChevron size={16} className="ml-2" />
                    </IconHoverWrapper>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            );
        })}
      </div>
    </div>
  );
}
