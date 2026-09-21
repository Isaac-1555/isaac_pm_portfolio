import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GalleryProvider, Figure } from "@/components/image/gallery-context";
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
import { TopoMap } from "@/components/case-study/TopoMap";

export const metadata = {
  title: "D4C: Building a Terminal Coding Agent in Rust from Scratch | Isaac PM Blog",
  description:
    "How I built a terminal coding agent from scratch in Rust — planning-first workflows, a native Ratatui TUI, a built-in MCP client, and provider-agnostic model support.",
};

const TOC = [
  { id: "intro", label: "What is D4C?" },
  { id: "why", label: "Why Rust, Why from Scratch" },
  { id: "features", label: "Key Features" },
  { id: "setup", label: "Setup & Architecture" },
  { id: "challenges", label: "Challenges & Fixes" },
  { id: "roadmap", label: "What's Next" },
];

export default function D4CArticle() {
  return (
    <GalleryProvider>
      <article className="pb-24">
      <header className="pt-28 pb-24 md:pt-36 md:pb-28 min-h-[600px] relative w-full bg-gradient-to-br from-slate-900 to-bg-dark overflow-hidden">
        <TopoMap activeId="blog-d4c" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 z-[2] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
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
              Building a Terminal Coding Agent in Rust from Scratch
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            Most coding agents optimize for freeform chat — and you find out
            the model misunderstood you only after your files change. D4C
            makes planning a first-class, interactive step. Built from
            scratch in Rust with a native TUI.
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {["Rust", "TUI", "AI Agent", "MCP", "Open Source"].map(
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
              <h2 className="text-sm font-industrial uppercase tracking-widest text-text-secondary mb-4">
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
              <h2 className="text-sm font-industrial uppercase tracking-widest text-text-secondary mb-3">
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
                — is a lightweight, modular terminal coding agent built from
                scratch in Rust with a native TUI. It shares no source code
                with Claude Code, OpenCode, or any existing agent — it&apos;s
                inspired by their usability, then rebuilt around a different
                core idea.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                That idea: <strong className="text-text-primary">guided workflows
                over open-ended chat</strong>. Most agents take your request and
                immediately start editing files — you discover scope or
                misunderstanding only after changes are made. D4C integrates
                model providers through APIs and treats planning as a
                first-class, interactive step: repository context is gathered,
                ambiguities are resolved through a structured questionnaire,
                assumptions are surfaced for review, and only an{" "}
                <strong className="text-text-primary">approved plan</strong> is
                executed, with checkpoints along the way.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The name is a nod to the JoJo&apos;s Bizarre Adventure reference.
                It stuck.
              </p>
            </section>

            <section id="why" className="mb-16 scroll-mt-24">
              <SectionHeading icon={BulbSvg} title="Why Rust, Why from Scratch" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                I use coding agents daily, and three frustrations kept coming
                up — none of them fixable by tweaking someone else&apos;s tool:
              </p>

              <Callout>
                <p className="text-sm md:text-base">
                  <strong>The problems:</strong> freeform chat wastes iterations
                  on misunderstandings; autonomous edits on real codebases are
                  hard to trust; and nothing records <em>why</em> a change was
                  made. On top of that, most agents lock you into one
                  vendor&apos;s CLI and treat local models as an afterthought.
                </p>
              </Callout>

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mt-6 mb-6">
                So D4C is built from scratch in Rust. Three reasons:
              </p>

              <div className="space-y-6 mb-6">
                <FeatureBlock
                  icon={<RocketIcon size={20} className="text-cta" />}
                  title="Startup under 100ms"
                  description="A coding agent should feel like a terminal tool, not a web app. Rust plus Ratatui gets D4C to its first interactive UI frame in under 100ms — no Node runtime booting, no framework hydration."
                />
                <FeatureBlock
                  icon={<PuzzleIcon size={20} className="text-cta" />}
                  title="Provider-agnostic by design"
                  description="D4C integrates model providers through APIs, not through one vendor's CLI. Self-hosted and local models get first-class support, not a bolted-on compatibility layer."
                />
                <FeatureBlock
                  icon={<CheckedIcon size={20} className="text-cta" />}
                  title="Guided, auditable workflows"
                  description="The planning-first interaction model is the core differentiator. Every change traces back to an approved plan, and checkpoints make autonomous edits reviewable instead of scary."
                />
              </div>

              <PullQuote>
                &quot;Most terminal agents optimize for freeform chat. D4C
                optimizes for getting it right before touching your files.&quot;
              </PullQuote>
            </section>

            <Figure
              src="/D4C_PlanMode.png"
              alt="D4C plan mode showing structured task breakdown and execution plan"
              caption="Fig 1 — D4C's planning workflow: structured breakdown, questionnaire, and an approved plan before any code is written."
              priority
            />

            <section id="features" className="mb-16 scroll-mt-24">
              <SectionHeading icon={SparklesIcon} title="Key Features" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                D4C&apos;s feature set follows from the planning-first philosophy.
                Each one exists to reduce surprise, not to add surface area.
              </p>

              <div className="space-y-6">
                <FeatureBlock
                  icon={<PuzzleIcon size={20} className="text-cta" />}
                  title="Planning-First Workflows"
                  description="The flagship feature. Before any code changes, D4C gathers repository context, resolves ambiguities through a structured questionnaire, and surfaces its assumptions for review. Only after you approve the plan does execution begin — with checkpoints along the way. This separation of thinking and doing dramatically reduces hallucination and builds trust in autonomous edits."
                />
                <FeatureBlock
                  icon={<TerminalIcon size={20} className="text-cta" />}
                  title="Native Ratatui TUI"
                  description="D4C renders with Ratatui + crossterm — a true terminal UI, not a REPL with colored text. Fast startup, full keyboard control, and a layout that stays responsive while streaming model output in the background."
                />
                <FeatureBlock
                  icon={<CpuIcon size={20} className="text-cta" />}
                  title="Native MCP Client"
                  description="D4C implements the Model Context Protocol natively in the Rust core — no external MCP launcher process. Tools and context servers plug in through a standard protocol instead of vendor-specific glue."
                />
                <FeatureBlock
                  icon={<MagnifierIcon size={20} className="text-cta" />}
                  title="Automatic Model Selection"
                  description="A small embedded router picks the model based on task complexity — cheap models for routine edits, stronger ones for gnarly refactors. No separate heavy service, no external dependency, and it's transparent: you can always see and override what was chosen."
                />
                <FeatureBlock
                  icon={<CodeIcon size={20} className="text-cta" />}
                  title="Slash-Command Architecture"
                  description="Slash commands are the primary interaction surface — not buried menus or chat keywords. Everything the agent can do is discoverable, scriptable, and consistent."
                />
              </div>

              <Callout>
                <p className="text-sm md:text-base">
                  <strong>Why an embedded router instead of a bigger service?</strong>{" "}
                  Model choice is a per-task decision, not a per-session config.
                  Keeping the router small and inside the agent means startup
                  stays fast, there&apos;s nothing else to deploy, and the
                  selection logic stays auditable in one place.
                </p>
              </Callout>

              <div className="mt-10 bg-card border-2 border-bg-dark rounded-sm p-6">
                <h4 className="text-sm font-industrial uppercase tracking-widest text-gold mb-4">
                  Feature Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: "<100ms", label: "First UI Frame" },
                    { value: "1", label: "Approved Plan Before Execution" },
                    { value: "Native", label: "MCP Client in Rust" },
                    { value: "Auto", label: "Model Router" },
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

            <Figure
              src="/D4C_BuildMode.png"
              alt="D4C executing a planned implementation step by step"
              caption="Fig 2 — Execution with checkpoints: each step from the approved plan, tracked as it completes."
            />

            <section id="setup" className="mb-16 scroll-mt-24">
              <SectionHeading icon={CodeIcon} title="Setup & Architecture" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                D4C is a Rust workspace split into three crates, each
                independently testable:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div>
                  <h4 className="text-sm font-industrial uppercase tracking-widest text-gold mb-3">
                    Core Stack
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Rust 2024 — single language, no runtime",
                      "d4c-core — agent logic, tools, MCP client",
                      "d4c-tui — Ratatui + crossterm terminal UI",
                      "d4c-cli — headless / non-interactive entry",
                      "Tokio — async runtime for streaming model I/O",
                      "reqwest — provider API calls over rustls",
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
                  <h4 className="text-sm font-industrial uppercase tracking-widest text-gold mb-3">
                    Architecture Principles
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Crates split: core / TUI / CLI independently testable",
                      "Provider abstraction — no vendor lock-in",
                      "MCP implemented natively in the core crate",
                      "Plans, checkpoints, and tool calls are first-class records",
                      "Model router embedded — no external service",
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

              <Figure
                src="/D4C_MCPServers.png"
                alt="D4C configuration showing MCP server setup"
                caption="Fig 3 — MCP client configuration in the Rust core: context servers plug in over the standard protocol."
              />
            </section>

            <section id="challenges" className="mb-16 scroll-mt-24">
              <SectionHeading icon={ChartLineIcon} title="Challenges & Fixes" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                Building an agent from scratch means building everything
                twice: once as code, once as an interaction model. These four
                problems shaped the project the most:
              </p>

              <div className="space-y-8">
                <LearningBlock
                  number="01"
                  title="The Trust Problem"
                  content="The whole reason D4C exists. Early prototypes edited files directly from chat and I stopped trusting them on real codebases. The fix wasn't a confirmation dialog — it was restructuring the interaction: context gathering, a structured questionnaire for ambiguities, surfaced assumptions, and an approved plan with checkpoints before execution starts."
                />
                <LearningBlock
                  number="02"
                  title="Streaming Output in a TUI"
                  content="Rendering live model output while keeping a Ratatui layout responsive is trickier than printing to stdout. The solution was an event-driven design on Tokio: model streams push events into a channel, and the TUI redraws from state snapshots — the render loop never blocks on the network."
                />
                <LearningBlock
                  number="03"
                  title="MCP Without the Glue"
                  content="Most agents shell out to an external MCP launcher process. D4C implements the protocol natively in the Rust core, which means better error handling and no process-management headaches — but it also meant implementing the protocol's lifecycle, tool discovery, and error semantics by hand."
                />
                <LearningBlock
                  number="04"
                  title="Provider Abstraction"
                  content="Every provider's API differs in streaming format, tool-call shape, and error behavior. The abstraction layer normalizes all of it into one internal format — which is also what makes the automatic model router possible: routing is just choosing among normalized providers per task."
                />
              </div>

              <PullQuote>
                &quot;Building from scratch wasn&apos;t the hard part. Deciding
                what the agent should ask before it acts was.&quot;
              </PullQuote>
            </section>

            <Figure
              src="/D4C_UpdateSkill.png"
              alt="D4C terminal session showing slash commands in action"
              caption="Fig 4 — Slash commands are the primary interaction surface: discoverable, scriptable, consistent."
            />

            <section id="roadmap" className="mb-16 scroll-mt-24">
              <SectionHeading icon={RocketIcon} title="What's Next" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                D4C is in active development as my daily coding agent.
                Here&apos;s the direction:
              </p>

              <div className="relative border-l-2 border-divider pl-6 space-y-8">
                <RoadmapItem
                  phase="In Progress"
                  title="Session Memory Persistence"
                  description="Remember decisions and repository context across sessions. If the agent mapped your project structure yesterday, it shouldn't rediscover it today."
                  status="In Progress"
                />
                <RoadmapItem
                  phase="Planned"
                  title="Richer Checkpoint Review"
                  description="Deeper diff inspection at each checkpoint, plus plan revision mid-execution when reality disagrees with the approved plan."
                  status="Planned"
                />
                <RoadmapItem
                  phase="Exploring"
                  title="Multi-Agent Orchestration"
                  description="Specialized sub-agents for parallel task execution — one builds while another researches, coordinated through the planning layer."
                  status="Exploring"
                />
                <RoadmapItem
                  phase="Exploring"
                  title="Local Model Hardening"
                  description="D4C is provider-agnostic by design; the next step is first-class support for self-hosted inference (Ollama, vLLM) with the same streaming and tool-call guarantees as hosted APIs."
                  status="Exploring"
                />
              </div>
            </section>

            <section className="mt-16 bg-gradient-to-br from-slate-900 to-bg-dark rounded-sm p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
              <div className="relative z-10">
                <TerminalIcon size={40} className="text-purple-300 mb-4" />
                <h3 className="text-2xl md:text-3xl font-industrial font-bold uppercase tracking-wider text-white mb-4">
                  Try D4C
                </h3>
                <p className="text-white/80 leading-relaxed max-w-xl mb-6">
                  Browse the source, read the PRD, or build it yourself. D4C is
                  open and built in the open — contributions and ideas welcome.
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
    </GalleryProvider>
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
    <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-industrial uppercase tracking-widest text-text-primary mb-6 pb-3 border-b border-divider">
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
        <h4 className="font-industrial uppercase tracking-widest text-base text-text-primary mb-1">
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
        <h4 className="font-industrial uppercase tracking-widest text-base text-text-primary mb-2">
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
      <h4 className="font-industrial uppercase tracking-widest text-base text-text-primary mb-1">
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
