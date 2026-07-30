"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccentWord } from "@/components/ui/AccentWord";
import Link from "next/link";
import RocketIcon from "@/components/icons/rocket-icon";
import ShieldCheck from "@/components/icons/shield-check";
import StackIcon from "@/components/icons/stack-icon";
import UsersIcon from "@/components/icons/users-icon";
import TrophyIcon from "@/components/icons/trophy-icon";
import CodeIcon from "@/components/icons/code-icon";
import FileDescriptionIcon from "@/components/icons/file-description-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";
import { motion } from "framer-motion";
import {
  revealProps,
  staggerContainer,
  staggerItem,
  staggerItemFast,
  useRevealMotion,
} from "@/lib/motion";
import { ScrambleIn } from "@/components/fancy/text/scramble-in";
import { TextHighlighter } from "@/components/fancy/text/text-highlighter";

const skills = [
  { 
    category: "Product Strategy", 
    items: ["Roadmapping", "Prioritization", "OKRs", "Competitive Analysis", "GTM Strategy"], 
    icon: RocketIcon 
  },
  { 
    category: "User-Centric Design", 
    items: ["Workflow Mapping", "User Testing", "Wireframing", "Journey Mapping", "Figma"], 
    icon: UsersIcon 
  },
  { 
    category: "Technical", 
    items: ["APIs", "React/Next.js", "AI Coding Agents", "System Architecture", "DevOps", "MCP"], 
    icon: StackIcon 
  },
  { 
    category: "Leadership", 
    items: ["Stakeholder Management", "Agile/Scrum", "Change Management", "Sprint Planning"], 
    icon: ShieldCheck 
  },
  { 
    category: "Languages", 
    items: ["TypeScript", "Python", "Rust", "SQL", "Kotlin", "Swift", "React", "C++", "Java", "HTML 5", "CSS 3", "Tailwind", "Node.js", "Express.js", "Next.js", "Django", "Flask"], 
    icon: CodeIcon 
  },
];

