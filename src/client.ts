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
import { IdealistaClient } from "./idealista/client.js";
import { RedditClient } from "./reddit/client.js";
import { ApartmentsClient } from "./apartments/client.js";
import { InstagramClient } from "./instagram/client.js";
import { RedfinClient } from "./redfin/client.js";
import { AccountClient } from "./account/client.js";
import { AmazonClient } from "./amazon/client.js";
import { ShopeeClient } from "./shopee/client.js";
import { TikTokClient } from "./tiktok/client.js";
import { EbayClient } from "./ebay/client.js";
import { FacebookClient } from "./facebook/client.js";
import { WalmartClient } from "./walmart/client.js";
import { DuckDuckGoClient } from "./duckduckgo/client.js";
import { BingClient } from "./bing/client.js";
import { BaiduClient } from "./baidu/client.js";
import { YahooClient } from "./yahoo/client.js";
import { YandexClient } from "./yandex/client.js";
import { YoutubeClient } from "./youtube/client.js";
import { RealtorClient } from "./realtor/client.js";
import { LeboncoinClient } from "./leboncoin/client.js";
import { ZillowClient } from "./zillow/client.js";
import { ImmobiliareClient } from "./immobiliare/client.js";
import { LoopNetClient } from "./loopnet/client.js";
import { PerplexityClient } from "./perplexity/client.js";
import { DepopClient } from "./depop/client.js";
import { LinkedInClient } from "./linkedin/client.js";
import { ChatGPTClient } from "./chatgpt/client.js";
import { GeminiClient } from "./gemini/client.js";

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
  /** Idealista API client. (Generated from the OpenAPI spec.) */
  readonly idealista: IdealistaClient;

  /** Reddit scraper API client */
  readonly reddit: RedditClient;

  /** Apartments.com scraper API client — search + property with unit-level pricing (US) */
  readonly apartments: ApartmentsClient;

  /** Instagram scraper API client — users, media, search, hashtags, locations, audio */
  readonly instagram: InstagramClient;

  /** Redfin scraper API client — search, property, agent, autocomplete, markets (redfin.com, US) */
  readonly redfin: RedfinClient;

  /** Amazon scraper API client — 14 endpoints */
  /** Account API client. (Generated from the OpenAPI spec.) */
  readonly account: AccountClient;
  readonly amazon: AmazonClient;

  /** Shopee scraper API client — 6 endpoints across 11 markets */
  readonly shopee: ShopeeClient;

  /** TikTok scraper API client — 26 endpoints */
  readonly tiktok: TikTokClient;

  /** eBay scraper API client — 12 endpoints across 18 markets */
  readonly ebay: EbayClient;
  /** Facebook API client. (Generated from the OpenAPI spec.) */
  readonly facebook: FacebookClient;

  /** Walmart scraper API client — 11 endpoints (walmart.com, US-only) */
  readonly walmart: WalmartClient;

  /** DuckDuckGo scraper API client — search, images, news, videos, autocomplete, instant, regions */
  readonly duckduckgo: DuckDuckGoClient;

  /** Bing scraper API client — 6 endpoints (search, images, videos, news, autocomplete, markets) */
  readonly bing: BingClient;

  /** Baidu scraper API client — search, news, images, autocomplete (baidu.com, China's #1 search engine) */
  readonly baidu: BaiduClient;

  /** Yahoo scraper API client — 6 endpoints (search, images, videos, news, autocomplete, markets) across 35 markets */
  readonly yahoo: YahooClient;

  /** Yandex scraper API client — web search, image search, reverse-image (CBIR), markets (tr/com/ru/by/kz/uz) */
  readonly yandex: YandexClient;

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

  /** LoopNet scraper API client — commercial real estate across US/CA/UK/FR/ES (search, listing, broker, markets, property types) */
  readonly loopnet: LoopNetClient;
  /** Perplexity API client. (Generated from the OpenAPI spec.) */
  readonly perplexity: PerplexityClient;

  /** Depop scraper API client — search, product, user, user products, markets (www.depop.com, 10 markets) */
  readonly depop: DepopClient;

  /** LinkedIn scraper API client — 11 no-auth endpoints (jobs, company, school, profile, post, article, learning, geo) */
  readonly linkedin: LinkedInClient;

  /** ChatGPT scraper API client — ask, brand visibility, models (the real chatgpt.com, anonymous) */
  readonly chatgpt: ChatGPTClient;

  /** Gemini scraper API client — ask, brand visibility (the real gemini.google.com, anonymous) */
  readonly gemini: GeminiClient;

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
    this.idealista = new IdealistaClient(this.baseClient);
    this.reddit = new RedditClient(this.baseClient);
    this.apartments = new ApartmentsClient(this.baseClient);
    this.instagram = new InstagramClient(this.baseClient);
    this.redfin = new RedfinClient(this.baseClient);
    this.account = new AccountClient(this.baseClient);
    this.amazon = new AmazonClient(this.baseClient);
    this.shopee = new ShopeeClient(this.baseClient);
    this.tiktok = new TikTokClient(this.baseClient);
    this.ebay = new EbayClient(this.baseClient);
    this.facebook = new FacebookClient(this.baseClient);
    this.walmart = new WalmartClient(this.baseClient);
    this.duckduckgo = new DuckDuckGoClient(this.baseClient);
    this.bing = new BingClient(this.baseClient);
    this.baidu = new BaiduClient(this.baseClient);
    this.yahoo = new YahooClient(this.baseClient);
    this.yandex = new YandexClient(this.baseClient);
    this.youtube = new YoutubeClient(this.baseClient);
    this.realtor = new RealtorClient(this.baseClient);
    this.leboncoin = new LeboncoinClient(this.baseClient);
    this.zillow = new ZillowClient(this.baseClient);
    this.immobiliare = new ImmobiliareClient(this.baseClient);
    this.loopnet = new LoopNetClient(this.baseClient);
    this.perplexity = new PerplexityClient(this.baseClient);
    this.depop = new DepopClient(this.baseClient);
    this.linkedin = new LinkedInClient(this.baseClient);
    this.chatgpt = new ChatGPTClient(this.baseClient);
    this.gemini = new GeminiClient(this.baseClient);
  }
}
