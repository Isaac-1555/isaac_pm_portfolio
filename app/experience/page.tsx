"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccentWord } from "@/components/ui/AccentWord";
import Link from "next/link";
import RocketIcon from "@/components/icons/rocket-icon";
import GearIcon from "@/components/icons/gear-icon";
import StackIcon from "@/components/icons/stack-icon";
import CpuIcon from "@/components/icons/cpu-icon";
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
    category: "Systems & Operations",
    items: [
      "Troubleshooting & Issue Resolution",
      "Active Directory & Entra ID",
      "Intune Device Management",
      "Windows & Microsoft 365",
      "Patching & Imaging",
      "Ticketing & Escalation",
      "Incident & Change Documentation",
    ],
    icon: GearIcon,
  },
  {
    category: "Scripting & Automation",
    items: [
      "Python",
      "JavaScript",
      "TypeScript",
      "SQL",
      "Rust",
      "Git & Shell",
      "Docker",
      "CI/CD Pipelines",
      "REST & Chrome Extension APIs",
      "OCR",
    ],
    icon: CodeIcon,
  },
  {
    category: "AI & Automation",
    items: [
      "LLM Integration",
      "Prompt Engineering",
      "Agentic Development Workflows",
      "On-Device Inference",
      "Multi-Provider AI Routing",
    ],
    icon: CpuIcon,
  },
  {
    category: "Technical Platforms",
    items: [
      "React / Next.js",
      "Node.js",
      "PostgreSQL / Supabase",
      "Chrome Extension APIs",
      "Kotlin / Jetpack Compose",
      "Rust / Tauri",
      "Vercel / Netlify",
    ],
    icon: StackIcon,
  },
  {
    category: "Product & Delivery",
    items: [
      "Roadmapping",
      "Prioritization",
      "Requirements Gathering",
      "Stakeholder Management",
      "Agile & Sprint Planning",
      "Solution Documentation",
      "User Acceptance Testing",
    ],
    icon: RocketIcon,
  },
];

