/**
 * Main ScrapeBadger client.
 *
 * This is the primary entry point for the ScrapeBadger SDK.
 */

import { BaseClient } from "./internal/client.js";
import { type ScrapeBadgerConfig, resolveConfig, getApiKeyFromEnv } from "./internal/config.js";
import { TwitterClient } from "./twitter/client.js";
import { WebClient } from "./web/client.js";
import { VintedClient } from "./vinted/client.js";
import { GoogleClient } from "./google/client.js";
import { RedditClient } from "./reddit/client.js";
import { AmazonClient } from "./amazon/client.js";
import { ShopeeClient } from "./shopee/client.js";
import { TikTokClient } from "./tiktok/client.js";
import { EbayClient } from "./ebay/client.js";
import { YoutubeClient } from "./youtube/client.js";
import { RealtorClient } from "./realtor/client.js";
import { LeboncoinClient } from "./leboncoin/client.js";
import { ZillowClient } from "./zillow/client.js";
import { ImmobiliareClient } from "./immobiliare/client.js";

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

  /** Web scraping API client */
  readonly web: WebClient;

  /** Vinted scraper API client */
  readonly vinted: VintedClient;

  /** Google Scraper API client — 19 Google product APIs */
  readonly google: GoogleClient;

  /** Reddit scraper API client */
  readonly reddit: RedditClient;

  /** Amazon scraper API client — 14 endpoints */
  readonly amazon: AmazonClient;

  /** Shopee scraper API client — 6 endpoints across 11 markets */
  readonly shopee: ShopeeClient;

  /** TikTok scraper API client — 26 endpoints */
  readonly tiktok: TikTokClient;

  /** eBay scraper API client — 12 endpoints across 18 markets */
  readonly ebay: EbayClient;

  /** YouTube scraper API client — 39 endpoints */
  readonly youtube: YoutubeClient;

  /** Realtor scraper API client — 4 endpoints across 2 markets (us, ca) */
  readonly realtor: RealtorClient;

  /** Leboncoin scraper API client — 10 endpoints (France) */
  readonly leboncoin: LeboncoinClient;

  /** Zillow scraper API client — 5 endpoints (search, property, agent, autocomplete, markets) */
  readonly zillow: ZillowClient;

  /** Immobiliare scraper API client — 8 endpoints across 4 markets (it, es, gr, lu) */
  readonly immobiliare: ImmobiliareClient;

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
    this.web = new WebClient(this.baseClient);
    this.vinted = new VintedClient(this.baseClient);
    this.google = new GoogleClient(this.baseClient);
    this.reddit = new RedditClient(this.baseClient);
    this.amazon = new AmazonClient(this.baseClient);
    this.shopee = new ShopeeClient(this.baseClient);
    this.tiktok = new TikTokClient(this.baseClient);
    this.ebay = new EbayClient(this.baseClient);
    this.youtube = new YoutubeClient(this.baseClient);
    this.realtor = new RealtorClient(this.baseClient);
    this.leboncoin = new LeboncoinClient(this.baseClient);
    this.zillow = new ZillowClient(this.baseClient);
    this.immobiliare = new ImmobiliareClient(this.baseClient);
  }
}
