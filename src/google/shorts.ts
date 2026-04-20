/**
 * Google Shorts API client — short-form vertical video results.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, ShortsSearchParams } from "./types.js";

/**
 * Client for Google Shorts search (`udm=39`).
 *
 * Returns a carousel of short-form videos — YouTube Shorts plus
 * TikToks, Instagram Reels, Facebook Reels, and other platforms.
 * Every tile carries `title`, `link`, `source` (platform),
 * `account_name`, `thumbnail`, `image` (inline preview),
 * `duration`, and `video_id` (YouTube only).
 *
 * @example
 * ```typescript
 * const shorts = await client.google.shorts.search({ q: "cooking hacks" });
 * for (const v of shorts.short_videos_results) {
 *   console.log(v.rank, v.title, v.source, v.account_name);
 * }
 * ```
 */
export class ShortsClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: ShortsSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/shorts/search", {
      params: { ...params },
    });
  }
}
