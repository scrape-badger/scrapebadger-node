/**
 * Base HTTP client with retry logic and error handling.
 */

import type { ResolvedConfig } from "./config.js";
import {
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  ServerError,
  TimeoutError,
  InsufficientCreditsError,
  AccountRestrictedError,
  ScrapeBadgerError,
} from "./exceptions.js";

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
  private readonly config: ResolvedConfig;

  constructor(config: ResolvedConfig) {
    this.config = config;
  }

  /**
   * Make an HTTP request to the API.
   */
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
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
      "User-Agent": "scrapebadger-node/0.1.0",
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
  private async executeWithRetry<T>(url: string, options: RequestInit): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(url, options);
        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) except rate limits
        if (error instanceof ScrapeBadgerError && !(error instanceof RateLimitError)) {
          if (
            error instanceof AuthenticationError ||
            error instanceof NotFoundError ||
            error instanceof ValidationError ||
            error instanceof InsufficientCreditsError ||
            error instanceof AccountRestrictedError
          ) {
            throw error;
          }
        }

        // Don't retry after exhausting attempts
        if (attempt === this.config.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = this.config.retryDelay * Math.pow(2, attempt);

        // For rate limits, use retry-after if available
        if (error instanceof RateLimitError && error.retryAfter) {
          const retryDelay = (error.retryAfter - Date.now() / 1000) * 1000;
          if (retryDelay > 0 && retryDelay < 60000) {
            await this.sleep(retryDelay);
            continue;
          }
        }

        await this.sleep(delay);
      }
    }

    throw lastError ?? new ScrapeBadgerError("Request failed after retries");
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
        throw new TimeoutError(`Request timed out after ${this.config.timeout}ms`, this.config.timeout);
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
   * Sleep for a given duration.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
