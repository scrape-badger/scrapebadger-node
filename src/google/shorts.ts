/**
 * Google Shorts API client — short-form vertical video results.
 */

import type { BaseClient } from "../internal/client.js";
import type { GoogleResponse, ShortsSearchParams } from "./types.js";

/**
 * Client for Google Shorts search.
 *
 * Triggers Google's Shorts SERP mode via `udm=39` and returns the
 * short_videos_results carousel — mostly YouTube Shorts but also
 * TikToks, Facebook Reels, and other short-form sources when Google
 * surfaces them.
 *
 * @example
 * ```typescript
 * const shorts = await client.google.shorts.search({ q: "cooking hacks" });
 * for (const video of shorts.short_videos_results) {
 *   console.log(video.title, video.source, video.link);
 * }
 * ```
 */
export class ShortsClient {
  constructor(private readonly client: BaseClient) {}

  /** Return short-form video results from Google Shorts mode. */
  async search(params: ShortsSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/shorts/search", {
      params: { ...params },
    });
  }
}
