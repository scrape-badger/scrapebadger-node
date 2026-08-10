/**
 * Yahoo News API client.
 *
 * The Yahoo news vertical.
 */

import type { BaseClient } from "../internal/client.js";
import type { YahooNewsParams, YahooNewsResponse } from "./types.js";

/**
 * Client for the Yahoo news endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const news = await client.yahoo.news.news("artificial intelligence");
 * for (const article of news.results) {
 *   console.log(article.source, article.published, article.title);
 * }
 * ```
 */
export class NewsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search the Yahoo news vertical.
   *
   * @param query - Search keywords, e.g. `"artificial intelligence"`.
   * @param params - Optional market.
   * @returns Articles carrying publisher, syndication source and real URLs.
   *   `published` is a relative age string (`"26 minutes ago"`) — Yahoo
   *   renders no absolute date.
   */
  async news(query: string, params: YahooNewsParams = {}): Promise<YahooNewsResponse> {
    return this.client.request<YahooNewsResponse>("/v1/yahoo/news", {
      params: {
        query,
        market: params.market,
      },
    });
  }
}
