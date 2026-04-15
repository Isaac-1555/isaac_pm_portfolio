import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import RightChevron from "@/components/icons/right-chevron";
import BookIcon from "@/components/icons/book-icon";
import ClockIcon from "@/components/icons/clock-icon";
import UserIcon from "@/components/icons/user-icon";
import IconHoverWrapper from "@/components/icons/IconHoverWrapper";

const posts = [
  {
    slug: "restostar",
    title: "Restostar: Turning Unhappy Diners into Private Conversations",
    subtitle:
      "The story behind a startup idea that rethinks restaurant reputation management — routing feedback by sentiment so that every review works for the restaurant, not against it.",
    date: "April 2026",
    readTime: "8 min",
    author: "Isaac",
    tags: ["SaaS", "0 to 1", "MVP", "Reputation Management"],
    image: "/Restostar_Dashboard.png",
    gradient: "from-emerald-900 to-teal-900",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      {/* Header */}
      <div id="mission-blog-header" className="mb-16">
        <h1 className="text-4xl md:text-6xl font-industrial font-bold uppercase tracking-widest text-text-primary mb-4">
          Project <span className="text-cta">Blog</span>
        </h1>
        <p className="text-text-secondary max-w-2xl text-lg leading-relaxed">
          Deeper dives into past projects, lessons learned, and the product
          thinking behind the builds.
        </p>
      </div>

      {/* Post list */}
      <section id="mission-blog-projects" className="mb-24">
        <h2 className="text-2xl font-industrial uppercase tracking-widest mb-8 border-b border-divider pb-4 flex items-center gap-2">
          <BookIcon size={20} className="text-cta" /> All Posts
        </h2>

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
