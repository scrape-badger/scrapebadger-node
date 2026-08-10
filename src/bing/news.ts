/**
 * Bing News API client.
 *
 * The Bing news vertical.
 */

import type { BaseClient } from "../internal/client.js";
import type { BingNewsParams, BingNewsResponse } from "./types.js";

/**
 * Client for the Bing news endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const news = await client.bing.news.news("artificial intelligence");
 * for (const article of news.results) {
 *   console.log(article.source, article.published_at, article.title);
 * }
 * ```
 */
export class NewsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search the Bing news vertical.
   *
   * @param query - Search keywords, e.g. `"artificial intelligence"`.
   * @param params - Optional market and freshness (`"day"`, `"week"`, `"month"`).
   * @returns Articles carrying publisher, publish dates and real URLs.
   */
  async news(query: string, params: BingNewsParams = {}): Promise<BingNewsResponse> {
    return this.client.request<BingNewsResponse>("/v1/bing/news", {
      params: {
        query,
        market: params.market,
        freshness: params.freshness,
      },
    });
  }
}
