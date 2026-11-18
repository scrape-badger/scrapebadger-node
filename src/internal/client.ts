/**
 * Base HTTP client with retry logic and error handling.
 */

import type { ResolvedConfig } from "./config.js";
import { SDK_VERSION } from "./version.js";
import {
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  BlockedError,
  ServerError,
  TimeoutError,
  InsufficientCreditsError,
  AccountRestrictedError,
  PermissionDeniedError,
  IPNotAllowedError,
  ConflictError,
  ScrapeBadgerError,
} from "./exceptions.js";
import type { BlockKind, BlockingCaptcha } from "./exceptions.js";

/**
 * Server-side status codes worth retrying.
 *
 * A transient 500 is no more permanent than a 502, and both clear on a retry
 * far more often than not. Kept in step with the Python SDK's `retry_on_status`.
 */
const RETRYABLE_STATUS_CODES = [500, 502, 503, 504];

export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number; // unix timestamp
}

export interface ResponseWithHeaders<T> {
  data: T;
  rateLimit?: RateLimit;
  /** HTTP status of the response (a 2xx — errors throw). */
  status?: number;
  /** Raw response headers. */
  headers?: Headers;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  /** Timeout for this request in milliseconds (default: the client's `timeout`). */
  timeoutMs?: number;
  /** Retry cap for this request (default: the client's `maxRetries`). */
  maxRetries?: number;
  /**
   * What a failed attempt may be retried on (default "all"):
   * - "all": 5xx, 429, timeouts and network faults;
   * - "transport": timeouts and network faults only; an error status is
   *   thrown at once (a stored result answers the same every time);
   * - "connect": only a connection that failed before anything was sent.
   *   For a request a second copy of which could run and bill a call again,
   *   such as an async submit without an `Idempotency-Key`: after a lost
   *   202, a timeout or an edge 5xx the call may already be running.
   */
  retry?: RetryMode;
}

/** See {@link RequestOptions.retry}. */
export type RetryMode = "all" | "transport" | "connect";

/**
 * A response with its status, headers and decoded body: JSON when the
 * response is JSON, otherwise text. Returned by {@link BaseClient.requestResponse}.
 */
export interface RawResponse {
  status: number;
  headers: Headers;
  body: unknown;
}

/** How {@link BaseClient} executes one request. */
interface ExecutePolicy<T> {
  decode?: (response: Response) => Promise<T>;
  timeoutMs?: number;
  maxRetries?: number;
  retry?: RetryMode;
}

/** Socket errors that mean the request never left this machine. */
const NOT_SENT_CODES = new Set([
  "ECONNREFUSED",
  "ENOTFOUND",
  "EAI_AGAIN",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "UND_ERR_CONNECT_TIMEOUT",
]);

/** Whether a `fetch` failure happened while connecting, before the request was sent. */
function failedBeforeSend(error: unknown): boolean {
  const cause = (error as { cause?: unknown } | null)?.cause as
    { code?: unknown; errors?: unknown } | undefined;
  if (!cause) return false;
  if (typeof cause.code === "string") return NOT_SENT_CODES.has(cause.code);
  // Happy-eyeballs connects fail with an AggregateError of one error per address.
  return (
    Array.isArray(cause.errors) &&
    cause.errors.length > 0 &&
    cause.errors.every((e: { code?: unknown }) => NOT_SENT_CODES.has(String(e?.code)))
  );
}

/**
 * Errors that a retry cannot fix: a replay of a stored result
 * (`Idempotent-Replayed: true`) answers the same on every attempt.
 */
const finalErrors = new WeakSet<object>();

interface ErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  limit?: number;
  remaining?: number;
  reset_at?: number;
  reason?: string;
  credits_balance?: number;
  error?: string;
  required_scope?: string;
  allowed_scopes?: string[];
  client_ip?: string | null;
  block_kind?: BlockKind | null;
  vendor?: string | null;
  captcha?: BlockingCaptcha | null;
  data?: Record<string, unknown> | null;
}

