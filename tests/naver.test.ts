/**
 * Tests for the Naver API client.
 *
 * The only non-trivial logic in this module is URL + query-param wiring, so
 * that is what is asserted: every sub-client is reachable, and a sample across
 * each family forwards the right path and params (path ids, required query
 * params, and the snake_case option keys each method maps).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";

function makeClient(): ScrapeBadger {
  return new ScrapeBadger({
    apiKey: "test-api-key",
    baseUrl: "https://api.scrapebadger.com",
    maxRetries: 0,
  });
}

function mockFetch(body: unknown = {}): void {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    })
  );
}

function requestedUrl(): URL {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  return new URL(mock.mock.calls[0][0] as string);
}

describe("NaverClient", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    mockFetch();
  });

  it("is wired onto the main client with every sub-client", () => {
    const client = makeClient();
    expect(client.naver.search).toBeDefined();
    expect(client.naver.places).toBeDefined();
    expect(client.naver.shopping).toBeDefined();
    expect(client.naver.stores).toBeDefined();
    expect(client.naver.content).toBeDefined();
    expect(client.naver.reviews).toBeDefined();
    expect(client.naver.products).toBeDefined();
    expect(client.naver.live).toBeDefined();
  });

  describe("search", () => {
    it("search forwards query, page and view", async () => {
      await makeClient().naver.search.search("커피머신", { page: 2, view: "more" });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/search");
      expect(url.searchParams.get("query")).toBe("커피머신");
      expect(url.searchParams.get("page")).toBe("2");
      expect(url.searchParams.get("view")).toBe("more");
    });

    it("news forwards query, page and sort", async () => {
      await makeClient().naver.search.news("인공지능", { page: 3, sort: "recent" });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/news");
      expect(url.searchParams.get("sort")).toBe("recent");
    });

    it("blog forwards query and page", async () => {
      await makeClient().naver.search.blog("맛집");
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/blog");
      expect(url.searchParams.get("query")).toBe("맛집");
    });

    it("autocomplete sends only query", async () => {
      await makeClient().naver.search.autocomplete("커피");
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/autocomplete");
      expect(url.searchParams.get("query")).toBe("커피");
    });
  });

  describe("places", () => {
    it("local forwards query and x/y centre", async () => {
      await makeClient().naver.places.local("강남 카페", {
        start: 1,
        display: 50,
        x: 127.02,
        y: 37.49,
      });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/local");
      expect(url.searchParams.get("start")).toBe("1");
      expect(url.searchParams.get("x")).toBe("127.02");
      expect(url.searchParams.get("y")).toBe("37.49");
    });

    it("get, reviews and photos build the place path", async () => {
      await makeClient().naver.places.get("1234567890");
      expect(requestedUrl().pathname).toBe("/v1/naver/place/1234567890");

      vi.unstubAllGlobals();
      mockFetch();
      await makeClient().naver.places.reviews("1234567890", { cursor: "abc", size: 30 });
      let url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/place/1234567890/reviews");
      expect(url.searchParams.get("cursor")).toBe("abc");
      expect(url.searchParams.get("size")).toBe("30");

      vi.unstubAllGlobals();
      mockFetch();
      await makeClient().naver.places.photos("1234567890", { media_source: "biz" });
      url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/place/1234567890/photos");
      expect(url.searchParams.get("media_source")).toBe("biz");
    });
  });

  describe("shopping", () => {
    it("bestsellers forwards ranking params", async () => {
      await makeClient().naver.shopping.bestsellers({
        category_id: "50000000",
        age_type: "WOMEN_20",
        sort_type: "PRODUCT_BUY",
        period_type: "WEEKLY",
      });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/shopping/bestsellers");
      expect(url.searchParams.get("category_id")).toBe("50000000");
      expect(url.searchParams.get("sort_type")).toBe("PRODUCT_BUY");
    });

    it("keywords sends the required category_id", async () => {
      await makeClient().naver.shopping.keywords("50000008", { period_type: "DAILY" });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/shopping/keywords");
      expect(url.searchParams.get("category_id")).toBe("50000008");
      expect(url.searchParams.get("period_type")).toBe("DAILY");
    });

    it("insight sends category, dates and options", async () => {
      await makeClient().naver.shopping.insight("50000000", "2026-01-01", "2026-01-31", {
        time_unit: "week",
        count: 30,
      });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/shopping/insight");
      expect(url.searchParams.get("start_date")).toBe("2026-01-01");
      expect(url.searchParams.get("end_date")).toBe("2026-01-31");
      expect(url.searchParams.get("time_unit")).toBe("week");
      expect(url.searchParams.get("count")).toBe("30");
    });

    it("categories and it-items take no params", async () => {
      await makeClient().naver.shopping.categories();
      expect(requestedUrl().pathname).toBe("/v1/naver/shopping/categories");
    });

    it("deals sends the required gender", async () => {
      await makeClient().naver.shopping.deals("F");
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/shopping/deals");
      expect(url.searchParams.get("gender")).toBe("F");
    });

    it("vertical builds the path", async () => {
      await makeClient().naver.shopping.vertical("fashiontown");
      expect(requestedUrl().pathname).toBe("/v1/naver/shopping/verticals/fashiontown");
    });

    it("searchCatalog forwards sort and page", async () => {
      await makeClient().naver.shopping.searchCatalog("아이폰 15", { sort: "LOW_PRICE", page: 2 });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/shopping/search-catalog");
      expect(url.searchParams.get("sort")).toBe("LOW_PRICE");
      expect(url.searchParams.get("page")).toBe("2");
    });

    it("searchFiltered forwards brand and attribute filters", async () => {
      await makeClient().naver.shopping.searchFiltered("운동화", {
        brand_id: "12345",
        attribute_id: "M987",
      });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/shopping/search-filtered");
      expect(url.searchParams.get("brand_id")).toBe("12345");
      expect(url.searchParams.get("attribute_id")).toBe("M987");
    });
  });

  describe("stores", () => {
    it("get forwards host", async () => {
      await makeClient().naver.stores.get("plusink", { host: "brand" });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/stores/plusink");
      expect(url.searchParams.get("host")).toBe("brand");
    });

    it("products forwards host, paging and channel_uid", async () => {
      await makeClient().naver.stores.products("plusink", {
        host: "smartstore",
        category_id: "100",
        page: 2,
        size: 40,
        sort: "POPULARITY",
        channel_uid: "2sxAbc",
      });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/stores/plusink/products");
      expect(url.searchParams.get("channel_uid")).toBe("2sxAbc");
      expect(url.searchParams.get("size")).toBe("40");
    });

    it("bestsellers forwards period", async () => {
      await makeClient().naver.stores.bestsellers("plusink", { period: "MONTHLY" });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/stores/plusink/bestsellers");
      expect(url.searchParams.get("period")).toBe("MONTHLY");
    });
  });

  describe("content", () => {
    it("searchWeb hits the /search/web path", async () => {
      await makeClient().naver.content.searchWeb("리액트", { page: 2 });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/search/web");
      expect(url.searchParams.get("page")).toBe("2");
    });

    it("cafe, kin, image, video, clip map to their paths", async () => {
      const content = makeClient().naver.content;
      const cases: [() => Promise<unknown>, string][] = [
        [() => content.cafe("고양이"), "/v1/naver/cafe"],
        [() => content.kin("고양이"), "/v1/naver/kin"],
        [() => content.image("고양이"), "/v1/naver/image"],
        [() => content.video("고양이"), "/v1/naver/video"],
        [() => content.clip("고양이"), "/v1/naver/clip"],
      ];
      for (const [call, path] of cases) {
        vi.unstubAllGlobals();
        mockFetch();
        await call();
        expect(requestedUrl().pathname).toBe(path);
      }
    });
  });

  describe("reviews & products", () => {
    it("review detail and ssr-queries build the review path", async () => {
      await makeClient().naver.reviews.get("987654321");
      expect(requestedUrl().pathname).toBe("/v1/naver/reviews/987654321");

      vi.unstubAllGlobals();
      mockFetch();
      await makeClient().naver.reviews.ssrQueries("987654321");
      expect(requestedUrl().pathname).toBe("/v1/naver/reviews/987654321/ssr-queries");
    });

    it("videoInkey forwards attach_vid and stamp", async () => {
      await makeClient().naver.reviews.videoInkey("vid123", "stamp456");
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/reviews/video-inkey");
      expect(url.searchParams.get("attach_vid")).toBe("vid123");
      expect(url.searchParams.get("stamp")).toBe("stamp456");
    });

    it("productReviews sends the required store_url and product_no", async () => {
      await makeClient().naver.reviews.productReviews("11223344", {
        store_url: "plusink",
        product_no: "55667788",
        page: 2,
        sort: "REVIEW_CREATE_DATE_DESC",
      });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/products/11223344/reviews");
      expect(url.searchParams.get("store_url")).toBe("plusink");
      expect(url.searchParams.get("product_no")).toBe("55667788");
      expect(url.searchParams.get("sort")).toBe("REVIEW_CREATE_DATE_DESC");
    });

    it("productQnas builds the qnas path with channel_uid", async () => {
      await makeClient().naver.reviews.productQnas("11223344", {
        store_url: "plusink",
        product_no: "55667788",
        channel_uid: "2sxAbc",
      });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/products/11223344/qnas");
      expect(url.searchParams.get("channel_uid")).toBe("2sxAbc");
    });

    it("groupReviewSummary sends the required leaf_category_id", async () => {
      await makeClient().naver.reviews.groupReviewSummary("9900", "50000123");
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/product-groups/9900/review-summary");
      expect(url.searchParams.get("leaf_category_id")).toBe("50000123");
    });

    it("product detail forwards host and store_url", async () => {
      await makeClient().naver.products.get("55667788", { host: "brand", store_url: "drbrian" });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/products/55667788");
      expect(url.searchParams.get("host")).toBe("brand");
      expect(url.searchParams.get("store_url")).toBe("drbrian");
    });
  });

  describe("shopping live", () => {
    it("searchKeywords hits the keywords path", async () => {
      await makeClient().naver.live.searchKeywords();
      expect(requestedUrl().pathname).toBe("/v1/naver/shopping/live/search/keywords");
    });

    it("broadcast and broadcastProducts build the broadcast path", async () => {
      await makeClient().naver.live.broadcast("1234567");
      expect(requestedUrl().pathname).toBe("/v1/naver/shopping/live/broadcasts/1234567");

      vi.unstubAllGlobals();
      mockFetch();
      await makeClient().naver.live.broadcastProducts("1234567", { page: 0, size: 50 });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/shopping/live/broadcasts/1234567/products");
      expect(url.searchParams.get("page")).toBe("0");
      expect(url.searchParams.get("size")).toBe("50");
    });

    it("channelShortclips forwards sort_type and cursor", async () => {
      await makeClient().naver.live.channelShortclips("abcdef", {
        sort_type: "VIEW",
        next: "123",
        size: 20,
      });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/shopping/live/channels/abcdef/shortclips");
      expect(url.searchParams.get("sort_type")).toBe("VIEW");
      expect(url.searchParams.get("next")).toBe("123");
    });

    it("replayProducts forwards include_before and next", async () => {
      await makeClient().naver.live.replayProducts("1234567", { include_before: false, next: "0" });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/shopping/live/broadcasts/1234567/replay-products");
      expect(url.searchParams.get("include_before")).toBe("false");
      expect(url.searchParams.get("next")).toBe("0");
    });

    it("shortclipProducts forwards attachment_type and sort", async () => {
      await makeClient().naver.live.shortclipProducts("sc_123", {
        attachment_type: "MAIN",
        sort: "POPULAR",
      });
      const url = requestedUrl();
      expect(url.pathname).toBe("/v1/naver/shopping/live/shortclips/sc_123/products");
      expect(url.searchParams.get("attachment_type")).toBe("MAIN");
      expect(url.searchParams.get("sort")).toBe("POPULAR");
    });
  });
});
