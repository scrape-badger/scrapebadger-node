/**
 * Amazon Search API client.
 *
 * Provides methods for keyword search and keyword autocomplete suggestions.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  AmazonSearchParams,
  AmazonAutocompleteParams,
  SearchResponse,
  AutocompleteResponse,
} from "./types.js";

/**
 * Client for Amazon search and autocomplete endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const results = await client.amazon.search.search({ query: "wireless headphones" });
 * for (const item of results.results) {
 *   console.log(`${item.position}. ${item.title}`);
 * }
 *
 * const suggestions = await client.amazon.search.autocomplete("lapt");
 * ```
 */
export class SearchClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search Amazon for products by keyword.
   *
   * @param params - Search parameters including query, filters, and pagination.
   * @returns Search results with rows and pagination metadata.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(params: AmazonSearchParams): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/amazon/search", {
      params: {
        query: params.query,
        domain: params.domain,
        page: params.page,
        sort_by: params.sort_by,
        category: params.category,
        min_price: params.min_price,
        max_price: params.max_price,
        zip: params.zip,
        language: params.language,
      },
    });
  }

  /**
   * Get Amazon keyword autocomplete suggestions.
   *
   * @param query - Partial search query string.
   * @param options - Optional parameters (domain).
   * @returns Autocomplete suggestions.
   */
  async autocomplete(
    query: string,
    options: AmazonAutocompleteParams = {}
  ): Promise<AutocompleteResponse> {
    return this.client.request<AutocompleteResponse>("/v1/amazon/autocomplete", {
      params: { query, domain: options.domain },
    });
  }
}