/**
 * Base HTTP client for making API requests.
 */
export class BaseClient {
  readonly config: ResolvedConfig;

  constructor(config: ResolvedConfig) {
    this.config = config;
  }

  /**
   * Make an HTTP request to the API.
   */
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { data } = await this.requestRaw<T>(path, options);
    return data;
  }

  /**
   * POST and return the undecoded response body.
   *
   * For endpoints that answer with something other than JSON — currently
   * `/v1/web/scrape` with `raw_content: true`, which returns the scraped body
   * itself. The normal path funnels a non-JSON response into
   * `{ detail: await response.text() }`, which both loses the result and, for
   * a binary payload, corrupts it: `text()` decodes bytes as UTF-8.
   *
   * Returns the raw bytes plus the response headers.
   */
  async postBinary(
    path: string,
    options: RequestOptions = {}
  ): Promise<{ bytes: Uint8Array; headers: Headers; status: number }> {
    const url = new URL(path, this.config.baseUrl);
    const { body, headers = {} } = options;

    const response = await this.fetchWithTimeout(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.config.apiKey,
        "User-Agent": `scrapebadger-node/${SDK_VERSION}`,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      // Let the shared error mapping raise the right typed error.
      await this.handleResponse<unknown>(response);
    }

    return {
      bytes: new Uint8Array(await response.arrayBuffer()),
      headers: response.headers,
      status: response.status,
    };
  }

  /**
   * Make an HTTP request and return the data with its rate limit, status and headers.
   */
  async requestWithHeaders<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ResponseWithHeaders<T>> {
    return this.requestRaw<T>(path, options);
  }

  /**
   * Make an HTTP request and return its status, headers and body undigested:
   * the body is JSON-decoded when the response is JSON, otherwise text (the
   * normal path turns a non-JSON, non-HTML body into `{ detail }`). Error
   * statuses still throw the matching typed error.
   */
  async requestResponse(path: string, options: RequestOptions = {}): Promise<RawResponse> {
    const { data } = await this.requestRaw<RawResponse>(path, options, async (response) => {
      if (!response.ok) {
        try {
          await this.handleResponse<unknown>(response);
        } catch (error) {
          if (response.headers.get("Idempotent-Replayed")?.trim().toLowerCase() === "true") {
            finalErrors.add(error as object);
          }
          throw error;
        }
      }
      const text = await response.text();
      let body: unknown = text;
      if (response.headers.get("content-type")?.toLowerCase().includes("json")) {
        try {
          body = JSON.parse(text);
        } catch {
          // Not valid JSON after all: keep the text.
        }
      }
      return { status: response.status, headers: response.headers, body };
    });
    return data;
  }

  /**
   * Internal method that builds the request and executes it, returning data and rate limit info.
   */
  private async requestRaw<T>(
    path: string,
    options: RequestOptions = {},
    decode?: (response: Response) => Promise<T>
  ): Promise<ResponseWithHeaders<T>> {
    const { method = "GET", params, body, headers = {}, timeoutMs, maxRetries, retry } = options;

    // Build URL with query parameters
    const url = new URL(path, this.config.baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    // Build headers
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-API-Key": this.config.apiKey,
      "User-Agent": `scrapebadger-node/${SDK_VERSION}`,
      ...headers,
    };

    // Build request options
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== "GET") {
      fetchOptions.body = JSON.stringify(body);
    }

    // Execute with retry logic
    return this.executeWithRetry<T>(url.toString(), fetchOptions, {
      decode,
      timeoutMs,
      maxRetries,
      retry,
    });
  }

  /**
   * Execute request with exponential backoff retry logic.
   */
  private async executeWithRetry<T>(
    url: string,
    options: RequestInit,
    policy: ExecutePolicy<T> = {}
  ): Promise<ResponseWithHeaders<T>> {
    let lastError: Error | undefined;
    const maxRetries = policy.maxRetries ?? this.config.maxRetries;
    const decode = policy.decode ?? ((response: Response) => this.handleResponse<T>(response));

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let retryAfterMs = 0;
      try {
        const httpResponse = await this.fetchWithTimeout(url, options, policy.timeoutMs);
        const retryAfter = httpResponse.headers.get("Retry-After")?.trim();
        if (retryAfter) {
          let requestedDelay = 0;
          if (/^\d+$/.test(retryAfter)) {
            requestedDelay = Number(retryAfter) * 1000;
          } else if (
            /^(?:(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} [A-Z][a-z]{2} \d{4}|(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), \d{2}-[A-Z][a-z]{2}-\d{2}) \d{2}:\d{2}:\d{2} GMT$/.test(
              retryAfter
            )
          ) {
            // Date.parse also accepts non-HTTP dates, so check the shape first.
            requestedDelay = Date.parse(retryAfter) - Date.now();
          } else if (
            /^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) [A-Z][a-z]{2} [ \d]\d \d{2}:\d{2}:\d{2} \d{4}$/.test(
              retryAfter
            )
          ) {
            // HTTP's obsolete asctime format is UTC despite having no zone.
            requestedDelay = Date.parse(`${retryAfter} GMT`) - Date.now();
          }
          // Ignore unusable values, including delays that overflow Node timers.
          if (requestedDelay > 0 && requestedDelay <= 2_147_483_647) {
            retryAfterMs = requestedDelay;
          }
        }
        const data = await decode(httpResponse);
        const rateLimit = this.parseRateLimitHeaders(httpResponse.headers);
        return { data, rateLimit, status: httpResponse.status, headers: httpResponse.headers };
      } catch (error) {
        lastError = error as Error;

        // Client errors (auth, validation, not-found) are final — retrying only
        // delays the throw. Transient server failures and timeouts fall through.
        if (!BaseClient.isRetryable(error, policy.retry ?? "all")) {
          throw error;
        }

        // Don't retry after exhausting attempts
        if (attempt === maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.max(this.config.retryDelay * Math.pow(2, attempt), retryAfterMs);
        const delaySec = Math.round(delay / 1000);
        const attemptNum = attempt + 1;

        // Warn with ANSI yellow coloring
        if (error instanceof RateLimitError) {
          console.warn(
            `\x1b[33m⚠ ScrapeBadger: 429 Rate Limited — retrying in ${delaySec}s (attempt ${attemptNum}/${maxRetries})\x1b[0m`
          );
          // For rate limits, use retry-after if available
          if (error.retryAfter) {
            const retryDelay = (error.retryAfter - Date.now() / 1000) * 1000;
            if (retryDelay > 0 && retryDelay < 60000) {
              await this.sleep(Math.max(retryDelay, retryAfterMs));
              continue;
            }
          }
        } else if (error instanceof TimeoutError) {
          console.warn(
            `\x1b[33m⚠ ScrapeBadger: TimeoutError — retrying in ${delaySec}s (attempt ${attemptNum}/${maxRetries})\x1b[0m`
          );
        } else if (error instanceof ServerError) {
          console.warn(
            `\x1b[33m⚠ ScrapeBadger: ${error.statusCode} ${error.message} — retrying in ${delaySec}s (attempt ${attemptNum}/${maxRetries})\x1b[0m`
          );
        } else {
          console.warn(
            `\x1b[33m⚠ ScrapeBadger: ${(error as Error).name} — retrying in ${delaySec}s (attempt ${attemptNum}/${maxRetries})\x1b[0m`
          );
        }

        await this.sleep(delay);
      }
    }

    throw lastError ?? new ScrapeBadgerError("Request failed after retries");
  }

  /**
   * Parse rate limit headers from an HTTP response.
   */
  private parseRateLimitHeaders(headers: Headers): RateLimit | undefined {
    const limit = headers.get("X-RateLimit-Limit");
    const remaining = headers.get("X-RateLimit-Remaining");
    const reset = headers.get("X-RateLimit-Reset");

    if (limit === null || remaining === null || reset === null) {
      return undefined;
    }

    const parsedLimit = parseInt(limit, 10);
    const parsedRemaining = parseInt(remaining, 10);
    const parsedReset = parseInt(reset, 10);

    if (isNaN(parsedLimit) || isNaN(parsedRemaining) || isNaN(parsedReset)) {
      return undefined;
    }

    return { limit: parsedLimit, remaining: parsedRemaining, reset: parsedReset };
  }

  /**
   * Fetch with timeout support.
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeoutMs: number = this.config.timeout
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(`Request timed out after ${timeoutMs}ms`, timeoutMs);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Handle HTTP response and convert errors.
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Parse response body
    let data: T | ErrorResponse;
    const contentType = response.headers.get("content-type");
    if (response.ok && contentType?.includes("text/html")) {
      return (await response.text()) as T;
    }

    if (contentType?.includes("application/json")) {
      data = (await response.json()) as T | ErrorResponse;
    } else {
      const text = await response.text();
      data = { detail: text } as ErrorResponse;
    }

    // Handle success
    if (response.ok) {
      return data as T;
    }

    // Handle errors
    const errorData = data as ErrorResponse;
    const message = errorData.detail ?? errorData.message ?? "Request failed";

    switch (response.status) {
      case 401:
        throw new AuthenticationError(message);

      case 402:
        throw new InsufficientCreditsError(message, errorData.credits_balance);

      case 403:
        if (errorData.error === "ip_not_allowed") {
          throw new IPNotAllowedError(message, errorData.client_ip ?? null);
        }
        if (
          errorData.error === "insufficient_scope" ||
          errorData.error === "full_access_required"
        ) {
          throw new PermissionDeniedError(
            message,
            errorData.required_scope,
            errorData.allowed_scopes ?? []
          );
        }
        if (message.toLowerCase().includes("restricted")) {
          throw new AccountRestrictedError(message, errorData.reason);
        }
        throw new AuthenticationError(message);

      case 404:
        throw new NotFoundError(message);

      case 409:
        throw new ConflictError(message);

      case 422:
        if (errorData.error === "blocking_page_detected") {
          throw new BlockedError(message, {
            blockKind: errorData.block_kind,
            vendor: errorData.vendor,
            captcha: errorData.captcha,
            data: errorData.data,
          });
        }
        throw new ValidationError(message, errorData.errors);

      case 429:
        throw new RateLimitError(message, {
          retryAfter: errorData.reset_at,
          limit: errorData.limit,
          remaining: errorData.remaining,
        });

      default:
        if (response.status >= 500) {
          throw new ServerError(message, response.status);
        }
        throw new ScrapeBadgerError(message);
    }
  }

  /**
   * Whether a failed request is worth another attempt.
   *
   * Retryable: transient server failures (500/502/503/504), request timeouts,
   * rate limits, and raw network faults thrown by `fetch` itself. Everything
   * else — auth, validation, not-found, conflict — is final, and so is a
   * replayed result. `mode` narrows this further (see `RequestOptions.retry`).
   */
  private static isRetryable(error: unknown, mode: RetryMode): boolean {
    if (typeof error === "object" && error !== null && finalErrors.has(error)) {
      return false;
    }
    // Anything that isn't one of ours is a network-level fault from fetch.
    const networkFault = !(error instanceof ScrapeBadgerError);
    if (mode === "connect") {
      return networkFault && failedBeforeSend(error);
    }
    if (error instanceof ServerError) {
      return mode === "all" && RETRYABLE_STATUS_CODES.includes(error.statusCode);
    }
    if (error instanceof RateLimitError) {
      return mode === "all";
    }
    return error instanceof TimeoutError || networkFault;
  }

  /**
   * Sleep for a given duration.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
