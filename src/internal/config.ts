/**
 * Configuration management for the ScrapeBadger SDK.
 */

export interface ScrapeBadgerConfig {
  /** API key for authentication */
  apiKey: string;
  /** Base URL for the API (default: https://api.scrapebadger.com) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial retry delay in milliseconds (default: 1000) */
  retryDelay?: number;
}

export interface ResolvedConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
}

const DEFAULT_BASE_URL = "https://api.scrapebadger.com";
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_MAX_RETRIES = 3;
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
