/**
 * Naver Place (Local) API client.
 *
 * Local business/venue search, Place detail, visitor reviews and the photo
 * viewer.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  NaverLocalParams,
  NaverPlacePhotosParams,
  NaverPlaceReviewsParams,
  NaverResponse,
} from "./types.js";

/**
 * Client for Naver Place / Local endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const local = await client.naver.places.local("강남 카페");
 * const place = await client.naver.places.get("1234567890");
 * const reviews = await client.naver.places.reviews("1234567890", { size: 30 });
 * const photos = await client.naver.places.photos("1234567890", { media_source: "biz" });
 * ```
 */
export class PlacesClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Search Naver Place/Local for Korean businesses and venues.
   *
   * @param query - Search keywords, e.g. `"강남 카페"`.
   * @param params - Optional paging (`start`/`display`) and `x`/`y` centre.
   *
   * @remarks Passing `start` switches to the paged `placeList` lane.
   */
  async local(query: string, params: NaverLocalParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/local", {
      params: {
        query,
        start: params.start,
        display: params.display,
        x: params.x,
        y: params.y,
      },
    });
  }

  /**
   * Get Place detail for a Korean business by its place id.
   *
   * @param placeId - Naver Place id (digits), from {@link local}.
   */
  async get(placeId: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/place/${placeId}`);
  }

  /**
   * Get Place visitor reviews.
   *
   * @param placeId - Naver Place id.
   * @param params - Optional opaque `cursor` and page `size` (1..50).
   */
  async reviews(placeId: string, params: NaverPlaceReviewsParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/place/${placeId}/reviews`, {
      params: { cursor: params.cursor, size: params.size },
    });
  }

  /**
   * Get Place photos (visitor-review or owner/place photos).
   *
   * @param placeId - Naver Place id.
   * @param params - Optional `media_source` and opaque `cursor`.
   */
  async photos(placeId: string, params: NaverPlacePhotosParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/place/${placeId}/photos`, {
      params: { media_source: params.media_source, cursor: params.cursor },
    });
  }
}
