/**
 * Yandex Search API client.
 *
 * Web search — organic results, ads, sitelinks, inline media, related
 * searches, and pagination.
 */

import type { BaseClient } from "../internal/client.js";
import type { YandexSearchParams, YandexSearchResponse } from "./types.js";

/**
 * Client for the Yandex web-search endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.yandex.search.search("python asyncio", { domain: "com" });
 * for (const item of results.organic_results) {
 *   console.log(`${item.position}. ${item.title} — ${item.url}`);
 * }
 * ```
 */
export class SearchClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search yandex.<domain>.
   *
   * @param query - Search keywords, e.g. `"python asyncio"`.
   * @param params - Optional domain, page, lr (region id) and lang.
   * @returns A page of web results with organic results, ads and pagination.
   */
  async search(query: string, params: YandexSearchParams = {}): Promise<YandexSearchResponse> {
    return this.client.request<YandexSearchResponse>("/v1/yandex/search", {
      params: {
        query,
        domain: params.domain,
        page: params.page,
        lr: params.lr,
        lang: params.lang,
      },
    });
  }
}
