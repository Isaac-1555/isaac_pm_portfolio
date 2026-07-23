"use client";

import { use } from "react";
import { motion, type MotionProps } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import ArrowBackIcon from "@/components/icons/arrow-back-icon";
import ExternalLinkIcon from "@/components/icons/external-link-icon";
import GithubIcon from "@/components/icons/github-icon";
import CheckedIcon from "@/components/icons/checked-icon";
import SparklesIcon from "@/components/icons/sparkles-icon";
import ChartBarIcon from "@/components/icons/chart-bar-icon";
import TargetIcon from "@/components/icons/target-icon";
import MagnifierIcon from "@/components/icons/magnifier-icon";
import GearIcon from "@/components/icons/gear-icon";
import CodeIcon from "@/components/icons/code-icon";
import RocketIcon from "@/components/icons/rocket-icon";
import BulbSvg from "@/components/icons/bulb-svg";
import ChartLineIcon from "@/components/icons/chart-line-icon";
import BrainCircuitIcon from "@/components/icons/brain-circuit-icon";
import DownloadIcon from "@/components/icons/download-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import { caseStudies } from "../data";
import { notFound } from "next/navigation";
import type { AnimatedIconProps } from "@/components/icons/types";
import { TechPillField } from "@/components/case-study/TechPillField";
import { revealProps, useRevealMotion } from "@/lib/motion";

function SectionHeader({ icon: Icon, title }: { icon: React.ComponentType<AnimatedIconProps>, title: string }) {
  return (
    <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 flex items-center gap-3">
      <Icon size={24} className="text-cta" /> {title}
    </h2>
  );
}

