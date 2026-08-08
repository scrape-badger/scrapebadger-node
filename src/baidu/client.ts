/**
 * Baidu API client.
 *
 * Baidu endpoints: search (web SERP), news (news vertical), images (image
 * search) and autocomplete (search-box suggestions).
 *
 * Baidu is China's #1 search engine (~60% of the market). Every request is
 * served from ScrapeBadger's own exits — no China-based proxy of your own is
 * needed.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  BaiduSearchParams,
  BaiduNewsParams,
  BaiduImagesParams,
  BaiduSearchResponse,
  BaiduNewsResponse,
  BaiduImagesResponse,
  BaiduAutocompleteResponse,
} from "./types.js";

/**
 * Client for all Baidu API operations.
 *
 * Organic and news results carry the **real target URL** in `url` (decoded
 * from Baidu's `mu` attribute), not just the `baidu.com/link?url=` tracking
 * redirect that competing APIs return — `baidu_url` holds that redirect
 * separately.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Web search
 * const results = await client.baidu.search("咖啡机", { num: 20, language: "zh-cn" });
 * for (const r of results.results) {
 *   console.log(`${r.position}. ${r.title} — ${r.url}`);
 * }
 *
 * // News, most recent first
 * const news = await client.baidu.news("人工智能", { sort: "time" });
 *
 * // Images
 * const images = await client.baidu.images("猫");
 *
 * // Search-box suggestions
 * const suggestions = await client.baidu.autocomplete("咖啡");
 * ```
 */
export class BaiduClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search baidu.com — the web SERP.
   *
   * Costs 5 credits.
   *
   * @param query - Search keywords, e.g. `"咖啡机"` or `"coffee machine"` (required).
   * @param options - Optional parameters (page, num, language, timeFrom, timeTo).
   * @returns Search response with organic results and Baidu's related searches.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(query: string, options: BaiduSearchParams = {}): Promise<BaiduSearchResponse> {
    return this.client.request<BaiduSearchResponse>("/v1/baidu/search", {
      params: {
        query,
        page: options.page,
        num: options.num,
        language: options.language,
        time_from: options.timeFrom,
        time_to: options.timeTo,
      },
    });
  }

  /**
   * Search the Baidu news vertical.
   *
   * Costs 5 credits.
   *
   * @param query - Search keywords, e.g. `"人工智能"` (required).
   * @param options - Optional parameters (page, sort).
   * @returns News response with articles carrying publisher, date and real URLs.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async news(query: string, options: BaiduNewsParams = {}): Promise<BaiduNewsResponse> {
    return this.client.request<BaiduNewsResponse>("/v1/baidu/news", {
      params: { query, page: options.page, sort: options.sort },
    });
  }

  /**
   * Search Baidu images.
   *
   * Costs 5 credits.
   *
   * @param query - Search keywords, e.g. `"猫"` (required).
   * @param options - Optional parameters (page). Baidu serves 30 images per page.
   * @returns Images response with full-size image URLs, Baidu-hosted thumbnail
   *   copies, pixel dimensions and the source page each image came from.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async images(query: string, options: BaiduImagesParams = {}): Promise<BaiduImagesResponse> {
    return this.client.request<BaiduImagesResponse>("/v1/baidu/images", {
      params: { query, page: options.page },
    });
  }

  /**
   * Baidu search-box suggestions — the cheapest call in this API.
   *
   * Costs 1 credit.
   *
   * @param query - Partial search term, e.g. `"咖啡"` or `"coff"` (required).
   * @returns Autocomplete response with Baidu's suggestions for the term.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async autocomplete(query: string): Promise<BaiduAutocompleteResponse> {
    return this.client.request<BaiduAutocompleteResponse>("/v1/baidu/autocomplete", {
      params: { query },
    });
  }
}
