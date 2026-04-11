/**
 * Google Flights API client — one-way, round-trip, multi-city.
 */

import type { BaseClient } from "../internal/client.js";
import type { FlightsSearchParams, GoogleResponse } from "./types.js";

/**
 * Client for Google Flights search.
 *
 * Supports one-way, round-trip, and multi-city itineraries with
 * passenger configuration, cabin class, stops filter, and max-price.
 * Returns Google's Best flights recommendations plus the full Other
 * flights result set, with per-offer pricing, duration, stops,
 * layovers, carbon emissions, and price insights (low / typical /
 * high + typical price range) when Google shows them.
 *
 * @example
 * ```typescript
 * const flights = await client.google.flights.search({
 *   departure_id: "JFK",
 *   arrival_id: "LHR",
 *   outbound_date: "2026-06-15",
 *   return_date: "2026-06-22",
 *   adults: 2,
 * });
 * for (const offer of flights.best_flights) {
 *   console.log(offer.price, offer.currency, offer.total_duration_minutes);
 * }
 * if (flights.price_insights) {
 *   console.log("Price level:", flights.price_insights.price_level);
 * }
 * ```
 */
export class FlightsClient {
  constructor(private readonly client: BaseClient) {}

  /** Search Google Flights for available itineraries. */
  async search(params: FlightsSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/flights/search", {
      params: { ...params },
    });
  }
}
