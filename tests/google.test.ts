/**
 * Tests for the Google API client.
 *
 * Uses vitest + a fetch mock so we only verify that each sub-client sends
 * the correct path and query params.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import { GoogleClient } from "../src/google/client.js";
import { SearchClient as GoogleSearchClient } from "../src/google/search.js";
import { MapsClient } from "../src/google/maps.js";
import { NewsClient } from "../src/google/news.js";
import { HotelsClient } from "../src/google/hotels.js";
import { TrendsClient as GoogleTrendsClient } from "../src/google/trends.js";
import { JobsClient } from "../src/google/jobs.js";
import { ShoppingClient } from "../src/google/shopping.js";
import { PatentsClient } from "../src/google/patents.js";
import { ScholarClient } from "../src/google/scholar.js";
import { AutocompleteClient } from "../src/google/autocomplete.js";
import { ImagesClient } from "../src/google/images.js";
import { VideosClient } from "../src/google/videos.js";
import { FinanceClient } from "../src/google/finance.js";
import { AiModeClient } from "../src/google/ai-mode.js";
import { LensClient } from "../src/google/lens.js";
import { ProductsClient } from "../src/google/products.js";

function makeClient(): ScrapeBadger {
  return new ScrapeBadger({
    apiKey: "test-api-key",
    baseUrl: "https://api.scrapebadger.com",
    maxRetries: 0,
  });
}

function mockFetch(body: unknown = { ok: true }, status = 200): void {
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

function capturedUrl(): URL {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  const [url] = mock.mock.calls[0] as [string, RequestInit];
  return new URL(url);
}

beforeEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Wiring
// ---------------------------------------------------------------------------

describe("GoogleClient wiring", () => {
  it("exposes all 16 sub-clients with correct types", () => {
    const client = makeClient();
    expect(client.google).toBeInstanceOf(GoogleClient);
    expect(client.google.search).toBeInstanceOf(GoogleSearchClient);
    expect(client.google.maps).toBeInstanceOf(MapsClient);
    expect(client.google.news).toBeInstanceOf(NewsClient);
    expect(client.google.hotels).toBeInstanceOf(HotelsClient);
    expect(client.google.trends).toBeInstanceOf(GoogleTrendsClient);
    expect(client.google.jobs).toBeInstanceOf(JobsClient);
    expect(client.google.shopping).toBeInstanceOf(ShoppingClient);
    expect(client.google.patents).toBeInstanceOf(PatentsClient);
    expect(client.google.scholar).toBeInstanceOf(ScholarClient);
    expect(client.google.autocomplete).toBeInstanceOf(AutocompleteClient);
    expect(client.google.images).toBeInstanceOf(ImagesClient);
    expect(client.google.videos).toBeInstanceOf(VideosClient);
    expect(client.google.finance).toBeInstanceOf(FinanceClient);
    expect(client.google.aiMode).toBeInstanceOf(AiModeClient);
    expect(client.google.lens).toBeInstanceOf(LensClient);
    expect(client.google.products).toBeInstanceOf(ProductsClient);
  });
});

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

describe("SearchClient", () => {
  it("calls /v1/google/search with forwarded params", async () => {
    mockFetch({ organic_results: [] });
    const client = makeClient();
    await client.google.search.search({
      q: "python",
      gl: "us",
      num: 20,
      domain: "google.co.uk",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/search");
    expect(url.searchParams.get("q")).toBe("python");
    expect(url.searchParams.get("num")).toBe("20");
    expect(url.searchParams.get("domain")).toBe("google.co.uk");
  });
});

// ---------------------------------------------------------------------------
// Maps
// ---------------------------------------------------------------------------

describe("MapsClient", () => {
  it("search uses /v1/google/maps/search", async () => {
    mockFetch({ results: [] });
    const client = makeClient();
    await client.google.maps.search({ q: "pizza", ll: "@40.7,-74.0,12z" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/maps/search");
    expect(url.searchParams.get("q")).toBe("pizza");
    expect(url.searchParams.get("ll")).toBe("@40.7,-74.0,12z");
  });

  it("place throws when no identifier is supplied", async () => {
    const client = makeClient();
    await expect(client.google.maps.place({})).rejects.toThrow(
      "place_id or data_id"
    );
  });

  it("reviews forwards all params", async () => {
    mockFetch({ reviews: [] });
    const client = makeClient();
    await client.google.maps.reviews({
      data_id: "data:123",
      sort_by: "newestFirst",
      results: 15,
      next_page_token: "tok1",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/maps/reviews");
    expect(url.searchParams.get("data_id")).toBe("data:123");
    expect(url.searchParams.get("sort_by")).toBe("newestFirst");
    expect(url.searchParams.get("results")).toBe("15");
    expect(url.searchParams.get("next_page_token")).toBe("tok1");
  });
});

// ---------------------------------------------------------------------------
// News
// ---------------------------------------------------------------------------

describe("NewsClient", () => {
  it("search forwards to /v1/google/news/search", async () => {
    mockFetch({ articles: [] });
    const client = makeClient();
    await client.google.news.search({ q: "openai", max_results: 20 });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/news/search");
    expect(url.searchParams.get("max_results")).toBe("20");
  });

  it("topics forwards the topic param", async () => {
    mockFetch({ articles: [] });
    const client = makeClient();
    await client.google.news.topics({ topic: "TECHNOLOGY" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/news/topics");
    expect(url.searchParams.get("topic")).toBe("TECHNOLOGY");
  });

  it("trending calls /v1/google/news/trending", async () => {
    mockFetch({ articles: [] });
    const client = makeClient();
    await client.google.news.trending({ gl: "GB" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/news/trending");
    expect(url.searchParams.get("gl")).toBe("GB");
  });
});

// ---------------------------------------------------------------------------
// Hotels
// ---------------------------------------------------------------------------

describe("HotelsClient", () => {
  it("search forwards dates and currency", async () => {
    mockFetch({ properties: [] });
    const client = makeClient();
    await client.google.hotels.search({
      q: "Paris",
      check_in: "2026-05-01",
      check_out: "2026-05-05",
      adults: 2,
      currency: "EUR",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/hotels/search");
    expect(url.searchParams.get("check_in")).toBe("2026-05-01");
    expect(url.searchParams.get("currency")).toBe("EUR");
  });

  it("details forwards property_token", async () => {
    mockFetch({ property: {} });
    const client = makeClient();
    await client.google.hotels.details({
      property_token: "PTOKEN",
      check_in: "2026-05-01",
      check_out: "2026-05-05",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/hotels/details");
    expect(url.searchParams.get("property_token")).toBe("PTOKEN");
  });
});

// ---------------------------------------------------------------------------
// Trends
// ---------------------------------------------------------------------------

describe("TrendsClient", () => {
  it("interest", async () => {
    mockFetch({ timeline: [] });
    const client = makeClient();
    await client.google.trends.interest({
      q: "python,javascript",
      geo: "US",
      date: "today 12-m",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/trends/interest");
    expect(url.searchParams.get("q")).toBe("python,javascript");
  });

  it("regions, related, trending route correctly", async () => {
    const client = makeClient();

    mockFetch({});
    await client.google.trends.regions({ q: "x" });
    expect(capturedUrl().pathname).toBe("/v1/google/trends/regions");
    vi.restoreAllMocks();

    mockFetch({});
    await client.google.trends.related({ q: "y" });
    expect(capturedUrl().pathname).toBe("/v1/google/trends/related");
    vi.restoreAllMocks();

    mockFetch({});
    await client.google.trends.trending({ geo: "GB" });
    expect(capturedUrl().pathname).toBe("/v1/google/trends/trending");
  });
});

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

describe("JobsClient", () => {
  it("search forwards filter params", async () => {
    mockFetch({ jobs: [] });
    const client = makeClient();
    await client.google.jobs.search({
      q: "software engineer",
      location: "San Francisco",
      job_type: "FULLTIME",
      date_posted: "week",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/jobs/search");
    expect(url.searchParams.get("location")).toBe("San Francisco");
    expect(url.searchParams.get("job_type")).toBe("FULLTIME");
    expect(url.searchParams.get("date_posted")).toBe("week");
  });
});

// ---------------------------------------------------------------------------
// Shopping
// ---------------------------------------------------------------------------

describe("ShoppingClient", () => {
  it("search forwards price filters and sort", async () => {
    mockFetch({ results: [] });
    const client = makeClient();
    await client.google.shopping.search({
      q: "laptop",
      min_price: 500,
      max_price: 2000,
      sort_by: "price_low",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/shopping/search");
    expect(url.searchParams.get("min_price")).toBe("500");
    expect(url.searchParams.get("sort_by")).toBe("price_low");
  });

  it("product uses the product endpoint", async () => {
    mockFetch({ product: {} });
    const client = makeClient();
    await client.google.shopping.product({ product_id: "abc123" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/shopping/product");
    expect(url.searchParams.get("product_id")).toBe("abc123");
  });

  it("click resolves via /shopping/product/click", async () => {
    mockFetch({ merchant_url: "https://www.razer.com/x" });
    const client = makeClient();
    const response = await client.google.shopping.click({
      title: 'Razer Blade 14"',
      source: "Razer.com",
      q: "gaming laptop",
      product_id: "pid123",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/shopping/product/click");
    expect(url.searchParams.get("title")).toBe('Razer Blade 14"');
    expect(url.searchParams.get("source")).toBe("Razer.com");
    expect(url.searchParams.get("product_id")).toBe("pid123");
    expect(response.merchant_url).toBe("https://www.razer.com/x");
  });
});

// ---------------------------------------------------------------------------
// Patents
// ---------------------------------------------------------------------------

describe("PatentsClient", () => {
  it("search forwards filters", async () => {
    mockFetch({ results: [] });
    const client = makeClient();
    await client.google.patents.search({
      q: "distributed lock",
      inventor: "Smith",
      assignee: "Acme",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/patents/search");
    expect(url.searchParams.get("inventor")).toBe("Smith");
    expect(url.searchParams.get("assignee")).toBe("Acme");
  });

  it("detail calls /patents/detail", async () => {
    mockFetch({ patent: {} });
    const client = makeClient();
    await client.google.patents.detail({ patent_id: "US10123456B2" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/patents/detail");
    expect(url.searchParams.get("patent_id")).toBe("US10123456B2");
  });
});

// ---------------------------------------------------------------------------
// Misc sub-clients
// ---------------------------------------------------------------------------

describe("Small Google sub-clients", () => {
  it("scholar", async () => {
    mockFetch({});
    const client = makeClient();
    await client.google.scholar.search({ q: "transformer", as_ylo: 2020, as_yhi: 2024 });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/scholar/search");
    expect(url.searchParams.get("as_ylo")).toBe("2020");
    expect(url.searchParams.get("as_yhi")).toBe("2024");
  });

  it("autocomplete", async () => {
    mockFetch({});
    const client = makeClient();
    await client.google.autocomplete.get({ q: "pyth" });
    expect(capturedUrl().pathname).toBe("/v1/google/autocomplete");
  });

  it("images", async () => {
    mockFetch({});
    const client = makeClient();
    await client.google.images.search({ q: "dog", imgsz: "l", imgcolor: "color" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/images/search");
    expect(url.searchParams.get("imgsz")).toBe("l");
    expect(url.searchParams.get("imgcolor")).toBe("color");
  });

  it("videos", async () => {
    mockFetch({});
    const client = makeClient();
    await client.google.videos.search({ q: "python tutorial", tbs: "qdr:w" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/videos/search");
    expect(url.searchParams.get("tbs")).toBe("qdr:w");
  });

  it("finance", async () => {
    mockFetch({});
    const client = makeClient();
    await client.google.finance.quote({ q: "AAPL:NASDAQ" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/finance/quote");
    expect(url.searchParams.get("q")).toBe("AAPL:NASDAQ");
  });

  it("aiMode", async () => {
    mockFetch({});
    const client = makeClient();
    await client.google.aiMode.search({ q: "what is kubernetes" });
    expect(capturedUrl().pathname).toBe("/v1/google/ai-mode/search");
  });

  it("lens", async () => {
    mockFetch({});
    const client = makeClient();
    await client.google.lens.search({ url: "https://example.com/dog.jpg" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/lens/search");
    expect(url.searchParams.get("url")).toBe("https://example.com/dog.jpg");
  });

  it("products", async () => {
    mockFetch({});
    const client = makeClient();
    await client.google.products.detail({ product_id: "pid1" });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/products/detail");
    expect(url.searchParams.get("product_id")).toBe("pid1");
  });
});
