/**
 * TypeScript types for the agent platform endpoints.
 *
 * Quote, feedback, result re-reads and async-request polling — the
 * account-level helpers an agent uses around the scraper APIs. None of these
 * calls is ever billed.
 */

// =============================================================================
// Request Types
// =============================================================================

/** Options for {@link AgentClient.quote}. */
export interface QuoteOptions {
  /** The quoted call's query parameters. */
  params?: Record<string, unknown>;
  /** The quoted call's JSON body (POST endpoints). */
  body?: Record<string, unknown>;
}

/** Options for {@link AgentClient.feedback} and {@link AgentClient.reportBug}. */
export interface FeedbackOptions {
  /** "feedback" (default) or "bug". `reportBug` always sends "bug". */
  type?: "bug" | "feedback";
  /** Longer description, up to 5,000 characters. */
  details?: string;
  /** `X-Request-ID` of the call concerned, so it can be found. */
  requestId?: string;
  /** Path of the endpoint concerned, e.g. "/v1/google/search". */
  endpoint?: string;
  /** Where to reach you, if you want a reply. */
  contact?: string;
}

/**
 * View params for {@link ResultsClient.get}. Sent without the underscore
 * prefix the same params take on other reads (`_jq`, `_fields`, ...).
 */
export interface ResultViewOptions {
  /**
   * jq expression applied last, e.g. ".results[].title". A jq error returns
   * `{ _view_error, result_id, data }`.
   */
  jq?: string;
  /** Fields to keep on each item of the main list, e.g. ["title", "link"] (dotted paths allowed). */
  fields?: string | string[];
  /** Keep at most this many items of the main list (adds a `_truncated` marker). */
  maxItems?: number;
  /** Return a structural outline (types, list lengths, byte sizes) instead of the body. */
  summary?: boolean;
}

// =============================================================================
// Response Types
// =============================================================================

/** One problem with the quoted call's parameters. */
export interface QuoteFieldError {
  field: string | null;
  /** What is wrong, e.g. "required". */
  message: string;
}

/** What the call costs in credits. */
export interface QuoteCredits {
  /** Lowest possible charge (0 when an empty result is not billed). */
  min: number;
  /** Highest possible charge; null when billed per item with no upper bound. */
  max: number | null;
  /** Charge for one call before any per-item part. */
  base: number;
  /** Charge per returned item (0 for flat-priced endpoints). */
  per_item: number;
}

/** What the call costs in USD. "list" = Starter plan rate, "best" = cheapest plan rate. */
export interface QuoteUsd {
  max_per_call_list: number;
  per_1k_calls_list: number;
  per_1k_calls_best: number;
  /** Per-item endpoints only. */
  per_1k_items_list?: number;
}

/** How long successful calls to this endpoint took recently. */
export interface QuoteLatency {
  p50_ms: number;
  p95_ms: number;
  p99_ms: number;
  samples: number;
  window_days: number;
}

/** What a call would cost, whether its parameters are valid, and how long it usually takes. */
export interface Quote {
  method: string;
  /** Normalised path (always starts with "/v1/"). */
  path: string;
  scraper: string;
  endpoint_pattern: string | null;
  /** false => `errors` lists problems; null => this endpoint's params are not validated. */
  valid: boolean | null;
  errors: QuoteFieldError[];
  /** "flat" | "per_item" | "dynamic" (web scraping) | "free" */
  billing: string;
  credits: QuoteCredits;
  /** null when plan rates are unavailable. */
  usd: QuoteUsd | null;
  /** null until samples exist. */
  latency: QuoteLatency | null;
  /** Billing caveats worth relaying, e.g. that empty results are free. */
  notes: string[];
}

/** Acknowledgement of a bug report or feedback. */
export interface FeedbackReceipt {
  id: string;
  /** Always "received". */
  status: string;
  /** Text to relay; no reply is needed. */
  message: string;
}

/** State of a call made with `Prefer: respond-async`. */
export interface AsyncRequest<T = unknown> {
  requestId: string;
  /**
   * true while the call is still in progress (HTTP 202). Poll again after
   * `retryAfterSeconds`; never re-submit the call.
   */
  running: boolean;
  /** 202 while running, otherwise the original call's status. */
  status: number;
  /** Suggested wait before the next poll (running only). */
  retryAfterSeconds: number | null;
  /** `X-Result-ID` of the finished call, for free re-reads via `results.get`. */
  resultId: string | null;
  /** `X-Credits-Used` of the finished call. */
  creditsUsed: number | null;
  /** The original response body once finished, or the 202 status body while running. */
  data: T;
}

/** One item of `requests.batch`: a GET read, as if sent alone. */
export interface BatchItem {
  /** Only GET reads can be batched. */
  method?: "GET";
  /** API path, e.g. "/v1/chatgpt/ask" (no query string). */
  path: string;
  /** Query parameters. */
  query?: Record<string, string | number | boolean | Array<string | number | boolean>>;
}

/** Options for `requests.batch`. */
export interface BatchOptions {
  /**
   * https URL that gets one signed webhook per item when it completes. Verify
   * it with `verifyWebhookSignature` and the secret from
   * `GET /v1/account/webhook-secret`.
   */
  callbackUrl?: string;
}

/** Outcome of one submitted item. */
export interface BatchItemResult {
  /** Position of the item in the submitted list. */
  index: number;
  /**
   * true when the item started (poll `request_id` or wait for its webhook);
   * false when refused before running (rate limit, credits...): not billed.
   */
  accepted: boolean;
  /** HTTP status of the submission (202 when accepted). */
  status: number;
  request_id: string | null;
  /** Where to poll it (accepted items). */
  poll_url?: string;
  /** The refusal's error body (refused items). */
  error?: unknown;
}

/** Result of `requests.batch`: one entry per submitted item, in order. */
export interface BatchSubmission {
  batch_id: string;
  count: number;
  accepted: number;
  requests: BatchItemResult[];
}

/**
 * The `agent_trial` block of `account.getAccountInfo()` — only present for an
 * agent trial key (minted without an account).
 */
export interface AgentTrial {
  credits_remaining: number;
  /** When the trial key stops working (ISO-8601). */
  expires_at: string;
  /** Link a human opens to move the key onto their account. */
  claim_url: string;
}
