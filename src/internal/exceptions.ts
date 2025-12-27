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
