/**
 * Main ScrapeBadger client.
 *
 * This is the primary entry point for the ScrapeBadger SDK.
 */

import { BaseClient } from "./internal/client.js";
import {
  type ScrapeBadgerConfig,
  resolveConfig,
  getApiKeyFromEnv,
} from "./internal/config.js";
import { TwitterClient } from "./twitter/client.js";

/**
 * ScrapeBadger API client.
 *
 * The main client for interacting with the ScrapeBadger API.
 * Provides access to all available scrapers through typed sub-clients.
 *
 * @example
 * ```typescript
 * import { ScrapeBadger } from "scrapebadger";
 *
 * // Create client with API key
 * const client = new ScrapeBadger({ apiKey: "your-api-key" });
 *
 * // Or use environment variable (SCRAPEBADGER_API_KEY)
 * const client = new ScrapeBadger();
 *
 * // Access Twitter API
 * const tweet = await client.twitter.tweets.getById("1234567890");
 * const user = await client.twitter.users.getByUsername("elonmusk");
 *
 * // Search with automatic pagination
 * for await (const tweet of client.twitter.tweets.searchAll("python")) {
 *   console.log(tweet.text);
 * }
 *
 * // Collect all results into an array
 * import { collectAll } from "scrapebadger";
 * const tweets = await collectAll(
 *   client.twitter.tweets.searchAll("python", { maxItems: 100 })
 * );
 * ```
 */
export class ScrapeBadger {
  private readonly baseClient: BaseClient;

  /** Twitter API client */
  readonly twitter: TwitterClient;

  /**
   * Create a new ScrapeBadger client.
   *
   * @param config - Configuration options. If apiKey is not provided,
   *   it will be read from the SCRAPEBADGER_API_KEY environment variable.
   * @throws Error if no API key is provided or found in environment.
   *
   * @example
   * ```typescript
   * // With explicit API key
   * const client = new ScrapeBadger({ apiKey: "your-api-key" });
   *
   * // With custom options
   * const client = new ScrapeBadger({
   *   apiKey: "your-api-key",
   *   baseUrl: "https://custom.api.com",
   *   timeout: 60000,
   *   maxRetries: 5
   * });
   *
   * // Using environment variable
   * // Set SCRAPEBADGER_API_KEY=your-api-key
   * const client = new ScrapeBadger();
   * ```
   */
  constructor(config: Partial<ScrapeBadgerConfig> = {}) {
    // Use provided API key or fall back to environment variable
    const apiKey = config.apiKey ?? getApiKeyFromEnv();

    if (!apiKey) {
      throw new Error(
        "API key is required. Pass it in the config or set SCRAPEBADGER_API_KEY environment variable."
      );
    }

    const resolvedConfig = resolveConfig({ ...config, apiKey });
    this.baseClient = new BaseClient(resolvedConfig);

    // Initialize sub-clients
    this.twitter = new TwitterClient(this.baseClient);
  }
}
