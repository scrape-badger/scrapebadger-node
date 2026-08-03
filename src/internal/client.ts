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
  ServerError,
  TimeoutError,
  InsufficientCreditsError,
  AccountRestrictedError,
  ConflictError,
  ScrapeBadgerError,
} from "./exceptions.js";

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
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
}

interface ErrorResponse {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
  limit?: number;
  remaining?: number;
  reset_at?: number;
  reason?: string;
  credits_balance?: number;
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
   * Make an HTTP request and return both data and rate limit headers.
   */
  async requestWithHeaders<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ResponseWithHeaders<T>> {
    return this.requestRaw<T>(path, options);
  }

  /**
   * Internal method that builds the request and executes it, returning data and rate limit info.
   */
  private async requestRaw<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<ResponseWithHeaders<T>> {
    const { method = "GET", params, body, headers = {} } = options;

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
    return this.executeWithRetry<T>(url.toString(), fetchOptions);
  }

  /**
   * Execute request with exponential backoff retry logic.
   */
  private async executeWithRetry<T>(
    url: string,
    options: RequestInit
  ): Promise<ResponseWithHeaders<T>> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const httpResponse = await this.fetchWithTimeout(url, options);
        const data = await this.handleResponse<T>(httpResponse);
        const rateLimit = this.parseRateLimitHeaders(httpResponse.headers);
        return { data, rateLimit };
      } catch (error) {
        lastError = error as Error;

        // Client errors (auth, validation, not-found) are final — retrying only
        // delays the throw. Transient server failures and timeouts fall through.
        if (!BaseClient.isRetryable(error)) {
          throw error;
        }

        // Don't retry after exhausting attempts
        if (attempt === this.config.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = this.config.retryDelay * Math.pow(2, attempt);
        const delaySec = Math.round(delay / 1000);
        const attemptNum = attempt + 1;
        const maxRetries = this.config.maxRetries;

        // Warn with ANSI yellow coloring
        if (error instanceof RateLimitError) {
          console.warn(
            `\x1b[33m⚠ ScrapeBadger: 429 Rate Limited — retrying in ${delaySec}s (attempt ${attemptNum}/${maxRetries})\x1b[0m`
          );
          // For rate limits, use retry-after if available
          if (error.retryAfter) {
            const retryDelay = (error.retryAfter - Date.now() / 1000) * 1000;
            if (retryDelay > 0 && retryDelay < 60000) {
              await this.sleep(retryDelay);
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
  private async fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new TimeoutError(
          `Request timed out after ${this.config.timeout}ms`,
          this.config.timeout
        );
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
        if (message.toLowerCase().includes("restricted")) {
          throw new AccountRestrictedError(message, errorData.reason);
        }
        throw new AuthenticationError(message);

      case 404:
        throw new NotFoundError(message);

      case 409:
        throw new ConflictError(message);

      case 422:
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
   * else — auth, validation, not-found, conflict — is final.
   */
  private static isRetryable(error: unknown): boolean {
    if (error instanceof ServerError) {
      return RETRYABLE_STATUS_CODES.includes(error.statusCode);
    }
    if (error instanceof RateLimitError || error instanceof TimeoutError) {
      return true;
    }
    // Anything that isn't one of ours is a network-level fault from fetch.
    return !(error instanceof ScrapeBadgerError);
  }

  /**
   * Sleep for a given duration.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
