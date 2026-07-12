/**
 * Tests for the Redfin API client.
 *
 * Uses vitest and a simple fetch mock that intercepts calls made by BaseClient.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  SearchResponse,
  PropertyResponse,
  AgentResponse,
  AutocompleteResponse,
  MarketsResponse,
  Listing,
  Property,
} from "../src/redfin/types.js";

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

const LISTING_FIXTURE = {
  position: 1,
  property_id: 12345678,
  url: "https://www.redfin.com/TX/Austin/123-Main-St/home/12345678",
  price: 750000,
  beds: 3,
  baths: 2.5,
  street_line: "123 Main St",
  city: "Austin",
  state: "TX",
} as unknown as Listing;

const SEARCH_FIXTURE: SearchResponse = {
  location: "Austin, TX",
  status: "for_sale",
  results: [LISTING_FIXTURE],
  total_results: 1234,
  region: null,
  map_bounds: null,
  search_median: null,
  data_sources: [],
  pagination: { current_page: 1, per_page: 40, total_results: 1234 },
  scraped_utc: null,
  scraped_at: null,
};

const PROPERTY_FIXTURE = {
  property_id: 12345678,
  price: 750000,
  address: { street_address: "123 Main St", city: "Austin", state: "TX" },
} as unknown as Property;

const PROPERTY_RESPONSE_FIXTURE: PropertyResponse = { property: PROPERTY_FIXTURE };

const AGENT_RESPONSE_FIXTURE: AgentResponse = {
  agent: {
    agent_id: "jane-doe",
    name: "Jane Doe",
    url: "https://www.redfin.com/real-estate-agents/jane-doe",
    profile_photo: null,
    title: null,
    is_redfin_agent: null,
    phone: null,
    email: null,
    brokerage: null,
    bio: null,
    rating: 4.9,
    review_count: 42,
    deals_last_year: null,
    total_deals: null,
    price_range_min: null,
    price_range_max: null,
    years_experience: null,
    service_areas: [],
    specialties: [],
    languages: [],
    reviews: [],
    listings: [LISTING_FIXTURE],
    scraped_utc: null,
    scraped_at: null,
  },
};

const AUTOCOMPLETE_FIXTURE: AutocompleteResponse = {
  query: "austin",
  results: [
    {
      name: "Austin, TX",
      display_name: "Austin, TX",
      type: "city",
      latitude: null,
      longitude: null,
      north: null,
      south: null,
      east: null,
      west: null,
    },
  ],
};

const MARKETS_FIXTURE: MarketsResponse = {
  markets: [
    {
      code: "us",
      country: "US",
      currency: "USD",
      locale: "en-US",
      name: "Redfin United States",
      domain: "redfin.com",
    },
  ],
};

// ---------------------------------------------------------------------------
// RedfinClient on ScrapeBadger
// ---------------------------------------------------------------------------

describe("RedfinClient on ScrapeBadger", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("is accessible via client.redfin", () => {
    const client = makeClient();
    expect(client.redfin).toBeDefined();
  });
});

describe("RedfinClient.search", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/redfin/search with location and filters", async () => {
    mockFetch(SEARCH_FIXTURE);
    const client = makeClient();

    const result = await client.redfin.search("Austin, TX", {
      price_max: 750000,
      beds_min: 3,
      sort: "price_low_to_high",
    });

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/redfin/search");
    expect(url).toContain("location=Austin%2C+TX");
    expect(url).toContain("price_max=750000");
    expect(url).toContain("beds_min=3");
    expect(url).toContain("sort=price_low_to_high");
    expect(result.results).toHaveLength(1);
    expect(result.total_results).toBe(1234);
  });
});

describe("RedfinClient.getProperty", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/redfin/property/{propertyId} by id", async () => {
    mockFetch(PROPERTY_RESPONSE_FIXTURE);
    const client = makeClient();

    const result = await client.redfin.getProperty("12345678");

    const { url } = capturedRequest();
    expect(url).toContain("/v1/redfin/property/12345678");
    expect(result.property.property_id).toBe(12345678);
  });

  it("sends GET to /v1/redfin/property with url param", async () => {
    mockFetch(PROPERTY_RESPONSE_FIXTURE);
    const client = makeClient();
    const homeUrl = "https://www.redfin.com/TX/Austin/123-Main-St/home/12345678";

    await client.redfin.getProperty(undefined, { url: homeUrl });

    const { url } = capturedRequest();
    expect(url).toContain("/v1/redfin/property?");
    expect(url).toContain(encodeURIComponent(homeUrl).replace(/%2F/g, "%2F"));
  });
});

describe("RedfinClient.getAgent", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/redfin/agent with agent_id", async () => {
    mockFetch(AGENT_RESPONSE_FIXTURE);
    const client = makeClient();

    const result = await client.redfin.getAgent("jane-doe");

    const { url } = capturedRequest();
    expect(url).toContain("/v1/redfin/agent");
    expect(url).toContain("agent_id=jane-doe");
    expect(result.agent.agent_id).toBe("jane-doe");
    expect(result.agent.listings).toHaveLength(1);
  });
});

describe("RedfinClient.autocomplete", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/redfin/autocomplete", async () => {
    mockFetch(AUTOCOMPLETE_FIXTURE);
    const client = makeClient();

    const result = await client.redfin.autocomplete("austin");

    const { url } = capturedRequest();
    expect(url).toContain("/v1/redfin/autocomplete");
    expect(url).toContain("query=austin");
    expect(result.results).toHaveLength(1);
  });
});

describe("RedfinClient.listMarkets", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/redfin/markets", async () => {
    mockFetch(MARKETS_FIXTURE);
    const client = makeClient();

    const result = await client.redfin.listMarkets();

    const { url } = capturedRequest();
    expect(url).toBe("https://api.scrapebadger.com/v1/redfin/markets");
    expect(result.markets).toHaveLength(1);
    expect(result.markets[0].code).toBe("us");
  });
});
