/**
 * Naver Reviews & Q&A API client.
 *
 * Commerce review detail and helpers, product rating summaries, paginated
 * product review and Q&A lists, variant-group graphs and group-level
 * summaries.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  NaverProductQnasParams,
  NaverProductReviewSummaryParams,
  NaverProductReviewsParams,
  NaverResponse,
} from "./types.js";

/**
 * Client for Naver review, Q&A and product-group endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const review = await client.naver.reviews.get("987654321");
 * const summary = await client.naver.reviews.productReviewSummary("11223344");
 * const list = await client.naver.reviews.productReviews("11223344", {
 *   store_url: "plusink",
 *   product_no: "55667788",
 * });
 * const qnas = await client.naver.reviews.productQnas("11223344", {
 *   store_url: "plusink",
 *   product_no: "55667788",
 *   channel_uid: "2sx…",
 * });
 * ```
 */
export class ReviewsClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Commerce review detail by id.
   *
   * @param reviewId - Commerce review id.
   */
  async get(reviewId: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/reviews/${reviewId}`);
  }

  /**
   * SSR page query recipes for a review (continuation helper).
   *
   * @param reviewId - Commerce review id.
   */
  async ssrQueries(reviewId: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/reviews/${reviewId}/ssr-queries`);
  }

  /**
   * Video playback key minted from `attachVid` + `videoStamp`.
   *
   * @param attachVid - The `attachVid` from a review attachment.
   * @param stamp - The `videoStamp` from `reviewAttaches[]` type M.
   */
  async videoInkey(attachVid: string, stamp: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/reviews/video-inkey", {
      params: { attach_vid: attachVid, stamp },
    });
  }

  /**
   * Product rating summary (star distribution, media/type counts).
   *
   * @param originProductNo - Origin product no.
   * @param params - Optional `leaf_category_id` (derived from the product
   *   detail category when omitted).
   */
  async productReviewSummary(
    originProductNo: string,
    params: NaverProductReviewSummaryParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(
      `/v1/naver/products/${originProductNo}/review-summary`,
      { params: { leaf_category_id: params.leaf_category_id } }
    );
  }

  /**
   * Paginated product review list.
   *
   * @param originProductNo - Origin product no.
   * @param params - `store_url` and `product_no` are required; host, cursor
   *   fields, page and sort are optional.
   */
  async productReviews(
    originProductNo: string,
    params: NaverProductReviewsParams
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/products/${originProductNo}/reviews`, {
      params: {
        store_url: params.store_url,
        product_no: params.product_no,
        host: params.host,
        channel_uid: params.channel_uid,
        checkout_merchant_no: params.checkout_merchant_no,
        page: params.page,
        sort: params.sort,
      },
    });
  }

  /**
   * Paginated product Q&A list (the list payload carries no answer body).
   *
   * @param originProductNo - Origin product no.
   * @param params - `store_url` and `product_no` are required; `channel_uid`
   *   is required for `host: "smartstore"`.
   */
  async productQnas(
    originProductNo: string,
    params: NaverProductQnasParams
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/products/${originProductNo}/qnas`, {
      params: {
        store_url: params.store_url,
        product_no: params.product_no,
        host: params.host,
        channel_uid: params.channel_uid,
        page: params.page,
      },
    });
  }

  /**
   * Storefront variant-group graph (groupId + member originProductNos).
   *
   * @param originProductNo - Origin product no.
   */
  async productGroup(originProductNo: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/products/${originProductNo}/group`);
  }

  /**
   * Group-level rating summary (same shape as the product review summary).
   *
   * @param groupProductNo - Group product no.
   * @param leafCategoryId - Leaf category id (required).
   */
  async groupReviewSummary(groupProductNo: string, leafCategoryId: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(
      `/v1/naver/product-groups/${groupProductNo}/review-summary`,
      { params: { leaf_category_id: leafCategoryId } }
    );
  }
}
