import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AccentWord } from "@/components/ui/AccentWord";
import RightChevron from "@/components/icons/right-chevron";
import ClockIcon from "@/components/icons/clock-icon";
import UserIcon from "@/components/icons/user-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";

const posts = [
  {
    slug: "barcode-lists",
    title:
      "Barcode Lists: A Shared Workflow for Calgary Coop",
    subtitle:
      "A Monday-morning scanning problem turned into a shared Chrome extension with AI-powered OCR, realtime sync, and 24 commits of iteration over three months.",
    date: "June 2026",
    readTime: "10 min",
    author: "Isaac",
    tags: ["Chrome Extension", "AI/OCR", "Internal Tool", "Realtime"],
    image: "/BarcodeLists_1.png",
    gradient: "from-slate-800 to-slate-950",
  },
  {
    slug: "d4c",
    title: "D4C: Building a Personalized Coding Agent on Top of Pi",
    subtitle:
      "How I forked the pi coding agent and added plan/build modes, permanent MCP servers, and an /update skill that preserves customizations across upstream syncs.",
    date: "May 2026",
    readTime: "8 min",
    author: "Isaac",
    tags: ["AI", "Dev Tools", "Open Source", "Agent"],
    image: "/D4C_Thumbnail.png",
    gradient: "from-indigo-900 to-purple-900",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      {/* Header */}
      <div id="mission-blog-header" className="mb-16">
        <h1 className="text-4xl md:text-6xl font-industrial font-bold uppercase tracking-widest text-text-primary mb-4">
          Project <AccentWord text="Blog" />
        </h1>
        <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">
          Deeper dives into past projects, lessons learned, and the product
          thinking behind the builds.
        </p>
      </div>

      {/* Post list */}
      <section id="mission-blog-projects" className="mb-24">
        <div className="space-y-10">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              data-icon-hover-trigger
              className="group block"
            >
              <article className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                {/* Image */}
                <div className="md:col-span-5 relative aspect-[16/10] rounded-sm overflow-hidden border-2 border-bg-dark">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="md:col-span-7 flex flex-col justify-center">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-tech text-text-secondary uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-1.5">
                      <UserIcon size={14} />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon size={14} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon size={14} />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-industrial font-bold uppercase tracking-wider text-text-primary group-hover:text-cta transition-colors leading-tight mb-3">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-text-secondary leading-relaxed mb-4 line-clamp-3 text-sm md:text-base">
                    {post.subtitle}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Read more */}
                  <div className="flex items-center gap-1.5 text-sm font-tech uppercase tracking-widest text-cta group-hover:gap-3 transition-all">
                    Read Article
                    <IconHoverWrapper hoverTrigger="closest">
                      <RightChevron size={16} />
                    </IconHoverWrapper>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
