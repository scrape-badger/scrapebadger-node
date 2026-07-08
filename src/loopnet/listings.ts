/**
 * LoopNet Listings API client.
 *
 * Provides full listing detail lookup by listing id.
 */

import type { BaseClient } from "../internal/client.js";
import type { ListingResponse, LoopNetMarket } from "./types.js";

/** Options for the listing detail endpoint. */
export interface LoopNetListingParams {
  /** Coverage market (default: "us") */
  market?: LoopNetMarket;
}

/**
 * Client for the LoopNet listing detail endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const detail = await client.loopnet.listings.get("12345678");
 * console.log(detail.listing.address, detail.listing.price_text);
 * ```
 */
export class ListingsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a single LoopNet listing's full detail by listing id.
   *
   * Costs 12 credits.
   *
   * @param listingId - The LoopNet listing id.
   * @param params - Optional market selector.
   * @returns Listing detail response.
   * @throws NotFoundError - If the listing doesn't exist.
   */
  async get(listingId: string, params: LoopNetListingParams = {}): Promise<ListingResponse> {
    return this.client.request<ListingResponse>(`/v1/loopnet/listings/${listingId}`, {
      params: { market: params.market },
    });
  }
}
