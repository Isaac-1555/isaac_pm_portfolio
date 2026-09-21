# Portfolio

Next.js App Router portfolio site (`next@16`, `react@19`, TypeScript, Tailwind CSS v4). Content/UI driven — case studies, work grid, and blog posts come from static data files, not a backend.

## Getting Started

```bash
npm ci        # install dependencies
npm run dev   # start dev server at http://localhost:3000
npm run build # production build
npm run start # serve production build
npm run lint  # lint
npx tsc --noEmit  # type-check
```

## Shared topographic map hero

Every featured work (case study) page and every blog post page renders a shared topographic background (`public/topographic.svg`) with markers for **all** projects and posts:

- 3 marker groups: `featured` (★ case studies), `work` (small square, work grid items), `blog` (✎ blog posts)
- The page you are currently on is highlighted in tech teal (`bg-cta`/`text-cta`)
- Marker positions live in one registry: `lib/topo-markers.ts` (`{ id, label, group, x, y }`, coordinates in % of the hero)
- Rendered by `components/case-study/TopoMap.tsx`

## Adding a new project

1. Add a full entry to `app/case-studies/data.ts` (follows the `CaseStudy` interface). No `heroBackground` field needed — the shared topo map is used automatically.
2. Add the same `id` to the in-file card arrays on the home page and `app/work/page.tsx` so cards link to the case study.
3. Add a marker to `lib/topo-markers.ts` with `group: "featured"` and a distinct `x`/`y` (avoid overlapping existing markers).
4. If the project also appears as a plain work item, add it to `technicalProjects` in `app/work/page.tsx` and add a `group: "work"` marker.
5. Check `components/mascot/AstronautMascot.tsx` `TOUR_CONFIGS` if the new page introduces or renames section IDs (`mission-*`).

## Adding a new blog post

1. Create `app/blog/<slug>/page.tsx` (copy the structure of an existing post; keep the `metadata` export and gradient hero).
2. Add `<TopoMap activeId="blog-<slug>" />` as the first layer inside the hero `<header>`, and import it from `@/components/case-study/TopoMap`.
3. Add the post to the `posts` array in `app/blog/page.tsx` (listing card) and `app/blog/sitemap.ts` if it exists.
4. Add a marker to `lib/topo-markers.ts` with `id: "blog-<slug>"`, `group: "blog"`, and a distinct `x`/`y`.

## Global Game Leaderboard

The interactive game in the hero has a global, shared high-score leaderboard
stored in **Upstash Redis** (the engine Vercel KV used to resell). It keeps the
Top 10 in a Redis sorted set for O(log n) reads.

### Setup

1. Create a free Upstash Redis database:
   - **via Vercel:** Dashboard → Storage → Create Database → **Upstash Redis**
     (Vercel injects the env vars for you), or
   - **directly:** [upstash.com](https://upstash.com) → Create database → Redis.
2. Copy the REST credentials into `.env.local` (and into the Vercel project
   environment). Any of these spellings work:

   ```
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=
   # or (legacy Vercel KV naming)
   KV_REST_API_URL=
   KV_REST_API_TOKEN=
   # or (namespaced variant)
   HIGH_SCORE_KV_REST_API_URL=
   HIGH_SCORE_KV_REST_API_TOKEN=
   ```

3. Restart the dev server. The leaderboard API returns `500` until credentials
   are configured.

### API

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/leaderboard/session` | POST | Issues a one-time game session token (TTL 2h) |
| `/api/leaderboard` | GET | Top 10 scores + 10th-place cutoff |
| `/api/leaderboard` | POST | Validates and saves a score (name, score, token) |

### Security notes

- All validation is server-side: score range, name sanitization (trim, strip
  control/HTML chars, 20-char limit), and qualification checks.
- One-time session tokens prevent duplicate/replayed submissions.
- Basic rate limiting (1 submission / 10 s per IP) uses a Redis `SET NX` window.
- Credentials never leave the server; routes expose no secrets.

