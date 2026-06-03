/**
 * Tests for the Amazon API client.
 *
 * Uses vitest and a simple fetch mock that intercepts calls made by BaseClient.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  SearchResponse,
  ProductDetailResponse,
  OffersResponse,
  ReviewsResponse,
  BestsellersResponse,
  NewReleasesResponse,
  DealsResponse,
  CategoryResponse,
  SellerProfileResponse,
  SellerProductsResponse,
  SellerFeedbackResponse,
  AutocompleteResponse,
  MarketsResponse,
  CategoriesResponse,
} from "../src/amazon/types.js";

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

const SEARCH_RESULT = {
  position: 1,
  asin: "B08N5WRWNW",
  title: "Echo Dot (4th Gen)",
  link: "https://www.amazon.com/dp/B08N5WRWNW",
  image: "https://m.media-amazon.com/images/I/abc.jpg",
  price: PRICE,
  list_price: { value: 49.99, currency: "USD", symbol: "$", raw: "$49.99" },
  unit_price: null,
  rating: 4.7,
  ratings_total: 123456,
  is_prime: true,
  is_sponsored: false,
  is_amazons_choice: true,
  is_best_seller: false,
  bought_past_month: "10K+ bought in past month",
  coupon: "Save 5%",
  availability: "In Stock",
};

const PAGINATION = { current_page: 1, total_pages: 20, total_results: 400 };

const SEARCH_FIXTURE: SearchResponse = {
  query: "echo dot",
  domain: "com",
  results: [SEARCH_RESULT],
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-03T00:00:00Z",
};

const PRODUCT_FIXTURE: ProductDetailResponse = {
  domain: "com",
  product: {
    asin: "B08N5WRWNW",
    parent_asin: "B08N5KWB9H",
    title: "Echo Dot (4th Gen)",
    link: "https://www.amazon.com/dp/B08N5WRWNW",
    brand: "Amazon",
    manufacturer: "Amazon",
    model_number: "B7W64E",
    price: PRICE,
    list_price: { value: 49.99, currency: "USD", symbol: "$", raw: "$49.99" },
    savings_amount: { value: 20, currency: "USD", symbol: "$", raw: "$20.00" },
    discount_percent: 40,
    rating: 4.7,
    ratings_total: 123456,
    rating_breakdown: {
      five_star: 80,
      four_star: 10,
      three_star: 5,
      two_star: 3,
      one_star: 2,
    },
    bought_past_month: "10K+ bought in past month",
    in_stock: true,
    availability: "In Stock",
    feature_bullets: ["Meet Echo Dot"],
    description: "Our most popular smart speaker.",
    main_image: "https://m.media-amazon.com/images/I/main.jpg",
    images: ["https://m.media-amazon.com/images/I/1.jpg"],
    images_count: 1,
    videos: [],
    videos_count: 0,
    has_aplus_content: true,
    variants: [
      {
        asin: "B08N5WRWNW",
        attributes: { Color: "Charcoal" },
        price: PRICE,
        is_current: true,
      },
    ],
    variant_asins: ["B08N5WRWNW", "B08N5KWB9H"],
    categories: ["Electronics"],
    bestsellers_rank: [{ rank: 1, category: "Smart Speakers", link: "https://example.com/bsr" }],
    attributes: { Connectivity: "Wi-Fi" },
    specifications: { Weight: "0.75 lb" },
    dimensions: "3.9 x 3.9 x 3.5 inches",
    weight: "0.75 lb",
    first_available: "October 22, 2020",
    country_of_origin: "China",
    buybox: {
      seller_name: "Amazon.com",
      seller_id: "ATVPDKIKX0DER",
      price: PRICE,
      fulfillment: "Ships from and sold by Amazon.com",
    },
    sold_by: "Amazon.com",
    ships_from: "Amazon.com",
    fulfilled_by: "Amazon",
    is_amazon_seller: true,
    badges: {
      amazons_choice: true,
      amazons_choice_keyword: "echo dot",
      best_seller: false,
      prime: true,
      climate_pledge_friendly: true,
    },
    coupon: { text: "Save 5%", discount: "5%" },
    deal: { type: "lightning", price: PRICE, ends_at: "2026-06-04T00:00:00Z" },
    delivery: { message: "FREE delivery", date: "Tomorrow", is_free: true },
    frequently_bought_together: [],
    also_bought: [],
    answered_questions: 42,
    scraped_utc: 1751500000,
    scraped_at: "2026-06-03T00:00:00Z",
  },
};

const OFFER = {
  position: 1,
  seller: {
    name: "Amazon.com",
    id: "ATVPDKIKX0DER",
    link: "https://www.amazon.com/sp?seller=ATVPDKIKX0DER",
    rating: 4.8,
    ratings_total: 1000000,
    ratings_percentage_positive: 98,
  },
  price: PRICE,
  condition: { is_new: true, title: "New", comments: null },
  delivery: {
    is_free: true,
    fulfilled_by_amazon: true,
    date: "Tomorrow",
    price: null,
  },
  buybox_winner: true,
  is_prime: true,
  minimum_order_quantity: 1,
  maximum_order_quantity: 30,
};

const OFFERS_FIXTURE: OffersResponse = {
  asin: "B08N5WRWNW",
  domain: "com",
  buybox: OFFER,
  offers: [OFFER],
  total_offers: 1,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-03T00:00:00Z",
};

const REVIEWS_FIXTURE: ReviewsResponse = {
  asin: "B08N5WRWNW",
  domain: "com",
  reviews: [
    {
      id: "R1ABCDEF",
      title: "Great speaker",
      body: "Works perfectly.",
      rating: 5,
      date_raw: "Reviewed in the United States on June 1, 2026",
      date_utc: 1751328000,
      date_at: "2026-06-01T00:00:00Z",
      review_country: "United States",
      is_global_review: false,
      profile: {
        name: "Jane",
        link: "https://www.amazon.com/profile/x",
        id: "AXYZ",
        image: "https://m.media-amazon.com/images/I/jane.jpg",
      },
      verified_purchase: true,
      vine_program: false,
      helpful_votes: 12,
      variant: "Charcoal",
      images: ["https://m.media-amazon.com/images/I/review.jpg"],
    },
  ],
  rating: 4.7,
  ratings_total: 123456,
  rating_breakdown: {
    five_star: 80,
    four_star: 10,
    three_star: 5,
    two_star: 3,
    one_star: 2,
  },
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-03T00:00:00Z",
};

const BESTSELLER = {
  rank: 1,
  position: 1,
  asin: "B08N5WRWNW",
  title: "Echo Dot (4th Gen)",
  link: "https://www.amazon.com/dp/B08N5WRWNW",
  image: "https://m.media-amazon.com/images/I/abc.jpg",
  rating: 4.7,
  ratings_total: 123456,
  price: PRICE,
};

const BESTSELLERS_FIXTURE: BestsellersResponse = {
  domain: "com",
  category: "electronics",
  bestsellers: [BESTSELLER],
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-03T00:00:00Z",
};

const NEW_RELEASES_FIXTURE: NewReleasesResponse = {
  domain: "com",
  category: "books",
  new_releases: [BESTSELLER],
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-03T00:00:00Z",
};

const DEALS_FIXTURE: DealsResponse = {
  domain: "com",
  category: null,
  deals: [
    {
      position: 1,
      asin: "B08N5WRWNW",
      title: "Echo Dot (4th Gen)",
      link: "https://www.amazon.com/dp/B08N5WRWNW",
      image: "https://m.media-amazon.com/images/I/abc.jpg",
      deal_price: PRICE,
      list_price: { value: 49.99, currency: "USD", symbol: "$", raw: "$49.99" },
      discount_percent: 40,
      deal_type: "Lightning Deal",
      is_lightning_deal: true,
      badge: "Limited time deal",
      ends_at_utc: 1751500000,
      ends_at: "2026-06-04T00:00:00Z",
    },
  ],
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-03T00:00:00Z",
};

const CATEGORY_FIXTURE: CategoryResponse = {
  domain: "com",
  node: "172282",
  results: [SEARCH_RESULT],
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-03T00:00:00Z",
};

const SELLER_PROFILE_FIXTURE: SellerProfileResponse = {
  domain: "com",
  seller: {
    seller_id: "A2L77EE7U53NWQ",
    name: "Amazon Warehouse",
    link: "https://www.amazon.com/sp?seller=A2L77EE7U53NWQ",
    rating: 4.6,
    ratings_total: 500000,
    ratings_percentage_positive: 95,
    feedback: {
      lifetime: { positive: 95, neutral: 3, negative: 2, count: 500000 },
      "12mo": { positive: 96, neutral: 2, negative: 2, count: 100000 },
      "90d": { positive: 97, neutral: 2, negative: 1, count: 30000 },
      "30d": { positive: 98, neutral: 1, negative: 1, count: 10000 },
    },
    business_name: "Amazon.com Services LLC",
    business_address: "410 Terry Ave N, Seattle, WA",
    member_since: "January 1, 2000",
  },
};

const SELLER_PRODUCTS_FIXTURE: SellerProductsResponse = {
  domain: "com",
  seller_id: "A2L77EE7U53NWQ",
  products: [SEARCH_RESULT],
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-03T00:00:00Z",
};

const SELLER_FEEDBACK_FIXTURE: SellerFeedbackResponse = {
  domain: "com",
  seller_id: "A2L77EE7U53NWQ",
  feedback: [
    {
      rating: 5,
      comment: "Fast shipping",
      rater: "buyer123",
      date_raw: "June 1, 2026",
      date_utc: 1751328000,
      date_at: "2026-06-01T00:00:00Z",
    },
  ],
  pagination: PAGINATION,
  scraped_utc: 1751500000,
  scraped_at: "2026-06-03T00:00:00Z",
};

const AUTOCOMPLETE_FIXTURE: AutocompleteResponse = {
  query: "echo",
  domain: "com",
  suggestions: [
    { value: "echo dot", alias: "electronics" },
    { value: "echo show", alias: null },
  ],
};

const MARKETS_FIXTURE: MarketsResponse = {
  markets: [
    {
      code: "US",
      domain: "com",
      country: "United States",
      currency: "USD",
      locale: "en-US",
      name: "Amazon US",
    },
  ],
};

const CATEGORIES_FIXTURE: CategoriesResponse = {
  categories: [
    {
      name: "Electronics",
      alias: "electronics",
      search_alias: "electronics",
      bestseller_node: "172282",
    },
  ],
};

// ---------------------------------------------------------------------------
// AmazonClient on ScrapeBadger
// ---------------------------------------------------------------------------

describe("AmazonClient on ScrapeBadger", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("is accessible via client.amazon", () => {
    expect(makeClient().amazon).toBeDefined();
  });

  it("has all sub-clients", () => {
    const c = makeClient();
    expect(c.amazon.search).toBeDefined();
    expect(c.amazon.products).toBeDefined();
    expect(c.amazon.listings).toBeDefined();
    expect(c.amazon.sellers).toBeDefined();
    expect(c.amazon.reference).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// SearchClient
// ---------------------------------------------------------------------------

describe("AmazonClient.search", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/amazon/search with query", async () => {
    mockFetch(SEARCH_FIXTURE);
    const result = await makeClient().amazon.search.search({ query: "echo dot" });

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/amazon/search");
    expect(url).toContain("query=echo+dot");
    expect(result.results).toHaveLength(1);
    expect(result.results[0].asin).toBe("B08N5WRWNW");
    expect(result.pagination.total_results).toBe(400);
  });

  it("passes all optional search params", async () => {
    mockFetch(SEARCH_FIXTURE);
    await makeClient().amazon.search.search({
      query: "laptop",
      domain: "de",
      page: 2,
      sort_by: "price_low_to_high",
      category: "electronics",
      min_price: 100,
      max_price: 500,
      zip: "10115",
      language: "de_DE",
    });
    const { url } = capturedRequest();
    expect(url).toContain("domain=de");
    expect(url).toContain("page=2");
    expect(url).toContain("sort_by=price_low_to_high");
    expect(url).toContain("category=electronics");
    expect(url).toContain("min_price=100");
    expect(url).toContain("max_price=500");
    expect(url).toContain("zip=10115");
    expect(url).toContain("language=de_DE");
  });

  it("autocomplete sends GET to /v1/amazon/autocomplete", async () => {
    mockFetch(AUTOCOMPLETE_FIXTURE);
    const result = await makeClient().amazon.search.autocomplete("echo", {
      domain: "co.uk",
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/autocomplete");
    expect(url).toContain("query=echo");
    expect(url).toContain("domain=co.uk");
    expect(result.suggestions).toHaveLength(2);
    expect(result.suggestions[0].value).toBe("echo dot");
  });
});

// ---------------------------------------------------------------------------
// ProductsClient
// ---------------------------------------------------------------------------

describe("AmazonClient.products", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("get sends GET to /v1/amazon/products/{asin}", async () => {
    mockFetch(PRODUCT_FIXTURE);
    const result = await makeClient().amazon.products.get("B08N5WRWNW", {
      domain: "de",
      zip: "10115",
      language: "de_DE",
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/products/B08N5WRWNW");
    expect(url).toContain("domain=de");
    expect(url).toContain("zip=10115");
    expect(url).toContain("language=de_DE");
    expect(result.product.asin).toBe("B08N5WRWNW");
    expect(result.product.badges.amazons_choice).toBe(true);
    expect(result.product.buybox?.seller_id).toBe("ATVPDKIKX0DER");
  });

  it("offers sends GET to /v1/amazon/products/{asin}/offers", async () => {
    mockFetch(OFFERS_FIXTURE);
    const result = await makeClient().amazon.products.offers("B08N5WRWNW");
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/products/B08N5WRWNW/offers");
    expect(result.buybox?.buybox_winner).toBe(true);
    expect(result.offers).toHaveLength(1);
  });

  it("reviews sends GET to /v1/amazon/products/{asin}/reviews", async () => {
    mockFetch(REVIEWS_FIXTURE);
    const result = await makeClient().amazon.products.reviews("B08N5WRWNW", {
      sort_by: "recent",
      star: "five_star",
      verified_only: true,
      media_only: false,
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/products/B08N5WRWNW/reviews");
    expect(url).toContain("sort_by=recent");
    expect(url).toContain("star=five_star");
    expect(url).toContain("verified_only=true");
    expect(result.reviews[0].date_utc).toBe(1751328000);
    expect(result.rating_breakdown?.five_star).toBe(80);
  });
});

// ---------------------------------------------------------------------------
// ListingsClient
// ---------------------------------------------------------------------------

describe("AmazonClient.listings", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("bestsellers sends GET to /v1/amazon/bestsellers", async () => {
    mockFetch(BESTSELLERS_FIXTURE);
    const result = await makeClient().amazon.listings.bestsellers({
      category: "electronics",
      page: 2,
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/bestsellers");
    expect(url).toContain("category=electronics");
    expect(url).toContain("page=2");
    expect(result.bestsellers[0].rank).toBe(1);
  });

  it("newReleases sends GET to /v1/amazon/new-releases", async () => {
    mockFetch(NEW_RELEASES_FIXTURE);
    const result = await makeClient().amazon.listings.newReleases({
      category: "books",
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/new-releases");
    expect(result.new_releases).toHaveLength(1);
  });

  it("deals sends GET to /v1/amazon/deals", async () => {
    mockFetch(DEALS_FIXTURE);
    const result = await makeClient().amazon.listings.deals();
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/deals");
    expect(result.deals[0].is_lightning_deal).toBe(true);
  });

  it("category sends GET to /v1/amazon/category with node", async () => {
    mockFetch(CATEGORY_FIXTURE);
    const result = await makeClient().amazon.listings.category({
      node: "172282",
      sort_by: "featured",
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/category");
    expect(url).toContain("node=172282");
    expect(url).toContain("sort_by=featured");
    expect(result.node).toBe("172282");
  });
});

// ---------------------------------------------------------------------------
// SellersClient
// ---------------------------------------------------------------------------

describe("AmazonClient.sellers", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("get sends GET to /v1/amazon/sellers/{id}", async () => {
    mockFetch(SELLER_PROFILE_FIXTURE);
    const result = await makeClient().amazon.sellers.get("A2L77EE7U53NWQ");
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/sellers/A2L77EE7U53NWQ");
    expect(url).not.toContain("/products");
    expect(url).not.toContain("/feedback");
    expect(result.seller.seller_id).toBe("A2L77EE7U53NWQ");
    expect(result.seller.feedback?.["30d"]?.positive).toBe(98);
  });

  it("products sends GET to /v1/amazon/sellers/{id}/products", async () => {
    mockFetch(SELLER_PRODUCTS_FIXTURE);
    const result = await makeClient().amazon.sellers.products("A2L77EE7U53NWQ", {
      page: 3,
    });
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/sellers/A2L77EE7U53NWQ/products");
    expect(url).toContain("page=3");
    expect(result.products).toHaveLength(1);
  });

  it("feedback sends GET to /v1/amazon/sellers/{id}/feedback", async () => {
    mockFetch(SELLER_FEEDBACK_FIXTURE);
    const result = await makeClient().amazon.sellers.feedback("A2L77EE7U53NWQ");
    const { url } = capturedRequest();
    expect(url).toContain("/v1/amazon/sellers/A2L77EE7U53NWQ/feedback");
    expect(result.feedback[0].rating).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// ReferenceClient
// ---------------------------------------------------------------------------

describe("AmazonClient.reference", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("markets sends GET to /v1/amazon/markets", async () => {
    mockFetch(MARKETS_FIXTURE);
    const result = await makeClient().amazon.reference.markets();
    const { url } = capturedRequest();
    expect(url).toBe("https://api.scrapebadger.com/v1/amazon/markets");
    expect(result.markets[0].code).toBe("US");
    expect(result.markets[0].locale).toBe("en-US");
  });

  it("categories sends GET to /v1/amazon/categories", async () => {
    mockFetch(CATEGORIES_FIXTURE);
    const result = await makeClient().amazon.reference.categories();
    const { url } = capturedRequest();
    expect(url).toBe("https://api.scrapebadger.com/v1/amazon/categories");
    expect(result.categories[0].alias).toBe("electronics");
    expect(result.categories[0].bestseller_node).toBe("172282");
  });
});
