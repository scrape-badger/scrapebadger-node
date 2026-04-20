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
   * rating_summary (per-star distribution), categories, extensions
   * (service_options, accessibility, offerings, payments), weekly
   * operating hours, popular_times graph, provider_id,
   * permanently_closed, thumbnail, and photo list.
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
   * Get photos for a place with place-specific categories.
   *
   * Returns place-specific categories (Menu, Vibe, Comfort food, dish
   * names) and photo URLs from all CDN families. Use `category_id` to
   * scope to a category, or `page_size: 200` to fetch all photos in
   * one call (Google caps at ~120 photos per response).
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
