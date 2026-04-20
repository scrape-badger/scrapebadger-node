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

  /**
   * Search Google News. One of `q`, `topic_token`, `publication_token`,
   * or `story_token` is required (or pass no params for the trending
   * home feed). Returns `menu_links`, `news_results`, `related_topics`.
   */
  async search(params: NewsSearchParams = {}): Promise<GoogleResponse> {
    if (!params.q && !params.topic_token && !params.publication_token && !params.story_token) {
      throw new Error("Provide q, topic_token, publication_token, or story_token");
    }
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
