/**
 * Google Finance API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { FinanceQuoteParams, GoogleResponse } from "./types.js";

/**
 * Client for Google Finance quotes.
 *
 * @example
 * ```typescript
 * const quote = await client.google.finance.quote({ q: "AAPL:NASDAQ" });
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
