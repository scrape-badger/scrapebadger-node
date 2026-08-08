/**
 * Bing API client.
 *
 * Provides access to all Bing API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { MediaClient } from "./media.js";
import { NewsClient } from "./news.js";
import { ReferenceClient } from "./reference.js";

/**
 * Bing API client with access to all Bing endpoints.
 *
 * Sub-clients:
 * - `search` - Web search and search-box autocomplete
 * - `media` - Image search and video search
 * - `news` - The news vertical
 * - `reference` - Reference data (markets)
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.bing.search.search("coffee machine");
 * const images = await client.bing.media.images("cats");
 * const videos = await client.bing.media.videos("cats");
 * const news = await client.bing.news.news("ai", { freshness: "day" });
 * const suggestions = await client.bing.search.autocomplete("coff");
 * const markets = await client.bing.reference.markets();
 * ```
 */
export class BingClient {
  /** Client for web search and search-box autocomplete */
  readonly search: SearchClient;

  /** Client for image search and video search */
  readonly media: MediaClient;

  /** Client for the news vertical */
  readonly news: NewsClient;

  /** Client for reference data (markets) */
  readonly reference: ReferenceClient;

  /**
   * Create a new Bing client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.media = new MediaClient(client);
    this.news = new NewsClient(client);
    this.reference = new ReferenceClient(client);
  }
}
