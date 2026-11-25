/**
 * Google Maps API client — search, place details, reviews, photos, posts.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  GoogleResponse,
  MapsPhotosParams,
  MapsPlaceParams,
  MapsPostsParams,
  MapsReviewsParams,
  MapsSearchParams,
} from "./types.js";

/**
 * Client for Google Maps endpoints.
 *
 * @example
 * ```typescript
 * const places = await client.google.maps.search({ q: "coffee shops sf" });
 * const detail = await client.google.maps.place({ data_id: "0x...:0x..." });
 * const reviews = await client.google.maps.reviews({
 *   data_id: "0x...:0x...",
 *   sort_by: "newestFirst",
 * });
 * ```
 */
export class MapsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search Maps for places by text query, place_id, or ludocid.
   *
   * Returns up to 20 results per page with full details (place_id,
   * data_id, GPS, rating, reviews, address, phone, website, extensions,
   * weekly hours, thumbnail) in a single call.
   */
  async search(params: MapsSearchParams): Promise<GoogleResponse> {
    if (!params.q && !params.place_id && !params.ludocid) {
      throw new Error("q, place_id, or ludocid is required");
    }
    return this.client.request<GoogleResponse>("/v1/google/maps/search", {
      params: { ...params },
    });
  }

  /**
   * Get full place detail by `place_id` or `data_id`.
   *
   * Returns title, address, phone, website, GPS, rating, reviews_count,
   * categories, extensions (amenity groups such as accessibility),
   * opening hours (`open_state`, today's `hours`, and `operating_hours`
   * for the coming seven days), `price_level` (Google's price per person,
   * e.g. "฿2,000+"), popular_times, provider_id, `thumbnail`/`image`, and
   * up to 20 photo URLs. `service_options` is null: Google no longer
   * exposes those flags to signed-out clients.
   */
  async place(params: MapsPlaceParams): Promise<GoogleResponse> {
    if (!params.place_id && !params.data_id) {
      throw new Error("place_id or data_id is required");
    }
    return this.client.request<GoogleResponse>("/v1/google/maps/place", {
      params: { ...params },
    });
  }

  /**
   * Get reviews for a place (paginated, optional topic filter).
   *
   * Pass the `next_page_token` from `response.pagination.next` for
   * subsequent pages, or use `topic_id` from `response.topics[].id`
   * to scope to a specific review topic.
   */
  async reviews(params: MapsReviewsParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/maps/reviews", {
      params: { ...params },
    });
  }

  /**
   * Get photos for a place.
   *
   * Returns the photos Google exposes to signed-out clients (usually the
   * first 8 of the gallery) as `thumbnail` and `image` URLs.
   * `pagination.total_results` is the place's total photo count on Google;
   * there is one page (`next` is null). To get another size, replace a
   * URL's `=w..-h..-k-no` suffix and keep its path.
   */
  async photos(params: MapsPhotosParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/maps/photos", {
      params: { ...params },
    });
  }

  /** Get business posts (promotional updates, announcements) for a place. */
  async posts(params: MapsPostsParams): Promise<GoogleResponse> {
    if (!params.data_id && !params.place_id) {
      throw new Error("data_id or place_id is required");
    }
    return this.client.request<GoogleResponse>("/v1/google/maps/posts", {
      params: { ...params },
    });
  }
}
