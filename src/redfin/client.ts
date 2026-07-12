/**
 * Redfin API client.
 *
 * Redfin endpoints: search (for-sale listings), getProperty (full
 * single-listing detail, by propertyId or URL), getAgent (agent profile +
 * listings, by agentId or URL), autocomplete (location suggestions), and
 * listMarkets. Single market: redfin.com (US, USD, en-US).
 */

import type { BaseClient } from "../internal/client.js";
import type {
  RedfinSearchParams,
  RedfinPropertyParams,
  RedfinAgentParams,
  SearchResponse,
  PropertyResponse,
  AgentResponse,
  AutocompleteResponse,
  MarketsResponse,
} from "./types.js";

/**
 * Client for all Redfin API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search for-sale listings
 * const results = await client.redfin.search("Austin, TX");
 * for (const listing of results.results) {
 *   console.log(`${listing.position}. ${listing.street_line} — ${listing.price}`);
 * }
 *
 * // Full single-listing detail
 * const detail = await client.redfin.getProperty("12345678");
 * console.log(detail.property.price);
 *
 * // Agent profile
 * const agent = await client.redfin.getAgent("jane-doe");
 *
 * // Supported markets
 * const markets = await client.redfin.listMarkets();
 * ```
 */
export class RedfinClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search Redfin for for-sale properties.
   *
   * @param location - City/state, ZIP, address or neighborhood (required).
   * @param options - Optional parameters (page, sort, price/beds/baths/sqft/lot
   *   filters, year built, max days on market, bbox override).
   * @returns Search response with matching listings, map bounds, and pagination.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(location: string, options: RedfinSearchParams = {}): Promise<SearchResponse> {
    return this.client.request<SearchResponse>("/v1/redfin/search", {
      params: {
        location,
        page: options.page,
        sort: options.sort,
        price_min: options.price_min,
        price_max: options.price_max,
        beds_min: options.beds_min,
        baths_min: options.baths_min,
        home_type: options.home_type,
        sqft_min: options.sqft_min,
        sqft_max: options.sqft_max,
        lot_min: options.lot_min,
        lot_max: options.lot_max,
        year_built_min: options.year_built_min,
        year_built_max: options.year_built_max,
        max_days_on_market: options.max_days_on_market,
        north: options.north,
        south: options.south,
        east: options.east,
        west: options.west,
      },
    });
  }

  /**
   * Get a single Redfin property's full detail by id or URL.
   *
   * Provide either `propertyId` or `options.url`.
   *
   * @param propertyId - The Redfin property id.
   * @param options - Optional parameters (url).
   * @returns Property detail response.
   * @throws NotFoundError - If the property doesn't exist.
   */
  async getProperty(
    propertyId?: string,
    options: RedfinPropertyParams = {}
  ): Promise<PropertyResponse> {
    if (options.url) {
      return this.client.request<PropertyResponse>("/v1/redfin/property", {
        params: { url: options.url },
      });
    }
    return this.client.request<PropertyResponse>(`/v1/redfin/property/${propertyId}`);
  }

  /**
   * Get a Redfin agent's profile and their active listings.
   *
   * Provide either `agentId` or `options.url`.
   *
   * @param agentId - The Redfin agent slug.
   * @param options - Optional parameters (url).
   * @returns Agent profile response with the agent and their listings.
   * @throws NotFoundError - If the agent doesn't exist.
   */
  async getAgent(agentId?: string, options: RedfinAgentParams = {}): Promise<AgentResponse> {
    return this.client.request<AgentResponse>("/v1/redfin/agent", {
      params: { agent_id: agentId, url: options.url },
    });
  }

  /**
   * Resolve a search term to Redfin locations.
   *
   * @param query - Partial location — city, ZIP, address, or neighborhood.
   * @returns Autocomplete response with location suggestions.
   */
  async autocomplete(query: string): Promise<AutocompleteResponse> {
    return this.client.request<AutocompleteResponse>("/v1/redfin/autocomplete", {
      params: { query },
    });
  }

  /**
   * Get all supported Redfin coverage markets.
   *
   * @returns Markets response with all supported markets.
   */
  async listMarkets(): Promise<MarketsResponse> {
    return this.client.request<MarketsResponse>("/v1/redfin/markets");
  }
}
