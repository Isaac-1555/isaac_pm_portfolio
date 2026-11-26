// Validation for the hidden space-cinema quote archive.
// Usage: npm run assistant:quotes

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  isSpaceQuoteContinuation,
  isSpaceQuoteRequest,
  matchSpaceQuote,
  normalizeSpaceQuoteText,
  randomSpaceQuote,
  relatedSpaceQuotes,
  spaceQuoteReply,
} from "../lib/assistant/space-quotes.ts";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const catalog = JSON.parse(
  await readFile(resolve(root, "content/assistant/space-quotes.json"), "utf8"),
);

const failures = [];
const ids = new Set();
const triggerOwners = new Map();

function fail(message) {
  failures.push(message);
}

if (!Array.isArray(catalog)) {
  fail("space-quotes.json must be an array");
}

for (const quote of catalog) {
  if (!quote.id || ids.has(quote.id)) fail(`Duplicate or missing id: ${quote.id}`);
  ids.add(quote.id);

  if (!quote.film) fail(`${quote.id}: missing film`);
  if (!quote.franchise) fail(`${quote.id}: missing franchise`);
  if (!quote.speaker) fail(`${quote.id}: missing speaker`);
  if (!quote.reply || typeof quote.reply !== "string") fail(`${quote.id}: missing reply`);
  if (!Array.isArray(quote.triggers) || !quote.triggers.length) {
    fail(`${quote.id}: triggers must be a non-empty array`);
    continue;
  }

  const words = quote.reply.trim().split(/\s+/).length;
  if (words > 45) fail(`${quote.id}: reply is ${words} words (target <= 45)`);

  const seenInEntry = new Set();
  for (const trigger of quote.triggers) {
    const normalized = normalizeSpaceQuoteText(trigger);
    if (!normalized) fail(`${quote.id}: empty trigger`);
    if (normalized.length < 3) fail(`${quote.id}: trigger too short: "${trigger}"`);
    if (seenInEntry.has(normalized)) continue;
    seenInEntry.add(normalized);

    const owner = triggerOwners.get(normalized);
    if (owner && owner !== quote.id) {
      fail(`Trigger "${trigger}" belongs to both ${owner} and ${quote.id}`);
    }
    triggerOwners.set(normalized, quote.id);
  }
}

const expectations = [
  ["what's the problem", "2001-problem"],
  ["what is the problem", "2001-problem"],
  ["what is the problem hal", "2001-problem"],
  ["open the pod bay doors hal please", "2001-pod-bay"],
  ["open the bay", "2001-pod-bay"],
  ["open bay", "2001-pod-bay"],
  ["live long and prosper", "st-prosper"],
  ["luke i am your father", "sw-father"],
  ["houston we have a problem", "apollo-problem"],
  ["so say we all", "bsg-say"],
  ["see you space cowboy", "bebop-see-you"],
  ["i am groot", "gotg-groot"],
  ["to infinity and beyond", "lightyear-infinity"],
  ["danger will robinson", "lost-robinson"],
  ["i aim to misbehave", "firefly-misbehave"],
  ["nothing goes over my head", "gotg-over-head"],
  ["you have to let go", "gravity-let-go"],
  ["klaatu barada nikto", "day-earth"],
  ["i am surrounded by assholes", "spaceballs-assholes"],
  ["do not answer", "threebody-answer"],
  ["remember the cant", "expanse-cant"],
  ["hi bob", "fam-hibob"],
];

for (const [text, expected] of expectations) {
  const match = matchSpaceQuote(catalog, text);
  if (match?.quote.id !== expected) {
    fail(`Expected "${text}" -> ${expected}, got ${match?.quote.id ?? "null"}`);
  }
}

const nonMatches = [
  "what is the weather in calgary",
  "how can i contact isaac",
  "what is the problem with my project",
  "tell me about your projects",
  "what are your skills",
  "are you available for hire",
];

for (const text of nonMatches) {
  const match = matchSpaceQuote(catalog, text);
  if (match) fail(`Expected "${text}" -> null, got ${match.quote.id}`);
}

if (!isSpaceQuoteRequest("space movie")) fail("space movie should trigger a random transmission");
if (!isSpaceQuoteRequest("tell me a sci-fi movie quote")) {
  fail("tell me a sci-fi movie quote should trigger a random transmission");
}
if (!isSpaceQuoteContinuation("another one")) fail("another one should continue the archive");
if (isSpaceQuoteContinuation("tell me about tux")) fail("normal questions must not continue the archive");

const random = randomSpaceQuote(catalog);
if (!random) fail("randomSpaceQuote returned null");

const excluded = new Set(catalog.map((quote) => quote.id));
const exhausted = randomSpaceQuote(catalog, excluded);
if (!exhausted) fail("randomSpaceQuote must still return a quote when everything is seen");

const starWars = catalog.find((quote) => quote.id === "sw-father");
if (starWars) {
  const related = relatedSpaceQuotes(catalog, starWars, 3);
  if (related.length !== 3) fail(`relatedSpaceQuotes returned ${related.length}, expected 3`);
  if (related.some((quote) => quote.id === starWars.id)) fail("relatedSpaceQuotes included the source quote");
  if (spaceQuoteReply(starWars) !== starWars.reply) {
    fail("spaceQuoteReply must return only the spoken line");
  }
}

if (failures.length) {
  console.error(`\n${failures.length} space-quote check(s) failed:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`\n${catalog.length} quotes / ${triggerOwners.size} triggers validated.`);
console.log("Space-quote archive OK.");