const experience = [
  {
    role: "IT Operations Specialist",
    company: "Calgary Co-op",
    period: "Apr 2024 - Present",
    bullets: [
      "Provide hands-on IT support for store and department staff — troubleshooting Windows devices, POS and peripheral hardware, and user issues, and escalating incidents when needed.",
      "Manage user accounts and access in Active Directory and Entra ID, and support end users on Microsoft 365 alongside device patching, imaging, and management through Intune.",
      "Log, track, and resolve support tickets, report recurring issues so permanent fixes can be prioritized, and write and maintain the documentation and how-to guides the whole team uses.",
      "Designed and built Barcode Lists, a standalone Chrome extension (JavaScript, Manifest V3) that replaced a manual FMC barcode and file lookup taking 4 to 6 hours per session — cutting the task to under 10 minutes, a 95% reduction.",
      "Deploy and maintain the tool across 11 stores without a dedicated engineering team, script away repetitive IT tasks, and cross-train across other departments.",
    ],
  },
  {
    role: "Web Developer (Internship)",
    company: "The Blessed Life",
    period: "Jan 2025 - Aug 2025",
    bullets: [
      "Worked directly with stakeholders to gather requirements and turn their vision into two working full-stack prototypes (React, TypeScript, Next.js, Python, PostgreSQL), so ideas could be validated before investment was committed.",
      "Iterated on feedback to drive a 30% improvement in feature adoption and a 100% improvement in workflow completion, and documented designs for non-technical stakeholders.",
    ],
  },
  {
    role: "Electrical Engineer",
    company: "Cris Planners and Builders",
    period: "Jul 2021 - Nov 2023",
    bullets: [
      "Assessed client needs and designed, configured, tested, and installed a home automation and IoT solution (ESP32, embedded systems) for lighting and water tank filling across 40+ home building and interior design projects.",
      "Positioned the offering as a premium upsell, generating additional profit per project, and adapted each installation to the client's environment and budget.",
    ],
  },
  {
    role: "Educator & Records Administrator",
    company: "CSC Computer Science Institute",
    period: "Jan 2019 - Jan 2021",
    bullets: [
      "Taught and supported government school students as a volunteer educator — including remotely during the COVID-19 lockdown — and maintained accurate, easy-to-retrievable student records for the institute.",
      "Built a Python program that let students look up their own results, removing the need for teachers to retrieve them manually.",
    ],
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

const certifications: { name: string; url?: string }[] = [
  {
    name: "Product Marketing Fundamental",
    url: "https://www.credly.com/badges/27eb5767-0aee-4ebe-ba3e-37bfac97b5f7",
  },
  {
    name: "Product Marketing Go-to-Market Strategy",
    url: "https://www.credly.com/badges/18ff8d76-40da-46fc-8f04-068f4e47336c",
  },
  {
    name: "Leaders as Coaches",
    url: "https://www.credly.com/badges/2b02ae67-541b-4ed5-8206-5963c6259e2b",
  },
  {
    name: "Problem Solving & Decision Making",
    url: "https://www.credly.com/badges/f453cc34-ee8f-42ed-9aec-c43ddcab66cc",
  },
  {
    name: "Executing & Closing Projects",
    url: "https://www.credly.com/badges/6a00922f-84df-4c36-86e1-02d50ef6d2e6",
  },
  {
    name: "Leadership Skills",
    url: "https://www.credly.com/badges/70ce20ea-9bd3-4795-bf65-9c5b6419da1c",
  },
  {
    name: "Agile Project Management",
    url: "https://www.credly.com/badges/424122c3-d17e-4c44-812d-7540b7c3421e",
  },
  {
    name: "The Power of Productive Meetings",
    url: "https://www.credly.com/badges/42e24dd5-38a4-40de-95f1-51267e293446",
  },
  {
    name: "Project Risk Methods & Practices",
    url: "https://www.credly.com/badges/290ef74a-6491-4b11-9780-f85beba472fc",
  },
  {
    name: "Initiating Projects",
    url: "https://www.credly.com/badges/fdd64a58-521e-49a9-84b3-d0afbe402a79",
  },
  {
    name: "Planning Projects",
    url: "https://www.credly.com/badges/a25cabbb-c011-470a-ab21-32211319c77f",
  },
  {
    name: "Project Management Essentials",
    url: "https://www.credly.com/badges/ddbc010f-4282-4dc6-a760-32d941cbdb83",
  },
  {
    name: "Communicating Effectively",
    url: "https://www.credly.com/badges/e6cc9ddf-2a25-4276-8dd2-1a79a5ec5bed",
  },
  {
    name: "Using Time Effectively and Productively",
    url: "https://www.credly.com/badges/b169ff2a-86ed-4c0d-a3c8-92598985e947",
  },
  // Credentials without a public badge page — rendered as plain badges.
  { name: "Microsoft 365 Fundamentals (MS-900)" },
  { name: "Python" },
  { name: "SQL" },
  { name: "C++" },
  { name: "Java" },
  { name: "Web Development" },
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
            I&apos;m a developer and automation engineer with 7+ years of shipping software who likes <TextHighlighter highlightColor="hsla(1, 85%, 65%, 0.7)" highlightTextColor="#2B3233" direction="ltr" transition={{ type: "spring", duration: 1, delay: 1.5, bounce: 0 }}>digging into messy problems</TextHighlighter>, understanding how people actually work, and turning &quot;there has to be a better way&quot; moments into tools people actually use &mdash; whether that&apos;s a product, an internal extension, or a script that saves a store four hours a day.
          </motion.p>
          <motion.p
            variants={staggerItem}
            className="text-lg text-text-secondary leading-relaxed mt-4"
          >
            No matter the industry, the problem is usually the same: people are <TextHighlighter highlightColor="hsla(1, 85%, 65%, 0.7)" highlightTextColor="#2B3233" direction="ltr" transition={{ type: "spring", duration: 1, delay: 1.5, bounce: 0 }}>stuck doing things the hard way</TextHighlighter>. My work has always revolved around finding those moments, understanding why they exist, and building solutions that make work faster, simpler, and more enjoyable. I&apos;ve been able to move between engineering, product, and operations teams because I enjoy <TextHighlighter highlightColor="hsla(1, 85%, 65%, 0.7)" highlightTextColor="#2B3233" direction="ltr" transition={{ type: "spring", duration: 1, delay: 1.5, bounce: 0 }}>speaking both languages</TextHighlighter>: the technical details and the human side of the problem. I&apos;m at my best when I&apos;m collaborating with people, earning their trust, and <TextHighlighter highlightColor="hsla(1, 85%, 65%, 0.7)" highlightTextColor="#2B3233" direction="ltr" transition={{ type: "spring", duration: 1, delay: 1.5, bounce: 0 }}>turning messy ideas into something teams can actually use</TextHighlighter>.
          </motion.p>
          <motion.div variants={staggerItem} className="mt-8">
            <a href="/Isaac_Sudakar_Resume.pdf?v=2026-11-12b" download="Isaac_Sudakar_Resume.pdf" target="_blank" rel="noopener noreferrer" data-icon-hover-trigger>
              <Button variant="outline" className="gap-2">
                <IconHoverWrapper hoverTrigger="closest">
                  <FileDescriptionIcon size={16} />
                </IconHoverWrapper>
                Download Resume
              </Button>
            </a>
          </motion.div>
        </motion.div>

        <section className="mb-24">
          <motion.h2
            {...competenciesHeader}
            className="text-3xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 will-change-transform"
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
                    <h3 className="text-2xl font-industrial uppercase tracking-widest text-text-primary">
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
            className="text-3xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 will-change-transform"
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
                <ul className="text-text-secondary max-w-2xl leading-relaxed mt-2 list-disc pl-5 space-y-2">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section>
          <motion.h2
            {...educationHeader}
            className="text-3xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 will-change-transform"
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
            className="text-3xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 will-change-transform"
          >
            Certifications
          </motion.h2>
          <p className="text-sm text-text-secondary mb-6 -mt-4">
            SAIT program credentials and certifications. Linked badges verify
            on Credly.
          </p>
          <motion.div
            {...certificationsRow}
            variants={staggerContainer}
            className="flex flex-wrap gap-3 will-change-transform"
          >
            {certifications.map((cert) => (
              <motion.div key={cert.name} variants={staggerItemFast}>
                {cert.url ? (
                  <Link href={cert.url} target="_blank" rel="noopener noreferrer">
                    <Badge variant="outline" className="text-sm px-4 py-2 border-cta/50 text-text-secondary transition-colors hover:border-cta hover:text-cta">
                      {cert.name}
                    </Badge>
                  </Link>
                ) : (
                  <Badge variant="outline" className="text-sm px-4 py-2 border-divider text-text-secondary">
                    {cert.name}
                  </Badge>
                )}
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
