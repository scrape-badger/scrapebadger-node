/**
 * TypeScript types for the agent platform endpoints.
 *
 * Quote, feedback, async requests and batches — the account-level helpers an
 * agent uses around the scraper APIs. None of these calls is ever billed
 * (a submitted call is billed once, when it completes).
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

/** HTTP methods {@link RequestsClient.submit} can send. */
export type SubmitMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/** Options for {@link RequestsClient.submit}. */
export interface SubmitOptions {
  /** HTTP method of the call (default "GET"). */
  method?: SubmitMethod;
  /** Query parameters of the call; `undefined` and `null` values are left out. */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** JSON body of the call (POST, PUT, PATCH). */
  body?: unknown;
  /**
   * https URL that gets a signed `request.completed` webhook when the call
   * completes (sent as `X-Callback-URL`). Verify it with
   * `verifyWebhookSignature` and the secret from `account.webhookSecret()`.
   * Without `wait`, a callback answers 202 at once (`wait=0`).
   */
  callbackUrl?: string;
  /**
   * Seconds (0-120) to wait for the call before answering 202 (sent as
   * `Prefer: respond-async, wait=N`). A call done within `wait` comes back
   * completed. Default: 0 with a `callbackUrl`, otherwise the API's 25.
   */
  wait?: number;
  /**
   * Your key for this call, 1-200 visible ASCII characters (sent as
   * `Idempotency-Key`). Resubmitting the same call with the same key within
   * 15 minutes runs and bills nothing: it answers what `requests.get` would
   * (with `replayed: true`). The same key on a different call is refused
   * with 409 `idempotency_key_reused` (`ConflictError`). With a key, the SDK
   * also retries a submit that timed out or hit a network fault.
   */
  idempotencyKey?: string;
}

/** Options for {@link RequestsClient.wait}. */
export interface WaitOptions {
  /** Give up after this many milliseconds (default 600000, ten minutes). */
  timeoutMs?: number;
}

/** Where to poll a running request. */
export interface AsyncNextAction {
  method: "GET";
  /** "/v1/requests/<request_id>" */
  url: string;
}

/**
 * Body of the 202 an async call answers while it runs, on every route.
 * Comes with `Location` and `Retry-After` headers.
 */
export interface AsyncAccepted {
  request_id: string;
  status: "running";
  retry_after_seconds: number;
  next_action: AsyncNextAction;
  /** Reminder to poll instead of re-submitting. */
  detail?: string;
  /** Webhook delivery state, on a poll of a call submitted with a callback. */
  callback?: Record<string, unknown>;
}

/**
 * State of an async call, from {@link RequestsClient.submit},
 * {@link RequestsClient.get} or {@link RequestsClient.wait}.
 */
export interface AsyncRequest<T = unknown> {
  requestId: string;
  /**
   * "running" while the call is in progress (HTTP 202): poll again after
   * `retryAfterSeconds`, never re-submit the call. "completed" once it has
   * finished: `statusCode`, `headers` and `body` are the call's own.
   */
  status: "running" | "completed";
  /** `status === "running"`. */
  running: boolean;
  /** Seconds to wait before the next poll (running only), from `Retry-After`. */
  retryAfterSeconds: number | null;
  /** HTTP status: 202 while running, otherwise the original call's status. */
  statusCode: number;
  /** Response headers, names lower-cased. */
  headers: Record<string, string>;
  /**
   * The original call's body once completed: JSON-decoded when it is JSON,
   * otherwise text. While running, the 202 body ({@link AsyncAccepted}).
   */
  body: T;
  /**
   * true when the API answered from an earlier submit with the same
   * `Idempotency-Key` (`Idempotent-Replayed: true`): nothing ran or was billed again.
   */
  replayed: boolean;
  /** `X-Credits-Used` of the finished call. */
  creditsUsed: number | null;
  /**
   * @deprecated Always `null`: the API stopped sending `X-Result-ID` (and
   * storing results for re-reads) on 2026-11-09.
   */
  resultId: string | null;
  /** @deprecated Same as `body`; use `body`. */
  data: T;
}

/** Delivery state of the webhook of a call submitted with a callback. */
export type CallbackState = "pending" | "delivering" | "delivered" | "failed";

/** Result of {@link RequestsClient.callbackStatus}. */
export interface CallbackStatus {
  request_id: string;
  state: CallbackState;
  /** Delivery attempts made so far (at most 4). */
  attempts: number;
  /** HTTP status your endpoint answered on the last attempt. */
  last_status: number | null;
  /** Short error class of the last failed attempt, e.g. "timeout". */
  last_error: string | null;
  /** When the next attempt is due (unix seconds), while retrying. */
  next_attempt_at: number | null;
  /** When the webhook was delivered (unix seconds). */
  delivered_at: number | null;
  /** Host of the callback URL (its path and query are never kept). */
  callback_host: string;
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
   * `account.webhookSecret()`.
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
