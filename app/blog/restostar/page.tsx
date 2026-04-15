import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ArrowBackIcon from "@/components/icons/arrow-back-icon";
import RightChevron from "@/components/icons/right-chevron";
import ClockIcon from "@/components/icons/clock-icon";
import UserIcon from "@/components/icons/user-icon";
import SoupIcon from "@/components/icons/soup-icon";
import BulbSvg from "@/components/icons/bulb-svg";
import TargetIcon from "@/components/icons/target-icon";
import SparklesIcon from "@/components/icons/sparkles-icon";
import CodeXmlIcon from "@/components/icons/code-xml-icon";
import ChartLineIcon from "@/components/icons/chart-line-icon";
import RocketIcon from "@/components/icons/rocket-icon";
import TriangleAlertIcon from "@/components/icons/triangle-alert-icon";
import CheckedIcon from "@/components/icons/checked-icon";
import MessageCircleIcon from "@/components/icons/message-circle-icon";
import StarIcon from "@/components/icons/star-icon";
import ShieldCheck from "@/components/icons/shield-check";
import ChartBarIcon from "@/components/icons/chart-bar-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";

export const metadata = {
  title: "Restostar: Building a Reputation Engine for Restaurants | Isaac PM Blog",
  description:
    "The story behind Restostar — a startup idea that turns unhappy diners into private conversations and happy ones into public advocates.",
};

