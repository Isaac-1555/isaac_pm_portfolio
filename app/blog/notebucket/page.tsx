import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ArrowBackIcon from "@/components/icons/arrow-back-icon";
import RightChevron from "@/components/icons/right-chevron";
import ClockIcon from "@/components/icons/clock-icon";
import UserIcon from "@/components/icons/user-icon";
import BulbSvg from "@/components/icons/bulb-svg";
import TriangleAlertIcon from "@/components/icons/triangle-alert-icon";
import GearIcon from "@/components/icons/gear-icon";
import MagnifierIcon from "@/components/icons/magnifier-icon";
import RocketIcon from "@/components/icons/rocket-icon";
import ChartLineIcon from "@/components/icons/chart-line-icon";
import CheckedIcon from "@/components/icons/checked-icon";
import ExternalLinkIcon from "@/components/icons/external-link-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";

export const metadata = {
  title: "NoteBucket: Lessons from Building an Offline-First Semantic Note Organizer | Isaac PM Blog",
  description:
    "Why I built it, the all-night rabbit hole that went nowhere, the pivot that saved the project, the bug that taught me about edge cases, and what I'd do differently next time.",
};

const TOC = [
  { id: "intro", label: "The Spark" },
  { id: "wrong-path", label: "The Wrong Path" },
  { id: "pivot", label: "The Pivot" },
  { id: "bug", label: "The Bug That Taught Me" },
  { id: "clicked", label: "How It All Clicked" },
  { id: "future", label: "Room to Grow" },
  { id: "closing", label: "Ship Fast, Ship Private" },
];

