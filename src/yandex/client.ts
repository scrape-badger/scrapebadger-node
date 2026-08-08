/**
 * Yandex API client.
 *
 * Provides access to all Yandex API endpoints through specialized
 * sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { ImagesClient } from "./images.js";
import { ReferenceClient } from "./reference.js";

/**
 * Yandex API client with access to all Yandex endpoints.
 *
 * Sub-clients:
 * - `search` - Web search (organic + ads + sitelinks + inline media)
 * - `images` - Image search and reverse-image (CBIR) search
 * - `reference` - The supported-markets list
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.yandex.search.search("privacy");
 * const images = await client.yandex.images.search("puppies");
 * const reverse = await client.yandex.images.reverse("https://example.com/photo.jpg");
 * const markets = await client.yandex.reference.markets();
 * ```
 */
export class YandexClient {
  /** Client for web search (organic + ads + sitelinks + inline media) */
  readonly search: SearchClient;

  /** Client for image search and reverse-image (CBIR) search */
  readonly images: ImagesClient;

  /** Client for the supported-markets list */
  readonly reference: ReferenceClient;

  /**
   * Create a new Yandex client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.images = new ImagesClient(client);
    this.reference = new ReferenceClient(client);
  }
}
