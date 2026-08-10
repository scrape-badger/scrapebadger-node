/**
 * Bing Media API client.
 *
 * Image search and video search.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  BingImagesParams,
  BingImagesResponse,
  BingVideosParams,
  BingVideosResponse,
} from "./types.js";

/**
 * Client for Bing image and video search endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const images = await client.bing.media.images("cats");
 * for (const img of images.results) {
 *   console.log(img.image_url, img.width, img.height);
 * }
 *
 * const videos = await client.bing.media.videos("cats");
 * ```
 */
export class MediaClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search Bing images.
   *
   * @param query - Search keywords, e.g. `"cats"`.
   * @param params - Optional market, count and safe-search filter.
   * @returns Full-size image URLs, thumbnails, pixel dimensions and the
   *   source page each image came from.
   */
  async images(query: string, params: BingImagesParams = {}): Promise<BingImagesResponse> {
    return this.client.request<BingImagesResponse>("/v1/bing/images", {
      params: {
        query,
        market: params.market,
        count: params.count,
        safe_search: params.safe_search,
      },
    });
  }

  /**
   * Search Bing videos.
   *
   * @param query - Search keywords, e.g. `"cats"`.
   * @param params - Optional market, count and safe-search filter.
   * @returns Video URLs, thumbnails, duration, publisher and view counts.
   */
  async videos(query: string, params: BingVideosParams = {}): Promise<BingVideosResponse> {
    return this.client.request<BingVideosResponse>("/v1/bing/videos", {
      params: {
        query,
        market: params.market,
        count: params.count,
        safe_search: params.safe_search,
      },
    });
  }
}
