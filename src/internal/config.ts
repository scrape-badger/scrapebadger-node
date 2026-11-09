/**
 * Configuration management for the ScrapeBadger SDK.
 */

export interface ScrapeBadgerConfig {
  /** API key for authentication */
  apiKey: string;
  /** Base URL for the API (default: https://scrapebadger.com) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial retry delay in milliseconds (default: 1000) */
  retryDelay?: number;
  /**
   * Skip the API's duplicate-request cache (default: false).
   *
   * An identical call from the same API key within 60 seconds is normally
   * served from the cache: `X-Cache: HIT`, `X-Credits-Used: 0`. With
   * `noCache: true` every request carries `Cache-Control: no-cache`, so each
   * call runs fresh and is billed. For a single call, use
   * `client.withOptions({ noCache: true })`.
   */
  noCache?: boolean;
  /** Extra headers sent on every request. */
  headers?: Record<string, string>;
}

export interface ResolvedConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  noCache: boolean;
  headers: Record<string, string>;
}

const DEFAULT_BASE_URL = "https://scrapebadger.com";
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_MAX_RETRIES = 10;
const DEFAULT_RETRY_DELAY = 1000;

/**
 * Resolve configuration with defaults.
 */
export function resolveConfig(config: ScrapeBadgerConfig): ResolvedConfig {
  if (!config.apiKey) {
    throw new Error("API key is required");
  }

  return {
    apiKey: config.apiKey,
    baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
    timeout: config.timeout ?? DEFAULT_TIMEOUT,
    maxRetries: config.maxRetries ?? DEFAULT_MAX_RETRIES,
    retryDelay: config.retryDelay ?? DEFAULT_RETRY_DELAY,
    noCache: config.noCache ?? false,
    headers: { ...config.headers },
  };
}

/**
 * Load API key from environment variable.
 */
export function getApiKeyFromEnv(): string | undefined {
  if (typeof process !== "undefined" && process.env) {
    return process.env.SCRAPEBADGER_API_KEY;
  }
  return undefined;
}
