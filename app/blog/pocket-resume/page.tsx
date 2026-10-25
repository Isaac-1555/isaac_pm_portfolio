import Image from "next/image";
import Link from "next/link";
import { TopoMap } from "@/components/case-study/TopoMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GalleryProvider } from "@/components/image/gallery-context";
import ArrowBackIcon from "@/components/icons/arrow-back-icon";
import ClockIcon from "@/components/icons/clock-icon";
import UserIcon from "@/components/icons/user-icon";
import FileDescriptionIcon from "@/components/icons/file-description-icon";
import BulbSvg from "@/components/icons/bulb-svg";
import TriangleAlertIcon from "@/components/icons/triangle-alert-icon";
import ChartLineIcon from "@/components/icons/chart-line-icon";
import RocketIcon from "@/components/icons/rocket-icon";
import SparklesIcon from "@/components/icons/sparkles-icon";
import CheckedIcon from "@/components/icons/checked-icon";
import CodeIcon from "@/components/icons/code-icon";
import CpuIcon from "@/components/icons/cpu-icon";
import MagnifierIcon from "@/components/icons/magnifier-icon";
import ExternalLinkIcon from "@/components/icons/external-link-icon";
import GithubIcon from "@/components/icons/github-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";

export const metadata = {
  title:
    "PocketResume: Eight Months to 70, Three Days to 4,000 | Isaac PM Blog",
  description:
    "A candid postmortem of the bug spiral, the v9.0.1 update, Quick Download, and the SEO landing page that took PocketResume from 27 weekly users to 4,000+ in three days.",
};

const TOC = [
  { id: "numbers", label: "The Numbers" },
  { id: "what", label: "What PocketResume Does" },
  { id: "slow", label: "Eight Months to 70" },
  { id: "bugs", label: "The Bug Spiral" },
  { id: "update", label: "v9.0.1" },
  { id: "spike", label: "Three Days" },
  { id: "why", label: "Why It Worked" },
  { id: "failures", label: "What Didn't Work" },
  { id: "product", label: "Product Lessons" },
  { id: "scale", label: "The Free-Tier Problem" },
  { id: "business", label: "Business Model" },
  { id: "playbook", label: "Playbook" },
  { id: "next", label: "What's Next" },
];

const FORMATS = [
  {
    name: "Professional",
    bestFor: "Freshers and entry-level roles",
    detail:
      "The standard corporate layout. Clean sections, predictable order, ATS-safe text.",
  },
  {
    name: "FAANG",
    bestFor: "Experienced professionals",
    detail:
      "Impact-first. Leads with outcomes, scope, and measurable results instead of responsibilities.",
  },
  {
    name: "Deedy / double-sided",
    bestFor: "Experienced candidates with more to show",
    detail:
      "A two-page FAANG-style layout for people who need more room without turning the resume into a wall of text.",
  },
  {
    name: "Academic CV",
    bestFor: "PhD and higher-education applications",
    detail:
      "Long-form academic format. Built for publications, research, teaching, and grants.",
  },
];

const PLAYBOOK = [
  {
    title: "Fix reliability before chasing growth",
    detail:
      "The product dropped from 70 to 27 because it stopped feeling trustworthy. No landing page fixes that. Bugs first.",
  },
  {
    title: "Make the first win one click away",
    detail:
      "Quick Download removed the API key, provider choice, prompt, and wait. The user gets something useful before they have to configure anything.",
  },
  {
    title: "Build the landing page for search intent",
    detail:
      "New pages, metadata, copy, and a blog gave the product a surface for people already searching for resume help.",
  },
  {
    title: "Treat the store listing as a product surface",
    detail:
      "The only listing change was a feature bullet for Quick Download. That bullet made the update legible to someone scanning the store.",
  },
  {
    title: "Don't mistake a spike for an engine",
    detail:
      "4,000 users in three days is a signal, not a system. Retention, churn, and a repeatable channel still have to be built.",
  },
  {
    title: "Ship the free version people can use without setup",
    detail:
      "BYOK keeps costs and privacy sane, but it adds friction. Give people a no-key path to value, then let them opt into the AI workflow.",
  },
];

