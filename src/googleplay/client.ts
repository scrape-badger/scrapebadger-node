/**
 * Google Play Store API client.
 *
 * Google Play endpoints: search, getApp (full detail), getReviews,
 * getPermissions, getSimilar, getDeveloper (a publisher's catalogue),
 * browseCategory, getCollection (top charts), listCategories and listMarkets.
 *
 * Play is one global host localised by two INDEPENDENT parameters: `country`
 * (`gl` — pricing, availability, chart ranking) and `lang` (`hl` — the language
 * of descriptions and reviews).
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GooglePlayApp,
  GooglePlayAppListResponse,
  GooglePlayCategoriesResponse,
  GooglePlayCollection,
  GooglePlayCollectionParams,
  GooglePlayLocaleParams,
  GooglePlayMarketsResponse,
  GooglePlayPermissionsResponse,
  GooglePlayReviewsParams,
  GooglePlayReviewsResponse,
  GooglePlaySearchParams,
} from "./types.js";

/**
 * Client for all Google Play Store API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search
 * const results = await client.googlePlay.search("puzzle", { price: "free" });
 * for (const card of results.apps) {
 *   console.log(`${card.app_id} — ${card.title} (${card.score})`);
 * }
 *
 * // Full app detail
 * const app = await client.googlePlay.getApp("com.whatsapp");
 * console.log(app.installs, app.developer?.legal_name);
 *
 * // Reviews (token pagination)
 * let page = await client.googlePlay.getReviews("com.whatsapp", { count: 150 });
 * while (page.next_page_token) {
 *   page = await client.googlePlay.getReviews("com.whatsapp", {
 *     pageToken: page.next_page_token,
 *   });
 * }
 *
 * // Reference
 * const categories = await client.googlePlay.listCategories();
 * const markets = await client.googlePlay.listMarkets();
 * ```
 */
