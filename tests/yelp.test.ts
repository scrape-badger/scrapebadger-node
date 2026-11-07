import { afterEach, expect, it, vi } from "vitest";
import { ScrapeBadger } from "../src/client.js";

afterEach(() => vi.unstubAllGlobals());

function business(position: number, overrides: Record<string, unknown> = {}) {
  return {
    position,
    is_ad: false,
    id: `biz-${position}`,
    alias: `pizza-place-${position}-san-francisco`,
    name: `Pizza Place ${position}`,
    url: `https://www.yelp.com/biz/pizza-place-${position}-san-francisco`,
    rating: 4.5,
    review_count: 0,
    price: null,
    price_level: null,
    categories: [{ alias: "pizza", title: "Pizza" }],
    neighborhoods: [],
    address: null,
    city: "San Francisco",
    phone: null,
    timezone: "America/Los_Angeles",
    opening_hours: [],
    snippet: null,
    snippet_type: null,
    highlights: [],
    tags: [],
    photos: [],
    alternate_names: [],
    is_service_area_business: false,
    is_yelp_guaranteed: false,
    has_verified_license: false,
    ad_placement: null,
    ...overrides,
  };
}

function stubJson(payload: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json", "X-Credits-Used": "15" },
    })
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function sentUrl(fetchMock: ReturnType<typeof vi.fn>): URL {
  return new URL(fetchMock.mock.calls[0]![0] as string);
}

it("search sends every filter and keeps the native payload", async () => {
  // Ads stay separate from ranked results; false, zero, empty and null values
  // inside nested groups must arrive unchanged.
  const payload = {
    market: "ca",
    query: "pizza",
    location: "Toronto, ON",
    location_resolved: {
      city: "Toronto",
      state: "ON",
      country: "CA",
      latitude: 43.65,
      longitude: -79.38,
    },
    did_you_mean: null,
    query_matched: true,
    total_results: 240,
    page: 2,
    page_size: 10,
    total_pages: 11,
    has_next_page: true,
    next_page: 3,
    results: [business(11), business(12, { rating: null, review_count: null })],
    ads: [business(0, { is_ad: true, ad_placement: "top" })],
    filters: {
      price: {
        title: "Price",
        type: "multi",
        options: [
          { value: "1", text: "$", selected: false },
          { value: "2", text: "$$", selected: true },
        ],
      },
      features: { title: "Features", type: "multi", options: [] },
    },
    related_searches: [],
    source_url: "https://www.yelp.ca/search?find_desc=pizza&find_loc=Toronto%2C+ON&start=10",
    fetched_at: "2026-11-07T16:00:00Z",
    fetched_utc: 1794067200.0,
  };
  const fetchMock = stubJson(payload);
  const client = new ScrapeBadger({ apiKey: "offline-key", maxRetries: 0 });
  const params = {
    location: "Toronto, ON",
    query: "pizza",
    market: "ca",
    category: "pizza",
    sort_by: "review_count",
    price: "1,2",
    features: "delivery,takeout",
    page: 2,
  };

  const result = await client.yelp.searchBusinesses(params);

  expect(result).toEqual(payload);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const url = sentUrl(fetchMock);
  expect(url.pathname).toBe("/v1/yelp/search");
  expect(Object.fromEntries(url.searchParams)).toEqual({ ...params, page: "2" });
  const init = fetchMock.mock.calls[0]![1] as RequestInit;
  expect((init.headers as Record<string, string>)["X-API-Key"]).toBe("offline-key");
});

it("search keeps a genuine empty result without coercion", async () => {
  // A genuine empty search is a normal 200 response, not an error or a
  // fabricated fallback; its zeros and nulls must not be coerced.
  const payload = {
    market: "us",
    query: null,
    location: "Barrow, AK",
    location_resolved: {
      city: "Utqiagvik",
      state: "AK",
      country: "US",
      latitude: null,
      longitude: null,
    },
    did_you_mean: null,
    query_matched: false,
    total_results: 0,
    page: 1,
    page_size: 10,
    total_pages: 0,
    has_next_page: false,
    next_page: null,
    results: [],
    ads: [],
    filters: {},
    related_searches: [],
    source_url: "https://www.yelp.com/search?find_loc=Barrow%2C+AK&cflt=pizza",
    fetched_at: "2026-11-07T16:00:00Z",
    fetched_utc: 1794067200.0,
  };
  const fetchMock = stubJson(payload);
  const client = new ScrapeBadger({ apiKey: "offline-key", maxRetries: 0 });

  const result = await client.yelp.searchBusinesses({
    location: "Barrow, AK",
    category: "pizza",
    query: undefined,
  });

  expect(result).toEqual(payload);
  expect(Object.fromEntries(sentUrl(fetchMock).searchParams)).toEqual({
    location: "Barrow, AK",
    category: "pizza",
  });
});

it("markets use no query and keep the payload", async () => {
  const payload = {
    markets: [
      {
        code: "us",
        name: "United States",
        domain: "www.yelp.com",
        language: "en",
        currency: "USD",
      },
      { code: "ca", name: "Canada", domain: "www.yelp.ca", language: "en", currency: "CAD" },
    ],
  };
  const fetchMock = stubJson(payload);
  const client = new ScrapeBadger({ apiKey: "offline-key", maxRetries: 0 });

  const result = await client.yelp.listMarkets();

  expect(result).toEqual(payload);
  const url = sentUrl(fetchMock);
  expect(url.pathname).toBe("/v1/yelp/markets");
  expect(url.search).toBe("");
});
