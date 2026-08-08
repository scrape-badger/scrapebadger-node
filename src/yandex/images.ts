/**
 * Yandex Images API client.
 *
 * Forward image search and reverse-image (CBIR) search.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  YandexImagesParams,
  YandexImagesResponse,
  YandexReverseImageResponse,
  YandexReverseParams,
} from "./types.js";

/**
 * Client for the Yandex image search and reverse-image endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const images = await client.yandex.images.search("golden retriever");
 * const reverse = await client.yandex.images.reverse("https://example.com/photo.jpg");
 * ```
 */
export class ImagesClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search Yandex Images.
   *
   * @param query - Search keywords.
   * @param params - Optional domain and page.
   */
  async search(
    query: string,
    params: YandexImagesParams = {},
  ): Promise<YandexImagesResponse> {
    return this.client.request<YandexImagesResponse>("/v1/yandex/images/search", {
      params: {
        query,
        domain: params.domain,
        page: params.page,
      },
    });
  }

  /**
   * Reverse-image (CBIR) search for a given image URL.
   *
   * @param imageUrl - The publicly reachable URL of the query image.
   * @param params - Optional domain.
   */
  async reverse(
    imageUrl: string,
    params: YandexReverseParams = {},
  ): Promise<YandexReverseImageResponse> {
    return this.client.request<YandexReverseImageResponse>("/v1/yandex/images/reverse", {
      params: {
        image_url: imageUrl,
        domain: params.domain,
      },
    });
  }
}
