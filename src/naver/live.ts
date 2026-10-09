/**
 * Naver Shopping Live API client.
 *
 * Shopping Live broadcasts, channels and shortclips — details, product lists,
 * counts, replay timelines and product categories.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  NaverLiveBroadcastProductCategoriesParams,
  NaverLiveBroadcastProductsParams,
  NaverLiveChannelProductsParams,
  NaverLiveChannelShortclipsParams,
  NaverLiveReplayProductsParams,
  NaverLiveShortclipProductsParams,
  NaverResponse,
} from "./types.js";

/**
 * Client for Naver Shopping Live endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const keywords = await client.naver.live.searchKeywords();
 * const broadcast = await client.naver.live.broadcast("1234567");
 * const products = await client.naver.live.broadcastProducts("1234567", { size: 50 });
 * const channel = await client.naver.live.channel("abcdef");
 * const clips = await client.naver.live.channelShortclips("abcdef", { sort_type: "VIEW" });
 * const clip = await client.naver.live.shortclip("sc_123");
 * ```
 */
export class ShoppingLiveClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Shopping Live search standby keyword ranking.
   */
  async searchKeywords(): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/live/search/keywords");
  }

  /**
   * Broadcast detail by id, including embedded `shoppingProducts`.
   *
   * @param broadcastId - Broadcast id.
   */
  async broadcast(broadcastId: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/shopping/live/broadcasts/${broadcastId}`);
  }

  /**
   * Paginated product list for one broadcast.
   *
   * @param broadcastId - Broadcast id.
   * @param params - Optional 0-based `page` and `size` (1..200).
   */
  async broadcastProducts(
    broadcastId: string,
    params: NaverLiveBroadcastProductsParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(
      `/v1/naver/shopping/live/broadcasts/${broadcastId}/products`,
      { params: { page: params.page, size: params.size } }
    );
  }

  /**
   * Broadcast viewer / like / comment counts.
   *
   * @param broadcastId - Broadcast id.
   */
  async broadcastCounts(broadcastId: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(
      `/v1/naver/shopping/live/broadcasts/${broadcastId}/counts`
    );
  }

  /**
   * Shopping Live channel / store profile.
   *
   * @param channelId - Channel id.
   */
  async channel(channelId: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/shopping/live/channels/${channelId}`);
  }

  /**
   * Channel product list.
   *
   * @param channelId - Channel id.
   * @param params - Optional `next` cursor and `size` (1..100).
   */
  async channelProducts(
    channelId: string,
    params: NaverLiveChannelProductsParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(
      `/v1/naver/shopping/live/channels/${channelId}/products`,
      { params: { next: params.next, size: params.size } }
    );
  }

  /**
   * Channel broadcast list, including upcoming STANDBY schedule cards.
   *
   * @param channelId - Channel id.
   */
  async channelBroadcasts(channelId: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(
      `/v1/naver/shopping/live/channels/${channelId}/broadcasts`
    );
  }

  /**
   * Channel shorts / clips list.
   *
   * @param channelId - Channel id.
   * @param params - Optional `sort_type`, `next` cursor and `size` (1..100).
   */
  async channelShortclips(
    channelId: string,
    params: NaverLiveChannelShortclipsParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(
      `/v1/naver/shopping/live/channels/${channelId}/shortclips`,
      { params: { sort_type: params.sort_type, next: params.next, size: params.size } }
    );
  }

  /**
   * Shortclip detail with embedded products and categories.
   *
   * @param shortclipId - Shortclip id.
   */
  async shortclip(shortclipId: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/shopping/live/shortclips/${shortclipId}`);
  }

  /**
   * Paginated shortclip product list.
   *
   * @param shortclipId - Shortclip id.
   * @param params - Optional `attachment_type`, 0-based `page`, `size` (1..100)
   *   and `sort`.
   */
  async shortclipProducts(
    shortclipId: string,
    params: NaverLiveShortclipProductsParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(
      `/v1/naver/shopping/live/shortclips/${shortclipId}/products`,
      {
        params: {
          attachment_type: params.attachment_type,
          page: params.page,
          size: params.size,
          sort: params.sort,
        },
      }
    );
  }

  /**
   * Replay product timeline of an ended broadcast.
   *
   * @param broadcastId - Broadcast id.
   * @param params - Optional `include_before` and `next` cursor (`0` = start).
   */
  async replayProducts(
    broadcastId: string,
    params: NaverLiveReplayProductsParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(
      `/v1/naver/shopping/live/broadcasts/${broadcastId}/replay-products`,
      { params: { include_before: params.include_before, next: params.next } }
    );
  }

  /**
   * Product categories present in a broadcast.
   *
   * @param broadcastId - Broadcast id.
   * @param params - Optional `attachment_type`.
   */
  async broadcastProductCategories(
    broadcastId: string,
    params: NaverLiveBroadcastProductCategoriesParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(
      `/v1/naver/shopping/live/broadcasts/${broadcastId}/product-categories`,
      { params: { attachment_type: params.attachment_type } }
    );
  }
}
