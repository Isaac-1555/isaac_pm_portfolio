import spaceQuotesJson from "@/content/assistant/space-quotes.json";
import type { SpaceQuote } from "@/lib/assistant/space-quotes";

/**
 * Loaded lazily by `use-assistant` so the quote archive never lands in the
 * initial assistant bundle.
 */
export const SPACE_QUOTES = spaceQuotesJson as SpaceQuote[];
