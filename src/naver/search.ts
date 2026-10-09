/**
 * Naver Search API client.
 *
 * The naver.com portal SERP and its news and blog verticals, plus search-box
 * autocomplete.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  NaverBlogParams,
  NaverNewsParams,
  NaverResponse,
  NaverSearchParams,
} from "./types.js";

/**
 * Client for Naver web / news / blog search and autocomplete.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const serp = await client.naver.search.search("커피머신", { page: 2 });
 * const news = await client.naver.search.news("인공지능", { sort: "recent" });
 * const blog = await client.naver.search.blog("제주도 맛집");
 * const suggestions = await client.naver.search.autocomplete("커피");
 * ```
 */
export class SearchClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search naver.com — Korea's top portal web SERP.
   *
   * @param query - Search keywords, e.g. `"커피머신"`.
   * @param params - Optional page (1..40) and `view`.
   */
  async search(query: string, params: NaverSearchParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/search", {
      params: { query, page: params.page, view: params.view },
    });
  }

  /**
   * Search the Naver news vertical.
   *
   * @param query - Search keywords.
   * @param params - Optional page (1..40) and sort.
   */
  async news(query: string, params: NaverNewsParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/news", {
      params: { query, page: params.page, sort: params.sort },
    });
  }

  /**
   * Search the Naver blog vertical.
   *
   * @param query - Search keywords.
   * @param params - Optional page (1..40).
   */
  async blog(query: string, params: NaverBlogParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/blog", {
      params: { query, page: params.page },
    });
  }

  /**
   * Naver search-box suggestions.
   *
   * @param query - Partial search term, e.g. `"커피"`.
   */
  async autocomplete(query: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/autocomplete", {
      params: { query },
    });
  }
}
