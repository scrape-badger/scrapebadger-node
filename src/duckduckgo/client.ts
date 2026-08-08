/**
 * DuckDuckGo API client.
 *
 * Provides access to all DuckDuckGo API endpoints through specialized
 * sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { MediaClient } from "./media.js";
import { ReferenceClient } from "./reference.js";

/**
 * DuckDuckGo API client with access to all DuckDuckGo endpoints.
 *
 * Sub-clients:
 * - `search` - Web search with the optional Instant-Answer abstract
 * - `media` - Image, news and video search
 * - `reference` - Autocomplete, instant answers and supported regions
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.duckduckgo.search.search("privacy");
 * const images = await client.duckduckgo.media.images("puppies");
 * const news = await client.duckduckgo.media.news("elections");
 * const videos = await client.duckduckgo.media.videos("lofi");
 * const suggestions = await client.duckduckgo.reference.autocomplete("weath");
 * const instant = await client.duckduckgo.reference.instant("python");
 * const regions = await client.duckduckgo.reference.regions();
 * ```
 */
export class DuckDuckGoClient {
  /** Client for web search with the optional Instant-Answer abstract */
  readonly search: SearchClient;

  /** Client for image, news and video search */
  readonly media: MediaClient;

  /** Client for autocomplete, instant answers and supported regions */
  readonly reference: ReferenceClient;

  /**
   * Create a new DuckDuckGo client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.media = new MediaClient(client);
    this.reference = new ReferenceClient(client);
  }
}
