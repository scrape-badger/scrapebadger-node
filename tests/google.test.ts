/**
 * Tests for the Google API client.
 *
 * Uses vitest + a fetch mock so we only verify that each sub-client sends
 * the correct path and query params.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import { ValidationError } from "../src/internal/exceptions.js";
import type { AiModeLocation } from "../src/index.js";
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
import { AdsClient } from "../src/google/ads.js";

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
    expect(client.google.ads).toBeInstanceOf(AdsClient);
  });
});

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

describe("SearchClient", () => {
  it.each(["search", "light"] as const)(
    "%s forwards targeting and preserves raw HTML",
    async (method) => {
      const html = "<!doctype html><html><body>Vilnius — kavinė</body></html>";
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(html, {
            headers: { "Content-Type": "text/html; charset=utf-8" },
          })
        )
      );
      const result: string = await makeClient().google.search[method]({
        q: "vinted api",
        location: "New York,New York,United States",
        no_cache: true,
        google_domain: "google.com",
        as_epq: "vinted api",
        color_scheme: "dark",
        oq: "vinted café + api&gl=fr",
        sourceid: "",
        ie: "UTF-8",
        output: "html",
      });
      expect(result).toBe(html);
      const url = capturedUrl();
      expect(url.pathname).toBe(
        method === "light" ? "/v1/google/light/search" : "/v1/google/search"
      );
      expect(url.searchParams.get("location")).toBe("New York,New York,United States");
      expect(url.searchParams.get("no_cache")).toBe("true");
      expect(url.searchParams.get("as_epq")).toBe("vinted api");
      expect(url.searchParams.get("output")).toBe("html");
      expect(url.searchParams.get("oq")).toBe("vinted café + api&gl=fr");
      expect(url.searchParams.get("sourceid")).toBe("");
      expect(url.searchParams.get("ie")).toBe("UTF-8");
    }
  );

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
    expect(url.searchParams.has("expand_related_questions")).toBe(false);
  });

  it("sends expand_related_questions=true", async () => {
    mockFetch({ related_questions: [] });
    await makeClient().google.search.search({ q: "headphones", expand_related_questions: true });
    expect(capturedUrl().searchParams.get("expand_related_questions")).toBe("true");
  });

  it("sends expand_related_questions as a count", async () => {
    mockFetch({ related_questions: [] });
    await makeClient().google.search.search({ q: "headphones", expand_related_questions: 2 });
    expect(capturedUrl().searchParams.get("expand_related_questions")).toBe("2");
  });

  it("light() calls the dedicated /v1/google/light/search endpoint", async () => {
    mockFetch({ organic_results: [] });
    await makeClient().google.search.light({
      q: "python",
      gl: "gb",
      num: 20,
      start: 10,
      domain: "google.co.uk",
      tbs: "qdr:w",
      ai_overview: true,
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/light/search");
    expect(url.searchParams.get("q")).toBe("python");
    expect(url.searchParams.get("gl")).toBe("gb");
    expect(url.searchParams.get("num")).toBe("20");
    expect(url.searchParams.get("start")).toBe("10");
    expect(url.searchParams.get("domain")).toBe("google.co.uk");
    expect(url.searchParams.get("tbs")).toBe("qdr:w");
    // Light cannot be upgraded to full Search, so none of its controls are sent.
    expect(url.searchParams.has("mode")).toBe(false);
    expect(url.searchParams.has("ai_overview")).toBe(false);
    expect(url.searchParams.has("expand_related_questions")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Search: resolving result links
// ---------------------------------------------------------------------------

describe("SearchClient link resolving", () => {
  const GOTO = "https://www.google.com/goto?url=abc";

  type Row = Record<string, unknown>;
  type Answer = { results: Row[]; retry_after_seconds: number | null };

  function jsonResponse(body: unknown): unknown {
    return {
      ok: true,
      status: 200,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    };
  }

  /** Answer each resolve call in turn with the next response. */
  function mockResolve(...answers: Answer[]): ReturnType<typeof vi.fn> {
    const fn = vi.fn();
    for (const answer of answers) fn.mockResolvedValueOnce(jsonResponse(answer));
    vi.stubGlobal("fetch", fn);
    return fn;
  }

  /** Answer each resolve call from the rows it sent. */
  function mockResolveWith(
    answer: (sent: Row[], call: number) => Answer
  ): ReturnType<typeof vi.fn> {
    let call = 0;
    const fn = vi.fn((_url: string, init: RequestInit) => {
      const sent = (JSON.parse(init.body as string) as { results: Row[] }).results;
      return Promise.resolve(jsonResponse(answer(sent, call++)));
    });
    vi.stubGlobal("fetch", fn);
    return fn;
  }

  /** The rows the n-th resolve call sent. */
  function sentRows(fn: ReturnType<typeof vi.fn>, n: number): Row[] {
    const [url, init] = fn.mock.calls[n] as [string, RequestInit];
    expect(url).toBe("https://api.scrapebadger.com/v1/google/resolve");
    expect(init.method).toBe("POST");
    return (JSON.parse(init.body as string) as { results: Row[] }).results;
  }

  function deepFreeze<T>(value: T): T {
    if (value !== null && typeof value === "object") {
      for (const inner of Object.values(value)) deepFreeze(inner);
      Object.freeze(value);
    }
    return value;
  }

  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it("resolve POSTs the results to /v1/google/resolve and returns the response", async () => {
    const answer: Answer = {
      results: [
        { position: 1, title: "A", link: "https://a.example/page" },
        { position: 2, title: "B", link: GOTO, link_token: "tok-b2", retry_after_seconds: 12 },
        { position: 3, title: "C", link: GOTO, link_token: "tok-c", error: "link_unavailable" },
      ],
      retry_after_seconds: 12,
    };
    const fn = mockResolve(answer);
    const items = [
      { position: 1, title: "A", link: GOTO, link_token: "tok-a" },
      { position: 2, title: "B", link: GOTO, link_token: "tok-b" },
      { position: 3, title: "C", link: GOTO, link_token: "tok-c" },
    ];

    const result = await makeClient().google.search.resolve({ results: items });

    expect(fn).toHaveBeenCalledOnce();
    const [url, init] = fn.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.scrapebadger.com/v1/google/resolve");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ results: items });
    expect(result).toEqual(answer);
    expect(result.results[1].link_token).toBe("tok-b2");
    expect(result.retry_after_seconds).toBe(12);
  });

  it("resolveAll returns the rows when all resolve on the first call", async () => {
    const fn = mockResolve({
      results: [
        { position: 1, title: "A", link: "https://a.example/" },
        { position: 2, title: "B", link: "https://b.example/" },
      ],
      retry_after_seconds: null,
    });
    const input = [
      { position: 1, title: "A", link: GOTO, link_token: "tok-a", retry_after_seconds: 0 },
      { position: 2, title: "B", link: GOTO, link_token: "tok-b", retry_after_seconds: 0 },
    ];

    const result = await makeClient().google.search.resolveAll(input);

    expect(fn).toHaveBeenCalledOnce();
    expect(sentRows(fn, 0)).toEqual(input);
    expect(result).toEqual([
      { position: 1, title: "A", link: "https://a.example/" },
      { position: 2, title: "B", link: "https://b.example/" },
    ]);
  });

  it("resolveAll waits the returned time, then sends the new token", async () => {
    const fn = mockResolve(
      {
        results: [
          { position: 1, link: "https://one.example/" },
          { position: 2, link: GOTO, link_token: "tok-2-new", retry_after_seconds: 7 },
        ],
        retry_after_seconds: 7,
      },
      { results: [{ position: 2, link: "https://two.example/" }], retry_after_seconds: null }
    );
    const promise = makeClient().google.search.resolveAll([
      { position: 1, link: GOTO, link_token: "tok-1", retry_after_seconds: 0 },
      { position: 2, link: GOTO, link_token: "tok-2", retry_after_seconds: 8 },
    ]);

    await vi.advanceTimersByTimeAsync(0);
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(6_999);
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(2);

    // Only the row that was not ready goes out again, with the token from the first answer.
    expect(sentRows(fn, 1)).toEqual([
      { position: 2, link: GOTO, link_token: "tok-2-new", retry_after_seconds: 7 },
    ]);
    expect(await promise).toEqual([
      { position: 1, link: "https://one.example/" },
      { position: 2, link: "https://two.example/" },
    ]);
  });

  it("resolveAll waits at least one second between rounds", async () => {
    const fn = mockResolve(
      {
        results: [{ link: GOTO, link_token: "tok-1b", retry_after_seconds: 0 }],
        retry_after_seconds: 0,
      },
      { results: [{ link: "https://one.example/" }], retry_after_seconds: null }
    );
    const promise = makeClient().google.search.resolveAll([{ link: GOTO, link_token: "tok-1" }]);

    await vi.advanceTimersByTimeAsync(999);
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(await promise).toEqual([{ link: "https://one.example/" }]);
  });

  it("resolveAll returns a failed row and does not send it again", async () => {
    const fn = mockResolve(
      {
        results: [
          { position: 1, link: "https://a.example/" },
          { position: 2, link: GOTO, link_token: "tok-b", error: "link_unavailable" },
          { position: 3, link: GOTO, link_token: "tok-c2", retry_after_seconds: 3 },
        ],
        retry_after_seconds: 3,
      },
      { results: [{ position: 3, link: "https://c.example/" }], retry_after_seconds: null }
    );
    const promise = makeClient().google.search.resolveAll([
      { position: 1, link: GOTO, link_token: "tok-a" },
      { position: 2, link: GOTO, link_token: "tok-b" },
      { position: 3, link: GOTO, link_token: "tok-c" },
      // Failed in an earlier call: never sent.
      { position: 4, link: GOTO, link_token: "tok-d", error: "link_unavailable" },
    ]);

    await vi.advanceTimersByTimeAsync(3_000);
    const result = await promise;

    expect(fn).toHaveBeenCalledTimes(2);
    expect(sentRows(fn, 0).map((r) => r.link_token)).toEqual(["tok-a", "tok-b", "tok-c"]);
    expect(sentRows(fn, 1).map((r) => r.link_token)).toEqual(["tok-c2"]);
    expect(result).toEqual([
      { position: 1, link: "https://a.example/" },
      { position: 2, link: GOTO, link_token: "tok-b", error: "link_unavailable" },
      { position: 3, link: "https://c.example/" },
      { position: 4, link: GOTO, link_token: "tok-d", error: "link_unavailable" },
    ]);
  });

  it("resolveAll sends more than 25 rows in requests of at most 25", async () => {
    const fn = mockResolveWith((sent) => ({
      results: sent.map((r) => ({
        position: r.position,
        link: `https://site.example/${String(r.position)}`,
      })),
      retry_after_seconds: null,
    }));
    const input = Array.from({ length: 60 }, (_, i) => ({
      position: i + 1,
      link: GOTO,
      link_token: `tok-${i + 1}`,
    }));

    const result = await makeClient().google.search.resolveAll(input);

    expect(fn).toHaveBeenCalledTimes(3);
    expect([0, 1, 2].map((n) => sentRows(fn, n).length)).toEqual([25, 25, 10]);
    expect(sentRows(fn, 0)[0].link_token).toBe("tok-1");
    expect(sentRows(fn, 1)[0].link_token).toBe("tok-26");
    expect(sentRows(fn, 2)[9].link_token).toBe("tok-60");
    expect(result).toEqual(
      input.map((r) => ({ position: r.position, link: `https://site.example/${r.position}` }))
    );
  });

  it("resolveAll waits the smallest time returned by any of its requests", async () => {
    // Round one: rows 1 and 30 are not ready (9 s and 4 s). Round two: both resolve.
    const waits: Record<number, number> = { 1: 9, 30: 4 };
    const fn = mockResolveWith((sent, call) => {
      const results = sent.map((r) => {
        const wait = call < 2 ? waits[r.position as number] : undefined;
        return wait === undefined
          ? { position: r.position, link: `https://site.example/${String(r.position)}` }
          : { ...r, link_token: `${String(r.link_token)}-new`, retry_after_seconds: wait };
      });
      const pending = results.flatMap((r) =>
        "retry_after_seconds" in r ? [r.retry_after_seconds] : []
      );
      return { results, retry_after_seconds: pending.length ? Math.min(...pending) : null };
    });
    const input = Array.from({ length: 30 }, (_, i) => ({
      position: i + 1,
      link: GOTO,
      link_token: `tok-${i + 1}`,
    }));
    const promise = makeClient().google.search.resolveAll(input);

    await vi.advanceTimersByTimeAsync(3_999);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(3);

    expect(sentRows(fn, 2).map((r) => r.link_token)).toEqual(["tok-1-new", "tok-30-new"]);
    const result = await promise;
    expect(result).toHaveLength(30);
    expect(result.every((r, i) => r.link === `https://site.example/${i + 1}`)).toBe(true);
  });

  it("resolveAll stops at the deadline and returns waiting rows with their latest token", async () => {
    const fn = mockResolveWith((sent, call) => ({
      results: sent.map((r) => ({
        ...r,
        link_token: `tok-${call + 1}`,
        retry_after_seconds: 4,
      })),
      retry_after_seconds: 4,
    }));
    const promise = makeClient().google.search.resolveAll(
      [{ position: 1, title: "A", link: GOTO, link_token: "tok-0", retry_after_seconds: 0 }],
      { maxWaitMs: 10_000 }
    );
    let settled: Row[] | undefined;
    void promise.then((rows) => (settled = rows));

    await vi.advanceTimersByTimeAsync(9_999);
    // Calls at 0, 4 s and 8 s.
    expect(fn).toHaveBeenCalledTimes(3);
    expect(settled).toBeUndefined();
    // The last wait is cut to the deadline: one more call at 10 s, then it returns.
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(4);

    await expect(promise).resolves.toEqual([
      { position: 1, title: "A", link: GOTO, link_token: "tok-4", retry_after_seconds: 4 },
    ]);
    expect(sentRows(fn, 3)[0].link_token).toBe("tok-3");
    // Nothing more is sent after the deadline.
    await vi.advanceTimersByTimeAsync(60_000);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("resolveAll defaults to a 240 second deadline", async () => {
    const fn = mockResolveWith((sent) => ({
      results: sent.map((r) => ({ ...r, retry_after_seconds: 60 })),
      retry_after_seconds: 60,
    }));
    const promise = makeClient().google.search.resolveAll([{ link: GOTO, link_token: "tok" }]);

    await vi.advanceTimersByTimeAsync(240_000);
    // Calls at 0, 60, 120, 180 and 240 s.
    expect(fn).toHaveBeenCalledTimes(5);
    await expect(promise).resolves.toEqual([
      { link: GOTO, link_token: "tok", retry_after_seconds: 60 },
    ]);
  });

  it("resolveAll never sends rows without a link_token and keeps their position", async () => {
    const fn = mockResolve({
      results: [
        { position: 2, link: "https://b.example/" },
        { position: 4, link: "https://d.example/" },
      ],
      retry_after_seconds: null,
    });
    const input = [
      { position: 1, link: "https://a.example/", link_token: null, retry_after_seconds: null },
      { position: 2, link: GOTO, link_token: "tok-b", retry_after_seconds: 0 },
      { position: 3, link: "https://c.example/" },
      { position: 4, link: GOTO, link_token: "tok-d", retry_after_seconds: 0 },
    ];

    const result = await makeClient().google.search.resolveAll(input);

    expect(fn).toHaveBeenCalledOnce();
    expect(sentRows(fn, 0).map((r) => r.link_token)).toEqual(["tok-b", "tok-d"]);
    expect(result).toEqual([
      { position: 1, link: "https://a.example/", link_token: null, retry_after_seconds: null },
      { position: 2, link: "https://b.example/" },
      { position: 3, link: "https://c.example/" },
      { position: 4, link: "https://d.example/" },
    ]);
  });

  it("resolveAll makes no request when no row has a link_token", async () => {
    const fn = mockResolve();
    const input = [
      { position: 1, link: "https://a.example/", link_token: null },
      { position: 2, link: "https://b.example/" },
    ];

    expect(await makeClient().google.search.resolveAll(input)).toEqual(input);
    expect(await makeClient().google.search.resolveAll([])).toEqual([]);
    expect(fn).not.toHaveBeenCalled();
  });

  it("resolveAll does not change the input array or its objects", async () => {
    mockResolve(
      {
        results: [
          { position: 2, link: "https://b.example/", sitelinks: [{ title: "Docs" }] },
          { position: 3, link: GOTO, link_token: "tok-c2", retry_after_seconds: 2 },
        ],
        retry_after_seconds: 2,
      },
      { results: [{ position: 3, link: "https://c.example/" }], retry_after_seconds: null }
    );
    const input = [
      { position: 1, link: "https://a.example/", link_token: null, retry_after_seconds: null },
      {
        position: 2,
        link: GOTO,
        link_token: "tok-b",
        retry_after_seconds: 0,
        sitelinks: [{ title: "Docs" }],
      },
      { position: 3, link: GOTO, link_token: "tok-c", retry_after_seconds: 5 },
    ];
    const before = structuredClone(input);
    // A write to the frozen input would throw.
    deepFreeze(input);

    const promise = makeClient().google.search.resolveAll(input);
    await vi.advanceTimersByTimeAsync(2_000);
    const result = await promise;

    expect(input).toEqual(before);
    expect(result).not.toBe(input);
    result.forEach((row, i) => expect(row).not.toBe(input[i]));
    expect(result).toEqual([
      { position: 1, link: "https://a.example/", link_token: null, retry_after_seconds: null },
      { position: 2, link: "https://b.example/", sitelinks: [{ title: "Docs" }] },
      { position: 3, link: "https://c.example/" },
    ]);
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
    await expect(client.google.maps.place({})).rejects.toThrow("place_id or data_id");
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

  it("offers resolves a barcode via /shopping/offers", async () => {
    mockFetch({ barcode: "0190198001751", offers: [] });
    const client = makeClient();
    const response = await client.google.shopping.offers({
      barcode: "0190198001751",
      gl: "us",
      hl: "en",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/shopping/offers");
    expect(url.searchParams.get("barcode")).toBe("0190198001751");
    expect(url.searchParams.get("gl")).toBe("us");
    expect(response.barcode).toBe("0190198001751");
  });

  it("offers accepts a Google Shopping catalog_id instead of a barcode", async () => {
    mockFetch({ catalog_id: "762120719996356571", total_offers: 19, offers: [] });
    const client = makeClient();
    const response = await client.google.shopping.offers({
      catalog_id: "762120719996356571",
      gl: "de",
      hl: "de",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/shopping/offers");
    expect(url.searchParams.get("catalog_id")).toBe("762120719996356571");
    expect(url.searchParams.has("barcode")).toBe(false);
    expect(response.total_offers).toBe(19);
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
// Ads Transparency Center
// ---------------------------------------------------------------------------

describe("AdsClient", () => {
  it("search forwards filters to /ads/search", async () => {
    mockFetch({ region: "anywhere", creatives: [] });
    const client = makeClient();
    await client.google.ads.search({
      advertiser_id: "AR01614014350098432001",
      region: "anywhere",
      format: "VIDEO",
      start_date: "2026-01-01",
      end_date: "2026-02-01",
      num: 100,
      cursor: "tok",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/ads/search");
    expect(url.searchParams.get("advertiser_id")).toBe("AR01614014350098432001");
    expect(url.searchParams.get("region")).toBe("anywhere");
    expect(url.searchParams.get("format")).toBe("VIDEO");
    expect(url.searchParams.get("start_date")).toBe("2026-01-01");
    expect(url.searchParams.get("end_date")).toBe("2026-02-01");
    expect(url.searchParams.get("num")).toBe("100");
    expect(url.searchParams.get("cursor")).toBe("tok");
  });

  it("searchAdvertisers forwards num up to 3000, num_domains and fuzzy", async () => {
    const body = {
      query: "rufwear",
      region: "US",
      country: null,
      fuzzy: true,
      variants: ["rufwear", "ruf"],
      variants_failed: [],
      next_page_token: null,
      advertisers: [
        {
          advertiser_id: "AR1",
          name: "Ruff Wear, Inc.",
          region: "US",
          domain: null,
          verified: true,
          ads_count: 120,
          details_link: null,
          similarity: 0.93,
          matched_query: "ruf",
        },
      ],
    };
    mockFetch(body);
    const client = makeClient();
    const res = await client.google.ads.searchAdvertisers({
      query: "rufwear",
      num: 3000,
      num_domains: 0,
      country: "US",
      fuzzy: true,
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/ads/advertisers");
    expect(url.searchParams.get("query")).toBe("rufwear");
    expect(url.searchParams.get("num")).toBe("3000");
    expect(url.searchParams.get("num_domains")).toBe("0");
    expect(url.searchParams.get("country")).toBe("US");
    expect(url.searchParams.get("fuzzy")).toBe("true");
    expect(res.variants).toEqual(["rufwear", "ruf"]);
    expect(res.advertisers[0]?.similarity).toBe(0.93);
    expect(res.advertisers[0]?.matched_query).toBe("ruf");
  });

  it("searchAdvertisers passes the domain-row cursor", async () => {
    mockFetch({ advertisers: [] });
    const client = makeClient();
    await client.google.ads.searchAdvertisers({ query: "nike", cursor: "next" });
    const url = capturedUrl();
    expect(url.searchParams.get("cursor")).toBe("next");
    expect(url.searchParams.has("fuzzy")).toBe(false);
  });

  it("advertiser calls /ads/advertiser", async () => {
    mockFetch({ advertiser_id: "AR1", region: "GB" });
    const client = makeClient();
    await client.google.ads.advertiser({
      advertiser_id: "AR1",
      region: "GB",
      start_date: "2026-09-01",
      end_date: "2026-09-30",
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/ads/advertiser");
    expect(url.searchParams.get("advertiser_id")).toBe("AR1");
    expect(url.searchParams.get("region")).toBe("GB");
    expect(url.searchParams.get("start_date")).toBe("2026-09-01");
    expect(url.searchParams.get("end_date")).toBe("2026-09-30");
  });

  it("creative calls /ads/creative", async () => {
    mockFetch({ creative_id: "CR1", region: "US", variations: [], political: null });
    const client = makeClient();
    await client.google.ads.creative({
      advertiser_id: "AR1",
      creative_id: "CR1",
      political: true,
    });
    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/google/ads/creative");
    expect(url.searchParams.get("advertiser_id")).toBe("AR1");
    expect(url.searchParams.get("creative_id")).toBe("CR1");
    expect(url.searchParams.get("political")).toBe("true");
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

// ---------------------------------------------------------------------------
// AI Mode location targeting (SCR-610)
// ---------------------------------------------------------------------------

describe("AiModeClient location targeting", () => {
  function sent(): Record<string, string> {
    return Object.fromEntries(capturedUrl().searchParams);
  }

  it("sends an unlocated request unchanged", async () => {
    mockFetch({});
    await makeClient().google.aiMode.search({ q: "best coffee near me" });
    expect(sent()).toEqual({ q: "best coffee near me" });
  });

  it("sends location without a gl so the API uses its country", async () => {
    mockFetch({});
    await makeClient().google.aiMode.search({
      q: "best coffee near me",
      location: "Wonju-si,Gangwon-do,South Korea",
      hl: "ko",
    });
    expect(sent()).toEqual({
      q: "best coffee near me",
      location: "Wonju-si,Gangwon-do,South Korea",
      hl: "ko",
    });
  });

  it("sends coordinates, uule and an explicit gl as given", async () => {
    mockFetch({});
    await makeClient().google.aiMode.search({
      q: "맛집 추천",
      lat: 35.1763,
      lon: 129.0798,
      gl: "kr",
      include_html: false,
    });
    expect(sent()).toEqual({
      q: "맛집 추천",
      lat: "35.1763",
      lon: "129.0798",
      gl: "kr",
      include_html: "false",
    });

    vi.restoreAllMocks();
    mockFetch({});
    const wonju = "w+CAIQICIfV29uanUtc2ksR2FuZ3dvbi1kbyxTb3V0aCBLb3JlYQ";
    await makeClient().google.aiMode.search({ q: "weather", uule: wonju });
    expect(sent()).toEqual({ q: "weather", uule: wonju });
  });

  it("returns the location echo", async () => {
    const echo: AiModeLocation = {
      requested: "Jeju-si",
      resolved: "Jeju-si,Jeju-do,South Korea",
      latitude: null,
      longitude: null,
      uule: "w+CAIQICIbSmVqdS1zaSxKZWp1LWRvLFNvdXRoIEtvcmVh",
    };
    mockFetch({ text_blocks: [], references: [], query: "weather", country: "kr", location: echo });
    const answer = await makeClient().google.aiMode.search({ q: "weather", location: "Jeju-si" });
    expect(answer.location).toEqual(echo);
    expect(answer.country).toBe("kr");
  });

  it("surfaces a targeting 422 as ValidationError", async () => {
    mockFetch({ detail: "Use only one of location, uule, or lat/lon." }, 422);
    await expect(
      makeClient().google.aiMode.search({ q: "cafe", location: "Seoul", lat: 1, lon: 2 })
    ).rejects.toThrow(ValidationError);
  });
});