export default function NoteBucketArticle() {
  return (
    <article className="pb-24">
      <header className="relative w-full bg-gradient-to-br from-cyan-900 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

        <div className="container mx-auto px-4 pt-28 pb-24 md:pt-36 md:pb-28 relative z-10">
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
              <ClockIcon size={14} /> 9 min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-industrial font-bold uppercase tracking-wider text-white leading-tight max-w-4xl">
            NoteBucket:{" "}
            <span className="text-cyan-300">
              Building an Offline-First Semantic Note Organizer
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
            The all-night rabbit hole that went nowhere, the pivot that saved
            the project, and what I&apos;d do differently next time.
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {["Android", "AI/ML", "Open Source", "Local-First"].map(
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
                  href="https://github.com/Isaac-1555/NoteBucket"
                  target="_blank"
                  data-icon-hover-trigger
                >
                  <Button variant="default" className="w-full text-xs">
                    View on GitHub
                    <IconHoverWrapper hoverTrigger="closest">
                      <RightChevron size={14} className="ml-2" />
                    </IconHoverWrapper>
                  </Button>
                </Link>
                <Link
                  href="/case-studies/notebucket"
                  target="_blank"
                  data-icon-hover-trigger
                >
                  <Button variant="secondary" className="w-full text-xs">
                    Technical Case Study
                    <IconHoverWrapper hoverTrigger="closest">
                      <ExternalLinkIcon size={14} className="ml-2" />
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
              <SectionHeading icon={BulbSvg} title="The Spark" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The idea for NoteBucket came from a simple frustration. I had
                notes scattered everywhere — Google Keep, local text files, a
                dusty Notion account I opened once and never touched again. Some
                folders had 200+ files I&apos;d abandoned because organizing
                them was more work than creating them.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                I wanted a note app that just worked. Not a &quot;smart&quot; AI
                assistant sending my data to the cloud. Not another subscription
                with a privacy policy I&apos;d never read. Something that sat on
                my phone, understood what my notes meant, and filed them
                automatically. No accounts. No sync. No analytics. Just notes
                and the folders they belonged in.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                That was the seed. A note organizer that routes by meaning, not
                keywords, and does it entirely on-device. The spec was simple
                enough to fit in one sentence, but the execution turned into a
                week-long sprint with more wrong turns than right ones.
              </p>

              <PullQuote>
                &quot;I wanted a note app that just worked. No accounts. No
                sync. No analytics. Just notes and the folders they belonged
                in.&quot;
              </PullQuote>
            </section>

            <figure className="my-12 -mx-4 md:mx-0">
              <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark bg-bg-dark shadow-lg">
                <Image
                  src="/NoteBucket_Hero.png"
                  alt="NoteBucket hero screen showing the main interface"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                NoteBucket&apos;s main interface — a bucket that routes notes
                into folders by meaning.
              </figcaption>
            </figure>

            <section id="wrong-path" className="mb-16 scroll-mt-24">
              <SectionHeading icon={TriangleAlertIcon} title="The Wrong Path" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                When I started, I had this grand vision: the AI would read a
                note, understand it, then create a folder and name it
                appropriately. A fully autonomous organizer. You write, it
                files, and the taxonomy builds itself.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                I spent the first night trying to make this work with a tiny
                on-device LLM. I tweaked prompts. I tried different models. I
                restructured the input format. I convinced myself it was almost
                there — one more parameter adjustment, one more prompt
                rewrite, one more model swap.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                It was 3 AM when I finally admitted the truth: the model was too
                small. BGE-small is 33MB. A model capable of generating coherent
                folder names from scratch would be 300MB or more. That&apos;s
                not a prompt problem — it&apos;s a physics problem. You can&apos;t
                squeeze generation capability out of a model that size.
              </p>

              <Callout>
                <p className="text-sm md:text-base">
                  <strong>The hard lesson:</strong> When a small model fails at
                  a task, it&apos;s tempting to blame your implementation. But
                  sometimes the model simply lacks the capacity. Recognizing
                  that boundary saved me from wasting days I didn&apos;t have.
                </p>
              </Callout>

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mt-6">
                I scrapped auto-generation entirely. The app would use
                predefined folders. The model&apos;s job shifted from
                &quot;understand and generate&quot; to &quot;understand and
                match.&quot; That distinction changed everything.
              </p>
            </section>

            <figure className="my-12 -mx-4 md:mx-0">
              <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark bg-bg-dark shadow-lg">
                <Image
                  src="/NoteBucket_Dashboard.jpeg"
                  alt="NoteBucket dashboard showing folder grid with color-coded labels"
                  fill
                  className="object-contain"
                />
              </div>
              <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                User-defined folders with color coding — the model routes notes
                by similarity to folder names.
              </figcaption>
            </figure>

            <section id="pivot" className="mb-16 scroll-mt-24">
              <SectionHeading icon={GearIcon} title="The Pivot" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                With auto-generation off the table, I needed a new approach. My
                first attempt was LLM-based classification — feed the note text
                to a small LLM and ask it which folder it belongs to. It worked,
                barely. Inference was slow (multiple seconds per note), and I
                was uncomfortable sending user notes through an LLM pipeline on
                principle.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The breakthrough came when I shifted from classification to
                embedding. Instead of asking the model to decide, I asked it to
                measure. BGE-small produces a 384-dimensional embedding vector
                for any text. By embedding each folder name once (at creation
                time) and each note on save, the routing becomes a cosine
                similarity calculation — not a model inference.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                This was faster by orders of magnitude. Embedding a note took
                milliseconds. Comparing 384 floats against a handful of folder
                embeddings was trivial. The app became instant instead of
                sluggish, and it never touched a network.
              </p>

              <PullQuote>
                &quot;Instead of asking the model to decide, I asked it to
                measure. That one conceptual shift turned a slow, awkward app
                into something that felt like magic.&quot;
              </PullQuote>
            </section>

            <section id="bug" className="mb-16 scroll-mt-24">
              <SectionHeading icon={MagnifierIcon} title="The Bug That Taught Me" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The embedding system worked well, but I hit a nasty edge case
                with hidden folders. I wanted hidden folders to still receive
                matching notes — you hide a folder, not its routing. So I added
                logic: if no visible folder scores above the threshold, check
                hidden folders.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                This is what shipped. And it was broken.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The &quot;Unsorted&quot; folder was always in the pool. If
                &quot;Unsorted&quot; won, I triggered the hidden-folder
                fallback. But here&apos;s the flaw: if any visible folder scored
                above threshold — even barely — it would win immediately,
                skipping the hidden folder check entirely. Hidden folders never
                got a fair shot because visible folders had priority by design.
              </p>

              <Callout>
                <p className="text-sm md:text-base">
                  <strong>The fix:</strong> Hidden folders are always in the
                  similarity pool, every time. No conditional trigger, no
                  fallback chain. Every folder — visible or hidden — competes on
                  equal footing. The routing is simpler, fairer, and works
                  exactly as intended.
                </p>
              </Callout>

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mt-6">
                This bug stuck with me because it felt so obvious in hindsight.
                I&apos;d over-engineered the fallback logic when I should have
                just included everyone in the pool. The simpler solution was the
                correct one all along.
              </p>
            </section>

            <section id="clicked" className="mb-16 scroll-mt-24">
              <SectionHeading icon={RocketIcon} title="How It All Clicked" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                Once the routing pipeline was solid, the rest of the app fell
                into place quickly. The architecture settled into a rhythm:
              </p>

              <div className="space-y-6 my-8">
                <FeatureBlock
                  icon={<GearIcon size={20} className="text-cta" />}
                  title="BGE Embedding Pipeline"
                  description="BGE-small-en-v1.5 via llama.cpp JNI. Notes get 384-dim L2-normalized embeddings on save. Folder names are embedded once at creation. Cosine similarity does the routing."
                />
                <FeatureBlock
                  icon={<MagnifierIcon size={20} className="text-cta" />}
                  title="Disambiguation Dialog"
                  description="When the margin between the top two folders is 0.03 or less, the app shows a dialog instead of guessing. The user picks. This was the UI solution to the ambiguity problem — no threshold tuning could replace it."
                />
                <FeatureBlock
                  icon={<CheckedIcon size={20} className="text-cta" />}
                  title="Crash-Safe Drafts"
                  description="Drafts persist to Room on every keystroke (debounced 500ms) and auto-commit after 1 minute in the background via WorkManager. I had lost one too many notes in other apps to skip this."
                />
              </div>

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The disambiguation dialog deserves special mention. When I first
                prototyped the router, I tried to solve ambiguity with a higher
                threshold. That just shifted the problem: too high and
                everything went to Unsorted, too low and notes landed in the
                wrong folder. The dialog was the actual solution — not a
                technical one, but a product one.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                It took me a while to accept that not every UX problem has a
                technical fix. Sometimes you just need to ask the user.
              </p>

              <PullQuote>
                &quot;It took me a while to accept that not every UX problem has
                a technical fix. Sometimes you just need to ask the user.&quot;
              </PullQuote>
            </section>

            <figure className="my-12 -mx-4 md:mx-0">
              <div className="relative w-full aspect-video rounded-sm overflow-hidden border-2 border-bg-dark bg-bg-dark shadow-lg">
                <Image
                  src="/NoteBucket_Editor.jpeg"
                  alt="NoteBucket editor screen with notion-style formatting"
                  fill
                  className="object-contain"
                />
              </div>
              <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
                The note editor with notion-style formatting and crash-safe
                draft persistence.
              </figcaption>
            </figure>

            <section id="future" className="mb-16 scroll-mt-24">
              <SectionHeading icon={ChartLineIcon} title="Room to Grow" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                NoteBucket works. But there are four things I&apos;d add if I
                had more time:
              </p>

              <div className="space-y-6">
                <LearningBlock
                  number="01"
                  title="Export / Import"
                  content="Right now your notes are tied to the device. A JSON export/import flow would give users ownership portability — backup their data or move to a new phone without starting from zero."
                />
                <LearningBlock
                  number="02"
                  title="Quick Capture Widget"
                  content="The fastest way to lose a thought is to open an app and wait for it to load. A home screen widget with a single text field would lower the capture friction to zero."
                />
                <LearningBlock
                  number="03"
                  title="Tags System"
                  content="Folders are one axis of organization. Tags would add a second — cross-cutting labels that span folders. A note about a Kotlin coroutine bug could live in the 'Android' folder and carry the 'kotlin' tag simultaneously."
                />
                <LearningBlock
                  number="04"
                  title="Folder Embedding Fine-Tuning"
                  content="When the user corrects a routing decision, that signal could refine the folder embedding over time. The model learns which notes belong where, making routing more accurate with use."
                />
              </div>
            </section>

            <section id="closing" className="mb-16 scroll-mt-24">
              <SectionHeading icon={CheckedIcon} title="Ship Fast, Ship Private" />

              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                Eight days. Twenty commits. Zero network permissions. From a
                vague idea about semantic organization to a working app with
                Room persistence, on-device ML, crash-safe drafts, hidden
                folders, search, and attachments.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                Looking back, the most important decision I made was the
                constraint: 100% offline, no accounts, no analytics. Every
                technical choice flowed from that. BGE-small instead of a larger
                model because it had to fit in the APK. Embedding routing
                instead of LLM classification because it had to run without a
                network. Room instead of Firebase because the data never leaves
                the device.
              </p>
              <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                The constraints didn&apos;t limit the app — they defined it. A
                version with cloud sync and a 7B model would have been more
                capable on paper and less useful in practice.
              </p>

              <PullQuote>
                &quot;The constraints didn&apos;t limit the app — they defined
                it. A version with cloud sync and a 7B model would have been
                more capable on paper and less useful in practice.&quot;
              </PullQuote>
            </section>

            <section className="mt-16 bg-gradient-to-br from-cyan-900 to-slate-900 rounded-sm p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
              <div className="relative z-10">
                <div className="mb-4">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-cyan-300">
                    <path d="M22 8L12 3L2 8L12 13L22 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 16L12 21L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 12L12 17L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-industrial font-bold uppercase tracking-wider text-white mb-4">
                  Dive Deeper
                </h3>
                <p className="text-white/80 leading-relaxed max-w-xl mb-6">
                  This post covered the <em>why</em> and the <em>what I
                  learned</em>. For the full technical breakdown — architecture,
                  code structure, implementation details — check out the case
                  study.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/case-studies/notebucket"
                    target="_blank"
                    data-icon-hover-trigger
                  >
                    <Button className="bg-white text-cyan-900 hover:bg-cyan-100 border-white">
                      Read the Case Study
                      <IconHoverWrapper hoverTrigger="closest">
                        <RightChevron size={16} className="ml-2" />
                      </IconHoverWrapper>
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com/Isaac-1555/NoteBucket"
                    target="_blank"
                    data-icon-hover-trigger
                  >
                    <Button
                      variant="outline"
                      className="text-white border-white/30 hover:bg-white/10"
                    >
                      View on GitHub
                      <IconHoverWrapper hoverTrigger="closest">
                        <ExternalLinkIcon size={16} className="ml-2" />
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
