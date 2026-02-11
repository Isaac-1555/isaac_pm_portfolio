import { Badge } from "@/components/ui/badge";
import { Rocket, Shield, Database, Users, GraduationCap } from "lucide-react";

const skills = [
  { 
    category: "Product Strategy", 
    items: ["Roadmapping", "Prioritization", "OKRs", "Competitive Analysis", "GTM Strategy"], 
    icon: Rocket 
  },
  { 
    category: "User-Centric Design", 
    items: ["Workflow Mapping", "User Testing", "Wireframing", "Journey Mapping", "Figma"], 
    icon: Users 
  },
  { 
    category: "Technical", 
    items: ["SQL", "APIs", "React/Next.js", "AI Tools", "System Architecture"], 
    icon: Database 
  },
  { 
    category: "Leadership", 
    items: ["Stakeholder Management", "Agile/Scrum", "Change Management", "Sprint Planning"], 
    icon: Shield 
  },
];

const experience = [
  {
    role: "Technology Product Consultant",
    company: "The Blessed Life",
    period: "2023 - Present",
    description: "Owning end-to-end product delivery for B2B workflow initiatives. Leading customer discovery, problem framing, and roadmap prioritization. Achieved ~25% improvement in workflow completion rates and ~30% increase in feature adoption.",
  },
  {
    role: "Electrical Engineer",
    company: "Cris Planners and Builders",
    period: "2021 - 2023",
    description: "Translated technical constraints into clear requirements in compliance-driven environments. Collaborated with cross-functional teams to resolve system issues, building strong systems thinking skills applicable to SDLC.",
  },
];

const education = [
  {
    degree: "Product Management Program (Distinction)",
    school: "Southern Alberta Institute of Technology",
    year: "2025",
  },
  {
    degree: "Project Management Program (Distinction)",
    school: "Southern Alberta Institute of Technology",
    year: "2024",
  },
  {
    degree: "B.E. Electrical & Electronics Engineering",
    school: "Panimalar Engineering College",
    year: "2018",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-industrial font-bold uppercase tracking-widest text-text-primary mb-12">
          Professional <span className="text-cta">Profile</span>
        </h1>

        <div className="prose prose-invert max-w-none mb-16">
          <p className="text-xl text-text-secondary leading-relaxed">
            Customer centric Product Manager with 5+ years of experience owning and delivering workflow heavy B2B software products from discovery through launch and iteration.
          </p>
          <p className="text-lg text-text-secondary leading-relaxed mt-4">
            Strong background in customer research, problem framing, and cross functional execution across engineering, design, and business stakeholders. Proven ability to translate complex operational workflows into scalable product solutions, define success metrics, and continuously improve adoption and outcomes.
          </p>
        </div>

        <section className="mb-24">
          <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4">
            Core Competencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <div key={skill.category} className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-6 w-6 text-cta group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-industrial uppercase tracking-widest text-text-primary">
                      {skill.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <Badge key={item} variant="secondary" className="group-hover:border-cta transition-colors">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-24">
          <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4">
            Professional Experience
          </h2>
          <div className="space-y-12 relative border-l-2 border-divider ml-4 md:ml-8 pl-8 md:pl-12 py-4">
            {experience.map((job, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[41px] md:-left-[59px] top-2 h-6 w-6 rounded-full bg-bg-dark border-4 border-bg-base flex items-center justify-center">
                  <div className="h-2 w-2 bg-cta rounded-full animate-pulse" />
                </div>
                <div className="mb-2 flex flex-col md:flex-row md:items-start gap-1 md:gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">{job.role}</h3>
                    <div className="text-cta font-medium">{job.company}</div>
                  </div>
                  <span className="font-mono text-text-secondary text-sm md:ml-auto">{job.period}</span>
                </div>
                <p className="text-text-secondary max-w-2xl leading-relaxed mt-2">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4">
            Education
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-divider/50 rounded-sm bg-bg-accent/5">
                <GraduationCap className="h-6 w-6 text-text-secondary mt-1" />
                <div>
                  <h3 className="font-bold text-text-primary">{edu.degree}</h3>
                  <div className="text-sm text-text-secondary">{edu.school}</div>
                  <div className="text-xs font-mono text-cta mt-1">{edu.year}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
