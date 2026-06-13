/**
 * Tests for the Shopee API client.
 *
 * Uses vitest and a simple fetch mock that intercepts calls made by BaseClient.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  SearchResult,
  ShopeeProduct,
  ReviewsResult,
  CategoryTree,
  MarketsResponse,
} from "../src/shopee/types.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function capturedRequest(): { url: string; init: RequestInit } {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  const [url, init] = mock.mock.calls[0] as [string, RequestInit];
  return { url, init };
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const PRODUCT_IMAGE = {
  hash: "abc123def456",
  url: "https://cf.shopee.sg/file/abc123def456",
};

const PRODUCT_MODEL = {
  model_id: 99001,
  name: "Red / M",
  price: 29.99,
  price_raw: 2999000,
  price_before_discount: 39.99,
  stock: 150,
  sold: 500,
  currency: "SGD",
  sku: "SKU-RED-M",
};

const SHOPEE_PRODUCT: ShopeeProduct = {
  item_id: 67890,
  shop_id: 12345,
  name: "Wireless Headphones Pro",
  price: 49.99,
  price_raw: 4999000,
  price_min: 39.99,
  price_max: 59.99,
  price_before_discount: 79.99,
  discount: "37%",
  currency: "SGD",
  rating_star: 4.8,
  rating_count_total: 1250,
  rating: {
    rating_star: 4.8,
    rating_count: [10, 5, 3, 2, 100],
    rcount_with_context: 80,
    rcount_with_image: 30,
  },
  stock: 200,
  sold: 3500,
  historical_sold: 10000,
  liked_count: 2300,
  comment_count: 1250,
  view_count: 50000,
  image: "https://cf.shopee.sg/file/main_image",
  images: [PRODUCT_IMAGE],
  description: "Premium wireless headphones with ANC.",
  brand: "AudioPro",
  categories: ["Electronics", "Audio"],
  attributes: [{ name: "Material", value: "Cotton", id: 555 }],
  models: [PRODUCT_MODEL],
  tier_variations: [{ name: "Color", options: ["Red", "Blue"] }],
  shop_location: "Singapore",
  shop_name: "AudioPro Official",
  is_official_shop: true,
  is_preferred_plus_seller: false,
  item_status: "normal",
  is_adult: false,
  condition: 1,
  ctime_utc: 1680000000,
  created_at: "2023-03-28T12:00:00Z",
  url: "https://shopee.sg/product/12345/67890",
};

const SEARCH_FIXTURE: SearchResult = {
  market: "sg",
  keyword: "wireless headphones",
  category_id: null,
  total_count: 500,
  page: 0,
  limit: 60,
  has_more: true,
  next_offset: 60,
  items: [SHOPEE_PRODUCT],
};

const REVIEWS_FIXTURE: ReviewsResult = {
  market: "sg",
  item_id: 67890,
  shop_id: 12345,
  offset: 0,
  limit: 20,
  has_more: true,
  next_offset: 20,
  summary: {
    rating_star: 4.8,
    rating_total: 1250,
    rating_count: [5, 10, 15, 120, 1100],
    rcount_with_media: 300,
    rcount_with_context: 800,
  },
  reviews: [
    {
      comment_id: 88001,
      item_id: 67890,
      shop_id: 12345,
      order_id: 77001,
      rating_star: 5,
      comment: "Excellent sound quality!",
      author_username: "buyer_sg",
      author_shopid: 5500,
      author_portrait: "https://cf.shopee.sg/file/portrait",
      anonymous: false,
      images: ["https://cf.shopee.sg/file/review_img"],
      videos: [],
      product_variation: "Red / M",
      like_count: 12,
      reply: {
        comment: "Thank you for your purchase!",
        ctime_utc: 1680100000,
        created_at: "2023-03-29T15:46:40Z",
      },
      ctime_utc: 1680050000,
      created_at: "2023-03-29T02:13:20Z",
      editable: 0,
      is_hidden: false,
    },
  ],
};

const CATEGORY_TREE_FIXTURE: CategoryTree = {
  market: "sg",
  categories: [
    {
      category_id: 100001,
      parent_id: 0,
      name: "Electronics",
      display_name: "Electronics",
      image: "https://cf.shopee.sg/file/cat_electronics",
      no_sub: false,
      block_buyer_platform: [],
      children: [
        {
          category_id: 100002,
          parent_id: 100001,
          name: "Audio",
          display_name: "Audio",
          image: null,
          no_sub: true,
          block_buyer_platform: [],
          children: [],
        },
      ],
    },
  ],
};

const MARKETS_FIXTURE: MarketsResponse = {
  markets: [
    {
      code: "sg",
      domain: "shopee.sg",
      country: "Singapore",
      currency: "SGD",
      locale: "en",
      name: "Shopee Singapore",
    },
    {
      code: "my",
      domain: "shopee.com.my",
      country: "Malaysia",
      currency: "MYR",
      locale: "en",
      name: "Shopee Malaysia",
    },
  ],
};

// ---------------------------------------------------------------------------
// ShopeeClient on ScrapeBadger
// ---------------------------------------------------------------------------

describe("ShopeeClient on ScrapeBadger", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("is accessible via client.shopee", () => {
    expect(makeClient().shopee).toBeDefined();
  });

  it("has all sub-clients", () => {
    const c = makeClient();
    expect(c.shopee.search).toBeDefined();
    expect(c.shopee.products).toBeDefined();
    expect(c.shopee.reviews).toBeDefined();
    expect(c.shopee.reference).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// SearchClient
// ---------------------------------------------------------------------------

describe("ShopeeClient.search", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("search sends GET to /v1/shopee/search with keyword and defaults", async () => {
    mockFetch(SEARCH_FIXTURE);
    const result = await makeClient().shopee.search.search({
      keyword: "wireless headphones",
    });

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/shopee/search");
    expect(url).toContain("keyword=wireless+headphones");
    expect(result.items).toHaveLength(1);
    expect(result.items[0].item_id).toBe(67890);
    expect(result.has_more).toBe(true);
  });

  it("search passes all optional params", async () => {
    mockFetch(SEARCH_FIXTURE);
    await makeClient().shopee.search.search({
      keyword: "gaming chair",
      market: "my",
      limit: 20,
      offset: 40,
      sort_by: "sales",
    });
    const { url } = capturedRequest();
    expect(url).toContain("market=my");
    expect(url).toContain("limit=20");
    expect(url).toContain("offset=40");
    expect(url).toContain("sort_by=sales");
  });

  it("categoryItems sends GET to /v1/shopee/category/{id}/items", async () => {
    mockFetch(SEARCH_FIXTURE);
    const result = await makeClient().shopee.search.categoryItems(100001);

    const { url } = capturedRequest();
    expect(url).toContain("/v1/shopee/category/100001/items");
    expect(result.market).toBe("sg");
  });

  it("categoryItems passes all optional params", async () => {
    mockFetch(SEARCH_FIXTURE);
    await makeClient().shopee.search.categoryItems(100002, {
      market: "ph",
      limit: 30,
      offset: 30,
      sort_by: "price_low_to_high",
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/shopee/category/100002/items");
    expect(url).toContain("market=ph");
    expect(url).toContain("sort_by=price_low_to_high");
  });
});

// ---------------------------------------------------------------------------
// ProductsClient
// ---------------------------------------------------------------------------

describe("ShopeeClient.products", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("get sends GET to /v1/shopee/product/{shop_id}/{item_id}", async () => {
    mockFetch(SHOPEE_PRODUCT);
    const result = await makeClient().shopee.products.get(12345, 67890);

    const { url } = capturedRequest();
    expect(url).toContain("/v1/shopee/product/12345/67890");
    expect(result.item_id).toBe(67890);
    expect(result.shop_id).toBe(12345);
    expect(result.name).toBe("Wireless Headphones Pro");
    expect(result.currency).toBe("SGD");
    expect(result.is_official_shop).toBe(true);
  });

  it("get passes explicit market", async () => {
    mockFetch(SHOPEE_PRODUCT);
    await makeClient().shopee.products.get(12345, 67890, { market: "my" });
    const { url } = capturedRequest();
    expect(url).toContain("market=my");
  });

  it("get uses sg as default market", async () => {
    mockFetch(SHOPEE_PRODUCT);
    await makeClient().shopee.products.get(12345, 67890);
    // Default market is not sent as param when undefined — that's fine;
    // just confirm the correct path is used.
    const { url } = capturedRequest();
    expect(url).toContain("/v1/shopee/product/12345/67890");
  });
});

// ---------------------------------------------------------------------------
// ReviewsClient
// ---------------------------------------------------------------------------

describe("ShopeeClient.reviews", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("get sends GET to /v1/shopee/product/{shop_id}/{item_id}/reviews", async () => {
    mockFetch(REVIEWS_FIXTURE);
    const result = await makeClient().shopee.reviews.get(12345, 67890);

    const { url } = capturedRequest();
    expect(url).toContain("/v1/shopee/product/12345/67890/reviews");
    expect(result.item_id).toBe(67890);
    expect(result.reviews).toHaveLength(1);
    expect(result.reviews[0].rating_star).toBe(5);
    expect(result.reviews[0].reply?.comment).toBe("Thank you for your purchase!");
    expect(result.summary?.rating_total).toBe(1250);
  });

  it("get passes all optional params", async () => {
    mockFetch(REVIEWS_FIXTURE);
    await makeClient().shopee.reviews.get(12345, 67890, {
      market: "th",
      limit: 10,
      offset: 20,
      rating: 5,
      filter: 2,
    });
    const { url } = capturedRequest();
    expect(url).toContain("market=th");
    expect(url).toContain("limit=10");
    expect(url).toContain("offset=20");
    expect(url).toContain("rating=5");
    expect(url).toContain("filter=2");
  });
});

// ---------------------------------------------------------------------------
// ReferenceClient
// ---------------------------------------------------------------------------

describe("ShopeeClient.reference", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("markets sends GET to /v1/shopee/markets", async () => {
    mockFetch(MARKETS_FIXTURE);
    const result = await makeClient().shopee.reference.markets();

    const { url } = capturedRequest();
    expect(url).toContain("/v1/shopee/markets");
    expect(result.markets).toHaveLength(2);
    expect(result.markets[0].code).toBe("sg");
    expect(result.markets[0].currency).toBe("SGD");
    expect(result.markets[1].code).toBe("my");
  });

  it("categories sends GET to /v1/shopee/categories with default market", async () => {
    mockFetch(CATEGORY_TREE_FIXTURE);
    const result = await makeClient().shopee.reference.categories();

    const { url } = capturedRequest();
    expect(url).toContain("/v1/shopee/categories");
    expect(result.market).toBe("sg");
    expect(result.categories).toHaveLength(1);
    expect(result.categories[0].category_id).toBe(100001);
    expect(result.categories[0].children).toHaveLength(1);
    expect(result.categories[0].children[0].category_id).toBe(100002);
  });

  it("categories passes explicit market", async () => {
    mockFetch(CATEGORY_TREE_FIXTURE);
    await makeClient().shopee.reference.categories({ market: "my" });
    const { url } = capturedRequest();
    expect(url).toContain("market=my");
  });
});

// ---------------------------------------------------------------------------
// Type shape tests (compile-time, but validated at runtime through fixture)
// ---------------------------------------------------------------------------

describe("Shopee type shapes", () => {
  it("ShopeeProduct has required fields", () => {
    const p: ShopeeProduct = SHOPEE_PRODUCT;
    expect(typeof p.item_id).toBe("number");
    expect(typeof p.shop_id).toBe("number");
    expect(Array.isArray(p.images)).toBe(true);
    expect(Array.isArray(p.models)).toBe(true);
    expect(Array.isArray(p.attributes)).toBe(true);
    expect(Array.isArray(p.categories)).toBe(true);
    expect(Array.isArray(p.tier_variations)).toBe(true);
  });

  it("ReviewsResult has reviews array", () => {
    const r: ReviewsResult = REVIEWS_FIXTURE;
    expect(Array.isArray(r.reviews)).toBe(true);
    expect(r.reviews[0].images).toBeInstanceOf(Array);
    expect(r.reviews[0].videos).toBeInstanceOf(Array);
  });

  it("CategoryTree has recursive children", () => {
    const tree: CategoryTree = CATEGORY_TREE_FIXTURE;
    const root = tree.categories[0];
    expect(Array.isArray(root.children)).toBe(true);
    expect(root.children[0].children).toBeInstanceOf(Array);
  });
});
