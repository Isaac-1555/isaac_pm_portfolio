import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ArrowBackIcon from "@/components/icons/arrow-back-icon";
import RightChevron from "@/components/icons/right-chevron";
import ClockIcon from "@/components/icons/clock-icon";
import UserIcon from "@/components/icons/user-icon";
import TerminalIcon from "@/components/icons/terminal-icon";
import BulbSvg from "@/components/icons/bulb-svg";
import SparklesIcon from "@/components/icons/sparkles-icon";
import CodeIcon from "@/components/icons/code-icon";
import ChartLineIcon from "@/components/icons/chart-line-icon";
import RocketIcon from "@/components/icons/rocket-icon";
import PuzzleIcon from "@/components/icons/layers-icon";
import CpuIcon from "@/components/icons/cpu-icon";
import MagnifierIcon from "@/components/icons/magnifier-icon";
import CheckedIcon from "@/components/icons/checked-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";

export const metadata = {
  title: "D4C: Building a Personalized Coding Agent | Isaac PM Blog",
  description:
    "How I forked the pi coding agent and added plan/build modes, permanent MCP servers, and an /update skill that preserves customizations across upstream syncs.",
};

const TOC = [
  { id: "intro", label: "What is D4C?" },
  { id: "why", label: "Why I Built It" },
  { id: "features", label: "Key Features" },
  { id: "setup", label: "Setup & Architecture" },
  { id: "challenges", label: "Challenges & Fixes" },
  { id: "roadmap", label: "What's Next" },
];

