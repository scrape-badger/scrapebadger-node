/**
 * Google Lens API client (visual image search).
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, LensSearchParams } from "./types.js";

/**
 * Client for Google Lens visual search by image URL.
 *
 * Response carries `lens_results` (Scrapingdog-parity alias) with
 * `title`, `source`, `source_favicon`, `thumbnail`, `rating`,
 * `reviews` and `in_stock`. Shoppable matches also carry `price`
 * (`{value, currency, extracted}`) plus the raw `tag` chip it is
 * parsed from. `related_searches` chips come alongside. Legacy
 * `results` alias retained for backwards compat.
 *
 * @example
 * ```typescript
 * const out = await client.google.lens.search({
 *   url: "https://example.com/photo.jpg",
 *   product: true, // bias towards shoppable matches
 * });
 * for (const match of out.lens_results) {
 *   console.log(match.title, match.price?.value, match.price?.currency);
 * }
 * ```
 */
export class LensClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: LensSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/lens/search", {
      params: { ...params },
    });
  }
}
