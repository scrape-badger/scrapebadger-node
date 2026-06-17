/**
 * Google Flights API client — one-way, round-trip, multi-city.
 */

import type { BaseClient } from "../internal/client.js";
import type { FlightsBookingOptionsParams, FlightsSearchParams, GoogleResponse } from "./types.js";

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
 *   // offer.booking_url deep-links to the booking page for that flight;
 *   // offer.selection_token feeds bookingOptions() below.
 * }
 * if (flights.price_insights) {
 *   console.log("Price level:", flights.price_insights.price_level);
 * }
 * ```
 */
export class FlightsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search Google Flights for available itineraries.
   *
   * Each offer includes a `booking_url` (deep link that pre-selects the
   * flight) and a `selection_token` for {@link bookingOptions}. The response
   * also carries a `search_url` for the whole search, and each leg carries
   * the flight number, departure/arrival times, airport names and aircraft.
   */
  async search(params: FlightsSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/flights/search", {
      params: { ...params },
    });
  }

  /**
   * Retrieve the provider booking list (airline + OTAs, with prices) for a
   * selected itinerary, given the `selection_token` from a search offer.
   *
   * Works for one-way / fully-selected itineraries. This renders the Google
   * Flights booking page, so it is slower than `search`. The actual
   * per-provider booking links open from the returned `booking_url`.
   *
   * @example
   * ```typescript
   * const flights = await client.google.flights.search({
   *   departure_id: "CNF", arrival_id: "GRU",
   *   outbound_date: "2026-06-25", trip_type: "one_way", currency: "BRL",
   * });
   * const token = flights.best_flights[0].selection_token;
   * const options = await client.google.flights.bookingOptions({
   *   selection_token: token, currency: "BRL", gl: "br",
   * });
   * for (const opt of options.booking_options) {
   *   console.log(opt.book_with, opt.price, opt.currency);
   * }
   * ```
   */
  async bookingOptions(params: FlightsBookingOptionsParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/flights/booking_options", {
      params: { ...params },
    });
  }
}
