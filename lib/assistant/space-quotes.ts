/**
 * Hidden space-cinema call-and-response engine.
 *
 * Data lives in `content/assistant/space-quotes.json`. This module contains
 * only pure matching/formatting logic so it can be imported by both the chat
 * panel and the `assistant:quotes` validation script.
 */

export type SpaceQuote = {
  id: string;
  film: string;
  year?: number;
  franchise: string;
  speaker: string;
  triggers: string[];
  reply: string;
  exactOnly?: boolean;
};

export type SpaceQuoteMatch = {
  quote: SpaceQuote;
  trigger: string;
  score: number;
};

const CONTRACTIONS: Array<[RegExp, string]> = [
  [/\bwhat's\b/g, "what is"],
  [/\bwhats\b/g, "what is"],
  [/\bit's\b/g, "it is"],
  [/\bits\b/g, "it is"],
  [/\bi'm\b/g, "i am"],
  [/\bim\b/g, "i am"],
  [/\bi've\b/g, "i have"],
  [/\bive\b/g, "i have"],
  [/\bi'll\b/g, "i will"],
  [/\bi'd\b/g, "i would"],
  [/\byou're\b/g, "you are"],
  [/\byoure\b/g, "you are"],
  [/\byou've\b/g, "you have"],
  [/\byou'll\b/g, "you will"],
  [/\bwe're\b/g, "we are"],
  [/\bwe've\b/g, "we have"],
  [/\bthey're\b/g, "they are"],
  [/\bthat's\b/g, "that is"],
  [/\bthere's\b/g, "there is"],
  [/\bhere's\b/g, "here is"],
  [/\bwho's\b/g, "who is"],
  [/\bhow's\b/g, "how is"],
  [/\bwhere's\b/g, "where is"],
  [/\bwhen's\b/g, "when is"],
  [/\bwhy's\b/g, "why is"],
  [/\bdon't\b/g, "do not"],
  [/\bdont\b/g, "do not"],
  [/\bdoesn't\b/g, "does not"],
  [/\bdidn't\b/g, "did not"],
  [/\bcan't\b/g, "cannot"],
  [/\bcant\b/g, "cannot"],
  [/\bwon't\b/g, "will not"],
  [/\bwouldn't\b/g, "would not"],
  [/\bcouldn't\b/g, "could not"],
  [/\bshouldn't\b/g, "should not"],
  [/\bisn't\b/g, "is not"],
  [/\baren't\b/g, "are not"],
  [/\bwasn't\b/g, "was not"],
  [/\bweren't\b/g, "were not"],
  [/\bhasn't\b/g, "has not"],
  [/\bhaven't\b/g, "have not"],
  [/\bhadn't\b/g, "had not"],
  [/\bain't\b/g, "is not"],
  [/\blet's\b/g, "let us"],
  [/\bgonna\b/g, "going to"],
  [/\bwanna\b/g, "want to"],
  [/\bgotta\b/g, "got to"],
  [/\bkinda\b/g, "kind of"],
  [/\boutta\b/g, "out of"],
];

const PORTFOLIO_TERMS = [
  "isaac",
  "project",
  "projects",
  "resume",
  "work",
  "experience",
  "skill",
  "skills",
  "education",
  "certification",
  "certifications",
  "available",
  "availability",
  "hire",
  "hiring",
  "contact",
  "email",
  "location",
  "calgary",
  "portfolio",
  "github",
  "linkedin",
  "tux",
  "notebucket",
  "mytube",
  "pocket resume",
  "d4c",
  "assistant",
];

const RANDOM_REQUESTS = [
  "space movie",
  "space movies",
  "sci fi movie",
  "science fiction movie",
  "space quote",
  "movie quote",
  "space movie quote",
  "sci fi quote",
  "give me a quote",
  "surprise me",
  "easter egg",
];

const CONTINUATIONS = new Set([
  "more",
  "another",
  "next",
  "again",
  "go on",
  "keep going",
  "more please",
  "another one",
  "next one",
  "more transmissions",
  "one more",
]);

export function normalizeSpaceQuoteText(input: string) {
  let text = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"');

  for (const [pattern, replacement] of CONTRACTIONS) {
    text = text.replace(pattern, replacement);
  }

  return text
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasPortfolioTerm(query: string) {
  const tokens = new Set(query.split(" "));
  return PORTFOLIO_TERMS.some((term) =>
    term.includes(" ") ? query.includes(term) : tokens.has(term),
  );
}

function diceCoefficient(a: string[], b: string[]) {
  if (!a.length || !b.length) return 0;

  const counts = new Map<string, number>();
  for (const token of a) counts.set(token, (counts.get(token) ?? 0) + 1);

  let overlap = 0;
  for (const token of b) {
    const remaining = counts.get(token) ?? 0;
    if (!remaining) continue;
    overlap += 1;
    counts.set(token, remaining - 1);
  }

  return (2 * overlap) / (a.length + b.length);
}

/**
 * Returns the best quote response for the user's text, or null when the text
 * is a normal portfolio question.
 */
export function matchSpaceQuote(
  catalog: readonly SpaceQuote[],
  input: string,
): SpaceQuoteMatch | null {
  const query = normalizeSpaceQuoteText(input);
  if (!query) return null;

  const queryTokens = query.split(" ");
  const padded = ` ${query} `;
  const portfolio = hasPortfolioTerm(query);
  let best: SpaceQuoteMatch | null = null;

  for (const quote of catalog) {
    const speakerTokens = new Set(normalizeSpaceQuoteText(quote.speaker).split(" "));

    for (const rawTrigger of quote.triggers) {
      const trigger = normalizeSpaceQuoteText(rawTrigger);
      if (!trigger) continue;

      const triggerTokens = trigger.split(" ");
      const extraTokens = queryTokens.filter((token) => !triggerTokens.includes(token));
      const onlySpeakerExtras =
        extraTokens.length > 0 && extraTokens.every((token) => speakerTokens.has(token));
      let score = 0;

      if (query === trigger) {
        score = 1;
      } else if (padded.includes(` ${trigger} `)) {
        score = 0.92;
      } else if (triggerTokens.length >= 4) {
        const similarity = diceCoefficient(queryTokens, triggerTokens);
        if (similarity >= 0.86) score = 0.7 + similarity * 0.15;
      }

      if (!score) continue;
      if (quote.exactOnly && score < 0.99 && !(score >= 0.9 && onlySpeakerExtras)) {
        continue;
      }
      if (portfolio && triggerTokens.length < 5) continue;

      const candidate: SpaceQuoteMatch = { quote, trigger, score };
      if (
        !best ||
        candidate.score > best.score + 1e-9 ||
        (Math.abs(candidate.score - best.score) < 1e-9 &&
          trigger.length > best.trigger.length)
      ) {
        best = candidate;
      }
    }
  }

  return best;
}

export function isSpaceQuoteRequest(input: string) {
  const query = normalizeSpaceQuoteText(input);
  if (!query) return false;
  if (query.split(" ").length > 9) return false;

  return RANDOM_REQUESTS.some((rawPhrase) => {
    const phrase = normalizeSpaceQuoteText(rawPhrase);
    return (
      query === phrase ||
      query.startsWith(`${phrase} `) ||
      query.endsWith(` ${phrase}`) ||
      query.includes(` ${phrase} `)
    );
  });
}

export function isSpaceQuoteContinuation(input: string) {
  return CONTINUATIONS.has(normalizeSpaceQuoteText(input));
}

export function randomSpaceQuote(
  catalog: readonly SpaceQuote[],
  excludeIds: ReadonlySet<string> = new Set(),
  franchise?: string,
) {
  const sameFranchise = catalog.filter(
    (quote) => !excludeIds.has(quote.id) && (!franchise || quote.franchise === franchise),
  );
  const unseen = catalog.filter((quote) => !excludeIds.has(quote.id));
  const pool = sameFranchise.length ? sameFranchise : unseen.length ? unseen : catalog;

  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}

export function relatedSpaceQuotes(
  catalog: readonly SpaceQuote[],
  quote: SpaceQuote,
  limit = 2,
) {
  const sameFranchise = catalog.filter(
    (candidate) => candidate.id !== quote.id && candidate.franchise === quote.franchise,
  );
  const rest = catalog.filter(
    (candidate) => candidate.id !== quote.id && candidate.franchise !== quote.franchise,
  );

  const shuffle = (list: readonly SpaceQuote[]) => {
    const copy = [...list];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  };

  return [...shuffle(sameFranchise), ...shuffle(rest)].slice(0, limit);
}

export function spaceQuoteReply(quote: SpaceQuote) {
  return quote.reply;
}

export function spaceQuotePrompt(quote: SpaceQuote) {
  return quote.triggers[0] ?? quote.film;
}
