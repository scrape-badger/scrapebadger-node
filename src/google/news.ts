/**
 * Google News API client — search, topics, trending.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GoogleResponse,
  NewsSearchParams,
  NewsTopicsParams,
  NewsTrendingParams,
} from "./types.js";

/**
 * Client for Google News endpoints.
 *
 * @example
 * ```typescript
 * const articles = await client.google.news.search({ q: "openai" });
 * const tech = await client.google.news.topics({ topic: "TECHNOLOGY" });
 * const trending = await client.google.news.trending();
 * ```
 */
export class NewsClient {
  constructor(private readonly client: BaseClient) {}

  async search(params: NewsSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/news/search", {
      params: { ...params },
    });
  }

  async topics(params: NewsTopicsParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/news/topics", {
      params: { ...params },
    });
  }

  async trending(params: NewsTrendingParams = {}): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/news/trending", {
      params: { ...params },
    });
  }
}
