/**
 * Apple App Store API client.
 *
 * App Store endpoints: search, getApp (iTunes lookup merged with storefront
 * enrichment), getReviews, getDeveloper (profile + catalogue), charts,
 * listGenres and listMarkets.
 *
 * Everything is storefront-scoped: the `us` and `de` feeds for the same app are
 * different data sets, not translations of one.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  AppStoreApp,
  AppStoreAppParams,
  AppStoreChartsParams,
  AppStoreChartsResponse,
  AppStoreDeveloperParams,
  AppStoreDeveloperResponse,
  AppStoreGenresResponse,
  AppStoreMarketsResponse,
  AppStoreReviewsParams,
  AppStoreReviewsResponse,
  AppStoreSearchParams,
  AppStoreSearchResponse,
} from "./types.js";

/**
 * Client for all Apple App Store API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search
 * const results = await client.appStore.search("slack", { country: "us" });
 * for (const app of results.apps) {
 *   console.log(`${app.app_id} — ${app.name} (${app.rating})`);
 * }
 *
 * // Full app detail, by track id or bundle id
 * const app = await client.appStore.getApp("618783545");
 * console.log(app.version, app.extras?.rating_histogram?.five_star);
 *
 * // Reviews (50 per page, pages 1-10)
 * const reviews = await client.appStore.getReviews("618783545", { page: 1 });
 *
 * // Top charts
 * const chart = await client.appStore.charts({ type: "top-grossing", genre: 6014 });
 *
 * // Reference
 * const genres = await client.appStore.listGenres();
 * const markets = await client.appStore.listMarkets();
 * ```
 */
export class AppStoreClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search the App Store full-text.
   *
   * Returns the complete iTunes record for every hit — the same ~40 fields the
   * detail endpoint returns, so a search result rarely needs a follow-up lookup.
   *
   * @param query - Search term, e.g. "slack".
   * @param options - Optional parameters (country, entity, limit, offset, lang).
   * @returns Search response with matching apps.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(query: string, options: AppStoreSearchParams = {}): Promise<AppStoreSearchResponse> {
    return this.client.request<AppStoreSearchResponse>("/v1/app-store/search", {
      params: {
        query,
        country: options.country ?? "us",
        entity: options.entity,
        limit: options.limit,
        offset: options.offset,
        lang: options.lang,
      },
    });
  }

  /**
   * Get full detail for one app, by track id or bundle id.
   *
   * Merges two sources: the iTunes lookup (core fields, always present) and the
   * storefront product page (`extras`, best-effort — a storefront failure
   * degrades the response rather than failing it).
   *
   * @param appId - Numeric track id (e.g. "618783545") or bundle id (e.g.
   *   "com.tinyspeck.chatlyio"). A value containing a dot is treated as a
   *   bundle id.
   * @param options - Optional parameters (country, lang, includeExtras).
   * @returns Full app detail.
   * @throws NotFoundError - If the app doesn't exist in the storefront.
   */
  async getApp(appId: string, options: AppStoreAppParams = {}): Promise<AppStoreApp> {
    return this.client.request<AppStoreApp>(`/v1/app-store/apps/${appId}`, {
      params: {
        country: options.country ?? "us",
        lang: options.lang,
        include_extras: options.includeExtras,
      },
    });
  }

  /**
   * Get customer reviews for an app — 50 per page, pages 1-10.
   *
   * Reviews are per-storefront: the "us" and "de" feeds for the same app are
   * different review sets, not translations of one set.
   *
   * @param appId - Numeric track id, e.g. "618783545". Apple's review feed has
   *   no bundle-id form — resolve a bundle id through `getApp` first and use
   *   its `app_id`.
   * @param options - Optional parameters (country, page, sort).
   * @returns Reviews response with a page of reviews.
   * @throws NotFoundError - If the app doesn't exist.
   * @throws ValidationError - If the app id is not numeric, or the page is
   *   beyond Apple's 10-page ceiling.
   */
  async getReviews(
    appId: string,
    options: AppStoreReviewsParams = {}
  ): Promise<AppStoreReviewsResponse> {
    return this.client.request<AppStoreReviewsResponse>(`/v1/app-store/apps/${appId}/reviews`, {
      params: {
        country: options.country ?? "us",
        page: options.page,
        sort: options.sort,
      },
    });
  }

  /**
   * Get a developer and every app they publish in the storefront.
   *
   * @param developerId - Numeric artist id, e.g. "284882218".
   * @param options - Optional parameters (country, limit).
   * @returns Developer response with the profile and their catalogue.
   * @throws NotFoundError - If the developer doesn't exist in the storefront.
   * @throws ValidationError - If the developer id is not numeric.
   */
  async getDeveloper(
    developerId: string,
    options: AppStoreDeveloperParams = {}
  ): Promise<AppStoreDeveloperResponse> {
    return this.client.request<AppStoreDeveloperResponse>(
      `/v1/app-store/developers/${developerId}`,
      { params: { country: options.country ?? "us", limit: options.limit } }
    );
  }

  /**
   * Get the top charts for a storefront, optionally scoped to one genre.
   *
   * `rank` is the app's position in the feed — Apple does not send an explicit
   * rank field.
   *
   * @param options - Optional parameters (country, type, genre, limit, entity).
   * @returns Charts response with ranked entries.
   * @throws ValidationError - If the chart type, entity or genre id is unknown.
   */
  async charts(options: AppStoreChartsParams = {}): Promise<AppStoreChartsResponse> {
    return this.client.request<AppStoreChartsResponse>("/v1/app-store/charts", {
      params: {
        country: options.country ?? "us",
        type: options.type,
        genre: options.genre,
        limit: options.limit,
        entity: options.entity,
      },
    });
  }

  /**
   * Get the App Store genre ids, for use with `charts({ genre })`.
   *
   * Every id listed is verified to return a non-empty chart.
   *
   * Free — this endpoint costs no credits.
   *
   * @returns Genres response with all chartable genre ids.
   */
  async listGenres(): Promise<AppStoreGenresResponse> {
    return this.client.request<AppStoreGenresResponse>("/v1/app-store/genres");
  }

  /**
   * Get the supported App Store storefronts.
   *
   * Informational — the endpoints accept any well-formed 2-letter code and let
   * Apple arbitrate, so a storefront missing from this list still works.
   *
   * Free — this endpoint costs no credits.
   *
   * @returns Markets response with all supported storefronts.
   */
  async listMarkets(): Promise<AppStoreMarketsResponse> {
    return this.client.request<AppStoreMarketsResponse>("/v1/app-store/markets");
  }
}