export default function PocketResumeArticle() {
  return (
    <GalleryProvider>
      <article className="pb-24">
        <header className="pt-28 pb-24 md:pt-36 md:pb-28 min-h-[600px] relative w-full bg-gradient-to-br from-amber-950 via-slate-950 to-bg-dark overflow-hidden">
          <TopoMap activeId="blog-pocket-resume" />
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
                <ClockIcon size={14} /> October 2026
              </span>
              <span className="flex items-center gap-1.5">
                <ClockIcon size={14} /> 12 min read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-industrial font-bold uppercase tracking-wider text-white leading-tight max-w-4xl">
              PocketResume:{" "}
              <span className="text-amber-300">
                Eight Months to 70, Three Days to 4,000
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              A candid postmortem of the bug spiral, the v9.0.1 update, Quick
              Download, and the SEO landing page that changed the trajectory.
            </p>

            <div className="flex flex-wrap gap-2 mt-8">
              {[
                "Chrome Extension",
                "Growth",
                "AI",
                "Product",
                "Postmortem",
                "BYOK",
              ].map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 backdrop-blur"
                >
                  {tag}
                </Badge>
              ))}
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
                  <Link
                    href="https://chromewebstore.google.com/detail/pocketresume/mdplmgfkpgalajmchilemiamifoaneip"
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
                    href="https://pocket-resume.xyz"
                    target="_blank"
                    data-icon-hover-trigger
                  >
                    <Button variant="outline" className="w-full text-xs">
                      Landing Page
                      <IconHoverWrapper hoverTrigger="closest">
                        <ExternalLinkIcon size={14} className="ml-2" />
                      </IconHoverWrapper>
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com/Isaac-1555/pocket-resume"
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
                  <Link href="/case-studies/pocket-resume">
                    <Button variant="secondary" className="w-full text-xs">
                      Technical Case Study
                      <IconHoverWrapper hoverTrigger="closest">
                        <FileDescriptionIcon size={14} className="ml-2" />
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

              <section id="numbers" className="mb-16 scroll-mt-24">
                <SectionHeading
                  icon={ChartLineIcon}
                  title="The Numbers"
                />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  On October 17, 2026, I shipped PocketResume v9.0.1. The
                  update cleared most of the bug backlog, added Quick Download,
                  and shipped a rebuilt landing page with new pages, metadata,
                  copy, and a blog. I also added one bullet about Quick
                  Download to the Chrome Web Store listing.
                </p>
                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  I did not have a launch campaign. I did not have a growth
                  plan. I was mostly trying to make the product reliable
                  again. Two days later, the Chrome Web Store dashboard showed
                  4,000+ weekly active users.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
                  {[
                    { value: "70", label: "first milestone" },
                    { value: "27", label: "September bottom" },
                    { value: "495", label: "Oct 17" },
                    { value: "4,510", label: "Oct 26" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="border border-divider bg-bg-accent/5 p-4 text-center"
                    >
                      <div className="font-industrial text-2xl md:text-3xl font-bold text-cta">
                        {stat.value}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <WideFigure
                  src="/PocketResume_usercount_cropped.png"
                  alt="Chrome Web Store dashboard showing PocketResume at 4,510 weekly active users, a 5-star rating, and version 9.0.1"
                  caption="Fig 1 — Chrome Web Store dashboard, Oct 26, 2026: 4,510 weekly active users, 5-star rating, v9.0.1. Cropped to the PocketResume row."
                />

                <GrowthChart />

                <div className="md:hidden grid grid-cols-2 gap-2 my-6">
                  {[
                    { value: "495", label: "Oct 17" },
                    { value: "2K", label: "Oct 18" },
                    { value: "4K", label: "Oct 19" },
                    { value: "4,510", label: "Oct 26" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="border border-divider bg-bg-accent/5 p-3 text-center"
                    >
                      <div className="font-industrial text-lg font-bold text-cta">
                        {item.value}
                      </div>
                      <div className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-text-secondary">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mt-4">
                  Weekly active users, Chrome Web Store dashboard. The 495
                  point is reconstructed from memory — I did not get a
                  screenshot before it jumped again. The chart uses a log scale
                  so the early numbers stay visible.
                </p>
              </section>

              <section id="what" className="mb-16 scroll-mt-24">
                <SectionHeading
                  icon={FileDescriptionIcon}
                  title="What PocketResume Does"
                />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  PocketResume is a Chrome extension that reads the job posting
                  in the active tab and rewrites your master resume to match the
                  role. No copy-pasting. Open the job page, press Generate, and
                  get a tailored PDF.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                  {[
                    "One-click job-page analysis",
                    "ATS score checker",
                    "AI resume refinement",
                    "Cover letter generation",
                    "Job tracker + AI form filler (paid)",
                    "Multi-provider AI, including local models",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 p-3 bg-bg-accent/5 border border-divider/50 rounded-sm"
                    >
                      <div className="h-2 w-2 bg-cta rounded-full shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  The core promise is privacy and control. No forced signup, no
                  copy-pasting, no per-generation limit. You bring your own API
                  key — Google Gemini, OpenRouter, or another provider — and the
                  key stays on your machine. If you have the hardware, you can
                  run a local model and keep the whole workflow offline.
                </p>

                <StoreFigure
                  src="/PocketResume_Store_1.png"
                  alt="PocketResume store listing hero showing one-click resume tailoring with a master resume and provider options"
                  caption="Fig 2 — The store listing pitch: open a job post, press Generate, get a tailored PDF. Your keys, your data."
                />
              </section>

              <section id="slow" className="mb-16 scroll-mt-24">
                <SectionHeading icon={BulbSvg} title="Eight Months to 70" />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  Version 1 went live on January 27, 2026. Growth was slow.
                  Word of mouth brought the first users. LinkedIn and Reddit
                  brought a few more. Over about eight months, PocketResume
                  reached roughly 70 weekly users.
                </p>
                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  That is not nothing. Seventy people chose to keep the
                  extension installed and use it every week. But it is also not
                  a business. The product was useful to a small group and
                  invisible to everyone else.
                </p>

                <Callout>
                  <p className="text-sm md:text-base">
                    <strong>The honest version:</strong> the first 70 users
                    came from people I could reach directly. I never built a
                    repeatable acquisition channel during this period.
                  </p>
                </Callout>
              </section>

              <section id="bugs" className="mb-16 scroll-mt-24">
                <SectionHeading
                  icon={TriangleAlertIcon}
                  title="The Bug Spiral"
                />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  Then it slipped. By August, weekly users were below 40. By
                  September, the number hit 27. The cause was not mysterious.
                  Bugs had piled up across the flows users touched most, and
                  the product stopped feeling reliable.
                </p>
                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  Resume tools have a brutal failure mode: if the output is
                  wrong, late, or hard to get, the user does not file a ticket.
                  They close the tab and go back to editing a document by hand.
                  The dashboard showed the result before I fully understood the
                  cause.
                </p>

                <PullQuote>
                  &quot;The product did not lose 43 users because the market
                  changed. It lost them because it stopped working well enough
                  to trust.&quot;
                </PullQuote>
              </section>

              <section id="update" className="mb-16 scroll-mt-24">
                <SectionHeading icon={CodeIcon} title="v9.0.1" />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  October 17 was not a marketing day. It was a cleanup day. I
                  shipped v9.0.1 with three changes that mattered:
                </p>

                <div className="space-y-6 my-8">
                  <FeatureBlock
                    icon={<CheckedIcon size={20} className="text-cta" />}
                    title="Fixed most of the bug backlog"
                    description="The unglamorous work. The flows that had been fragile for weeks got another pass, and the product started behaving like something you could rely on again."
                  />
                  <FeatureBlock
                    icon={<RocketIcon size={20} className="text-cta" />}
                    title="Added Quick Download"
                    description="A free, no-AI path to a finished resume. Instead of reading the job description and generating a tailored version, Quick Download exports your master resume in one of four ATS- and recruiter-friendly layouts."
                  />
                  <FeatureBlock
                    icon={<MagnifierIcon size={20} className="text-cta" />}
                    title="Rebuilt the landing page for search"
                    description="New pages, metadata, copy, and a blog. The goal was not a prettier homepage — it was a surface for people already searching for resume help."
                  />
                </div>

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  The only Chrome Web Store change was a feature bullet for
                  Quick Download. I did not rewrite the title, swap the
                  screenshots, or run a store-wide ASO overhaul.
                </p>

                <div className="overflow-x-auto my-8">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-divider">
                        <th className="text-left py-3 pr-4 font-industrial uppercase tracking-widest text-text-primary">
                          Layout
                        </th>
                        <th className="text-left py-3 pr-4 font-industrial uppercase tracking-widest text-text-primary">
                          Best for
                        </th>
                        <th className="text-left py-3 font-industrial uppercase tracking-widest text-text-primary">
                          What it does
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {FORMATS.map((format) => (
                        <tr key={format.name} className="border-b border-divider/60">
                          <td className="py-3 pr-4 font-medium text-text-primary align-top">
                            {format.name}
                          </td>
                          <td className="py-3 pr-4 text-text-secondary align-top">
                            {format.bestFor}
                          </td>
                          <td className="py-3 text-text-secondary align-top">
                            {format.detail}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <StoreFigure
                  src="/PocketResume_Store_3.png"
                  alt="PocketResume store listing showing four resume layouts: Professional, FAANG, Deedy, and Academic CV"
                  caption="Fig 3 — Quick Download ships four layouts: Professional, FAANG, Deedy / double-sided, and Academic CV."
                />
              </section>

              <section id="spike" className="mb-16 scroll-mt-24">
                <SectionHeading icon={ChartLineIcon} title="Three Days" />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  The first number I saw was 495. I did not screenshot it. I
                  went back the next day to capture proof and the dashboard
                  already showed 2,000+. The day after that, it showed 4,000+.
                </p>
                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  The only screenshot I have is 4,510 on October 26. That is
                  the number in Fig 1. The 495 on the chart is reconstructed
                  from memory, not from a dashboard capture.
                </p>

                <Callout>
                  <p className="text-sm md:text-base">
                    <strong>What I actually did during the spike:</strong>{" "}
                    nothing. I checked the dashboard, took a screenshot, and
                    went back to real life. My sister&apos;s wedding was
                    coming up. I did not run a single growth experiment that
                    week.
                  </p>
                </Callout>

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mt-6 mb-6">
                  The number also keeps moving. Weekly active users go up and
                  down — churn, weekends, holidays. The 4,510 is a snapshot,
                  not a cumulative install count.
                </p>
              </section>

              <section id="why" className="mb-16 scroll-mt-24">
                <SectionHeading
                  icon={SparklesIcon}
                  title="Why It Worked"
                />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  I cannot prove which change caused the jump. There is no
                  clean A/B test here. But the most likely explanation is not
                  that the AI got better. It did not. The product got easier to
                  try.
                </p>

                <div className="space-y-6 my-8">
                  <FeatureBlock
                    icon={<CheckedIcon size={20} className="text-cta" />}
                    title="1. Quick Download removed the biggest barrier"
                    description="Before Quick Download, value required an API key, a provider choice, a master resume, a generation wait, and a good output. Quick Download gives a useful result in one click with no key at all. That changes the first-run experience completely."
                  />
                  <FeatureBlock
                    icon={<CheckedIcon size={20} className="text-cta" />}
                    title="2. The bug fixes restored trust"
                    description="Users who had tried PocketResume before had a reason to come back. The product no longer broke in the places that mattered."
                  />
                  <FeatureBlock
                    icon={<CheckedIcon size={20} className="text-cta" />}
                    title="3. SEO captured existing demand"
                    description="The new pages, metadata, copy, and blog gave the landing page something to rank for. This was not a viral moment. It was search intent meeting a better surface."
                  />
                  <FeatureBlock
                    icon={<CheckedIcon size={20} className="text-cta" />}
                    title="4. The store bullet made the update legible"
                    description="A single bullet about Quick Download told someone scanning the listing what was new. It did not create demand, but it made the update easier to understand."
                  />
                  <FeatureBlock
                    icon={<CheckedIcon size={20} className="text-cta" />}
                    title="5. The loop compounded"
                    description="More users meant more reviews, more word of mouth, and more people seeing the listing. The spike is not a repeatable engine yet, but the loop is real."
                  />
                </div>

                <PullQuote>
                  &quot;The update did not make the AI smarter. It made the
                  product easier to try, easier to trust, and easier to
                  find.&quot;
                </PullQuote>
              </section>

              <section id="failures" className="mb-16 scroll-mt-24">
                <SectionHeading
                  icon={TriangleAlertIcon}
                  title="What Didn't Work"
                />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  Social media did not work for me. Not because the platforms
                  are bad — because I was not consistent. Posting once every
                  few weeks does not compound. It just creates the feeling of
                  doing marketing without the distribution.
                </p>
                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  I also did nothing for growth after the spike. My sister&apos;s
                  wedding took over my calendar. That was the right priority,
                  but it means the 4,000 users arrived without a follow-up
                  motion. No onboarding emails, no retention experiments, no
                  new channel tests.
                </p>

                <Callout>
                  <p className="text-sm md:text-base">
                    <strong>What I still cannot answer:</strong> how much of
                    the spike came from Quick Download, how much came from SEO,
                    and how much came from the store listing refresh. I have
                    correlation, not attribution.
                  </p>
                </Callout>
              </section>

              <section id="product" className="mb-16 scroll-mt-24">
                <SectionHeading
                  icon={FileDescriptionIcon}
                  title="Product Lessons"
                />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  The most-used features are the ATS score checker and AI
                  resume refinement. That surprised me. I expected people to
                  care most about the one-click tailoring, but the real job is
                  broader: understand the resume, understand the ATS, and make
                  the document better.
                </p>

                <PullQuote>
                  &quot;PocketResume really helped me understand how to apply
                  for jobs properly — the resume layout, what to add, how the
                  ATS system works, and how to save time and reduce
                  frustration.&quot;
                </PullQuote>

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  That feedback reframed the product. PocketResume is not just
                  a generator. It is a job-application assistant that helps
                  people understand what a good application looks like.
                </p>

                <StoreFigure
                  src="/PocketResume_Store_2.png"
                  alt="PocketResume store listing showing resume and cover letter generation in the same pass"
                  caption="Fig 4 — The cover letter path. The same master resume and the same voice, generated alongside the resume."
                />
              </section>

              <section id="scale" className="mb-16 scroll-mt-24">
                <SectionHeading
                  icon={CpuIcon}
                  title="The Free-Tier Problem"
                />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  PocketResume does not ship a shared API key. Users bring
                  their own. In practice, that often means a free Google Gemini
                  key or a free OpenRouter model. It keeps costs low, protects
                  privacy, and lets people run the workflow offline with a
                  local model if they have the hardware.
                </p>
                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  It also moves the rate limit to the user&apos;s provider.
                  When usage grows, more people hit free-tier quotas at the
                  same time. The bottleneck was not my server. It was other
                  people&apos;s free tiers.
                </p>

                <div className="space-y-6 my-8">
                  <FeatureBlock
                    icon={<TriangleAlertIcon size={20} className="text-warning" />}
                    title="The failure mode"
                    description="A user picks a free provider, hits a quota, and the generation fails. From their side, it looks like PocketResume is broken. From my side, it is a provider limit I do not control."
                  />
                  <FeatureBlock
                    icon={<CheckedIcon size={20} className="text-cta" />}
                    title="The next fixes"
                    description="Clearer quota errors, provider fallback, better key onboarding, and a stronger local-model path. BYOK is the right model for privacy, but it needs better failure handling at scale."
                  />
                </div>
              </section>

              <section id="business" className="mb-16 scroll-mt-24">
                <SectionHeading icon={RocketIcon} title="Business Model" />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  The core product is free: AI-polished PDF generation, the ATS
                  score checker, and AI resume refinement. Cloud sync is also
                  free if you create an account, so the same resume and history
                  follow you across devices.
                </p>
                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-6">
                  The paid tier is $5/month, or $4.16/month billed annually. It
                  includes the job application tracker and the AI form filler.
                  Both are live.
                </p>

                <StoreFigure
                  src="/PocketResume_Store_4.png"
                  alt="PocketResume job tracker board with saved, applied, interview, and offer columns"
                  caption="Fig 5 — The paid job tracker. Saved, applied, interview, and offer stages, with recruiters, rounds, and notes attached."
                />
              </section>

              <section id="playbook" className="mb-16 scroll-mt-24">
                <SectionHeading icon={CheckedIcon} title="Playbook" />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                  If I had to reduce the last eight months into rules I would
                  actually reuse, it would be these.
                </p>

                <div className="space-y-8">
                  {PLAYBOOK.map((item, i) => (
                    <LearningBlock
                      key={item.title}
                      number={String(i + 1).padStart(2, "0")}
                      title={item.title}
                      content={item.detail}
                    />
                  ))}
                </div>
              </section>

              <section id="next" className="mb-16 scroll-mt-24">
                <SectionHeading icon={RocketIcon} title="What's Next" />

                <p className="text-text-secondary leading-relaxed text-base md:text-lg mb-8">
                  The spike exposed the next set of problems. These are the
                  ones I care about most.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Better BYOK onboarding",
                      desc: "Make the first key setup obvious, test the key before the first run, and explain exactly what each provider can do for free.",
                    },
                    {
                      title: "Provider fallback",
                      desc: "If one free tier hits a quota, offer a clear retry path or another provider instead of a dead end.",
                    },
                    {
                      title: "Retention instrumentation",
                      desc: "Weekly active users is a lagging number. I need to know who comes back, who generates a second resume, and who churns.",
                    },
                    {
                      title: "Grow the paid tier",
                      desc: "The tracker and AI form filler are live. The next step is making them part of the same daily workflow as the resume generator.",
                    },
                    {
                      title: "More layout coverage",
                      desc: "Four layouts cover a lot, but different industries still have different expectations. Add formats where users ask for them.",
                    },
                    {
                      title: "Keep the privacy promise",
                      desc: "No forced signup, no keys in the cloud, and a real offline path. Growth should not cost the thing that makes the product different.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="bg-card border-2 border-bg-dark p-5 rounded-sm"
                    >
                      <h4 className="font-industrial uppercase tracking-widest text-base text-text-primary mb-2">
                        {item.title}
                      </h4>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-16 bg-gradient-to-br from-amber-950 via-slate-950 to-bg-dark rounded-sm p-8 md:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                <div className="relative z-10">
                  <FileDescriptionIcon size={40} className="text-amber-300 mb-4" />
                  <h3 className="text-2xl md:text-3xl font-industrial font-bold uppercase tracking-wider text-white mb-4">
                    Try PocketResume
                  </h3>
                  <p className="text-white/80 leading-relaxed max-w-xl mb-6">
                    One click, one tailored resume. Bring your own key, keep
                    your data local, and use Quick Download when you just need
                    a clean PDF.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="https://chromewebstore.google.com/detail/pocketresume/mdplmgfkpgalajmchilemiamifoaneip"
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
                      href="https://pocket-resume.xyz"
                      target="_blank"
                      data-icon-hover-trigger
                    >
                      <Button
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-slate-900"
                      >
                        Visit the Landing Page
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

function WideFigure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="my-10">
      <div className="overflow-x-auto">
        <div className="relative w-full min-w-[680px] aspect-[2268/130] overflow-hidden rounded-sm border-2 border-bg-dark bg-bg-dark shadow-lg">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 680px, 900px"
            className="object-contain"
          />
        </div>
      </div>
      <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
        {caption}
      </figcaption>
    </figure>
  );
}

function StoreFigure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="my-12">
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-sm border-2 border-bg-dark bg-bg-dark shadow-lg">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 92vw, 900px"
          className="object-contain"
        />
      </div>
      <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
        {caption}
      </figcaption>
    </figure>
  );
}

function GrowthChart() {
  const W = 860;
  const H = 340;
  const left = 64;
  const right = 24;
  const top = 24;
  const bottom = 58;

  const start = Date.UTC(2026, 6, 1);
  const end = Date.UTC(2026, 9, 26);

  const points = [
    { label: "Jul", axisLabel: "Jul", date: Date.UTC(2026, 6, 15), value: 70 },
    { label: "Aug", axisLabel: "Aug", date: Date.UTC(2026, 7, 15), value: 40 },
    { label: "Sep", axisLabel: "Sep", date: Date.UTC(2026, 8, 20), value: 27 },
    { label: "Oct 17", axisLabel: "Oct 17", date: Date.UTC(2026, 9, 17), value: 495 },
    { label: "Oct 18", axisLabel: null, date: Date.UTC(2026, 9, 18), value: 2000 },
    { label: "Oct 19", axisLabel: null, date: Date.UTC(2026, 9, 19), value: 4000 },
    { label: "Oct 26", axisLabel: null, date: Date.UTC(2026, 9, 26), value: 4510 },
  ];

  const logMin = Math.log10(10);
  const logMax = Math.log10(5000);

  const xFor = (date: number) =>
    left + ((date - start) / (end - start)) * (W - left - right);
  const yFor = (value: number) =>
    top +
    ((logMax - Math.log10(Math.max(value, 10))) / (logMax - logMin)) *
      (H - top - bottom);

  const line = points
    .map((point, i) => `${i === 0 ? "M" : "L"} ${xFor(point.date)} ${yFor(point.value)}`)
    .join(" ");
  const area = `${line} L ${xFor(points[points.length - 1].date)} ${H - bottom} L ${xFor(points[0].date)} ${H - bottom} Z`;

  const releaseX = xFor(Date.UTC(2026, 9, 17));

  return (
    <figure className="hidden md:block my-10">
      <div className="rounded-sm border border-divider bg-bg-accent/5 p-4 md:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <div className="font-industrial uppercase tracking-widest text-sm text-text-primary">
            Weekly active users
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
            Log scale · Chrome Web Store
          </div>
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="growth-chart-title growth-chart-desc"
          className="w-full h-auto"
        >
          <title id="growth-chart-title">
            PocketResume weekly active users from mid-2026 to October 26, 2026
          </title>
          <desc id="growth-chart-desc">
            The line falls from about 70 weekly users in mid-2026 to 27 in
            September, then jumps to 495 on October 17, 2,000 the next day,
            4,000 the day after, and 4,510 on October 26. The y-axis is
            logarithmic.
          </desc>

          {[10, 100, 1000, 5000].map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line
                  x1={left}
                  x2={W - right}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.15"
                  strokeDasharray="4 6"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={left - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-text-secondary font-mono"
                  fontSize="11"
                >
                  {tick >= 1000 ? `${tick / 1000}K` : tick}
                </text>
              </g>
            );
          })}

          <line
            x1={releaseX}
            x2={releaseX}
            y1={top}
            y2={H - bottom}
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeDasharray="3 5"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={releaseX + 8}
            y={top + 12}
            className="fill-text-secondary font-mono"
            fontSize="10"
          >
            v9.0.1
          </text>

          <path d={area} fill="url(#growthFill)" opacity="0.6" />
          <path
            d={line}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="text-cta"
          />

          {points.map((point) => {
            const x = xFor(point.date);
            const y = yFor(point.value);
            return (
              <g key={point.label}>
                <circle cx={x} cy={y} r="4" className="fill-cta" />
                {point.axisLabel && (
                  <text
                    x={point.axisLabel === "Oct 26" ? x - 4 : x}
                    y={H - bottom + 22}
                    textAnchor={point.axisLabel === "Oct 26" ? "end" : "middle"}
                    className="fill-text-secondary font-mono"
                    fontSize="10"
                  >
                    {point.axisLabel}
                  </text>
                )}
              </g>
            );
          })}

          <text
            x={xFor(Date.UTC(2026, 6, 15))}
            y={yFor(70) - 12}
            textAnchor="middle"
            className="fill-text-primary font-mono"
            fontSize="11"
          >
            70
          </text>
          <text
            x={xFor(Date.UTC(2026, 8, 20))}
            y={yFor(27) - 12}
            textAnchor="middle"
            className="fill-text-primary font-mono"
            fontSize="11"
          >
            27
          </text>
          <text
            x={xFor(Date.UTC(2026, 9, 17)) - 4}
            y={yFor(495) - 14}
            textAnchor="end"
            className="fill-text-primary font-mono"
            fontSize="11"
          >
            495
          </text>
          <text
            x={xFor(Date.UTC(2026, 9, 26))}
            y={yFor(4510) - 14}
            textAnchor="middle"
            className="fill-text-primary font-mono"
            fontSize="11"
          >
            4,510
          </text>

          <defs>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F25F5C" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F25F5C" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <figcaption className="text-xs text-text-secondary font-tech uppercase tracking-widest mt-3 text-center">
        Fig 1b — The shape of the jump. Eight months of slow growth, a bug
        spiral, then three days that changed the scale.
      </figcaption>
    </figure>
  );
}
