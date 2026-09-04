/**
 * TypeScript types for the ChatGPT API.
 *
 * Answers come from the real chatgpt.com web surface (not the OpenAI API),
 * anonymously — no OpenAI account or API key is involved.
 */

// =============================================================================
// Request Types
// =============================================================================

/** Whether ChatGPT should browse the web for the answer. */
export type ChatGPTWebSearchMode = "auto" | "force" | "off";

/** Parameters for the ask endpoint. */
export interface ChatGPTAskParams {
  /** The prompt to send. Maximum 4096 characters. */
  prompt: string;
  /** ISO-3166 alpha-2 egress country (default: "US") */
  country?: string;
  /** Whether ChatGPT should browse (default: "auto") */
  web_search?: ChatGPTWebSearchMode;
  /**
   * Public http(s) URL of an image to attach. ChatGPT looks at the picture and
   * answers about it (JPEG/PNG/GIF/WEBP/BMP, up to 5 MB). An image ask takes
   * noticeably longer — allow 90-150s.
   *
   * ChatGPT will NOT generate an image: anonymous chatgpt.com gates that behind a
   * login.
   */
  image_url?: string;
}

/** Parameters for the brand-visibility endpoint. */
export interface ChatGPTBrandVisibilityParams {
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
  /** Whether ChatGPT should browse (default: "force") */
  web_search?: ChatGPTWebSearchMode;
}

/** Parameters for the models endpoint. */
export interface ChatGPTModelsParams {
  /** ISO-3166 alpha-2 egress country (default: "US") */
  country?: string;
}

// =============================================================================
// Sources
// =============================================================================

/**
 * A web source ChatGPT actually referenced in its answer.
 *
 * `start_index` / `end_index` are character offsets into the answer, so a
 * citation can be anchored to the exact span of text it supports.
 */
export interface ChatGPTCitation {
  /** Source URL */
  url: string | null;
  /** Page title */
  title: string | null;
  /** Snippet of the source text */
  snippet: string | null;
  /** Bare domain of the source (e.g. "reuters.com") */
  domain: string | null;
  /** Publisher attribution string, when ChatGPT provides one */
  attribution: string | null;
  /** Publication time as a Unix timestamp */
  pub_date_utc: number | null;
  /** Publication time as an ISO-8601 Z string */
  published_at: string | null;
  /** Character offset into the answer where the supported span begins */
  start_index: number | null;
  /** Character offset into the answer where the supported span ends */
  end_index: number | null;
  /** The answer substring this source supports */
  matched_text: string | null;
}

/** One entry of the FULL set ChatGPT retrieved — cited or not. */
export interface ChatGPTSearchResult {
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
  /** Publication time as a Unix timestamp */
  pub_date_utc: number | null;
  /** Publication time as an ISO-8601 Z string */
  published_at: string | null;
  /** Index of this result in the retrieved set */
  ref_index: number | null;
  /** Whether this result was actually referenced in the answer */
  cited: boolean;
}

// =============================================================================
// Ask
// =============================================================================

/** A ChatGPT answer with its sources. */
/** An image the answer itself displayed. */
export interface MediaItem {
  /** Image URL. */
  url: string;
  /** Alt text, when one was supplied. */
  title?: string | null;
}

export interface ChatGPTAskResponse {
  /** The prompt that was sent */
  prompt: string;
  /** The answer as plain text */
  answer: string;
  /** The answer as markdown, when available */
  answer_markdown: string | null;
  /** Sources ChatGPT actually referenced */
  citations: ChatGPTCitation[];
  /** The full retrieved set, cited or not */
  search_results: ChatGPTSearchResult[];
  /** Distinct domains across the sources */
  source_domains: string[];
  /**
   * Images the answer displayed. Never a generated image — see
   * `image_url` on the params.
   */
  images: MediaItem[];
  /** Whether ChatGPT ACTUALLY browsed the web */
  /** True when the render budget expired mid-answer; `answer` is partial. */
  truncated: boolean;
  web_search_triggered: boolean;
  /** Raw reference markers (e.g. "turn0search1") */
  /** Actual sub-queries ChatGPT issued to the search engine. */
  search_queries: string[];
  reference_tokens: string[];
  /** Model slug that answered (e.g. "gpt-5-5") */
  model: string | null;
  /** ChatGPT conversation identifier */
  conversation_id: string | null;
  /** ChatGPT message identifier */
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
export interface ChatGPTCompetitorMention {
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

/** AEO/GEO brand analysis of a ChatGPT answer. */
export interface ChatGPTBrandVisibilityResponse {
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
  competitors: ChatGPTCompetitorMention[];
  /** Answer text around the first brand mention */
  excerpt: string | null;
  /** The answer as plain text */
  answer: string;
  /** Sources ChatGPT actually referenced */
  citations: ChatGPTCitation[];
  /** Whether ChatGPT ACTUALLY browsed the web */
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

// =============================================================================
// Reference
// =============================================================================

/** One model offered by chatgpt.com. */
export interface ChatGPTModel {
  /** Model slug (e.g. "gpt-5-5") */
  slug: string;
  /** Human-readable name */
  title: string | null;
  /** Short description */
  description: string | null;
  /** Maximum context length, when advertised */
  max_tokens: number | null;
  /** Model tags */
  tags: string[];
}

/** The models chatgpt.com currently offers. */
export interface ChatGPTModelsResponse {
  /** Available models */
  models: ChatGPTModel[];
  /** Number of models */
  count: number;
}