export default function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const reduced = useRevealMotion();
  const { slug } = use(params);
  const project = caseStudies.find(p => p.id === slug);

  if (!project) {
    notFound();
  }

  const reveal = (i: number): MotionProps => {
    if (reduced) {
      return { initial: false };
    }
    return {
      ...revealProps(false),
      transition: { delay: i * 0.04, duration: 0.5 },
    };
  };

  return (
    <article className="min-h-screen pb-24 bg-bg-base">
      {/* Header */}
      <header className={`py-24 relative overflow-hidden bg-gradient-to-br ${project.gradient}`}>
        <TechPillField techStack={project.techStack} />
        <div className="absolute inset-0 bg-bg-dark/40 z-[2] pointer-events-none" />
        <div className="absolute inset-0 z-[2] diagonal-stripes opacity-10 pointer-events-none" />

        <div className="container mx-auto px-6 md:px-8 relative z-10 pointer-events-none">
          <Link
            href="/work"
            data-icon-hover-trigger
            className="inline-flex items-center text-white hover:text-cta mb-8 transition-colors uppercase tracking-widest text-sm font-tech pointer-events-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
          >
            <IconHoverWrapper hoverTrigger="closest">
              <ArrowBackIcon size={16} className="mr-2" />
            </IconHoverWrapper>
            Return to Mission Control
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="tech" className="bg-white/15 text-white border border-white/30">{project.company}</Badge>
            <Badge variant="outline" className="border-cta bg-cta/10 text-white">{project.status}</Badge>
          </div>

          <h1 className="text-4xl md:text-7xl font-industrial font-bold uppercase tracking-widest mb-4 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl font-light mb-8 drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]">
            {project.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 text-sm font-tech uppercase tracking-widest text-white/85 pt-6 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
            <span>Role: <span className="text-white">{project.role}</span></span>
            <span className="text-cta">•</span>
            <span>Duration: <span className="text-white">{project.timeline}</span></span>
            <span className="text-cta">•</span>
            <span>Team: <span className="text-white">{project.team}</span></span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-16">

          {/* 2. Context / Overview */}
          <motion.section {...reveal(0)} className="will-change-transform">
            <SectionHeader icon={TargetIcon} title="Context & Overview" />
            <p className="text-lg leading-relaxed text-text-primary">
              {project.context}
            </p>
          </motion.section>

          {/* 3. Problem / Challenge */}
          <motion.section {...reveal(1)} className="will-change-transform">
            <SectionHeader icon={SparklesIcon} title="The Challenge" />
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
          </motion.section>

          {/* 4. Goal / Success Metrics */}
          <motion.section {...reveal(2)} className="will-change-transform">
            <SectionHeader icon={TargetIcon} title="Goals & Metrics" />
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-industrial uppercase tracking-wide text-gold mb-4">Objectives</h3>
                <ul className="space-y-3">
                  {project.goals.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckedIcon size={20} className="text-cta shrink-0 mt-0.5" />
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
                      <ChartBarIcon size={20} className="text-cta shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{kpi}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 5. Research & Discovery */}
          <motion.section {...reveal(3)} className="will-change-transform">
            <SectionHeader icon={MagnifierIcon} title="Research & Discovery" />
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
                      <BulbSvg size={20} className="text-gold shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 6. Approach / Process */}
          <motion.section {...reveal(4)} className="will-change-transform">
            <SectionHeader icon={GearIcon} title="Approach & Strategy" />
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
          </motion.section>

          {/* 7. Solution (With Carousel) */}
          <motion.section {...reveal(5)} className="will-change-transform">
            <SectionHeader icon={CodeIcon} title="The Solution" />
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
                     {src.includes('placeholder') ? (
                       <div className="text-text-secondary font-industrial uppercase tracking-widest text-center p-4">
                         <span className="block text-4xl mb-2 opacity-20">{i + 1}</span>
                         Screenshot Placeholder
                       </div>
                     ) : (
                     <Image
                          src={src}
                          alt={`Screenshot ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 85vw, 600px"
                          className={project.carouselFit === "contain" ? "object-contain" : "object-cover"}
                        />
                     )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-bg-accent/10 p-6 rounded-sm border-l-2 border-gold">
              <h4 className="font-bold text-sm uppercase tracking-wider text-gold mb-2">Design Rationale</h4>
              <p className="text-sm text-text-secondary">{project.solution.rationale}</p>
            </div>
          </motion.section>

          {/* 8. Execution */}
          <motion.section {...reveal(6)} className="will-change-transform">
            <SectionHeader icon={RocketIcon} title="Execution" />
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-text-primary mb-4">Roadmap</h3>
                <div className="relative border-l-2 border-divider ml-2 space-y-8 pl-8 py-2">
                  {project.execution.roadmap.map((phase, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[39px] top-1 h-5 w-5 rounded-full bg-bg-base border-2 border-cta flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-cta" />
                      </div>
                      <h4 className="text-sm font-bold text-cta uppercase tracking-widest mb-1">{phase.label}</h4>
                      <p className="text-text-secondary text-sm leading-relaxed">{phase.description}</p>
                    </div>
                  ))}
                </div>
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
          </motion.section>

          {/* 9. Outcome */}
          <motion.section {...reveal(7)} className="will-change-transform">
            <SectionHeader icon={ChartLineIcon} title="Outcomes & Impact" />
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
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* 10. Learnings */}
          <motion.section {...reveal(8)} className="will-change-transform">
            <SectionHeader icon={BrainCircuitIcon} title="Learnings & Future" />
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
          </motion.section>

        </div>

        {/* Sidebar / Actions */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-card border-2 border-bg-dark p-6 sticky top-24 rounded-sm shadow-xl">
            <h3 className="text-xl font-industrial uppercase tracking-widest mb-6 text-bg-dark border-b border-bg-dark/10 pb-4">
              Project Actions
            </h3>

            <div className="space-y-4">
              <Link href={project.websiteUrl} target="_blank" data-icon-hover-trigger className="block">
                <Button className="w-full gap-2 h-12 text-lg font-bold uppercase tracking-widest" size="lg">
                  Visit Website
                  <IconHoverWrapper hoverTrigger="closest">
                    <ExternalLinkIcon size={16} />
                  </IconHoverWrapper>
                </Button>
              </Link>

              <Link href={project.repoUrl} target="_blank" data-icon-hover-trigger className="block">
                <Button variant="outline" className="w-full gap-2 border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-white">
                  View Source Code
                  <IconHoverWrapper hoverTrigger="closest">
                    <GithubIcon size={16} />
                  </IconHoverWrapper>
                </Button>
              </Link>

              {project.apkUrl && (
                <Link href={project.apkUrl} download data-icon-hover-trigger className="block">
                  <Button variant="outline" className="w-full gap-2 border-bg-dark text-bg-dark hover:bg-bg-dark hover:text-white">
                    Download APK (109 MB)
                    <IconHoverWrapper hoverTrigger="closest">
                      <DownloadIcon size={16} />
                    </IconHoverWrapper>
                  </Button>
                </Link>
              )}
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
