/**
 * Tests for the Google Play, App Store and Google Ads Transparency clients.
 *
 * These clients are thin path/param mappers over the gateway, so the thing that
 * can silently break is a wrong URL or a mis-spelled query key. Every method is
 * routed through a fetch mock and asserted on both.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import { GooglePlayClient } from "../src/googleplay/client.js";
import { AppStoreClient } from "../src/appstore/client.js";
import { GoogleAdsClient } from "../src/googleads/client.js";

function makeClient(): ScrapeBadger {
  return new ScrapeBadger({
    apiKey: "test-api-key",
    baseUrl: "https://api.scrapebadger.com",
    maxRetries: 0,
  });
}

function mockFetch(body: unknown, status = 200): void {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    })
  );
}

function capturedUrl(): string {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  return (mock.mock.calls[0] as [string, RequestInit])[0];
}

describe("GooglePlayClient", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("is wired onto the top-level client", () => {
    expect(makeClient().googlePlay).toBeInstanceOf(GooglePlayClient);
  });

  it("search() routes to /v1/google-play/search with params", async () => {
    mockFetch({ result_count: 0, apps: [] });
    await makeClient().googlePlay.search("puzzle", { country: "DE", lang: "de", price: "free" });
    const url = capturedUrl();
    expect(url).toContain("/v1/google-play/search");
    expect(url).toContain("query=puzzle");
    expect(url).toContain("country=DE");
    expect(url).toContain("lang=de");
    expect(url).toContain("price=free");
  });

  it("getApp() routes to /v1/google-play/apps/{id} with locale defaults", async () => {
    mockFetch({ app_id: "com.whatsapp" });
    await makeClient().googlePlay.getApp("com.whatsapp");
    const url = capturedUrl();
    expect(url).toContain("/v1/google-play/apps/com.whatsapp");
    expect(url).toContain("country=US");
    expect(url).toContain("lang=en");
  });

  it("getReviews() sends the token as page_token", async () => {
    mockFetch({ app_id: "com.whatsapp", sort: "rating", result_count: 0, reviews: [] });
    await makeClient().googlePlay.getReviews("com.whatsapp", {
      sort: "rating",
      count: 150,
      pageToken: "tok",
    });
    const url = capturedUrl();
    expect(url).toContain("/v1/google-play/apps/com.whatsapp/reviews");
    expect(url).toContain("sort=rating");
    expect(url).toContain("count=150");
    expect(url).toContain("page_token=tok");
  });

  it("getPermissions() and getSimilar() route to their sub-paths", async () => {
    mockFetch({ app_id: "com.whatsapp", result_count: 0, permission_groups: [] });
    await makeClient().googlePlay.getPermissions("com.whatsapp");
    expect(capturedUrl()).toContain("/v1/google-play/apps/com.whatsapp/permissions");

    vi.restoreAllMocks();
    mockFetch({ result_count: 0, apps: [] });
    await makeClient().googlePlay.getSimilar("com.whatsapp");
    expect(capturedUrl()).toContain("/v1/google-play/apps/com.whatsapp/similar");
  });

  it("getDeveloper(), getCollection() and browseCategory() route correctly", async () => {
    mockFetch({ result_count: 0, apps: [] });
    await makeClient().googlePlay.getDeveloper("5700313618786177705");
    expect(capturedUrl()).toContain("/v1/google-play/developers/5700313618786177705");

    vi.restoreAllMocks();
    mockFetch({ result_count: 0, apps: [] });
    await makeClient().googlePlay.getCollection("topgrossing", { category: "GAME" });
    let url = capturedUrl();
    expect(url).toContain("/v1/google-play/collections/topgrossing");
    expect(url).toContain("category=GAME");

    vi.restoreAllMocks();
    mockFetch({ result_count: 0, apps: [] });
    await makeClient().googlePlay.browseCategory("GAME_PUZZLE");
    url = capturedUrl();
    expect(url).toContain("/v1/google-play/categories/GAME_PUZZLE");
  });

  it("listCategories() and listMarkets() route to the reference endpoints", async () => {
    mockFetch({ result_count: 0, categories: [] });
    await makeClient().googlePlay.listCategories();
    expect(capturedUrl()).toContain("/v1/google-play/categories");

    vi.restoreAllMocks();
    mockFetch({ result_count: 0, markets: [], languages: [] });
    await makeClient().googlePlay.listMarkets();
    expect(capturedUrl()).toContain("/v1/google-play/markets");
  });
});

describe("AppStoreClient", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("is wired onto the top-level client", () => {
    expect(makeClient().appStore).toBeInstanceOf(AppStoreClient);
  });

  it("search() routes to /v1/app-store/search with params", async () => {
    mockFetch({ query: "slack", country: "gb", entity: "macSoftware", result_count: 0, apps: [] });
    await makeClient().appStore.search("slack", {
      country: "gb",
      entity: "macSoftware",
      limit: 10,
      offset: 5,
    });
    const url = capturedUrl();
    expect(url).toContain("/v1/app-store/search");
    expect(url).toContain("query=slack");
    expect(url).toContain("country=gb");
    expect(url).toContain("entity=macSoftware");
    expect(url).toContain("offset=5");
  });

  it("getApp() sends include_extras in snake_case", async () => {
    mockFetch({ app_id: 618783545 });
    await makeClient().appStore.getApp("618783545", { includeExtras: false });
    const url = capturedUrl();
    expect(url).toContain("/v1/app-store/apps/618783545");
    expect(url).toContain("include_extras=false");
  });

  it("getReviews() routes to the reviews sub-path", async () => {
    mockFetch({
      app_id: "618783545",
      country: "de",
      page: 2,
      sort: "mostHelpful",
      result_count: 0,
      reviews: [],
    });
    await makeClient().appStore.getReviews("618783545", {
      country: "de",
      page: 2,
      sort: "mostHelpful",
    });
    const url = capturedUrl();
    expect(url).toContain("/v1/app-store/apps/618783545/reviews");
    expect(url).toContain("page=2");
    expect(url).toContain("sort=mostHelpful");
  });

  it("getDeveloper() and charts() route correctly", async () => {
    mockFetch({ country: "us", result_count: 0, apps: [] });
    await makeClient().appStore.getDeveloper("284882218", { limit: 200 });
    let url = capturedUrl();
    expect(url).toContain("/v1/app-store/developers/284882218");
    expect(url).toContain("limit=200");

    vi.restoreAllMocks();
    mockFetch({ country: "us", type: "top-grossing", entity: "ipad", result_count: 0, apps: [] });
    await makeClient().appStore.charts({ type: "top-grossing", genre: 6014, entity: "ipad" });
    url = capturedUrl();
    expect(url).toContain("/v1/app-store/charts");
    expect(url).toContain("type=top-grossing");
    expect(url).toContain("genre=6014");
    expect(url).toContain("entity=ipad");
  });

  it("listGenres() and listMarkets() route to the reference endpoints", async () => {
    mockFetch({ result_count: 0, genres: [] });
    await makeClient().appStore.listGenres();
    expect(capturedUrl()).toContain("/v1/app-store/genres");

    vi.restoreAllMocks();
    mockFetch({ result_count: 0, markets: [] });
    await makeClient().appStore.listMarkets();
    expect(capturedUrl()).toContain("/v1/app-store/markets");
  });
});

describe("GoogleAdsClient", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("is wired onto the top-level client", () => {
    expect(makeClient().googleAds).toBeInstanceOf(GoogleAdsClient);
  });

  it("searchAds() maps camelCase options onto snake_case query keys", async () => {
    mockFetch({ region: "DE", returned_results: 0, creatives: [] });
    await makeClient().googleAds.searchAds({
      query: "tesla.com",
      region: "DE",
      format: "IMAGE",
      startDate: "2026-07-01",
      endDate: "2026-07-31",
      num: 100,
      cursor: "tok",
    });
    const url = capturedUrl();
    expect(url).toContain("/v1/google/ads/search");
    expect(url).toContain("region=DE");
    expect(url).toContain("format=IMAGE");
    expect(url).toContain("start_date=2026-07-01");
    expect(url).toContain("end_date=2026-07-31");
    expect(url).toContain("cursor=tok");
  });

  it("getCreative() sends both ids as query params", async () => {
    mockFetch({ region: "US", variations: [] });
    await makeClient().googleAds.getCreative("AR01", "CR02", { political: true });
    const url = capturedUrl();
    expect(url).toContain("/v1/google/ads/creative");
    expect(url).toContain("advertiser_id=AR01");
    expect(url).toContain("creative_id=CR02");
    expect(url).toContain("political=true");
  });

  it("searchAdvertisers() and getAdvertiser() route correctly", async () => {
    mockFetch({ query: "tesla", region: "US", advertisers: [] });
    await makeClient().googleAds.searchAdvertisers("tesla", { num: 20 });
    let url = capturedUrl();
    expect(url).toContain("/v1/google/ads/advertisers");
    expect(url).toContain("num=20");

    vi.restoreAllMocks();
    mockFetch({ advertiser_id: "AR01", region: "US", ad_mix: [], spend_by_date: [] });
    await makeClient().googleAds.getAdvertiser("AR01", { startDate: "2026-07-01" });
    url = capturedUrl();
    expect(url).toContain("/v1/google/ads/advertiser");
    expect(url).toContain("advertiser_id=AR01");
    expect(url).toContain("start_date=2026-07-01");
  });
});
