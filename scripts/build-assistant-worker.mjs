// Bundles the assistant worker for the browser.
// Usage: npm run assistant:worker (also runs before dev/build)
//
// Turbopack emits a module worker created from a .ts URL as raw source, so the
// worker is prebundled with esbuild and served as a static file instead.

import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const outdir = resolve(root, "public/assistant");
await mkdir(outdir, { recursive: true });

const result = await build({
  entryPoints: [resolve(root, "workers/assistant.worker.ts")],
  outfile: resolve(outdir, "worker.js"),
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  minify: true,
  legalComments: "none",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  logLevel: "info",
});

if (result.errors.length) process.exit(1);
