import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Rocket, Shield, Briefcase, Database, LineChart, Users } from "lucide-react";

const skills = [
  { category: "Product Strategy", items: ["Roadmapping", "Market Analysis", "OKRs", "Growth Strategy"], icon: Rocket },
  { category: "Technical", items: ["System Architecture", "SQL/NoSQL", "API Design", "Cloud Infrastructure"], icon: Database },
  { category: "Analytics", items: ["Mixpanel", "Amplitude", "Google Analytics", "User Research"], icon: LineChart },
  { category: "Leadership", items: ["Stakeholder Management", "Team Mentorship", "Agile/Scrum", "Crisis Mgmt"], icon: Users },
];

const experience = [
  {
    role: "Senior Product Manager",
    company: "Deep Space Industries",
    period: "2021 - Present",
    description: "Leading the orbital mining division's software ecosystem. Increased operational efficiency by 200%.",
  },
  {
    role: "Product Owner",
    company: "Defense Corp",
    period: "2018 - 2021",
    description: "Managed the development of the Aegis defense system. Reduced false positives by 95%.",
  },
  {
    role: "Systems Analyst",
    company: "Global Comm",
    period: "2016 - 2018",
    description: "Designed the architecture for the Nexus communication protocol.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-industrial font-bold uppercase tracking-widest text-text-primary mb-12">
          Operator <span className="text-cta">Profile</span>
        </h1>

        <section className="mb-24">
          <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4">
            Technical Competencies
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

        <section>
          <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4">
            Mission History
          </h2>
          <div className="space-y-12 relative border-l-2 border-divider ml-4 md:ml-8 pl-8 md:pl-12 py-4">
            {experience.map((job, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[41px] md:-left-[59px] top-2 h-6 w-6 rounded-full bg-bg-dark border-4 border-bg-base flex items-center justify-center">
                  <div className="h-2 w-2 bg-cta rounded-full animate-pulse" />
                </div>
                <div className="mb-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h3 className="text-xl font-bold text-text-primary">{job.role}</h3>
                  <Badge variant="outline" className="w-fit">{job.company}</Badge>
                  <span className="font-mono text-text-secondary text-sm">{job.period}</span>
                </div>
                <p className="text-text-secondary max-w-2xl leading-relaxed">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