export class GooglePlayClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search Google Play for apps and games.
   *
   * Returns the ~30 results Play renders server-side. There is no `page`
   * parameter — Play's search page has no page number, and its infinite-scroll
   * continuation is not reachable. Use `getSimilar` or `getDeveloper` to widen
   * a result set.
   *
   * @param query - Search keywords, e.g. "puzzle".
   * @param options - Optional parameters (country, lang, price).
   * @returns App list response with the matching app cards.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async search(
    query: string,
    options: GooglePlaySearchParams = {}
  ): Promise<GooglePlayAppListResponse> {
    return this.client.request<GooglePlayAppListResponse>("/v1/google-play/search", {
      params: {
        query,
        country: options.country ?? "US",
        lang: options.lang ?? "en",
        price: options.price,
      },
    });
  }

  /**
   * Get full detail for one app.
   *
   * One fetch returns the description, ratings histogram, install bands,
   * pricing and IAP range, developer contact and legal entity, media,
   * release/update timestamps, the Data Safety declaration, the permission
   * tree and the similar-apps rail.
   *
   * @param appId - Android package id, e.g. "com.whatsapp".
   * @param options - Optional parameters (country, lang).
   * @returns Full app detail.
   * @throws NotFoundError - If the app doesn't exist.
   */
  async getApp(appId: string, options: GooglePlayLocaleParams = {}): Promise<GooglePlayApp> {
    return this.client.request<GooglePlayApp>(`/v1/google-play/apps/${appId}`, {
      params: { country: options.country ?? "US", lang: options.lang ?? "en" },
    });
  }

  /**
   * Get paginated user reviews, with developer replies where they exist.
   *
   * Play paginates reviews by token only — there is no page number. Pass the
   * previous response's `next_page_token` as `pageToken`.
   *
   * @param appId - Android package id, e.g. "com.whatsapp".
   * @param options - Optional parameters (country, lang, sort, count, pageToken).
   * @returns Reviews response with a page of reviews and the next page token.
   * @throws NotFoundError - If the app doesn't exist.
   */
  async getReviews(
    appId: string,
    options: GooglePlayReviewsParams = {}
  ): Promise<GooglePlayReviewsResponse> {
    return this.client.request<GooglePlayReviewsResponse>(`/v1/google-play/apps/${appId}/reviews`, {
      params: {
        country: options.country ?? "US",
        lang: options.lang ?? "en",
        sort: options.sort,
        count: options.count,
        page_token: options.pageToken,
      },
    });
  }

  /**
   * Get every Android permission the app declares, grouped as Play groups them.
   *
   * @param appId - Android package id, e.g. "com.whatsapp".
   * @param options - Optional parameters (country, lang).
   * @returns Permissions response with the full permission tree.
   * @throws NotFoundError - If the app doesn't exist.
   */
  async getPermissions(
    appId: string,
    options: GooglePlayLocaleParams = {}
  ): Promise<GooglePlayPermissionsResponse> {
    return this.client.request<GooglePlayPermissionsResponse>(
      `/v1/google-play/apps/${appId}/permissions`,
      { params: { country: options.country ?? "US", lang: options.lang ?? "en" } }
    );
  }

  /**
   * Get the apps Play recommends alongside this one.
   *
   * Play caps the rail at roughly a dozen entries. The full list behind its
   * "See more" link is `GooglePlayApp.similar_apps_url`.
   *
   * @param appId - Android package id, e.g. "com.whatsapp".
   * @param options - Optional parameters (country, lang).
   * @returns App list response with the "Similar apps" rail.
   * @throws NotFoundError - If the app doesn't exist.
   */
  async getSimilar(
    appId: string,
    options: GooglePlayLocaleParams = {}
  ): Promise<GooglePlayAppListResponse> {
    return this.client.request<GooglePlayAppListResponse>(`/v1/google-play/apps/${appId}/similar`, {
      params: { country: options.country ?? "US", lang: options.lang ?? "en" },
    });
  }

  /**
   * Get a developer's published apps.
   *
   * Play server-renders only the first rail of a large catalogue — around 10
   * apps for a publisher with dozens.
   *
   * @param developer - Developer id: either the numeric id from an app's
   *   `developer.developer_id` (e.g. "5700313618786177705") or the display name
   *   from `developer.name` (e.g. "WhatsApp LLC").
   * @param options - Optional parameters (country, lang).
   * @returns App list response with the developer's catalogue.
   * @throws NotFoundError - If the developer has no apps.
   */
  async getDeveloper(
    developer: string,
    options: GooglePlayLocaleParams = {}
  ): Promise<GooglePlayAppListResponse> {
    return this.client.request<GooglePlayAppListResponse>(
      `/v1/google-play/developers/${developer}`,
      { params: { country: options.country ?? "US", lang: options.lang ?? "en" } }
    );
  }

  /**
   * Get a top chart for a category and country.
   *
   * @param collection - Top chart: "topselling_free", "topselling_paid" or
   *   "topgrossing".
   * @param options - Optional parameters (category, country, lang).
   * @returns App list response with the ranked chart.
   * @throws ValidationError - If the collection is unknown, or Play renders the
   *   chart client-side and no server-side ranking is available.
   */
  async getCollection(
    collection: GooglePlayCollection,
    options: GooglePlayCollectionParams = {}
  ): Promise<GooglePlayAppListResponse> {
    return this.client.request<GooglePlayAppListResponse>(
      `/v1/google-play/collections/${collection}`,
      {
        params: {
          category: options.category ?? "APPLICATION",
          country: options.country ?? "US",
          lang: options.lang ?? "en",
        },
      }
    );
  }

  /**
   * Browse a Play category.
   *
   * Returns every app across the category page's editorial rails, deduped and
   * in the order Play ranked them.
   *
   * @param categoryId - Play category id, e.g. "GAME_PUZZLE" or "SOCIAL". See
   *   `listCategories`.
   * @param options - Optional parameters (country, lang).
   * @returns App list response with the category's apps.
   * @throws NotFoundError - If the category has no apps.
   */
  async browseCategory(
    categoryId: string,
    options: GooglePlayLocaleParams = {}
  ): Promise<GooglePlayAppListResponse> {
    return this.client.request<GooglePlayAppListResponse>(
      `/v1/google-play/categories/${categoryId}`,
      { params: { country: options.country ?? "US", lang: options.lang ?? "en" } }
    );
  }

  /**
   * Get every Play app and game category id.
   *
   * Free — this endpoint costs no credits.
   *
   * @returns Categories response with all category ids.
   */
  async listCategories(): Promise<GooglePlayCategoriesResponse> {
    return this.client.request<GooglePlayCategoriesResponse>("/v1/google-play/categories");
  }

  /**
   * Get the supported storefront countries (`gl`) and content languages (`hl`).
   *
   * The two are independent: `gl` selects pricing, availability and chart
   * ranking, `hl` selects the language of descriptions and reviews.
   *
   * Free — this endpoint costs no credits.
   *
   * @returns Markets response with countries and languages.
   */
  async listMarkets(): Promise<GooglePlayMarketsResponse> {
    return this.client.request<GooglePlayMarketsResponse>("/v1/google-play/markets");
  }
}
