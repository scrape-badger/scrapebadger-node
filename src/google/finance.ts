/**
 * Google Finance API client.
 *
 * Powered by the same `mKsvE` batchexecute RPC the Google Finance SPA
 * uses internally. Returns price / change / change% / previous_close /
 * after-hours / market hours / timezone / currency / country /
 * alternate exchange listings in ~1 s.
 */

import type { BaseClient } from "../internal/client.js";
import type { FinanceQuoteParams, GoogleResponse } from "./types.js";

/**
 * Client for Google Finance quotes.
 *
 * @example
 * ```typescript
 * const quote = await client.google.finance.quote({ q: "AAPL:NASDAQ" });
 * console.log(quote.price, quote.currency, quote.after_hours);
 * ```
 */
export class FinanceClient {
  constructor(private readonly client: BaseClient) {}

  async quote(params: FinanceQuoteParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/finance/quote", {
      params: { ...params },
    });
  }
}
