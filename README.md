This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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

