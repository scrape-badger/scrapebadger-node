/**
 * LoopNet Brokers API client.
 *
 * Provides a commercial broker's profile and their active listings.
 */

import type { BaseClient } from "../internal/client.js";
import type { BrokerResponse, LoopNetMarket } from "./types.js";

/** Options for the broker profile endpoint. */
export interface LoopNetBrokerParams {
  /** Coverage market (default: "us") */
  market?: LoopNetMarket;
}

/**
 * Client for the LoopNet broker profile endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const profile = await client.loopnet.brokers.get("jane-doe", "w7x2k9");
 * console.log(profile.broker.name, profile.broker.listing_count);
 * ```
 */
export class BrokersClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a LoopNet broker's profile and their active listings.
   *
   * Costs 8 credits.
   *
   * @param slug - The broker's profile URL slug.
   * @param brokerId - The LoopNet broker id.
   * @param params - Optional market selector.
   * @returns Broker profile response with the broker and their listings.
   * @throws NotFoundError - If the broker doesn't exist.
   */
  async get(
    slug: string,
    brokerId: string,
    params: LoopNetBrokerParams = {}
  ): Promise<BrokerResponse> {
    return this.client.request<BrokerResponse>(`/v1/loopnet/brokers/${slug}/${brokerId}`, {
      params: { market: params.market },
    });
  }
}
