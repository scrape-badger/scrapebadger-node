/**
 * Tests for the ChatGPT API client.
 *
 * Uses vitest and a simple fetch mock that intercepts calls made by BaseClient.
 * Focus: query-string building (defaults omitted, string[] joined with commas)
 * and that the response types match the API contract field-for-field.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  ChatGPTAskResponse,
  ChatGPTBrandVisibilityResponse,
  ChatGPTModelsResponse,
} from "../src/chatgpt/types.js";

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

function capturedUrl(): URL {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  return new URL(mock.mock.calls[0][0] as string);
}

const ASK_FIXTURE: ChatGPTAskResponse = {
  prompt: "best running shoes 2026",
  answer: "Plain text answer.",
  answer_markdown: "**Markdown** answer.",
  citations: [
    {
      url: "https://reuters.com/a",
      title: "A headline",
      snippet: "A snippet",
      domain: "reuters.com",
      attribution: "Reuters",
      pub_date_utc: 1754300000,
      published_at: "2026-08-04T10:00:00Z",
      start_index: 12,
      end_index: 48,
      matched_text: "the supported span",
    },
  ],
  search_results: [
    {
      url: "https://example.com/b",
      title: "Another page",
      snippet: "Another snippet",
      domain: "example.com",
      attribution: null,
      pub_date_utc: null,
      published_at: null,
      ref_index: 3,
      cited: false,
    },
  ],
  source_domains: ["reuters.com", "example.com"],
  web_search_triggered: true,
  reference_tokens: ["turn0search1", "turn0news20"],
  model: "gpt-5-5",
  conversation_id: "conv-1",
  message_id: "msg-1",
  country: "US",
  answer_length: 18,
  citation_count: 1,
  latency_ms: 24310,
  created_utc: 1754400000,
  created_at: "2026-08-05T10:00:00Z",
};

const BRAND_FIXTURE: ChatGPTBrandVisibilityResponse = {
  prompt: "best web scraping API",
  brand: "ScrapeBadger",
  domain: "scrapebadger.com",
  mentioned: true,
  mention_count: 3,
  first_position: 42,
  position_score: 0.83,
  share_of_voice_pct: 37.5,
  cited: true,
  cited_urls: ["https://scrapebadger.com/"],
  citation_rank: 2,
  competitors: [
    {
      name: "Bright Data",
      mentioned: true,
      mention_count: 5,
      first_position: 10,
      cited: true,
      cited_urls: ["https://brightdata.com/"],
    },
  ],
  excerpt: "...ScrapeBadger is a...",
  answer: "Plain text answer.",
  citations: [],
  web_search_triggered: true,
  model: "gpt-5-5",
  country: "US",
  latency_ms: 27100,
  created_utc: 1754400000,
  created_at: "2026-08-05T10:00:00Z",
};

const MODELS_FIXTURE: ChatGPTModelsResponse = {
  models: [
    {
      slug: "gpt-5-5",
      title: "GPT-5.5",
      description: "Great for most questions",
      max_tokens: 128000,
      tags: ["default"],
    },
  ],
  count: 1,
};

describe("ChatGPT ask", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("hits /v1/chatgpt/ask and omits unset params", async () => {
    mockFetch(ASK_FIXTURE);
    const client = makeClient();

    const result = await client.chatgpt.ask.ask({ prompt: "best running shoes 2026" });

    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/chatgpt/ask");
    expect(url.searchParams.get("prompt")).toBe("best running shoes 2026");
    expect(url.searchParams.has("country")).toBe(false);
    expect(url.searchParams.has("web_search")).toBe(false);

    expect(result.web_search_triggered).toBe(true);
    expect(result.citations[0].start_index).toBe(12);
    expect(result.search_results[0].cited).toBe(false);
    expect(result.reference_tokens).toEqual(["turn0search1", "turn0news20"]);
  });

  it("forwards country and web_search", async () => {
    mockFetch(ASK_FIXTURE);
    const client = makeClient();

    await client.chatgpt.ask.ask({
      prompt: "q",
      country: "GB",
      web_search: "force",
    });

    const url = capturedUrl();
    expect(url.searchParams.get("country")).toBe("GB");
    expect(url.searchParams.get("web_search")).toBe("force");
  });
});

describe("ChatGPT brand visibility", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("joins aliases and competitors with commas", async () => {
    mockFetch(BRAND_FIXTURE);
    const client = makeClient();

    const result = await client.chatgpt.brand.visibility({
      prompt: "best web scraping API",
      brand: "ScrapeBadger",
      domain: "scrapebadger.com",
      aliases: ["Scrape Badger"],
      competitors: ["Bright Data", "Apify"],
      country: "DE",
    });

    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/chatgpt/brand-visibility");
    expect(url.searchParams.get("brand")).toBe("ScrapeBadger");
    expect(url.searchParams.get("aliases")).toBe("Scrape Badger");
    expect(url.searchParams.get("competitors")).toBe("Bright Data,Apify");
    expect(url.searchParams.get("country")).toBe("DE");

    expect(result.share_of_voice_pct).toBe(37.5);
    expect(result.competitors[0].cited_urls).toEqual(["https://brightdata.com/"]);
  });

  it("omits empty arrays rather than sending an empty string", async () => {
    mockFetch(BRAND_FIXTURE);
    const client = makeClient();

    await client.chatgpt.brand.visibility({
      prompt: "q",
      brand: "ScrapeBadger",
      aliases: [],
      competitors: [],
    });

    const url = capturedUrl();
    expect(url.searchParams.has("aliases")).toBe(false);
    expect(url.searchParams.has("competitors")).toBe(false);
    expect(url.searchParams.has("domain")).toBe(false);
  });
});

describe("ChatGPT reference", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("hits /v1/chatgpt/models", async () => {
    mockFetch(MODELS_FIXTURE);
    const client = makeClient();

    const result = await client.chatgpt.reference.models({ country: "GB" });

    const url = capturedUrl();
    expect(url.pathname).toBe("/v1/chatgpt/models");
    expect(url.searchParams.get("country")).toBe("GB");

    expect(result.count).toBe(1);
    expect(result.models[0].slug).toBe("gpt-5-5");
    expect(result.models[0].max_tokens).toBe(128000);
  });
});
