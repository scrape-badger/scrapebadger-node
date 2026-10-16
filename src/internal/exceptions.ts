/**
 * Custom exceptions for the ScrapeBadger SDK.
 */

/**
 * Base error class for all ScrapeBadger errors.
 */
export class ScrapeBadgerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScrapeBadgerError";
    Object.setPrototypeOf(this, ScrapeBadgerError.prototype);
  }
}

/**
 * Raised when authentication fails (invalid or missing API key).
 */
export class AuthenticationError extends ScrapeBadgerError {
  constructor(message = "Authentication failed. Check your API key.") {
    super(message);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Raised when the API key is not permitted to call this API (HTTP 403,
 * `error: "insufficient_scope"`). Keys can be restricted to specific APIs in
 * the dashboard; a refused call is not charged.
 *
 * Extends `AuthenticationError`, which is what a 403 threw before 0.52.0.
 */
export class PermissionDeniedError extends AuthenticationError {
  /** The API the request needed, e.g. `"twitter"` */
  readonly requiredScope: string | undefined;
  /** The APIs this key may call */
  readonly allowedScopes: string[];

  constructor(
    message = "This API key is not permitted to call this API.",
    requiredScope?: string,
    allowedScopes: string[] = []
  ) {
    super(message);
    this.name = "PermissionDeniedError";
    this.requiredScope = requiredScope;
    this.allowedScopes = allowedScopes;
    Object.setPrototypeOf(this, PermissionDeniedError.prototype);
  }
}

/**
 * Raised when the API key is restricted to IP addresses and this request came
 * from another one (HTTP 403, `error: "ip_not_allowed"`). Not charged.
 */
export class IPNotAllowedError extends PermissionDeniedError {
  /** The address ScrapeBadger saw (null when relayed, e.g. via the hosted MCP server) */
  readonly clientIp: string | null;

  constructor(
    message = "This API key may not be used from this IP address.",
    clientIp: string | null = null
  ) {
    super(message);
    this.name = "IPNotAllowedError";
    this.clientIp = clientIp;
    Object.setPrototypeOf(this, IPNotAllowedError.prototype);
  }
}

/**
 * Raised when rate limit is exceeded.
 */
export class RateLimitError extends ScrapeBadgerError {
  /** Unix timestamp when the rate limit resets */
  readonly retryAfter: number | undefined;
  /** Maximum requests per minute for this tier */
  readonly limit: number | undefined;
  /** Remaining requests in the current window */
  readonly remaining: number | undefined;

  constructor(
    message = "Rate limit exceeded.",
    options?: { retryAfter?: number; limit?: number; remaining?: number }
  ) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfter = options?.retryAfter;
    this.limit = options?.limit;
    this.remaining = options?.remaining;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Raised when the requested resource is not found.
 */
export class NotFoundError extends ScrapeBadgerError {
  /** The resource type that was not found */
  readonly resourceType: string | undefined;
  /** The resource ID that was not found */
  readonly resourceId: string | undefined;

  constructor(message = "Resource not found.", resourceType?: string, resourceId?: string) {
    super(message);
    this.name = "NotFoundError";
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Raised when the request is invalid.
 */
export class ValidationError extends ScrapeBadgerError {
  /** Validation errors by field */
  readonly errors: Record<string, string[]> | undefined;

  constructor(message = "Validation error.", errors?: Record<string, string[]>) {
    super(message);
    this.name = "ValidationError";
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/** Why the Web Scraping API reported a target as blocked (SCR-306). */
export type BlockKind =
  "antibot" | "captcha" | "rate_limit" | "ip_ban" | "geo_block" | "auth_wall" | "empty" | "other";

/** The CAPTCHA gating a blocked page. */
export interface BlockingCaptcha {
  system: string;
  confidence: number;
  details?: string | null;
  version?: string | null;
  gate?: boolean;
  solvable?: boolean;
  params?: Record<string, unknown>;
}

/**
 * Raised when a web scrape hit an anti-bot wall on every attempt (HTTP 422,
 * `error: "blocking_page_detected"`). Extends `ValidationError`, which is
 * what this threw before 0.61.0, so existing handlers still match. Blocked
 * requests are not charged.
 *
 * @example
 * ```ts
 * try {
 *   await client.web.scrape({ url: "https://example.com" });
 * } catch (err) {
 *   if (err instanceof BlockedError) {
 *     console.log(err.blockKind, err.vendor, err.captcha?.params);
 *   }
 * }
 * ```
 */
export class BlockedError extends ValidationError {
  /** The wall's class; undefined on older responses */
  readonly blockKind: BlockKind | undefined;
  /** The protection vendor that served it, e.g. "cloudflare", "datadome", "aws_waf" */
  readonly vendor: string | undefined;
  /** The CAPTCHA gating the page when blockKind is "captcha" */
  readonly captcha: BlockingCaptcha | undefined;
  /** The scrape result the API returned with the block */
  readonly data: Record<string, unknown> | undefined;

  constructor(
    message = "Blocking page detected.",
    details: {
      blockKind?: BlockKind | null;
      vendor?: string | null;
      captcha?: BlockingCaptcha | null;
      data?: Record<string, unknown> | null;
    } = {}
  ) {
    super(message);
    this.name = "BlockedError";
    this.blockKind = details.blockKind ?? undefined;
    this.vendor = details.vendor ?? undefined;
    this.captcha = details.captcha ?? undefined;
    this.data = details.data ?? undefined;
    Object.setPrototypeOf(this, BlockedError.prototype);
  }
}

/**
 * Raised when an internal server error occurs.
 */
export class ServerError extends ScrapeBadgerError {
  /** HTTP status code */
  readonly statusCode: number;

  constructor(message = "Internal server error.", statusCode = 500) {
    super(message);
    this.name = "ServerError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

/**
 * Raised when the request times out.
 */
export class TimeoutError extends ScrapeBadgerError {
  /** Timeout duration in milliseconds */
  readonly timeout: number;

  constructor(message = "Request timed out.", timeout: number) {
    super(message);
    this.name = "TimeoutError";
    this.timeout = timeout;
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * Raised when the account has insufficient credits.
 */
export class InsufficientCreditsError extends ScrapeBadgerError {
  /** Current credit balance */
  readonly creditsBalance: number | undefined;

  constructor(message = "Insufficient credits.", creditsBalance?: number) {
    super(message);
    this.name = "InsufficientCreditsError";
    this.creditsBalance = creditsBalance;
    Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
  }
}

/**
 * Raised when the account is restricted.
 */
export class AccountRestrictedError extends ScrapeBadgerError {
  /** Reason for the restriction */
  readonly reason: string | undefined;

  constructor(message = "Account restricted.", reason?: string) {
    super(message);
    this.name = "AccountRestrictedError";
    this.reason = reason;
    Object.setPrototypeOf(this, AccountRestrictedError.prototype);
  }
}

/**
 * Raised when a resource conflict occurs (e.g. duplicate monitor name).
 *
 * Maps to HTTP 409 Conflict.
 *
 * @example
 * ```typescript
 * import { ConflictError } from "scrapebadger";
 *
 * try {
 *   await client.twitter.stream.createMonitor({
 *     name: "Existing Monitor",
 *     usernames: ["elonmusk"],
 *     pollIntervalSeconds: 10,
 *   });
 * } catch (err) {
 *   if (err instanceof ConflictError) {
 *     console.error("Monitor name already exists:", err.message);
 *   }
 * }
 * ```
 */
export class ConflictError extends ScrapeBadgerError {
  constructor(message = "Resource conflict.") {
    super(message);
    this.name = "ConflictError";
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Raised when the WebSocket stream connection fails or is terminated.
 *
 * Common codes:
 * - 4001 -- Invalid or missing API key (auth failure)
 * - 4003 -- Connection limit exceeded (max 5 per API key)
 * - 1001 -- Server closed due to pong timeout
 * - 0    -- Unknown/parse error
 *
 * @example
 * ```typescript
 * import { WebSocketStreamError } from "scrapebadger";
 *
 * try {
 *   for await (const event of client.twitter.stream.connectIter()) {
 *     // ...
 *   }
 * } catch (err) {
 *   if (err instanceof WebSocketStreamError && err.code === 4001) {
 *     console.error("API key rejected -- check your key");
 *   }
 * }
 * ```
 */
export class WebSocketStreamError extends ScrapeBadgerError {
  /** WebSocket close code or server error code */
  readonly code: number | undefined;

  constructor(message = "WebSocket stream error", code?: number) {
    super(message);
    this.name = "WebSocketStreamError";
    this.code = code;
    Object.setPrototypeOf(this, WebSocketStreamError.prototype);
  }
}
