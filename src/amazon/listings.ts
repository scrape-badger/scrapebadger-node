/**
 * Amazon Listings API client.
 *
 * Provides methods for bestsellers, new releases, deals, and category browse.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  AmazonListingsParams,
  AmazonDealsParams,
  AmazonCategoryParams,
  BestsellersResponse,
  NewReleasesResponse,
  DealsResponse,
  CategoryResponse,
} from "./types.js";

/**
 * Client for Amazon listing endpoints (bestsellers, new releases, deals, category).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const top = await client.amazon.listings.bestsellers({ category: "electronics" });
 * for (const item of top.bestsellers) {
 *   console.log(`#${item.rank}: ${item.title}`);
 * }
 * ```
 */
export class ListingsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get the bestsellers list for a marketplace / category.
   *
   * @param options - Optional parameters (domain, category, page).
   * @returns Bestsellers response with ranked products and pagination.
   */
  async bestsellers(
    options: AmazonListingsParams = {}
  ): Promise<BestsellersResponse> {
    return this.client.request<BestsellersResponse>("/v1/amazon/bestsellers", {
      params: {
        domain: options.domain,
        category: options.category,
        page: options.page,
      },
    });
  }

  /**
   * Get the new-releases list for a marketplace / category.
   *
   * @param options - Optional parameters (domain, category, page).
   * @returns New-releases response with ranked products and pagination.
   */
  async newReleases(
    options: AmazonListingsParams = {}
  ): Promise<NewReleasesResponse> {
    return this.client.request<NewReleasesResponse>("/v1/amazon/new-releases", {
      params: {
        domain: options.domain,
        category: options.category,
        page: options.page,
      },
    });
  }

  /**
   * Get current deals for a marketplace / category.
   *
   * @param options - Optional parameters (domain, category, page).
   * @returns Deals response with deal rows and pagination.
   */
  async deals(options: AmazonDealsParams = {}): Promise<DealsResponse> {
    return this.client.request<DealsResponse>("/v1/amazon/deals", {
      params: {
        domain: options.domain,
        category: options.category,
        page: options.page,
      },
    });
  }

  /**
   * Browse a category / department by browse-node ID.
   *
   * @param params - Parameters including the required node ID.
   * @returns Category response with result rows and pagination.
   */
  async category(params: AmazonCategoryParams): Promise<CategoryResponse> {
    return this.client.request<CategoryResponse>("/v1/amazon/category", {
      params: {
        node: params.node,
        domain: params.domain,
        page: params.page,
        sort_by: params.sort_by,
      },
    });
  }
}
