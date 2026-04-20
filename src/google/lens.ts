/**
 * Google Lens API client (visual image search).
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, LensSearchParams } from "./types.js";

/**
 * Client for Google Lens visual search by image URL.
 *
 * Response carries `lens_results` (Scrapingdog-parity alias) with
 * `title`, `source`, `source_favicon`, `thumbnail`, optional `tag`
 * price chip and `in_stock`, plus `related_searches` chips. Legacy
 * `results` alias retained for backwards compat.
 *
 * @example
 * ```typescript
 * const out = await client.google.lens.search({
 *   url: "https://example.com/photo.jpg",
 *   product: true, // bias towards shoppable matches
 * });
 * for (const match of out.lens_results) {
 *   console.log(match.title, match.tag);
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
