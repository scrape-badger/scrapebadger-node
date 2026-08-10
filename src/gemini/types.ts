/**
 * TypeScript types for the Gemini API.
 *
 * Answers come from the real gemini.google.com web surface (not the Gemini
 * API), anonymously — no Google account or API key is involved.
 */

// =============================================================================
// Request Types
// =============================================================================

/** Whether Gemini should ground the answer with a web search. */
export type GeminiWebSearchMode = "auto" | "force" | "off";

/** Parameters for the ask endpoint. */
export interface GeminiAskParams {
  /** The prompt to send. Maximum 4096 characters. */
  prompt: string;
  /** ISO-3166 alpha-2 egress country (default: "US") */
  country?: string;
  /** Whether Gemini should ground with web search (default: "auto") */
  web_search?: GeminiWebSearchMode;
}

/** Parameters for the brand-visibility endpoint. */
export interface GeminiBrandVisibilityParams {
  /** The prompt to send. Maximum 4096 characters. */
  prompt: string;
  /** The brand name to look for in the answer. */
  brand: string;
  /** The brand's domain, used to detect brand citations. */
  domain?: string;
  /** Other spellings of the brand that should count as mentions. */
  aliases?: string[];
  /** Competitor names to measure share of voice against. */
  competitors?: string[];
  /** ISO-3166 alpha-2 egress country (default: "US") */
  country?: string;
  /** Whether Gemini should ground with web search (default: "force") */
  web_search?: GeminiWebSearchMode;
}

// =============================================================================
// Sources
// =============================================================================

/**
 * A web source Gemini actually referenced in its answer.
 *
 * `start_index` / `end_index` are character offsets into the answer, so a
 * citation can be anchored to the exact span of text it supports.
 */
export interface GeminiCitation {
  /** Source URL */
  url: string | null;
  /** Page title */
  title: string | null;
  /** Snippet of the source text */
  snippet: string | null;
  /** Bare domain of the source (e.g. "reuters.com") */
  domain: string | null;
  /** Publisher attribution string, when Gemini provides one */
  attribution: string | null;
  /** Character offset into the answer where the supported span begins */
  start_index: number | null;
  /** Character offset into the answer where the supported span ends */
  end_index: number | null;
  /** The answer substring this source supports */
  matched_text: string | null;
}

/** One entry of the FULL set Gemini retrieved — cited or not. */
export interface GeminiSearchResult {
  /** Result URL */
  url: string | null;
  /** Page title */
  title: string | null;
  /** Snippet of the result text */
  snippet: string | null;
  /** Bare domain of the result */
  domain: string | null;
  /** Publisher attribution string, when present */
  attribution: string | null;
  /** Whether this result was actually referenced in the answer */
  cited: boolean;
}

// =============================================================================
// Ask
// =============================================================================

/** A Gemini answer with its sources. */
export interface GeminiAskResponse {
  /** The prompt that was sent */
  prompt: string;
  /** The answer as plain text */
  answer: string;
  /** The answer as markdown, when available */
  answer_markdown: string | null;
  /** Sources Gemini actually referenced */
  citations: GeminiCitation[];
  /** The full retrieved set, cited or not */
  search_results: GeminiSearchResult[];
  /** Distinct domains across the sources */
  source_domains: string[];
  /** True when the render budget expired mid-answer; `answer` is partial. */
  truncated: boolean;
  /** Whether Gemini ACTUALLY grounded the answer with a web search */
  web_search_triggered: boolean;
  /** Model slug that answered (e.g. a Gemini Flash-Lite build) */
  model: string | null;
  /** Gemini conversation identifier */
  conversation_id: string | null;
  /** Gemini message identifier */
  message_id: string | null;
  /** ISO-3166 alpha-2 egress country used */
  country: string;
  /** Length of the answer in characters */
  answer_length: number;
  /** Number of citations */
  citation_count: number;
  /** End-to-end latency in milliseconds */
  latency_ms: number;
  /** Creation time as a Unix timestamp */
  created_utc: number | null;
  /** Creation time as an ISO-8601 Z string */
  created_at: string | null;
}

// =============================================================================
// Brand visibility
// =============================================================================

/** How one competitor fared in the same answer. */
export interface GeminiCompetitorMention {
  /** Competitor name as supplied in the request */
  name: string;
  /** Whether the competitor appears in the answer */
  mentioned: boolean;
  /** Number of mentions */
  mention_count: number;
  /** Character offset of the first mention */
  first_position: number | null;
  /** Whether a competitor URL is cited as a source */
  cited: boolean;
  /** Cited URLs attributed to this competitor */
  cited_urls: string[];
}

/** AEO/GEO brand analysis of a Gemini answer. */
export interface GeminiBrandVisibilityResponse {
  /** The prompt that was sent */
  prompt: string;
  /** The brand that was analysed */
  brand: string;
  /** The brand's domain, when supplied */
  domain: string | null;
  /** Whether the brand appears in the answer */
  mentioned: boolean;
  /** Number of brand mentions */
  mention_count: number;
  /** Character offset of the first brand mention */
  first_position: number | null;
  /** 1.0 = named at the very start, 0.0 = absent */
  position_score: number;
  /** Brand mentions / (brand + competitor mentions) */
  share_of_voice_pct: number;
  /** Whether the brand's domain is cited as a source */
  cited: boolean;
  /** Cited URLs on the brand's domain */
  cited_urls: string[];
  /** 1-based rank of the first cited brand URL */
  citation_rank: number | null;
  /** Per-competitor breakdown */
  competitors: GeminiCompetitorMention[];
  /** Answer text around the first brand mention */
  excerpt: string | null;
  /** The answer as plain text */
  answer: string;
  /** Sources Gemini actually referenced */
  citations: GeminiCitation[];
  /** Whether Gemini ACTUALLY grounded the answer with a web search */
  web_search_triggered: boolean;
  /** Model slug that answered */
  model: string | null;
  /** ISO-3166 alpha-2 egress country used */
  country: string;
  /** End-to-end latency in milliseconds */
  latency_ms: number;
  /** Creation time as a Unix timestamp */
  created_utc: number | null;
  /** Creation time as an ISO-8601 Z string */
  created_at: string | null;
}
