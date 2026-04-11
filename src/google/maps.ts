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

  /** Search Maps for places by text query. */
  async search(params: MapsSearchParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/maps/search", {
      params: { ...params },
    });
  }

  /** Get place details by `place_id` or `data_id`. */
  async place(params: MapsPlaceParams): Promise<GoogleResponse> {
    if (!params.place_id && !params.data_id) {
      throw new Error("place_id or data_id is required");
    }
    return this.client.request<GoogleResponse>("/v1/google/maps/place", {
      params: { ...params },
    });
  }

  /** Get reviews for a place (sorted/paginated). */
  async reviews(params: MapsReviewsParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/maps/reviews", {
      params: { ...params },
    });
  }

  /** Get photos for a place. */
  async photos(params: MapsPhotosParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/maps/photos", {
      params: { ...params },
    });
  }

  /** Get business posts for a place. */
  async posts(params: MapsPostsParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/maps/posts", {
      params: { ...params },
    });
  }
}
