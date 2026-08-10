/**
 * DuckDuckGo Media API client.
 *
 * Image, news and video search.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  DuckDuckGoImagesParams,
  DuckDuckGoImagesResponse,
  DuckDuckGoNewsParams,
  DuckDuckGoNewsResponse,
  DuckDuckGoVideosParams,
  DuckDuckGoVideosResponse,
} from "./types.js";

/**
 * Client for the DuckDuckGo image, news and video endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const images = await client.duckduckgo.media.images("puppies", { size: "Large" });
 * const news = await client.duckduckgo.media.news("elections", { timelimit: "d" });
 * const videos = await client.duckduckgo.media.videos("lofi", { duration: "long" });
 * ```
 */
export class MediaClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search DuckDuckGo Images.
   *
   * @param query - Search keywords.
   * @param params - Optional region, safesearch, page and image filters
   *   (size, color, image_type, layout, license).
   */
  async images(
    query: string,
    params: DuckDuckGoImagesParams = {}
  ): Promise<DuckDuckGoImagesResponse> {
    return this.client.request<DuckDuckGoImagesResponse>("/v1/duckduckgo/images", {
      params: {
        query,
        region: params.region,
        safesearch: params.safesearch,
        page: params.page,
        size: params.size,
        color: params.color,
        image_type: params.image_type,
        layout: params.layout,
        license: params.license,
      },
    });
  }

  /**
   * Search DuckDuckGo News.
   *
   * @param query - Search keywords.
   * @param params - Optional region, safesearch, timelimit and page.
   */
  async news(query: string, params: DuckDuckGoNewsParams = {}): Promise<DuckDuckGoNewsResponse> {
    return this.client.request<DuckDuckGoNewsResponse>("/v1/duckduckgo/news", {
      params: {
        query,
        region: params.region,
        safesearch: params.safesearch,
        timelimit: params.timelimit,
        page: params.page,
      },
    });
  }

  /**
   * Search DuckDuckGo Videos.
   *
   * @param query - Search keywords.
   * @param params - Optional region, safesearch, page, duration and resolution.
   */
  async videos(
    query: string,
    params: DuckDuckGoVideosParams = {}
  ): Promise<DuckDuckGoVideosResponse> {
    return this.client.request<DuckDuckGoVideosResponse>("/v1/duckduckgo/videos", {
      params: {
        query,
        region: params.region,
        safesearch: params.safesearch,
        page: params.page,
        duration: params.duration,
        resolution: params.resolution,
      },
    });
  }
}
