/**
 * Naver Content API client.
 *
 * The web, cafe, Knowledge iN (kin), image, video and clip SERP verticals.
 */

import type { BaseClient } from "../internal/client.js";
import type { NaverContentParams, NaverResponse } from "./types.js";

/**
 * Client for Naver content-vertical SERPs.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const web = await client.naver.content.searchWeb("리액트 훅");
 * const cafe = await client.naver.content.cafe("강아지 사료", { page: 2 });
 * const kin = await client.naver.content.kin("비타민 추천");
 * const images = await client.naver.content.image("한라산");
 * const videos = await client.naver.content.video("김치찌개 레시피");
 * const clips = await client.naver.content.clip("고양이");
 * ```
 */
export class ContentClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Web vertical SERP (15 docs/page).
   *
   * @param query - Search keywords.
   * @param params - Optional page (1-based).
   */
  async searchWeb(query: string, params: NaverContentParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/search/web", {
      params: { query, page: params.page },
    });
  }

  /**
   * Cafe vertical SERP (30/page).
   *
   * @param query - Search keywords.
   * @param params - Optional page (1-based).
   */
  async cafe(query: string, params: NaverContentParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/cafe", {
      params: { query, page: params.page },
    });
  }

  /**
   * Knowledge iN vertical SERP (10/page).
   *
   * @param query - Search keywords.
   * @param params - Optional page (1-based).
   */
  async kin(query: string, params: NaverContentParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/kin", {
      params: { query, page: params.page },
    });
  }

  /**
   * Image vertical SERP (JSON API, 100/page).
   *
   * @param query - Search keywords.
   * @param params - Optional page (1-based).
   */
  async image(query: string, params: NaverContentParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/image", {
      params: { query, page: params.page },
    });
  }

  /**
   * Video vertical SERP with `/more` pagination (step 48).
   *
   * @param query - Search keywords.
   * @param params - Optional page (1-based).
   */
  async video(query: string, params: NaverContentParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/video", {
      params: { query, page: params.page },
    });
  }

  /**
   * Clip vertical SERP with `/more` pagination (step 24).
   *
   * @param query - Search keywords.
   * @param params - Optional page (1-based).
   */
  async clip(query: string, params: NaverContentParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/clip", {
      params: { query, page: params.page },
    });
  }
}
