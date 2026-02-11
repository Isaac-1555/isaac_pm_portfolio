import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, CheckCircle2, Zap, Users, BarChart3, Target, Search, Settings, Code, Rocket, Lightbulb, TrendingUp, Brain } from "lucide-react";
import { caseStudies } from "../data";
import { notFound } from "next/navigation";

export default async function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = caseStudies.find(p => p.id === slug);

  if (!project) {
    notFound();
  }

  // Helper for section headers to keep code DRY
  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 flex items-center gap-3">
      <Icon className="h-6 w-6 text-cta" /> {title}
    </h2>
  );

  return (
    <article className="min-h-screen pb-24 bg-bg-base">
      {/* Header */}
      <header className={`py-24 relative overflow-hidden bg-gradient-to-br ${project.gradient}`}>
        <div className="absolute inset-0 bg-bg-base/90 backdrop-blur-sm z-0" />
        <div className="absolute inset-0 z-0 diagonal-stripes opacity-10 pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <Link href="/work" className="inline-flex items-center text-text-secondary hover:text-cta mb-8 transition-colors uppercase tracking-widest text-sm font-tech">
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Mission Control
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="tech">{project.company}</Badge>
            <Badge variant="outline" className="border-cta/50 text-cta">{project.status}</Badge>
          </div>

          <h1 className="text-4xl md:text-7xl font-industrial font-bold uppercase tracking-widest mb-4 text-text-primary">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl font-light mb-8">
            {project.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 text-sm font-tech uppercase tracking-widest text-text-secondary border-t border-divider/20 pt-6">
            <span>Role: <span className="text-text-primary">{project.role}</span></span>
            <span className="text-cta">•</span>
            <span>Duration: <span className="text-text-primary">{project.timeline}</span></span>
            <span className="text-cta">•</span>
            <span>Team: <span className="text-text-primary">{project.team}</span></span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* 2. Context / Overview */}
          <section>
            <SectionHeader icon={Target} title="Context & Overview" />
            <p className="text-lg leading-relaxed text-text-primary">
              {project.context}
            </p>
          </section>

          {/* 3. Problem / Challenge */}
          <section>
            <SectionHeader icon={Zap} title="The Challenge" />
            <div className="bg-bg-accent/5 p-8 border-l-4 border-cta rounded-r-sm space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2 text-text-primary">Problem Statement</h3>
                <p className="text-text-secondary">{project.problem.statement}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-text-primary">Why It Matters</h3>
                <p className="text-text-secondary">{project.problem.importance}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-text-primary">Constraints</h3>
                <ul className="list-disc list-inside text-text-secondary space-y-1">
                  {project.problem.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Goal / Success Metrics */}
          <section>
            <SectionHeader icon={Target} title="Goals & Metrics" />
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-industrial uppercase tracking-wide text-gold mb-4">Objectives</h3>
                <ul className="space-y-3">
                  {project.goals.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cta shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-industrial uppercase tracking-wide text-gold mb-4">Target KPIs</h3>
                <ul className="space-y-3">
                  {project.goals.kpis.map((kpi, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <BarChart3 className="h-5 w-5 text-cta shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{kpi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Research & Discovery */}
          <section>
            <SectionHeader icon={Search} title="Research & Discovery" />
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-text-primary mb-2">Methodology</h3>
                <div className="flex flex-wrap gap-2">
                  {project.research.methods.map((method, i) => (
                    <Badge key={i} variant="secondary" className="text-sm py-1">{method}</Badge>
                  ))}
                </div>
              </div>
              <div className="bg-bg-accent/5 p-6 rounded-sm">
                <h3 className="font-bold text-text-primary mb-4">Key Insights</h3>
                <ul className="space-y-3">
                  {project.research.insights.map((insight, i) => (
                    <li key={i} className="flex gap-3 text-text-secondary">
                      <Lightbulb className="h-5 w-5 text-gold shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 6. Approach / Process */}
          <section>
            <SectionHeader icon={Settings} title="Approach & Strategy" />
            <p className="text-text-secondary mb-6 leading-relaxed">
              {project.approach.strategy}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border border-divider rounded-sm">
                <h4 className="font-bold text-sm uppercase tracking-wider text-cta mb-2">Frameworks</h4>
                <p className="text-sm text-text-secondary">{project.approach.frameworks.join(", ")}</p>
              </div>
              <div className="p-4 border border-divider rounded-sm">
                <h4 className="font-bold text-sm uppercase tracking-wider text-cta mb-2">Collaboration</h4>
                <p className="text-sm text-text-secondary">{project.approach.collaboration}</p>
              </div>
            </div>
          </section>

          {/* 7. Solution (With Carousel) */}
          <section>
            <SectionHeader icon={Code} title="The Solution" />
            <p className="text-lg text-text-primary mb-6">{project.solution.description}</p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {project.solution.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-bg-accent/5 border border-divider/50 rounded-sm">
                  <div className="h-2 w-2 bg-cta rounded-full" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* Simple CSS Scroll Snap Carousel for Screenshots */}
            <div className="my-12">
              <h3 className="font-industrial uppercase tracking-wide text-sm text-text-secondary mb-4">App Visuals</h3>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-cta scrollbar-track-bg-dark">
                {project.screenshots.map((src, i) => (
                  <div key={i} className="snap-center shrink-0 w-[85vw] md:w-[600px] aspect-video bg-bg-dark/50 rounded-sm border border-divider flex items-center justify-center relative overflow-hidden group">
                     {/* Placeholder logic: If src contains 'placeholder', show text. Else img */}
                     {src.includes('placeholder') ? (
                       <div className="text-text-secondary font-industrial uppercase tracking-widest text-center p-4">
                         <span className="block text-4xl mb-2 opacity-20">{i + 1}</span>
                         Screenshot Placeholder
                       </div>
                     ) : (
                       <img src={src} alt={`Screenshot ${i + 1}`} className="object-cover w-full h-full" />
                     )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-accent/10 p-6 rounded-sm border-l-2 border-gold">
              <h4 className="font-bold text-sm uppercase tracking-wider text-gold mb-2">Design Rationale</h4>
              <p className="text-sm text-text-secondary">{project.solution.rationale}</p>
            </div>
          </section>

          {/* 8. Execution */}
          <section>
            <SectionHeader icon={Rocket} title="Execution" />
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-text-primary mb-2">Roadmap</h3>
                <p className="text-text-secondary font-mono text-sm border-l-2 border-divider pl-4">
                  {project.execution.roadmap}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-2">Challenges Overcome</h3>
                <ul className="space-y-2">
                  {project.execution.challenges.map((challenge, i) => (
                    <li key={i} className="flex gap-2 text-text-secondary text-sm">
                      <span className="text-warning">⚠</span> {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 9. Outcome */}
          <section>
            <SectionHeader icon={TrendingUp} title="Outcomes & Impact" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-bg-accent/5 p-6 rounded-sm">
                <h3 className="font-industrial uppercase tracking-wide text-success mb-4">Quantifiable Results</h3>
                <ul className="space-y-4">
                  {project.outcome.quantifiable.map((res, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-text-primary font-industrial">{i + 1}.</span>
                      <span className="text-text-secondary">{res}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-industrial uppercase tracking-wide text-gold mb-4">Qualitative Feedback</h3>
                <div className="space-y-4">
                  {project.outcome.qualitative.map((quote, i) => (
                    <blockquote key={i} className="border-l-4 border-divider pl-4 italic text-text-secondary text-sm">
                      "{quote}"
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 10. Learnings */}
          <section>
            <SectionHeader icon={Brain} title="Learnings & Future" />
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-text-primary mb-3">Key Takeaways</h3>
                <ul className="list-disc list-inside text-text-secondary space-y-2 text-sm">
                  {project.learnings.takeaways.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-text-primary mb-3">Next Steps</h3>
                <ul className="list-disc list-inside text-text-secondary space-y-2 text-sm">
                  {project.learnings.nextSteps.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar / Actions */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-card border-2 border-bg-dark p-6 sticky top-24 rounded-sm shadow-xl">
            <h3 className="text-xl font-industrial uppercase tracking-widest mb-6 text-bg-dark border-b border-bg-dark/10 pb-4">
              Project Actions
            </h3>
            
            <div className="space-y-4">
              <Link href={project.websiteUrl} target="_blank" className="block">
                <Button className="w-full gap-2 h-12 text-lg font-bold uppercase tracking-widest" size="lg">
                  Visit Website <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
              
              <Link href={project.repoUrl} target="_blank" className="block">
                <Button variant="outline" className="w-full gap-2 border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-white">
                  View Source Code <Github className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-bg-dark/10">
              <h4 className="font-bold text-sm uppercase tracking-wider text-text-secondary mb-4">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-bg-dark/5 hover:bg-bg-dark/10 text-bg-dark border-bg-dark/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