/* ------------------------------------------------------------------ */
/*  Table of Contents data                                            */
/* ------------------------------------------------------------------ */
const TOC = [
  { id: "problem", label: "The Problem" },
  { id: "solution", label: "The Solution" },
  { id: "features", label: "Features & Highlights" },
  { id: "tech", label: "Tech Stack & Architecture" },
  { id: "learnings", label: "Challenges & Learnings" },
  { id: "roadmap", label: "What's Next" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
export default function RestostarArticle() {
  return (
    <article className="pb-24">
      {/* ── Hero ── */}
      <header className="relative w-full bg-gradient-to-br from-emerald-900 to-teal-900 overflow-hidden">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

        <div className="container mx-auto px-4 pt-28 pb-16 md:pt-36 md:pb-20 relative z-10">
          {/* Back link */}
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

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm font-tech mb-6">
            <span className="flex items-center gap-1.5">
              <UserIcon size={14} /> Isaac
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon size={14} /> April 2026
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon size={14} /> 8 min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-industrial font-bold uppercase tracking-wider text-white leading-tight max-w-4xl">
            Restostar:{" "}
            <span className="text-emerald-300">
              Turning Unhappy Diners into Private Conversations
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            The story behind a startup idea that rethinks restaurant reputation
            management — routing feedback by sentiment so that every review
            works <em>for</em> the restaurant, not against it.
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8">
            {["SaaS", "0 to 1", "MVP", "Reputation Management", "Restaurants"].map(
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

      {/* ── Body grid ── */}
      <div className="container mx-auto px-4 mt-12 lg:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* --- Sidebar / TOC --- */}
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

              {/* Quick links */}
              <div className="mt-10 space-y-3">
                <Link href="https://restostar.vercel.app/" target="_blank" data-icon-hover-trigger>
                  <Button variant="default" className="w-full text-xs">
                    Live Demo
                    <IconHoverWrapper hoverTrigger="closest">
                      <RightChevron size={14} className="ml-2" />
                    </IconHoverWrapper>
                  </Button>
                </Link>
                <Link
                  href="https://github.com/Isaac-1555/Restostar"
                  target="_blank"
                  data-icon-hover-trigger
                >
                  <Button variant="outline" className="w-full text-xs mt-3">
                    Source Code
                    <IconHoverWrapper hoverTrigger="closest">
                      <RightChevron size={14} className="ml-2" />
                    </IconHoverWrapper>
                  </Button>
                </Link>
              </div>
            </nav>
          </aside>

          {/* --- Main content --- */}
          <div className="lg:col-span-9 max-w-none">
            {/* Mobile TOC */}
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

            {/* ────────────────────────────────────────────── */}
            {/*  1. PROBLEM STATEMENT                         */}
            {/* ────────────────────────────────────────────── */}
            <section id="problem" className="mb-16 scroll-mt-24">
              <SectionHeading icon={TriangleAlertIcon} title="The Problem" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                Walk into any restaurant and ask the owner what keeps them up at
                night. Somewhere near the top of the list — right after food
                costs and staffing — you will hear the same answer:{" "}
                <strong className="text-text-primary">online reviews</strong>.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                A single 1-star review on Google or Yelp can undo months of
                goodwill. Worse, most negative reviews are posted by guests who
                never told the staff anything was wrong. They smile, pay the
                bill, walk out — and then vent to the internet. The restaurant
                learns about the problem only after the damage is public and
                permanent.
              </p>

              <Callout>
                <p className="text-sm md:text-base">
                  <strong>The core paradox:</strong> The guests most willing to
                  leave feedback are the angriest ones, and the only channel
                  available to them is a public review site. Happy guests rarely
                  bother. The system is structurally rigged against restaurants.
                </p>
              </Callout>

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mt-6">
                Existing solutions fall into two camps. Review-aggregation
                dashboards that let owners <em>monitor</em> the damage after it
                happens. Or pushy &quot;tap-to-review&quot; kiosks that treat
                every customer identically, annoying happy guests and giving
                unhappy ones a megaphone. Neither addresses the root cause: the
                feedback channel itself needs to be smarter.
              </p>
            </section>

            {/* ────────────────────────────────────────────── */}
            {/*  2. SOLUTION OVERVIEW                         */}
            {/* ────────────────────────────────────────────── */}
            <section id="solution" className="mb-16 scroll-mt-24">
              <SectionHeading icon={BulbSvg} title="The Solution" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                Restostar is a <strong className="text-text-primary">sentiment-aware feedback funnel</strong>{" "}
                for restaurants. Instead of sending every guest to the same
                review page, it asks a single, fast question about their
                experience and then <em>routes them</em> based on how they feel:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <div className="bg-success/10 border border-success/30 rounded-sm p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <StarIcon size={20} className="text-success" />
                    <h4 className="font-industrial uppercase tracking-widest text-sm text-success">
                      Happy Guest
                    </h4>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Guided to leave a public review on Google, Yelp, or
                    TripAdvisor — with a pre-filled prompt that makes the
                    process frictionless. The restaurant earns organic positive
                    visibility.
                  </p>
                </div>
                <div className="bg-cta/10 border border-cta/30 rounded-sm p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={20} className="text-cta" />
                    <h4 className="font-industrial uppercase tracking-widest text-sm text-cta">
                      Unhappy Guest
                    </h4>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Redirected to a private feedback form that goes straight to
                    the owner&apos;s dashboard. The issue gets resolved behind
                    closed doors — before it ever becomes a public review.
                  </p>
                </div>
              </div>

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The result is a win-win. Guests feel heard regardless of
                sentiment. Restaurants increase their public star ratings
                organically while catching operational problems early. No
                gimmicks, no fake reviews — just smarter routing.
              </p>

              <PullQuote>
                &quot;What if the feedback channel itself was intelligent enough
                to know where each piece of feedback should go?&quot;
              </PullQuote>
            </section>

            {/* ── Dashboard image ── */}
            <figure className="my-12 -mx-4 md:mx-0">
              <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark shadow-lg">
                <Image
                  src="/Restostar_Dashboard.png"
                  alt="Restostar owner dashboard showing feedback analytics and sentiment breakdown"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                Fig 1 — The Restostar owner dashboard: real-time feedback,
                sentiment trends, and alert management.
              </figcaption>
            </figure>

            {/* ────────────────────────────────────────────── */}
            {/*  3. FEATURES & HIGHLIGHTS                     */}
            {/* ────────────────────────────────────────────── */}
            <section id="features" className="mb-16 scroll-mt-24">
              <SectionHeading icon={SparklesIcon} title="Features & Highlights" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                The MVP was scoped around four capabilities that directly
                validate the hypothesis: can a sentiment-based routing system
                measurably shift a restaurant&apos;s public reputation?
              </p>

              <div className="space-y-6">
                <FeatureBlock
                  icon={<TargetIcon size={20} className="text-cta" />}
                  title="Smart Sentiment Routing"
                  description="A lightweight questionnaire gauges guest satisfaction in under 10 seconds. Positive sentiment triggers a public review prompt; negative sentiment opens a private channel. The routing logic is configurable per restaurant."
                />
                <FeatureBlock
                  icon={<MessageCircleIcon size={20} className="text-cta" />}
                  title="Instant Owner Alerts"
                  description="When critical feedback arrives — low ratings or specific keywords like 'food poisoning' or 'rude' — the owner gets an immediate notification via email and in-dashboard alert. Response time drops from days to minutes."
                />
                <FeatureBlock
                  icon={<ChartBarIcon size={20} className="text-cta" />}
                  title="Analytics Dashboard"
                  description="Tracks feedback volume, sentiment trends over time, resolution rate, and public review conversion. Owners can see which shifts, menu items, or staff interactions correlate with negative feedback."
                />
                <FeatureBlock
                  icon={<ShieldCheck size={20} className="text-cta" />}
                  title="Zero Negative Public Reviews (Pilot)"
                  description="During the initial pilot period, every piece of negative feedback was captured privately. Zero negative reviews made it to public platforms — not because they were suppressed, but because they were resolved first."
                />
              </div>

              <div className="mt-10 bg-card border-2 border-bg-dark rounded-sm p-6">
                <h4 className="text-xs font-industrial uppercase tracking-widest text-gold mb-4">
                  Pilot Results
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: "0", label: "Negative Public Reviews" },
                    { value: "15+", label: "Issues Caught Privately" },
                    { value: "<10s", label: "Avg. Feedback Time" },
                    { value: "100%", label: "Owner Alert Delivery" },
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

            {/* ────────────────────────────────────────────── */}
            {/*  4. TECH STACK & ARCHITECTURE                 */}
            {/* ────────────────────────────────────────────── */}
            <section id="tech" className="mb-16 scroll-mt-24">
              <SectionHeading icon={CodeXmlIcon} title="Tech Stack & Architecture" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The architecture was designed for speed-to-market. As a solo
                founder building an MVP, every technology choice was evaluated
                on a single criterion: does this let me validate the idea
                faster, or does it add complexity I don&apos;t need yet?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div>
                  <h4 className="text-xs font-industrial uppercase tracking-widest text-gold mb-3">
                    Frontend
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Next.js — App Router for SSR and static generation",
                      "React 19 — Component-driven UI with server components",
                      "Tailwind CSS — Rapid, consistent styling",
                      "Vercel — Deployment with edge functions and analytics",
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
                    Backend & Data
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Node.js API routes — Lightweight serverless functions",
                      "Database layer — Feedback storage and analytics queries",
                      "Sentiment analysis — Keyword-based + threshold scoring",
                      "Email notifications — Transactional alerts to owners",
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

              {/* AI image */}
              <figure className="my-10 -mx-4 md:mx-0">
                <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark shadow-lg">
                  <Image
                    src="/Restostar_AI.png"
                    alt="Restostar AI-powered sentiment analysis pipeline"
                    fill
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                  Fig 2 — Sentiment analysis pipeline: from guest input to
                  routing decision.
                </figcaption>
              </figure>

              <Callout>
                <p className="text-sm md:text-base">
                  <strong>Architecture principle:</strong> The system was built
                  as a monorepo with clear separation between the guest-facing
                  feedback flow (public), the owner dashboard (authenticated),
                  and the routing/notification engine (server-side). This makes
                  it straightforward to swap out the sentiment engine later
                  without touching the UI.
                </p>
              </Callout>
            </section>

            {/* ────────────────────────────────────────────── */}
            {/*  5. CHALLENGES & LEARNINGS                    */}
            {/* ────────────────────────────────────────────── */}
            <section id="learnings" className="mb-16 scroll-mt-24">
              <SectionHeading icon={ChartLineIcon} title="Challenges & Learnings" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                Building Restostar from zero to a working pilot taught me more
                about product thinking than any framework or methodology could.
                Here are the lessons that stuck:
              </p>

              <div className="space-y-8">
                <LearningBlock
                  number="01"
                  title="Scope is the enemy of shipping"
                  content="The first version of the PRD had 23 features. The shipped MVP had 4. Every feature I cut hurt — but each one also brought the launch date closer by a week. The hardest product decision isn't what to build; it's what to deliberately leave out."
                />
                <LearningBlock
                  number="02"
                  title="Talk to restaurant owners, not restaurant tech"
                  content="Early user research showed that owners don't think in terms of 'sentiment analysis' or 'NLP pipelines.' They think in terms of 'that table that looked unhappy' and 'I wish I'd known before they left.' The language of the product had to match their mental model, not mine."
                />
                <LearningBlock
                  number="03"
                  title="The routing threshold is the product"
                  content="Getting the sentiment threshold right — the line between 'route to public review' and 'route to private feedback' — turned out to be the most consequential design decision. Too aggressive and you funnel lukewarm guests to private (losing potential positive reviews). Too lenient and genuinely unhappy guests end up on Google."
                />
                <LearningBlock
                  number="04"
                  title="Speed of feedback loop > accuracy of analysis"
                  content="Owners cared less about a detailed sentiment breakdown and more about getting alerted fast. The first version had a sophisticated analytics view that nobody used in the pilot. The instant alert feature — a simple email — was the most praised capability."
                />
              </div>

              <PullQuote>
                &quot;I went in thinking I was building a dashboard. I came out
                realizing I was building an early warning system.&quot;
              </PullQuote>
            </section>

            {/* ────────────────────────────────────────────── */}
            {/*  6. FUTURE ROADMAP                            */}
            {/* ────────────────────────────────────────────── */}
            <section id="roadmap" className="mb-16 scroll-mt-24">
              <SectionHeading icon={RocketIcon} title="What's Next" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                Restostar started as a hypothesis. The pilot validated the core
                loop. Here is where I want to take it:
              </p>

              <div className="relative border-l-2 border-divider pl-6 space-y-8">
                <RoadmapItem
                  phase="Phase 1"
                  title="AI-Powered Sentiment Engine"
                  description="Replace the keyword-based routing with an LLM-backed sentiment classifier that understands nuance, sarcasm, and multilingual feedback. This lifts accuracy from ~80% to 95%+ and removes the need for manual threshold tuning."
                  status="In Progress"
                />
                <RoadmapItem
                  phase="Phase 2"
                  title="Multi-Location Support"
                  description="A single dashboard for restaurant groups and franchises. Aggregate analytics across locations, benchmark performance, and identify systemic issues vs. location-specific ones."
                  status="Planned"
                />
                <RoadmapItem
                  phase="Phase 3"
                  title="Integration Ecosystem"
                  description="Direct integrations with POS systems, reservation platforms (OpenTable, Resy), and CRM tools. Auto-trigger feedback requests after a guest's visit without any staff involvement."
                  status="Exploring"
                />
                <RoadmapItem
                  phase="Phase 4"
                  title="Public Review Response Assistant"
                  description="An AI-assisted tool that helps owners craft professional, empathetic responses to the public reviews that do make it through. Tone-matched to the restaurant's brand voice."
                  status="Exploring"
                />
              </div>
            </section>

            {/* ── Closing CTA ── */}
            <section className="mt-16 bg-gradient-to-br from-emerald-900 to-teal-900 rounded-sm p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
              <div className="relative z-10">
                <SoupIcon size={40} className="text-emerald-300 mb-4" />
                <h3 className="text-2xl md:text-3xl font-industrial font-bold uppercase tracking-wider text-white mb-4">
                  Try Restostar
                </h3>
                <p className="text-white/80 leading-relaxed max-w-xl mb-6">
                  Explore the live MVP or dive into the source code. Restostar
                  is an open project — feedback and contributions are welcome.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="https://restostar.vercel.app/" target="_blank" data-icon-hover-trigger>
                    <Button className="bg-white text-emerald-900 hover:bg-emerald-100 border-white">
                      Visit Live Demo
                      <IconHoverWrapper hoverTrigger="closest">
                        <RightChevron size={16} className="ml-2" />
                      </IconHoverWrapper>
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com/Isaac-1555/Restostar"
                    target="_blank"
                    data-icon-hover-trigger
                  >
                    <Button
                      variant="outline"
                      className="text-white border-white/40 hover:bg-white/10 hover:text-white"
                    >
                      View Source Code
                      <IconHoverWrapper hoverTrigger="closest">
                        <RightChevron size={16} className="ml-2" />
                      </IconHoverWrapper>
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* ── Back to blog ── */}
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

/* ================================================================== */
/*  Sub-components                                                    */
/* ================================================================== */

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
      {/* Timeline dot */}
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
