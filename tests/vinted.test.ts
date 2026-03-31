/**
 * Tests for the Vinted API client.
 *
 * Uses vitest and a simple fetch mock that intercepts calls made by BaseClient.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  SearchResponse,
  ItemDetailResponse,
  UserProfileResponse,
  UserItemsResponse,
  BrandsResponse,
  ColorsResponse,
  StatusesResponse,
  MarketsResponse,
} from "../src/vinted/types.js";

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

const SEARCH_RESPONSE_FIXTURE: SearchResponse = {
  items: [
    {
      id: 100001,
      title: "Nike Air Max 90",
      price: { amount: "45.00", currency_code: "EUR" },
      brand_title: "Nike",
      size_title: "M",
      status: "Active",
      url: "https://www.vinted.fr/items/100001",
      favourite_count: 12,
      view_count: 150,
      user: {
        id: 200001,
        login: "seller1",
        photo_url: "https://images.vinted.net/user1.jpg",
        business: false,
      },
      photo: {
        id: 300001,
        url: "https://images.vinted.net/photo1.jpg",
        dominant_color: "#ffffff",
        is_main: true,
        width: 800,
        height: 600,
        full_size_url: "https://images.vinted.net/photo1_full.jpg",
      },
      photos: [],
    },
  ],
  pagination: {
    current_page: 1,
    total_pages: 5,
    total_entries: 100,
    per_page: 20,
  },
  market: "fr",
};

const ITEM_DETAIL_FIXTURE: ItemDetailResponse = {
  item: {
    id: 100001,
    title: "Nike Air Max 90",
    price: { amount: "45.00", currency_code: "EUR" },
    brand_title: "Nike",
    size_title: "M",
    status: "Active",
    url: "https://www.vinted.fr/items/100001",
    favourite_count: 12,
    view_count: 150,
    user: {
      id: 200001,
      login: "seller1",
      photo_url: "https://images.vinted.net/user1.jpg",
      business: false,
    },
    photo: {
      id: 300001,
      url: "https://images.vinted.net/photo1.jpg",
      dominant_color: "#ffffff",
      is_main: true,
      width: 800,
      height: 600,
      full_size_url: "https://images.vinted.net/photo1_full.jpg",
    },
    photos: [],
    description: "Classic Nike Air Max 90 in great condition",
    catalog_id: 5,
    color1: "White",
    seller: {
      id: 200001,
      login: "seller1",
      photo_url: "https://images.vinted.net/user1.jpg",
      business: false,
      feedback_count: 42,
      feedback_reputation: 0.98,
      item_count: 15,
      location: "Paris, France",
      last_seen: "2026-03-30T12:00:00Z",
      badges: ["fast_shipper"],
    },
    category: "Shoes",
    upload_date: "2026-03-15T10:00:00Z",
    can_buy: true,
    instant_buy: true,
    is_closed: false,
    is_reserved: false,
    is_hidden: false,
    size_id: 10,
    status_id: 1,
    brand_id: 53,
  },
  market: "fr",
};

const USER_PROFILE_FIXTURE: UserProfileResponse = {
  user: {
    id: 200001,
    login: "seller1",
    photo_url: "https://images.vinted.net/user1.jpg",
    business: false,
    country_code: "FR",
    city: "Paris",
    feedback_count: 42,
    feedback_reputation: 0.98,
    positive_feedback_count: 40,
    neutral_feedback_count: 2,
    negative_feedback_count: 0,
    item_count: 15,
    followers_count: 120,
    following_count: 30,
    is_online: true,
    is_on_holiday: false,
    last_loged_on_ts: "1711800000",
    profile_url: "https://www.vinted.fr/member/200001-seller1",
    locale: "fr",
  },
  market: "fr",
};

const USER_ITEMS_FIXTURE: UserItemsResponse = {
  items: [SEARCH_RESPONSE_FIXTURE.items[0]],
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_entries: 1,
    per_page: 20,
  },
  market: "fr",
};

const BRANDS_FIXTURE: BrandsResponse = {
  brands: [
    {
      id: 53,
      title: "Nike",
      slug: "nike",
      item_count: 500000,
      favourite_count: 10000,
      is_luxury: false,
      url: "https://www.vinted.fr/brand/nike",
    },
  ],
  pagination: {
    current_page: 1,
    total_pages: 1,
    total_entries: 1,
    per_page: 20,
  },
};

const COLORS_FIXTURE: ColorsResponse = {
  colors: [
    { id: 1, title: "Black", hex: "000000", code: "black" },
    { id: 2, title: "White", hex: "ffffff", code: "white" },
  ],
};

const STATUSES_FIXTURE: StatusesResponse = {
  statuses: [
    { id: 1, title: "New with tags" },
    { id: 2, title: "New without tags" },
    { id: 3, title: "Very good" },
  ],
};

const MARKETS_FIXTURE: MarketsResponse = {
  markets: [
    {
      code: "fr",
      domain: "www.vinted.fr",
      country: "France",
      currency: "EUR",
      name: "Vinted France",
    },
    {
      code: "de",
      domain: "www.vinted.de",
      country: "Germany",
      currency: "EUR",
      name: "Vinted Germany",
    },
  ],
};

// ---------------------------------------------------------------------------
// VintedClient on ScrapeBadger
// ---------------------------------------------------------------------------

describe("VintedClient on ScrapeBadger", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("is accessible via client.vinted", () => {
    const client = makeClient();
    expect(client.vinted).toBeDefined();
  });

  it("has search sub-client", () => {
    const client = makeClient();
    expect(client.vinted.search).toBeDefined();
  });

  it("has items sub-client", () => {
    const client = makeClient();
    expect(client.vinted.items).toBeDefined();
  });

  it("has users sub-client", () => {
    const client = makeClient();
    expect(client.vinted.users).toBeDefined();
  });

  it("has reference sub-client", () => {
    const client = makeClient();
    expect(client.vinted.reference).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// SearchClient
// ---------------------------------------------------------------------------

describe("VintedClient.search", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/vinted/search with query param", async () => {
    mockFetch(SEARCH_RESPONSE_FIXTURE);
    const client = makeClient();

    const result = await client.vinted.search.search({ query: "nike air max" });

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/vinted/search");
    expect(url).toContain("query=nike+air+max");
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe("Nike Air Max 90");
    expect(result.pagination.total_entries).toBe(100);
    expect(result.market).toBe("fr");
  });

  it("passes all optional search params", async () => {
    mockFetch(SEARCH_RESPONSE_FIXTURE);
    const client = makeClient();

    await client.vinted.search.search({
      query: "adidas",
      market: "de",
      page: 2,
      per_page: 10,
      price_from: 5,
      price_to: 50,
      brand_ids: "53,100",
      color_ids: "1,2",
      status_ids: "1",
      order: "price_low_to_high",
    });

    const { url } = capturedRequest();
    expect(url).toContain("query=adidas");
    expect(url).toContain("market=de");
    expect(url).toContain("page=2");
    expect(url).toContain("per_page=10");
    expect(url).toContain("price_from=5");
    expect(url).toContain("price_to=50");
    expect(url).toContain("brand_ids=53%2C100");
    expect(url).toContain("color_ids=1%2C2");
    expect(url).toContain("status_ids=1");
    expect(url).toContain("order=price_low_to_high");
  });

  it("does not include undefined optional params in URL", async () => {
    mockFetch(SEARCH_RESPONSE_FIXTURE);
    const client = makeClient();

    await client.vinted.search.search({ query: "jacket" });

    const { url } = capturedRequest();
    expect(url).toContain("query=jacket");
    expect(url).not.toContain("market=");
    expect(url).not.toContain("page=");
    expect(url).not.toContain("per_page=");
    expect(url).not.toContain("price_from=");
    expect(url).not.toContain("price_to=");
    expect(url).not.toContain("brand_ids=");
    expect(url).not.toContain("order=");
  });
});

// ---------------------------------------------------------------------------
// ItemsClient
// ---------------------------------------------------------------------------

describe("VintedClient.items", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/vinted/items/{id}", async () => {
    mockFetch(ITEM_DETAIL_FIXTURE);
    const client = makeClient();

    const result = await client.vinted.items.get(100001);

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/vinted/items/100001");
    expect(result.item.id).toBe(100001);
    expect(result.item.title).toBe("Nike Air Max 90");
    expect(result.item.description).toBe("Classic Nike Air Max 90 in great condition");
    expect(result.item.seller.login).toBe("seller1");
    expect(result.market).toBe("fr");
  });

  it("passes market option as query param", async () => {
    mockFetch(ITEM_DETAIL_FIXTURE);
    const client = makeClient();

    await client.vinted.items.get(100001, { market: "de" });

    const { url } = capturedRequest();
    expect(url).toContain("market=de");
  });

  it("does not include market param when not specified", async () => {
    mockFetch(ITEM_DETAIL_FIXTURE);
    const client = makeClient();

    await client.vinted.items.get(100001);

    const { url } = capturedRequest();
    expect(url).not.toContain("market=");
  });
});

// ---------------------------------------------------------------------------
// UsersClient
// ---------------------------------------------------------------------------

describe("VintedClient.users.getProfile", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/vinted/users/{id}", async () => {
    mockFetch(USER_PROFILE_FIXTURE);
    const client = makeClient();

    const result = await client.vinted.users.getProfile(200001);

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/vinted/users/200001");
    expect(url).not.toContain("/items");
    expect(result.user.id).toBe(200001);
    expect(result.user.login).toBe("seller1");
    expect(result.user.feedback_reputation).toBe(0.98);
    expect(result.market).toBe("fr");
  });

  it("passes market option as query param", async () => {
    mockFetch(USER_PROFILE_FIXTURE);
    const client = makeClient();

    await client.vinted.users.getProfile(200001, { market: "de" });

    const { url } = capturedRequest();
    expect(url).toContain("market=de");
  });
});

describe("VintedClient.users.getItems", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/vinted/users/{id}/items", async () => {
    mockFetch(USER_ITEMS_FIXTURE);
    const client = makeClient();

    const result = await client.vinted.users.getItems(200001);

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/vinted/users/200001/items");
    expect(result.items).toHaveLength(1);
    expect(result.pagination.total_entries).toBe(1);
    expect(result.market).toBe("fr");
  });

  it("passes market, page, and per_page as query params", async () => {
    mockFetch(USER_ITEMS_FIXTURE);
    const client = makeClient();

    await client.vinted.users.getItems(200001, {
      market: "de",
      page: 2,
      per_page: 10,
    });

    const { url } = capturedRequest();
    expect(url).toContain("market=de");
    expect(url).toContain("page=2");
    expect(url).toContain("per_page=10");
  });

  it("does not include undefined optional params", async () => {
    mockFetch(USER_ITEMS_FIXTURE);
    const client = makeClient();

    await client.vinted.users.getItems(200001);

    const { url } = capturedRequest();
    expect(url).not.toContain("market=");
    expect(url).not.toContain("page=");
    expect(url).not.toContain("per_page=");
  });
});

// ---------------------------------------------------------------------------
// ReferenceClient
// ---------------------------------------------------------------------------

describe("VintedClient.reference.brands", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/vinted/brands", async () => {
    mockFetch(BRANDS_FIXTURE);
    const client = makeClient();

    const result = await client.vinted.reference.brands();

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/vinted/brands");
    expect(result.brands).toHaveLength(1);
    expect(result.brands[0].title).toBe("Nike");
  });

  it("passes keyword, market, and per_page as query params", async () => {
    mockFetch(BRANDS_FIXTURE);
    const client = makeClient();

    await client.vinted.reference.brands({
      keyword: "nike",
      market: "de",
      per_page: 10,
    });

    const { url } = capturedRequest();
    expect(url).toContain("keyword=nike");
    expect(url).toContain("market=de");
    expect(url).toContain("per_page=10");
  });

  it("does not include undefined optional params", async () => {
    mockFetch(BRANDS_FIXTURE);
    const client = makeClient();

    await client.vinted.reference.brands();

    const { url } = capturedRequest();
    expect(url).not.toContain("keyword=");
    expect(url).not.toContain("market=");
    expect(url).not.toContain("per_page=");
  });
});

describe("VintedClient.reference.colors", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/vinted/colors", async () => {
    mockFetch(COLORS_FIXTURE);
    const client = makeClient();

    const result = await client.vinted.reference.colors();

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/vinted/colors");
    expect(result.colors).toHaveLength(2);
    expect(result.colors[0].title).toBe("Black");
  });

  it("passes market as query param", async () => {
    mockFetch(COLORS_FIXTURE);
    const client = makeClient();

    await client.vinted.reference.colors({ market: "de" });

    const { url } = capturedRequest();
    expect(url).toContain("market=de");
  });
});

describe("VintedClient.reference.statuses", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/vinted/statuses", async () => {
    mockFetch(STATUSES_FIXTURE);
    const client = makeClient();

    const result = await client.vinted.reference.statuses();

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/vinted/statuses");
    expect(result.statuses).toHaveLength(3);
    expect(result.statuses[0].title).toBe("New with tags");
  });

  it("passes market as query param", async () => {
    mockFetch(STATUSES_FIXTURE);
    const client = makeClient();

    await client.vinted.reference.statuses({ market: "fr" });

    const { url } = capturedRequest();
    expect(url).toContain("market=fr");
  });
});

describe("VintedClient.reference.markets", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/vinted/markets", async () => {
    mockFetch(MARKETS_FIXTURE);
    const client = makeClient();

    const result = await client.vinted.reference.markets();

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toBe("https://api.scrapebadger.com/v1/vinted/markets");
    expect(result.markets).toHaveLength(2);
    expect(result.markets[0].code).toBe("fr");
    expect(result.markets[0].domain).toBe("www.vinted.fr");
    expect(result.markets[1].code).toBe("de");
  });
});
