/**
 * Yahoo Media API client.
 *
 * Image search and video search.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YahooImagesParams,
  YahooImagesResponse,
  YahooVideosParams,
  YahooVideosResponse,
} from "./types.js";

/**
 * Client for Yahoo image and video search endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const images = await client.yahoo.media.images("cats");
 * for (const img of images.results) {
 *   console.log(img.image_url, img.width, img.height);
 * }
 *
 * const videos = await client.yahoo.media.videos("cats");
 * ```
 */
export class MediaClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search Yahoo images.
   *
   * Yahoo renders ~60 tiles server-side with no native page-size parameter,
   * so `count` trims the list rather than paginating.
   *
   * @param query - Search keywords, e.g. `"cats"`.
   * @param params - Optional market and count.
   * @returns Full-size image URLs, thumbnails, pixel dimensions and the
   *   source page each image came from.
   */
  async images(query: string, params: YahooImagesParams = {}): Promise<YahooImagesResponse> {
    return this.client.request<YahooImagesResponse>("/v1/yahoo/images", {
      params: {
        query,
        market: params.market,
        count: params.count,
      },
    });
  }

  /**
   * Search Yahoo videos.
   *
   * Like images, Yahoo has no native page-size parameter here, so `count`
   * trims the returned list.
   *
   * @param query - Search keywords, e.g. `"cats"`.
   * @param params - Optional market and count.
   * @returns Video URLs, thumbnails, duration, host platform and view counts.
   */
  async videos(query: string, params: YahooVideosParams = {}): Promise<YahooVideosResponse> {
    return this.client.request<YahooVideosResponse>("/v1/yahoo/videos", {
      params: {
        query,
        market: params.market,
        count: params.count,
      },
    });
  }
}