export default function D4CArticle() {
  return (
    <article className="pb-24">
      <header className="relative w-full bg-gradient-to-br from-indigo-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

        <div className="container mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-20 relative z-10">
          <Link
            href="/blog"
            data-icon-hover-trigger
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-tech uppercase tracking-widest mb-8 transition-colors"
          >
            <IconHoverWrapper hoverTrigger="closest">
              <ArrowBackIcon size={16} />
            </IconHoverWrapper>
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm font-tech mb-6">
            <span className="flex items-center gap-1.5">
              <UserIcon size={14} /> Isaac
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon size={14} /> May 2026
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon size={14} /> 8 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-industrial font-bold uppercase tracking-wider text-white leading-tight max-w-4xl">
            D4C:{" "}
            <span className="text-purple-300">
              Building a Personalized Coding Agent
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            How I forked the pi coding agent and added plan/build modes,
            permanent MCP servers, and an /update skill that preserves
            customizations across upstream syncs.
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {["AI", "Dev Tools", "Open Source", "Agent", "MCP"].map(
              (tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 backdrop-blur"
                >
                  {tag}
                </Badge>
              )
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-12 lg:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="sticky top-28">
              <h2 className="text-xs font-industrial uppercase tracking-widest text-text-secondary mb-4">
                Contents
              </h2>
              <ol className="space-y-2 border-l-2 border-divider pl-4">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-text-secondary hover:text-cta transition-colors block py-0.5"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>

              <div className="mt-10 space-y-3">
                <Link href="https://github.com/Isaac-1555/D4C" target="_blank" data-icon-hover-trigger>
                  <Button variant="default" className="w-full text-xs">
                    View on GitHub
                    <IconHoverWrapper hoverTrigger="closest">
                      <RightChevron size={14} className="ml-2" />
                    </IconHoverWrapper>
                  </Button>
                </Link>
              </div>
            </nav>
          </aside>

          <div className="lg:col-span-9 max-w-none">
            <nav className="lg:hidden mb-10 bg-card border-2 border-bg-dark rounded-sm p-5">
              <h2 className="text-xs font-industrial uppercase tracking-widest text-text-secondary mb-3">
                Contents
              </h2>
              <ol className="grid grid-cols-2 gap-2">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-text-secondary hover:text-cta transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <section id="intro" className="mb-16 scroll-mt-24">
              <SectionHeading icon={TerminalIcon} title="What is D4C?" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                D4C — short for{" "}
                <strong className="text-text-primary">Dirty Deeds Done Dirt Cheap</strong>{" "}
                — is a personalized fork of the{" "}
                <a
                  href="https://pi.ai"
                  target="_blank"
                  className="text-cta hover:underline"
                >
                  pi coding agent
                </a>
                . It takes everything pi does well and layers on custom features
                that fit <em>my</em> workflow.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                Pi already had a solid foundation: it&apos;s a capable coding agent
                with an extensive extension marketplace. But the features I
                needed most — plan mode, build mode, permanent MCP servers —
                weren&apos;t available as extensions. They had to be ingrained in the
                agent itself. D4C is the result of that conviction.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The name is a nod to the JoJo&apos;s Bizarre Adventure reference:
                the ability to swap between different &quot;modes&quot; on the
                fly. It stuck.
              </p>
            </section>

            <section id="why" className="mb-16 scroll-mt-24">
              <SectionHeading icon={BulbSvg} title="Why I Built It" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                I started with pi because it was the best open-source coding
                agent I could find. It understood context, it could execute
                tools, and the extension ecosystem meant I wasn&apos;t starting from
                zero. But as I used it more, I kept hitting the same wall:
              </p>

              <Callout>
                <p className="text-sm md:text-base">
                  <strong>The problem:</strong> The features I wanted most —
                  structured plan/build workflows, built-in TODO tracking,
                  integrated web search, permanent MCP servers — needed to be
                  part of the agent&apos;s core, not add-on extensions that
                  could lose support or break across updates.
                </p>
              </Callout>

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mt-6">
                Pi&apos;s extension marketplace is extensive, but every
                extension has a lifespan. I didn&apos;t want to rely on
                third-party maintainers for workflow-critical capabilities. If a
                feature is part of my daily coding loop, it needs to be baked
                in.
              </p>

              <PullQuote>
                &quot;If a feature is part of my daily coding loop, it needs to
                be baked in — not bolted on.&quot;
              </PullQuote>
            </section>

            <figure className="my-12 -mx-4 md:mx-0">
              <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark bg-bg-dark shadow-lg">
                <Image
                  src="/D4C_PlanMode.png"
                  alt="D4C plan mode showing structured task breakdown and execution plan"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                Fig 1 — D4C plan mode: structured task breakdown before any code
                is written.
              </figcaption>
            </figure>

            <section id="features" className="mb-16 scroll-mt-24">
              <SectionHeading icon={SparklesIcon} title="Key Features" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                D4C ships with four major additions over stock pi. Each one
                solves a specific pain point in my development workflow.
              </p>

              <div className="space-y-6">
                <FeatureBlock
                  icon={<PuzzleIcon size={20} className="text-cta" />}
                  title="Plan & Build Modes"
                  description="The flagship feature. Plan mode forces the agent to think before acting: it produces a structured breakdown of what needs to be done, identifies risks, and lays out an approach. Build mode executes the plan methodically, section by section. This separation of thinking and doing dramatically reduces hallucination and keeps the agent on track."
                />
                <FeatureBlock
                  icon={<CheckedIcon size={20} className="text-cta" />}
                  title="Built-in TODO Tracking"
                  description="Imported from the pi marketplace but integrated at the agent level. The agent can create, update, and check off tasks as it works. This gives me visibility into what's been done and what's pending — essential for multi-step refactors."
                />
                <FeatureBlock
                  icon={<MagnifierIcon size={20} className="text-cta" />}
                  title="Integrated Web Search"
                  description="Also from the pi marketplace, but baked in as a first-class capability. The agent can search the web for current documentation, package versions, and known issues — no context-switching needed. This alone cut my research time by roughly half."
                />
                <FeatureBlock
                  icon={<CpuIcon size={20} className="text-cta" />}
                  title="Permanent MCP Servers"
                  description="Two MCP servers run permanently: Context7 (for querying library documentation and code examples in real time) and Playwright (for browser automation and visual testing). These are always available — no manual setup per session, no config files to remember. The agent just uses them when needed."
                />
              </div>

              <Callout>
                <p className="text-sm md:text-base">
                  <strong>Why MCP servers instead of extensions?</strong>{" "}
                  Context7 and Playwright are deeply embedded tools. Context7
                  provides documentation lookup that keeps the agent accurate
                  with library APIs. Playwright lets the agent test UI changes
                  interactively. Extensions could provide similar functionality,
                  but permanent MCP servers guarantee they&apos;re always
                  available without configuration overhead.
                </p>
              </Callout>

              <div className="mt-10 bg-card border-2 border-bg-dark rounded-sm p-6">
                <h4 className="text-xs font-industrial uppercase tracking-widest text-gold mb-4">
                  Feature Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: "2", label: "New Modes (Plan + Build)" },
                    { value: "2", label: "Integrated Marketplace Extensions" },
                    { value: "2", label: "Permanent MCP Servers" },
                    { value: "1", label: "Custom /update Skill" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl md:text-3xl font-industrial font-bold text-cta">
                        {stat.value}
                      </div>
                      <div className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <figure className="my-12 -mx-4 md:mx-0">
              <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark bg-bg-dark shadow-lg">
                <Image
                  src="/D4C_BuildMode.png"
                  alt="D4C build mode executing a planned implementation step by step"
                  fill
                  className="object-contain"
                />
              </div>
              <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                Fig 2 — Build mode in action: executing each step from the plan
                with progress tracking.
              </figcaption>
            </figure>

            <section id="setup" className="mb-16 scroll-mt-24">
              <SectionHeading icon={CodeIcon} title="Setup & Architecture" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                D4C starts from the pi codebase and applies a layered
                customization strategy. Instead of modifying pi&apos;s core files
                directly (which would break on updates), every custom feature
                lives in its own directory or config file.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div>
                  <h4 className="text-xs font-industrial uppercase tracking-widest text-gold mb-3">
                    Core Stack
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Pi coding agent — Base agent framework",
                      "Custom skills — Plan mode, build mode, /update",
                      "MCP servers — Context7 + Playwright",
                      "Marketplace extensions — TODO + WebSearch",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <CheckedIcon size={16} className="text-success mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-industrial uppercase tracking-widest text-gold mb-3">
                    Architecture Principle
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "All custom features in isolated directories",
                      "No modifications to pi's core source files",
                      "Config-driven feature registration",
                      "/update skill layers changes on top of upstream sync",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <CheckedIcon size={16} className="text-success mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <figure className="my-10 -mx-4 md:mx-0">
                <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark bg-bg-dark shadow-lg">
                  <Image
                    src="/D4C_MCPServers.png"
                    alt="D4C configuration showing permanent MCP server setup"
                    fill
                    className="object-contain"
                  />
                </div>
                <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                  Fig 3 — Permanent MCP server configuration: Context7 and
                  Playwright always available.
                </figcaption>
              </figure>
            </section>

            <section id="challenges" className="mb-16 scroll-mt-24">
              <SectionHeading icon={ChartLineIcon} title="Challenges & Fixes" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                Building D4C was straightforward for the most part — pi is well
                architected. But one problem nearly killed the project:
              </p>

              <div className="space-y-8">
                <LearningBlock
                  number="01"
                  title="The Update Problem"
                  content="The first time I tried to pull upstream changes from pi's repo, it wiped every customization I had made. Plan mode? Gone. MCP servers? Gone. The entire branch was a fork that would drift further from upstream with every commit. I needed a way to stay current without rebuilding my customizations from scratch every time."
                />
                <LearningBlock
                  number="02"
                  title="The /update Skill"
                  content="I built a custom /update command that solves this. Instead of a naive git pull, the /update skill pulls the latest from pi's upstream, then reapplies all D4C-specific customizations on top — skills, configs, MCP servers, extensions. The layering is deterministic: pull, merge, overlay. No manual conflict resolution, no lost features."
                />
                <LearningBlock
                  number="03"
                  title="Extension Integration Depth"
                  content="TODO and WebSearch exist in pi's marketplace, but running them as extensions meant they weren't deeply integrated. The agent could use them, but they didn't feel native. I had to modify how the agent registers and prefers these tools — making them first-class citizens rather than optional add-ons."
                />
                <LearningBlock
                  number="04"
                  title="MCP Server Reliability"
                  content="Permanent MCP servers need to be resilient. If Context7 or Playwright fail, the agent should degrade gracefully rather than crash. I added health-check retries and fallback messaging so the agent acknowledges the tool is down and suggests alternatives instead of failing silently."
                />
              </div>

              <PullQuote>
                &quot;The /update skill was the make-or-break feature. Without
                it, D4C would have been a static fork — dead in the water after
                the first upstream sync.&quot;
              </PullQuote>
            </section>

            <figure className="my-12 -mx-4 md:mx-0">
              <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark bg-bg-dark shadow-lg">
                <Image
                  src="/D4C_UpdateSkill.png"
                  alt="D4C /update skill output showing the pull-and-layer process"
                  fill
                  className="object-contain"
                />
              </div>
              <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                Fig 4 — The /update skill in action: pulling upstream changes and
                layering D4C features on top.
              </figcaption>
            </figure>

            <section id="roadmap" className="mb-16 scroll-mt-24">
              <SectionHeading icon={RocketIcon} title="What's Next" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                D4C is actively used as my daily coding agent. Here&apos;s what I&apos;m
                planning next:
              </p>

              <div className="relative border-l-2 border-divider pl-6 space-y-8">
                <RoadmapItem
                  phase="In Progress"
                  title="Custom Skill SDK"
                  description="A lightweight SDK for writing custom skills without touching the agent's internals. The goal is to make adding a new mode or command as simple as dropping a file into a directory."
                  status="In Progress"
                />
                <RoadmapItem
                  phase="Planned"
                  title="Session Memory Persistence"
                  description="Remember decisions and context across sessions. If the agent figured out your project structure in a previous session, it shouldn't need to rediscover it."
                  status="Planned"
                />
                <RoadmapItem
                  phase="Exploring"
                  title="Multi-Agent Orchestration"
                  description="Spin up specialized sub-agents for parallel task execution. One agent builds while another researches — coordinated by the main agent."
                  status="Exploring"
                />
                <RoadmapItem
                  phase="Exploring"
                  title="Open Source Release"
                  description="Package D4C's customization layer so anyone can apply the same features to their own pi fork. Plan/build modes, MCP servers, and the /update skill as a reusable overlay."
                  status="Exploring"
                />
              </div>
            </section>

            <section className="mt-16 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-sm p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
              <div className="relative z-10">
                <TerminalIcon size={40} className="text-purple-300 mb-4" />
                <h3 className="text-2xl md:text-3xl font-industrial font-bold uppercase tracking-wider text-white mb-4">
                  Try D4C
                </h3>
                <p className="text-white/80 leading-relaxed max-w-xl mb-6">
                  Fork it, tweak it, or just browse the source. D4C is open and
                  built in the open — contributions and ideas welcome.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="https://github.com/Isaac-1555/D4C" target="_blank" data-icon-hover-trigger>
                    <Button className="bg-white text-indigo-900 hover:bg-indigo-100 border-white">
                      View on GitHub
                      <IconHoverWrapper hoverTrigger="closest">
                        <RightChevron size={16} className="ml-2" />
                      </IconHoverWrapper>
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-divider">
              <Link
                href="/blog"
                data-icon-hover-trigger
                className="inline-flex items-center gap-2 text-sm font-tech uppercase tracking-widest text-text-secondary hover:text-cta transition-colors"
              >
                <IconHoverWrapper hoverTrigger="closest">
                  <ArrowBackIcon size={16} />
                </IconHoverWrapper>
                Back to all posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <h2 className="flex items-center gap-3 text-xl md:text-2xl font-industrial uppercase tracking-widest text-text-primary mb-6 pb-3 border-b border-divider">
      <Icon className="h-5 w-5 text-cta shrink-0" />
      {title}
    </h2>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-bg-accent/5 border-l-4 border-cta rounded-sm p-5 my-6">
      {children}
    </div>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-10 border-l-4 border-gold pl-6 py-2">
      <p className="text-lg md:text-xl italic text-text-primary leading-relaxed">
        {children}
      </p>
    </blockquote>
  );
}

function FeatureBlock({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 shrink-0">{icon}</div>
      <div>
        <h4 className="font-industrial uppercase tracking-widest text-sm text-text-primary mb-1">
          {title}
        </h4>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function LearningBlock({
  number,
  title,
  content,
}: {
  number: string;
  title: string;
  content: string;
}) {
  return (
    <div className="flex gap-4 md:gap-6">
      <div className="text-3xl md:text-4xl font-industrial font-bold text-bg-dark/20 shrink-0 leading-none select-none">
        {number}
      </div>
      <div>
        <h4 className="font-industrial uppercase tracking-widest text-sm text-text-primary mb-2">
          {title}
        </h4>
        <p className="text-sm md:text-base text-text-secondary leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
}

function RoadmapItem({
  phase,
  title,
  description,
  status,
}: {
  phase: string;
  title: string;
  description: string;
  status: string;
}) {
  const statusColor =
    status === "In Progress"
      ? "text-success"
      : status === "Planned"
        ? "text-gold"
        : "text-text-secondary";

  return (
    <div className="relative">
      <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-cta border-2 border-bg-base" />
      <div className="text-xs font-tech uppercase tracking-widest text-text-secondary mb-1">
        {phase}
      </div>
      <h4 className="font-industrial uppercase tracking-widest text-sm text-text-primary mb-1">
        {title}
      </h4>
      <p className="text-sm text-text-secondary leading-relaxed mb-2">
        {description}
      </p>
      <span className={`text-xs font-tech uppercase tracking-widest ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}
