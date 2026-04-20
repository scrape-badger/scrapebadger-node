/**
 * Google Videos API client.
 *
 * Returns up to 10 tiles per page with `title`, `link`
 * (YouTube / Vimeo / etc.), `displayed_link`, `snippet`, `thumbnail`,
 * `image` (inline base-64), `favicon`, `duration`, `channel`,
 * `source` (platform), `date`, `video_id`, and raw `extensions`.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, VideosSearchParams } from "./types.js";

/**
 * Client for Google Videos search.
 *
 * @example
 * ```typescript
 * const res = await client.google.videos.search({ q: "python tutorial" });
 * for (const v of res.results) {
 *   console.log(v.rank, v.title, v.duration, v.channel);
 * }
 * ```
 */
export class VideosClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: VideosSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/videos/search", {
      params: { ...params },
    });
  }
}
