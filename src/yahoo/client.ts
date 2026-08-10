/**
 * Yahoo API client.
 *
 * Provides access to all Yahoo API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { MediaClient } from "./media.js";
import { NewsClient } from "./news.js";
import { ReferenceClient } from "./reference.js";

/**
 * Yahoo API client with access to all Yahoo endpoints.
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
 * const results = await client.yahoo.search.search("coffee machine");
 * const images = await client.yahoo.media.images("cats");
 * const videos = await client.yahoo.media.videos("cats");
 * const news = await client.yahoo.news.news("ai");
 * const suggestions = await client.yahoo.search.autocomplete("coff");
 * const markets = await client.yahoo.reference.markets();
 * ```
 */
export class YahooClient {
  /** Client for web search and search-box autocomplete */
  readonly search: SearchClient;

  /** Client for image search and video search */
  readonly media: MediaClient;

  /** Client for the news vertical */
  readonly news: NewsClient;

  /** Client for reference data (markets) */
  readonly reference: ReferenceClient;

  /**
   * Create a new Yahoo client.
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
