/**
 * eBay Search API client.
 *
 * Provides methods for active search, completed/sold search, and keyword
 * autocomplete suggestions.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  EbaySearchParams,
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
