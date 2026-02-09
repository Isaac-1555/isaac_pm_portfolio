import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Briefcase, Rocket, Shield } from "lucide-react";

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
    icon: Rocket,
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
    icon: Shield,
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
    icon: Briefcase,
  },
];

export function FeaturedWork() {
  return (
    <section className="py-16 md:py-24 bg-bg-base/50">
      <div className="container mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
          <div>
            <Badge variant="warning" className="mb-3">
              Featured Case Studies
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-industrial font-bold uppercase tracking-wide md:tracking-widest text-text-primary">
              Mission <span className="text-cta">Logs</span>
            </h2>
          </div>
          <Link href="/case-studies" className="hidden md:block">
            <Button variant="outline">
              View All Missions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => {
            const Icon = project.icon;
            return (
              <Card key={project.id} className="group h-full flex flex-col hover:border-cta transition-colors">
                {/* Card Image Header */}
                <div className={`h-40 md:h-48 w-full bg-gradient-to-br ${project.gradient} relative overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                  <Icon className="h-12 w-12 md:h-16 md:w-16 text-white/20 group-hover:text-white/40 transition-colors transform group-hover:scale-110 duration-500" />
                  <Badge variant="outline" className="absolute top-3 right-3 bg-black/50 backdrop-blur text-white border-white/20 text-xs">
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
                  <p className="text-sm md:text-base text-text-secondary leading-relaxed">
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
                        <div className="text-gold font-bold font-industrial text-xs md:text-sm whitespace-nowrap">{metric}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                {/* Card Footer */}
                <CardFooter className="mt-auto pt-4 border-t border-divider/50">
                  <Link href={project.href} className="w-full">
                    <Button variant="ghost" className="w-full text-sm group-hover:bg-cta group-hover:text-white transition-all">
                      Initialize Protocol
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/case-studies">
            <Button variant="outline" className="w-full">
              View All Missions <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
