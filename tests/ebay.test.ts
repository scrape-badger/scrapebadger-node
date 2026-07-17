/**
 * Tests for the eBay API client.
 *
 * Uses vitest and a simple fetch mock that intercepts calls made by BaseClient.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  EbaySearchResponse,
  EbayItemDetailResponse,
  EbayReviewsResponse,
  EbaySellerProfileResponse,
  EbaySellerItemsResponse,
  EbaySellerFeedbackResponse,
  EbayCategoryResponse,
  EbayAutocompleteResponse,
  EbayMarketsResponse,
  EbayCategoriesResponse,
} from "../src/ebay/index.js";

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

const PRICE = { value: 29.99, currency: "USD", symbol: "$", raw: "$29.99" };

const PAGINATION = {
  current_page: 1,
  per_page: 60,
  total_pages: 20,
  total_results: 400,
};

const SEARCH_RESULT = {
  position: 1,
  item_id: "123456789012",
  product_id: "987654321",
  title: "Nintendo Switch OLED",
  url: "https://www.ebay.com/itm/123456789012",
  image: "https://i.ebayimg.com/abc.jpg",
  price: PRICE,
  original_price: { value: 49.99, currency: "USD", symbol: "$", raw: "$49.99" },
  discount_percent: 40,
  currency: "USD",
  condition: "new",
  brand: "Nintendo",
  buying_format: "Buy It Now",
  is_auction: false,
  bids: null,
  time_left: null,
  current_bid: null,
  shipping: "Free shipping",
  shipping_cost: null,
  free_shipping: true,
  location: "United States",
  returns: "30 days",
  sold_count: 120,
  sold_date: null,
  sold_date_at: null,
  watchers: 30,
  coupon: null,
  rating: 4.8,
  ratings_total: 50,
  seller_name: "musicmagpie",
  seller_feedback_percent: 99.5,
  seller_feedback_score: 100000,
  program_badge: "eBay Refurbished",
  is_sponsored: false,
};

const SEARCH_FIXTURE: EbaySearchResponse = {
  query: "nintendo switch",
  domain: "com",
  category_id: null,
  sold: false,
  results: [SEARCH_RESULT],
  facets: { condition: ["new", "used"] },
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-21T00:00:00Z",
};

const COMPLETED_FIXTURE: EbaySearchResponse = {
  ...SEARCH_FIXTURE,
  sold: true,
  results: [{ ...SEARCH_RESULT, sold_date: "2 Jul 2026", sold_date_at: "2026-07-02" }],
};

const ITEM_FIXTURE: EbayItemDetailResponse = {
  domain: "com",
  item: {
    item_id: "123456789012",
    product_id: "987654321",
    legacy_item_id: "123456789012",
    title: "Nintendo Switch OLED",
    subtitle: "Brand new sealed",
    url: "https://www.ebay.com/itm/123456789012",
    condition: "new",
    condition_id: "1000",
    condition_description: "Brand New",
    price: PRICE,
    original_price: null,
    discount_percent: null,
    currency: "USD",
    availability: "In stock",
    quantity_available: 10,
    quantity_sold: 120,
    watchers: 30,
    buying_format: "Buy It Now",
    is_auction: false,
    bids: null,
    time_left: null,
    current_bid: null,
    end_time_utc: null,
    end_time_at: null,
    buy_it_now_price: PRICE,
    best_offer_enabled: true,
    brand: "Nintendo",
    mpn: "HEGSKAAAA",
    model: "Switch OLED",
    color: "White",
    gtin: "0045496882174",
    main_image: "https://i.ebayimg.com/main.jpg",
    images: [{ url: "https://i.ebayimg.com/1.jpg", width: 500, height: 500 }],
    images_count: 1,
    description: "A great console.",
    seller_notes: null,
    item_specifics: { Platform: "Nintendo Switch" },
    categories: ["Video Games & Consoles"],
    category_id: "139971",
    shipping_options: [
      {
        cost: null,
        is_free: true,
        service: "Standard Shipping",
        destination_country: "US",
        delivery_estimate: "3-5 business days",
      },
    ],
    shipping_cost: null,
    free_shipping: true,
    item_location: "United States",
    ships_to: ["United States", "Canada"],
    returns: {
      accepted: true,
      period: "30 days",
      cost_paid_by: "buyer",
      raw: "30 day returns. Buyer pays return shipping.",
    },
    seller: {
      username: "musicmagpie",
      url: "https://www.ebay.com/usr/musicmagpie",
      feedback_score: 100000,
      feedback_percent: 99.5,
      store_name: "musicMagpie",
      store_url: "https://www.ebay.com/str/musicmagpie",
    },
    rating: 4.8,
    ratings_total: 50,
    date_modified_utc: 1751400000,
    date_modified_at: "2026-06-20T00:00:00Z",
    scraped_utc: 1751500000,
    scraped_at: "2026-06-21T00:00:00Z",
  },
};

const REVIEWS_FIXTURE: EbayReviewsResponse = {
  domain: "com",
  item_id: "123456789012",
  product_id: "987654321",
  rating: 4.8,
  ratings_total: 50,
  histogram: {
    five_star: 40,
    four_star: 6,
    three_star: 2,
    two_star: 1,
    one_star: 1,
  },
  reviews: [
    {
      title: "Excellent",
      body: "Works perfectly.",
      rating: 5,
      author: "buyer123",
      date_raw: "June 1, 2026",
      date_utc: 1751328000,
      date_at: "2026-06-01T00:00:00Z",
      helpful_votes: 12,
      verified_purchase: true,
    },
  ],
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-21T00:00:00Z",
};

const SELLER_PROFILE_FIXTURE: EbaySellerProfileResponse = {
  domain: "com",
  seller: {
    username: "musicmagpie",
    url: "https://www.ebay.com/usr/musicmagpie",
    store_name: "musicMagpie",
    store_url: "https://www.ebay.com/str/musicmagpie",
    feedback_score: 100000,
    feedback_percent: 99.5,
    member_since: "January 1, 2010",
    location: "United Kingdom",
    items_for_sale: 5000,
    feedback_12mo: { positive: 9800, neutral: 100, negative: 100 },
    top_rated: true,
    scraped_utc: 1751500000,
    scraped_at: "2026-06-21T00:00:00Z",
  },
};

const SELLER_ITEMS_FIXTURE: EbaySellerItemsResponse = {
  domain: "com",
  username: "musicmagpie",
  results: [SEARCH_RESULT],
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-21T00:00:00Z",
};

const SELLER_FEEDBACK_FIXTURE: EbaySellerFeedbackResponse = {
  domain: "com",
  username: "musicmagpie",
  feedback: [
    {
      rating: "positive",
      comment: "Fast shipping",
      rater: "buyer123",
      item: "Nintendo Switch OLED",
      date_raw: "June 1, 2026",
      date_utc: 1751328000,
      date_at: "2026-06-01T00:00:00Z",
    },
  ],
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-21T00:00:00Z",
};

const CATEGORY_FIXTURE: EbayCategoryResponse = {
  domain: "com",
  category_id: "9355",
  results: [SEARCH_RESULT],
  facets: {},
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-21T00:00:00Z",
};

const AUTOCOMPLETE_FIXTURE: EbayAutocompleteResponse = {
  query: "ipho",
  domain: "com",
  suggestions: [{ value: "iphone 15" }, { value: "iphone 14 pro" }],
};

const MARKETS_FIXTURE: EbayMarketsResponse = {
  markets: [
    {
      code: "US",
      domain: "com",
      country: "United States",
      currency: "USD",
      locale: "en-US",
      name: "eBay US",
      site_id: 0,
    },
  ],
};

const CATEGORIES_FIXTURE: EbayCategoriesResponse = {
  categories: [
    { name: "Electronics", category_id: "293", parent: null },
    { name: "Cell Phones", category_id: "15032", parent: "Electronics" },
  ],
};

// ---------------------------------------------------------------------------
// EbayClient on ScrapeBadger
// ---------------------------------------------------------------------------

describe("EbayClient on ScrapeBadger", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("is accessible via client.ebay", () => {
    expect(makeClient().ebay).toBeDefined();
  });

  it("has all sub-clients", () => {
    const c = makeClient();
    expect(c.ebay.search).toBeDefined();
    expect(c.ebay.items).toBeDefined();
    expect(c.ebay.sellers).toBeDefined();
    expect(c.ebay.categories).toBeDefined();
    expect(c.ebay.reference).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// SearchClient
// ---------------------------------------------------------------------------

describe("EbayClient.search", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("search sends GET to /v1/ebay/search with query", async () => {
    mockFetch(SEARCH_FIXTURE);
    const result = await makeClient().ebay.search.search({
      query: "nintendo switch",
    });

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/ebay/search");
    expect(url).toContain("query=nintendo+switch");
    expect(result.results).toHaveLength(1);
    expect(result.results[0].item_id).toBe("123456789012");
    expect(result.results[0].current_bid).toBeNull();
    expect(result.sold).toBe(false);
    expect(result.facets.condition).toContain("new");
  });

  it("passes all optional search params", async () => {
    mockFetch(SEARCH_FIXTURE);
    await makeClient().ebay.search.search({
      query: "laptop",
      domain: "de",
      category_id: "175672",
      page: 2,
      per_page: 120,
      sort_by: "price_low_to_high",
      condition: "used",
      buying_format: "auction",
      min_price: 100,
      max_price: 500,
      free_shipping: true,
    });
    const { url } = capturedRequest();
    expect(url).toContain("domain=de");
    expect(url).toContain("category_id=175672");
    expect(url).toContain("page=2");
    expect(url).toContain("per_page=120");
    expect(url).toContain("sort_by=price_low_to_high");
    expect(url).toContain("condition=used");
    expect(url).toContain("buying_format=auction");
    expect(url).toContain("min_price=100");
    expect(url).toContain("max_price=500");
    expect(url).toContain("free_shipping=true");
  });

  it("completed sends GET to /v1/ebay/completed and returns sold results", async () => {
    mockFetch(COMPLETED_FIXTURE);
    const result = await makeClient().ebay.search.completed({
      query: "nintendo switch",
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/ebay/completed");
    expect(result.sold).toBe(true);
    expect(result.results[0].sold_date).toBe("2 Jul 2026");
    expect(result.results[0].sold_date_at).toBe("2026-07-02");
  });

  it("autocomplete sends GET to /v1/ebay/autocomplete", async () => {
    mockFetch(AUTOCOMPLETE_FIXTURE);
    const result = await makeClient().ebay.search.autocomplete("ipho", {
      domain: "co.uk",
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/ebay/autocomplete");
    expect(url).toContain("query=ipho");
    expect(url).toContain("domain=co.uk");
    expect(result.suggestions).toHaveLength(2);
    expect(result.suggestions[0].value).toBe("iphone 15");
  });
});

// ---------------------------------------------------------------------------
// ItemsClient
// ---------------------------------------------------------------------------

describe("EbayClient.items", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("get sends GET to /v1/ebay/items/{itemId}", async () => {
    mockFetch(ITEM_FIXTURE);
    const result = await makeClient().ebay.items.get("123456789012", {
      domain: "de",
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/ebay/items/123456789012");
    expect(url).not.toContain("/reviews");
    expect(url).toContain("domain=de");
    expect(result.item.item_id).toBe("123456789012");
    expect(result.item.seller?.username).toBe("musicmagpie");
    expect(result.item.returns?.accepted).toBe(true);
    expect(result.item.current_bid).toBeNull();
    expect(result.item.end_time_utc).toBeNull();
    expect(result.item.end_time_at).toBeNull();
    expect(result.item.buy_it_now_price?.raw).toBe("$29.99");
  });

  it("reviews sends GET to /v1/ebay/items/{itemId}/reviews with productId", async () => {
    mockFetch(REVIEWS_FIXTURE);
    const result = await makeClient().ebay.items.reviews("123456789012", {
      page: 2,
      productId: "987654321",
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/ebay/items/123456789012/reviews");
    expect(url).toContain("page=2");
    expect(url).toContain("product_id=987654321");
    expect(result.reviews[0].rating).toBe(5);
    expect(result.histogram?.five_star).toBe(40);
  });
});

// ---------------------------------------------------------------------------
// SellersClient
// ---------------------------------------------------------------------------

describe("EbayClient.sellers", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("get sends GET to /v1/ebay/sellers/{username}", async () => {
    mockFetch(SELLER_PROFILE_FIXTURE);
    const result = await makeClient().ebay.sellers.get("musicmagpie");
    const { url } = capturedRequest();
    expect(url).toContain("/v1/ebay/sellers/musicmagpie");
    expect(url).not.toContain("/items");
    expect(url).not.toContain("/feedback");
    expect(result.seller.username).toBe("musicmagpie");
    expect(result.seller.feedback_12mo?.positive).toBe(9800);
  });

  it("items sends GET to /v1/ebay/sellers/{username}/items", async () => {
    mockFetch(SELLER_ITEMS_FIXTURE);
    const result = await makeClient().ebay.sellers.items("musicmagpie", {
      query: "switch",
      page: 3,
      per_page: 240,
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/ebay/sellers/musicmagpie/items");
    expect(url).toContain("query=switch");
    expect(url).toContain("page=3");
    expect(url).toContain("per_page=240");
    expect(result.results).toHaveLength(1);
  });

  it("feedback sends GET to /v1/ebay/sellers/{username}/feedback", async () => {
    mockFetch(SELLER_FEEDBACK_FIXTURE);
    const result = await makeClient().ebay.sellers.feedback("musicmagpie", {
      page: 2,
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/ebay/sellers/musicmagpie/feedback");
    expect(url).toContain("page=2");
    expect(result.feedback[0].rating).toBe("positive");
  });
});

// ---------------------------------------------------------------------------
// CategoriesClient
// ---------------------------------------------------------------------------

describe("EbayClient.categories", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("browse sends GET to /v1/ebay/categories/{id}/items", async () => {
    mockFetch(CATEGORY_FIXTURE);
    const result = await makeClient().ebay.categories.browse("9355", {
      sort_by: "newly_listed",
      min_price: 10,
      max_price: 100,
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/ebay/categories/9355/items");
    expect(url).toContain("sort_by=newly_listed");
    expect(url).toContain("min_price=10");
    expect(url).toContain("max_price=100");
    expect(result.category_id).toBe("9355");
  });

  it("list sends GET to /v1/ebay/categories", async () => {
    mockFetch(CATEGORIES_FIXTURE);
    const result = await makeClient().ebay.categories.list();
    const { url } = capturedRequest();
    expect(url).toBe("https://api.scrapebadger.com/v1/ebay/categories");
    expect(result.categories[0].category_id).toBe("293");
    expect(result.categories[1].parent).toBe("Electronics");
  });
});

// ---------------------------------------------------------------------------
// ReferenceClient
// ---------------------------------------------------------------------------

describe("EbayClient.reference", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("markets sends GET to /v1/ebay/markets", async () => {
    mockFetch(MARKETS_FIXTURE);
    const result = await makeClient().ebay.reference.markets();
    const { url } = capturedRequest();
    expect(url).toBe("https://api.scrapebadger.com/v1/ebay/markets");
    expect(result.markets[0].code).toBe("US");
    expect(result.markets[0].site_id).toBe(0);
  });
});
