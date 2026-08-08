/**
 * Yandex Reference API client.
 *
 * The list of supported Yandex markets.
 */

import type { BaseClient } from "../internal/client.js";
import type { YandexMarketsResponse } from "./types.js";

/**
 * Client for the Yandex markets endpoint.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const markets = await client.yandex.reference.markets();
 * for (const m of markets.markets) {
 *   console.log(`${m.code}: ${m.domain} (lr ${m.default_lr})`);
 * }
 * ```
 */
export class ReferenceClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Get the supported Yandex markets.
   */
  async markets(): Promise<YandexMarketsResponse> {
    return this.client.request<YandexMarketsResponse>("/v1/yandex/markets");
  }
}
