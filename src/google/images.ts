/**
 * Google Images API client.
 *
 * Returns up to 100 tiles per page with `title`, `source`, `link`
 * (referrer page), `thumbnail`, `image` (inline preview), `original`
 * (full-res URL), `original_width` / `original_height`,
 * `original_size` (e.g. `"635KB"`), plus licensability flags.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, ImagesSearchParams } from "./types.js";

/**
 * Client for Google Images search.
 *
 * @example
 * ```typescript
 * const res = await client.google.images.search({
 *   q: "golden retriever",
 *   imgsz: "l",
 *   imgcolor: "color",
 * });
 * for (const img of res.results) {
 *   console.log(img.rank, img.title, img.original);
 * }
 * ```
 */
export class ImagesClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: ImagesSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/images/search", {
      params: { ...params },
    });
  }
}