const experience = [
  {
    role: "Full Stack Developer",
    company: "The Blessed Life",
    period: "2025 - 2026",
    description: "Owning end-to-end product delivery for B2B workflow initiatives. Leading customer discovery, problem framing, and roadmap prioritization. Achieved ~25% improvement in workflow completion rates and ~30% increase in feature adoption.",
  },
  {
    role: "IT Operations Specialist",
    company: "Calgary Coop",
    period: "2024 - Present",
    description: "Implemented workflow improvements that boosted team efficiency by 20%. Reduced file retrieval time 35% through optimized categorization. Streamlined documentation processedd supporting internal porduct tracking.",
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
    degree: "Product Management Program",
    school: "Southern Alberta Institute of Technology",
    year: "2025",
  },
  {
    degree: "Project Management Program",
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
  const reduced = useRevealMotion();
  const intro = revealProps(reduced);
  const competenciesHeader = revealProps(reduced);
  const competenciesGrid = revealProps(reduced);
  const experienceHeader = revealProps(reduced);
  const experienceList = revealProps(reduced);
  const educationHeader = revealProps(reduced);
  const educationGrid = revealProps(reduced);
  const certificationsHeader = revealProps(reduced);
  const certificationsRow = revealProps(reduced);

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          {...intro}
          className="text-4xl md:text-6xl font-industrial font-bold uppercase tracking-widest text-text-primary mb-12 will-change-transform"
        >
          Professional <AccentWord text="Profile" />
        </motion.h1>

        <motion.div
          {...intro}
          variants={staggerContainer}
          className="prose prose-invert max-w-none mb-16 will-change-transform"
        >
          <motion.p
            variants={staggerItem}
            className="text-xl text-text-secondary leading-relaxed"
          >
            <ScrambleIn
              text="I have a simple rule: if it's boring to do, a computer should do it."
              scrambleSpeed={30}
              scrambledLetterCount={3}
              className="text-text-primary font-semibold"
              scrambledClassName="text-cta/40"
            />
          </motion.p>
          <motion.p
            variants={staggerItem}
            className="text-lg text-text-secondary leading-relaxed mt-4"
          >
            I&apos;m a software developer and product manager who likes <TextHighlighter highlightColor="hsla(1, 85%, 65%, 0.7)" highlightTextColor="#2B3233" direction="ltr">digging into messy problems</TextHighlighter>, understanding how people actually work, and turning &quot;there has to be a better way&quot; moments into products people love using.
          </motion.p>
          <motion.p
            variants={staggerItem}
            className="text-lg text-text-secondary leading-relaxed mt-4"
          >
            No matter the industry, the problem is usually the same: people are <TextHighlighter highlightColor="hsla(1, 85%, 65%, 0.7)" highlightTextColor="#2B3233" direction="ltr">stuck doing things the hard way</TextHighlighter>. My work has always revolved around finding those moments, understanding why they exist, and building solutions that make work faster, simpler, and more enjoyable. I&apos;ve been able to move between engineering, product, and business teams because I enjoy <TextHighlighter highlightColor="hsla(1, 85%, 65%, 0.7)" highlightTextColor="#2B3233" direction="ltr">speaking both languages</TextHighlighter>: the technical details and the human side of the problem. I&apos;m at my best when I&apos;m collaborating with people, earning their trust, and <TextHighlighter highlightColor="hsla(1, 85%, 65%, 0.7)" highlightTextColor="#2B3233" direction="ltr">turning messy ideas into something teams can actually use</TextHighlighter>.
          </motion.p>
          <motion.div variants={staggerItem} className="mt-8">
            <Link href="/Isaac_Daniel_Sudakar_Resume.pdf" download target="_blank" data-icon-hover-trigger>
              <Button variant="outline" className="gap-2">
                <IconHoverWrapper hoverTrigger="closest">
                  <FileDescriptionIcon size={16} />
                </IconHoverWrapper>
                Download Resume
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <section className="mb-24">
          <motion.h2
            {...competenciesHeader}
            className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 will-change-transform"
          >
            Core Skills
          </motion.h2>
          <motion.div
            {...competenciesGrid}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 will-change-transform"
          >
            {skills.map((skill) => {
              const Icon = skill.icon;
              return (
                <motion.div key={skill.category} variants={staggerItem} data-icon-hover-trigger className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <IconHoverWrapper hoverTrigger="closest">
                      <Icon size={24} className="text-cta transition-transform group-hover:scale-110" />
                    </IconHoverWrapper>
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
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        <section className="mb-24">
          <motion.h2
            {...experienceHeader}
            className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 will-change-transform"
          >
            Professional Experience
          </motion.h2>
          <motion.div
            {...experienceList}
            variants={staggerContainer}
            className="space-y-12 relative border-l-2 border-divider ml-4 md:ml-8 pl-8 md:pl-12 py-4 will-change-transform"
          >
            {experience.map((job, index) => (
              <motion.div key={index} variants={staggerItem} className="relative">
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
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section>
          <motion.h2
            {...educationHeader}
            className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 will-change-transform"
          >
            Education
          </motion.h2>
          <motion.div
            {...educationGrid}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 will-change-transform"
          >
            {education.map((edu, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="flex items-start gap-4 p-4 border border-divider/50 rounded-sm bg-bg-accent/5"
              >
                <TrophyIcon size={24} className="text-text-secondary mt-1" />
                <div>
                  <h3 className="font-bold text-text-primary">{edu.degree}</h3>
                  <div className="text-sm text-text-secondary">{edu.school}</div>
                  <div className="text-xs font-mono text-cta mt-1">{edu.year}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mt-24">
          <motion.h2
            {...certificationsHeader}
            className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 will-change-transform"
          >
            Certifications
          </motion.h2>
          <motion.div
            {...certificationsRow}
            variants={staggerContainer}
            className="flex flex-wrap gap-3 will-change-transform"
          >
            {["Agile & Scrum", "Prompt Engineering", "Context Engineering"].map((cert) => (
              <motion.div key={cert} variants={staggerItemFast}>
                <Badge variant="outline" className="text-sm px-4 py-2 border-cta/50 text-text-secondary">
                  {cert}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
