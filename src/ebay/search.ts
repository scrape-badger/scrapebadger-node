/**
 * eBay Search API client.
 *
 * Provides methods for active search, visual (by-image) search,
 * completed/sold search, and keyword autocomplete suggestions.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  EbaySearchParams,
  EbaySearchByImageParams,
  EbayCompletedParams,
  EbayAutocompleteParams,
  SearchResponse,
  AutocompleteResponse,
} from "./types.js";

/**
 * Client for eBay search, completed-listings, and autocomplete endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.ebay.search.search({ query: "nintendo switch" });
 * for (const item of results.results) {
 *   console.log(`${item.position}. ${item.title}`);
 * }
 *
 * const visual = await client.ebay.search.searchByImage({
 *   image_url: "https://example.com/sneaker.jpg",
 * });
 *
 * const sold = await client.ebay.search.completed({ query: "nintendo switch" });
 *
 * const suggestions = await client.ebay.search.autocomplete("ipho");
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search an eBay marketplace for active listings.
   *
   * @param params - Search parameters including query, filters, and pagination.
   * @returns Search results with cards, facets, and pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(params: EbaySearchParams): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/ebay/search", {
      params: {
        query: params.query,
        domain: params.domain,
        category_id: params.category_id,
        page: params.page,
        per_page: params.per_page,
        sort_by: params.sort_by,
        condition: params.condition,
        buying_format: params.buying_format,
        min_price: params.min_price,
        max_price: params.max_price,
        free_shipping: params.free_shipping,
      },
    });
  }

  /**
   * Search an eBay marketplace by image — eBay's own visual search.
   *
   * This is what eBay's camera icon does: the image is uploaded to eBay, and
   * the handle it answers with is searched like a keyword. Supply the picture
   * either as `image_url` (downloaded for you) or as `image_base64`; exactly
   * one of the two is required.
   *
   * There is no `sort_by` — eBay ignores sorting on a visual results page.
   *
   * @param params - The image plus the usual listing filters and pagination.
   * @returns Search results (with `query: null`), facets, and pagination.
   * @throws Error - If neither or both of `image_url` / `image_base64` are given.
   * @throws ValidationError - If eBay cannot read the image.
   */
  async searchByImage(params: EbaySearchByImageParams): Promise<SearchResponse> {
    if (Boolean(params.image_url) === Boolean(params.image_base64)) {
      throw new Error("provide exactly one of image_url or image_base64");
    }

    return this.client.request<SearchResponse>("/v1/ebay/search/by-image", {
      method: "POST",
      body: {
        image_url: params.image_url,
        image_base64: params.image_base64,
        domain: params.domain,
        category_id: params.category_id,
        page: params.page,
        per_page: params.per_page,
        condition: params.condition,
        buying_format: params.buying_format,
        min_price: params.min_price,
        max_price: params.max_price,
        free_shipping: params.free_shipping,
        location: params.location,
        language: params.language,
      },
    });
  }

  /**
   * Search completed / sold listings — eBay's sold-price history.
   *
   * @param params - Search parameters including query, filters, and pagination.
   * @returns Search results (with `sold: true`), facets, and pagination.
   */
  async completed(params: EbayCompletedParams): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/ebay/completed", {
      params: {
        query: params.query,
        domain: params.domain,
        category_id: params.category_id,
        page: params.page,
        per_page: params.per_page,
        sort_by: params.sort_by,
        condition: params.condition,
        min_price: params.min_price,
        max_price: params.max_price,
      },
    });
  }

  /**
   * Get eBay keyword autocomplete suggestions.
   *
   * @param query - Partial search query prefix.
   * @param options - Optional parameters (domain).
   * @returns Autocomplete suggestions.
   */
  async autocomplete(
    query: string,
    options: EbayAutocompleteParams = {}
  ): Promise<AutocompleteResponse> {
    return this.client.request<AutocompleteResponse>("/v1/ebay/autocomplete", {
      params: { query, domain: options.domain },
    });
  }
}
