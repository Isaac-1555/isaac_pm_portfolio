import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ArrowBackIcon from "@/components/icons/arrow-back-icon";
import ClockIcon from "@/components/icons/clock-icon";
import UserIcon from "@/components/icons/user-icon";
import ScanBarcodeIcon from "@/components/icons/scan-barcode-icon";
import BulbSvg from "@/components/icons/bulb-svg";
import SparklesIcon from "@/components/icons/sparkles-icon";
import CodeIcon from "@/components/icons/code-icon";
import ChartLineIcon from "@/components/icons/chart-line-icon";
import RocketIcon from "@/components/icons/rocket-icon";
import PuzzleIcon from "@/components/icons/layers-icon";
import CpuIcon from "@/components/icons/cpu-icon";
import MagnifierIcon from "@/components/icons/magnifier-icon";
import CheckedIcon from "@/components/icons/checked-icon";
import TriangleAlertIcon from "@/components/icons/triangle-alert-icon";
import GithubIcon from "@/components/icons/github-icon";
import ExternalLinkIcon from "@/components/icons/external-link-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";

export const metadata = {
  title: "Barcode Lists: Building a Shared Barcode Workflow for Calgary Coop | Isaac PM Blog",
  description:
    "How a Monday-morning scanning problem at Calgary Coop turned into a shared Chrome extension with AI-powered OCR, real-time sync, and 24 commits of iteration.",
};

const TOC = [
  { id: "intro", label: "What is Barcode Lists?" },
  { id: "why", label: "Why I Built It" },
  { id: "helping", label: "How It Helped My Colleagues" },
  { id: "features", label: "Feature Deep-Dives" },
  { id: "bugs", label: "Bugs I Fixed" },
  { id: "changelog", label: "Changelog" },
  { id: "roadmap", label: "What's Next" },
];

const CHANGELOG = [
  {
    version: "v1.0",
    date: "Mar 31 2026",
    title: "First commit. Supabase backend live.",
    points: [
      "Supabase backend wired to save lists and numbers",
      "Manifest + project structure scaffold",
      "Documentation pass before any feature work",
    ],
  },
  {
    version: "v1.x",
    date: "Apr 3 – Apr 5 2026",
    title: "AI extraction pipeline + UI cleanup",
    points: [
      "OCR feature using AI for image-to-barcode",
      "Lazy loader added to keep popup snappy",
      "TCO UPC parser using AI for noisy scans",
      "UI pass — removed the floating add button",
    ],
  },
  {
    version: "v1.x",
    date: "Apr 7 – Apr 23 2026",
    title: "Polish + comments",
    points: [
      "Improved AI detection (still needs testing)",
      "Updated AI model for better accuracy",
      "Added comment button on barcodes (local + remote)",
      "Manifest + README updates",
    ],
  },
  {
    version: "v2.x",
    date: "May 13 – May 16 2026",
    title: "Realtime + status states",
    points: [
      "Realtime polling to live-update newly added lists",
      "Icon-only buttons across the popup",
      "Toast notifications + notification badge",
      "Glow effect for new remote lists",
      "Font color changes when a barcode is copied",
      "Red glow for 'important' lists",
      "Opened status for opened lists",
      "Fixed: new list being added to the top",
    ],
  },
  {
    version: "v3.x",
    date: "May 17 2026",
    title: "Manifest hardening",
    points: [
      "Manifest updated for new + opened status fixes",
    ],
  },
  {
    version: "v3.x",
    date: "May 25 2026",
    title: "Phone-list sync fix",
    points: [
      "Fixed phone lists overriding the empty list in the extension",
    ],
  },
  {
    version: "v6.0",
    date: "Jun 17 2026",
    title: "Cloud-first sync + per-op increments",
    points: [
      "Cloud-first sync model",
      "Incremental per-operation updates",
      "Category order persisted across devices",
      "* prefix reserved for important lists",
    ],
  },
];

const FIXES = [
  {
    name: "Phone list sync collision",
    detail:
      "Phone lists were clobbering the empty list state in the extension. Fixed by switching to a per-list key and treating empty as a first-class state rather than a missing entry.",
  },
  {
    name: "New list ordering",
    detail:
      "Newly added lists were being inserted at the wrong position. Reordered the insertion path so new entries land where the user expects them in the sidebar.",
  },
  {
    name: "Notification noise",
    detail:
      "Toasts and badge counts were firing too often. Added deduplication + a state guard so a user only sees a toast for genuinely new content.",
  },
  {
    name: "AI extraction accuracy",
    detail:
      "Initial OCR pass returned noisy barcodes mixed with invoice numbers. Tightened the model prompt and added a post-extraction filter to drop anything that didn't match barcode length/charset rules.",
  },
];

