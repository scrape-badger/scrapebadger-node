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
 * Also carries a `warnings` array naming any parameter that could not be
 * applied. `exact_matches: true` returns just the pages hosting the image,
 * flagged `exact_match`, for most images; when Google does not expose that
 * set the grid comes back and `warnings` says so. `product: true` narrows the same grid to the tiles Google marked
 * buyable.
 *
 * @example
 * ```typescript
 * const out = await client.google.lens.search({
 *   url: "https://example.com/photo.jpg",
 *   query: "wallpaper", // text refinement — honoured
 * });
 * // GoogleResponse is Record<string, unknown>, so narrow before use.
 * console.warn(out.warnings as string[] | undefined);
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