export default function BarcodeListsArticle() {
  return (
    <article className="pb-24">
      <header className="relative w-full bg-gradient-to-br from-slate-800 to-slate-950 overflow-hidden">
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
              <ClockIcon size={14} /> June 2026
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon size={14} /> 10 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-industrial font-bold uppercase tracking-wider text-white leading-tight max-w-4xl">
            Barcode Lists:{" "}
            <span className="text-emerald-300">
              A Shared Workflow for Calgary Coop
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            A Monday-morning scanning problem at Calgary Coop turned into a
            shared Chrome extension with AI-powered OCR, realtime sync, and 24
            commits of iteration over three months.
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {["Chrome Extension", "AI/OCR", "Internal Tool", "B2B", "Realtime"].map(
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
                <Link
                  href="https://chromewebstore.google.com/detail/barcode-lists/colpoghjdbjnmciefnipaefbdflgjifg"
                  target="_blank"
                  data-icon-hover-trigger
                >
                  <Button variant="default" className="w-full text-xs">
                    Chrome Web Store
                    <IconHoverWrapper hoverTrigger="closest">
                      <ExternalLinkIcon size={14} className="ml-2" />
                    </IconHoverWrapper>
                  </Button>
                </Link>
                <Link
                  href="https://github.com/Isaac-1555/Barcode-Lists"
                  target="_blank"
                  data-icon-hover-trigger
                >
                  <Button variant="outline" className="w-full text-xs">
                    View on GitHub
                    <IconHoverWrapper hoverTrigger="closest">
                      <GithubIcon size={14} className="ml-2" />
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
              <SectionHeading icon={ScanBarcodeIcon} title="What is Barcode Lists?" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                Barcode Lists is a Chrome extension I built for{" "}
                <strong className="text-text-primary">Calgary Coop</strong>{" "}
                store personnel. It centralizes barcode storage, enables shared
                access across the team, and uses AI to extract barcodes from
                images and spreadsheets.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                It started as a Monday-morning fix. It ended as a 24-commit
                project on the Chrome Web Store, used across multiple store
                locations.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                This post is the builder&apos;s log — why I built it, how my
                colleagues used it, the feature deep-dives, the bugs I had to
                fix, and the full changelog from v1.0 to v6.0.
              </p>
            </section>

            <figure className="my-12 -mx-4 md:mx-0">
              <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark bg-bg-dark shadow-lg">
                <Image
                  src="/BarcodeLists_1.png"
                  alt="Barcode Lists popup showing a saved list of barcodes with action buttons"
                  fill
                  sizes="(max-width: 768px) 92vw, 800px"
                  className="object-contain"
                  priority
                />
              </div>
              <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                Fig 1 — Barcode Lists popup. Lists on the left, barcodes on the
                right, AI extraction button at the bottom.
              </figcaption>
            </figure>

            <section id="why" className="mb-16 scroll-mt-24">
              <SectionHeading icon={BulbSvg} title="Why I Built It" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                Calgary Coop store personnel scan barcodes every Monday as part
                of inventory operations. Before Barcode Lists, those barcodes
                lived in personal notes apps, screenshots, or just memory.
              </p>

              <Callout>
                <p className="text-sm md:text-base">
                  <strong>The problem:</strong> barcodes were siloed per
                  individual. A barcode scanned on one shift would get
                  re-scanned on the next because no one else knew it already
                  existed. Manual cleanup was eating into Monday mornings.
                </p>
              </Callout>

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mt-6 mb-6">
                The store team needed three things:
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  "A shared barcode database, accessible by every authorized staff member.",
                  "A way to extract barcodes from images and spreadsheets without typing them in by hand.",
                  "Real-time sync, so a barcode saved on one device shows up on every other device immediately.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm md:text-base text-text-secondary"
                  >
                    <CheckedIcon size={18} className="text-success mt-1 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                A Chrome extension was the obvious form factor. All store
                operations already happen in the browser. No app install
                friction, no native build, no MDM push. Manifest V3 gave us
                security and performance out of the box.
              </p>

              <PullQuote>
                &quot;If the barcodes are lost between shifts, the work was
                lost between shifts. A shared store wasn&apos;t a nice-to-have
                — it was the whole point.&quot;
              </PullQuote>
            </section>

            <section id="helping" className="mb-16 scroll-mt-24">
              <SectionHeading icon={ChartLineIcon} title="How It Helped My Colleagues" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The most useful feedback I got wasn&apos;t about a feature I
                designed. It was about the absence of a problem.
              </p>

              <div className="space-y-6 mb-6">
                <FeatureBlock
                  icon={<CheckedIcon size={20} className="text-cta" />}
                  title="Monday scanning got faster"
                  description="Store staff stopped re-scanning barcodes that were already in a colleague's list. The first week of rollout, the team estimated it cut their Monday scanning session by roughly a third."
                />
                <FeatureBlock
                  icon={<CheckedIcon size={20} className="text-cta" />}
                  title="No more lost barcodes between shifts"
                  description="The shared database meant a barcode scanned on Saturday afternoon was still there on Monday morning. Before Barcode Lists, this wasn't guaranteed."
                />
                <FeatureBlock
                  icon={<CheckedIcon size={20} className="text-cta" />}
                  title="Image-to-list in seconds"
                  description="A photo of a printed barcode sheet used to mean typing each code by hand. With the AI extractor, staff pasted the image and got a clean list in a few seconds."
                />
                <FeatureBlock
                  icon={<CheckedIcon size={20} className="text-cta" />}
                  title="Cross-device without thinking about it"
                  description="Realtime sync meant the same list showed up on every device logged into the store account. Staff didn't need to remember which phone or laptop they used last."
                />
              </div>

              <Callout>
                <p className="text-sm md:text-base">
                  <strong>Adoption note:</strong> the extension stayed at 4
                  active users across Calgary Coop locations — small in absolute
                  terms, but every Monday scan went through it. Internal tools
                  don&apos;t need to scale. They need to fit the workflow.
                </p>
              </Callout>
            </section>

            <section id="features" className="mb-16 scroll-mt-24">
              <SectionHeading icon={SparklesIcon} title="Feature Deep-Dives" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                The feature set grew organically. Each of the four below
                started as a real complaint I heard from store staff.
              </p>

              <div className="space-y-6">
                <FeatureBlock
                  icon={<PuzzleIcon size={20} className="text-cta" />}
                  title="Shared Barcode Database with Login Auth"
                  description="Clerk handles auth, Supabase holds the data, Manifest V3 keeps the extension secure. A barcode saved by one user is visible to every other authorized user in real time. The shared store is the foundation — everything else assumes it's there."
                />
                <FeatureBlock
                  icon={<CpuIcon size={20} className="text-cta" />}
                  title="AI-Powered Image & Spreadsheet OCR"
                  description="This was the most-requested feature after the shared store. Staff could paste a photo of a printed barcode sheet, a screenshot of a spreadsheet, or even a noisy image that mixed barcodes with invoice numbers. The AI extracted the barcodes, then a post-filter dropped anything that didn't match barcode length and charset rules."
                />
                <FeatureBlock
                  icon={<MagnifierIcon size={20} className="text-cta" />}
                  title="Intelligent Barcode Cleaning"
                  description="The OCR pass had a tendency to include invoice numbers and stray whitespace. A second pass scanned the extracted values, kept the ones that looked like valid barcodes, and silently discarded the rest. Staff stopped having to clean up after the AI."
                />
                <FeatureBlock
                  icon={<PuzzleIcon size={20} className="text-cta" />}
                  title="Realtime Sync + Status States"
                  description="Polling, not websockets — the volume didn't justify the complexity. Polling gave us a 'new list arrived' glow, font-color change on copy, red glow for important lists, and an 'opened' status that stuck. The little touches added up."
                />
                <FeatureBlock
                  icon={<PuzzleIcon size={20} className="text-cta" />}
                  title="Per-List Comments"
                  description="A small feature, but it removed a Slack thread per scan. Each barcode can carry a short comment, stored locally and remotely, so the next person on shift knows why it was added."
                />
              </div>

              <figure className="my-12 -mx-4 md:mx-0">
                <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark bg-bg-dark shadow-lg">
                  <Image
                    src="/BarcodeLists_2.png"
                    alt="Barcode Lists showing a list with important indicator, status states, and action buttons"
                    fill
                    sizes="(max-width: 768px) 92vw, 800px"
                    className="object-contain"
                  />
                </div>
                <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                  Fig 2 — A list with the &quot;important&quot; glow, opened
                  status, and copy action visible.
                </figcaption>
              </figure>
            </section>

            <section id="bugs" className="mb-16 scroll-mt-24">
              <SectionHeading icon={TriangleAlertIcon} title="Bugs I Fixed" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                The changelog hides the actual work. Most of the late commits
                are fix-on-fix, not new features. Here are the four bugs that
                cost me the most time.
              </p>

              <div className="space-y-8">
                {FIXES.map((fix, i) => (
                  <LearningBlock
                    key={fix.name}
                    number={String(i + 1).padStart(2, "0")}
                    title={fix.name}
                    content={fix.detail}
                  />
                ))}
              </div>

              <PullQuote>
                &quot;The fix commits tell you where the real work was. The
                feature commits are the easy part.&quot;
              </PullQuote>
            </section>

            <section id="changelog" className="mb-16 scroll-mt-24">
              <SectionHeading icon={CodeIcon} title="Changelog" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                Twenty-four commits over three months. Grouped by release phase
                rather than individual commit, but every change is here.
              </p>

              <div className="relative border-l-2 border-divider pl-6 space-y-10">
                {CHANGELOG.map((entry, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-cta border-2 border-bg-base" />
                    <div className="flex flex-wrap items-baseline gap-3 mb-1">
                      <span className="font-industrial uppercase tracking-widest text-cta text-sm">
                        {entry.version}
                      </span>
                      <span className="text-xs font-tech uppercase tracking-widest text-text-secondary">
                        {entry.date}
                      </span>
                    </div>
                    <h4 className="font-industrial uppercase tracking-widest text-sm text-text-primary mb-2">
                      {entry.title}
                    </h4>
                    <ul className="space-y-1.5">
                      {entry.points.map((point, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-sm text-text-secondary"
                        >
                          <span className="text-cta mt-0.5">›</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section id="roadmap" className="mb-16 scroll-mt-24">
              <SectionHeading icon={RocketIcon} title="What's Next" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                Barcode Lists is live and stable. Here&apos;s what I&apos;d
                build next if the team needed it.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Multi-store rollout",
                    desc: "Same shared-store model, but scoped per location. One extension, many isolated stores.",
                  },
                  {
                    title: "Batch export",
                    desc: "Export a list as CSV or directly into the inventory system the store already uses.",
                  },
                  {
                    title: "Offline mode",
                    desc: "Cache the active list locally so scanning keeps working in dead zones.",
                  },
                  {
                    title: "Better mobile handoff",
                    desc: "Tighten the phone-scanner companion app so it never collides with the empty list state again.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-card border-2 border-bg-dark p-5 rounded-sm"
                  >
                    <h4 className="font-industrial uppercase tracking-widest text-sm text-text-primary mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16 bg-gradient-to-br from-slate-800 to-slate-950 rounded-sm p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
              <div className="relative z-10">
                <ScanBarcodeIcon size={40} className="text-emerald-300 mb-4" />
                <h3 className="text-2xl md:text-3xl font-industrial font-bold uppercase tracking-wider text-white mb-4">
                  Try Barcode Lists
                </h3>
                <p className="text-white/80 leading-relaxed max-w-xl mb-6">
                  It&apos;s live on the Chrome Web Store and open source on
                  GitHub. If you run a team that scans the same barcodes
                  repeatedly, it might save you a Monday morning.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="https://chromewebstore.google.com/detail/barcode-lists/colpoghjdbjnmciefnipaefbdflgjifg"
                    target="_blank"
                    data-icon-hover-trigger
                  >
                    <Button className="bg-white text-slate-900 hover:bg-slate-100 border-white">
                      Install from Chrome Web Store
                      <IconHoverWrapper hoverTrigger="closest">
                        <ExternalLinkIcon size={16} className="ml-2" />
                      </IconHoverWrapper>
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com/Isaac-1555/Barcode-Lists"
                    target="_blank"
                    data-icon-hover-trigger
                  >
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-slate-900"
                    >
                      View on GitHub
                      <IconHoverWrapper hoverTrigger="closest">
                        <GithubIcon size={16} className="ml-2" />
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
