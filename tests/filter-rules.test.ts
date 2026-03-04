/**
 * Tests for StreamClient filter rule methods.
 *
 * Uses vitest and a simple fetch mock that intercepts calls made by BaseClient.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  FilterRuleResponse,
  FilterRuleListResponse,
  FilterRuleValidateResponse,
  FilterRuleDeliveryLogListResponse,
  FilterRulePricingTiersResponse,
} from "../src/twitter/stream-types.js";

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

const RULE_FIXTURE: FilterRuleResponse = {
  id: "rule-uuid-1",
  tag: "python news",
  query: "#python lang:en -is:retweet",
  interval_seconds: 60,
  status: "active",
  status_reason: null,
  webhook_url: null,
  webhook_secret_set: false,
  max_results_per_poll: 10,
  credits_per_rule_per_day: 100,
  pricing_tier: "Standard",
  created_at: "2026-03-04T00:00:00Z",
  updated_at: "2026-03-04T00:00:00Z",
};

// ---------------------------------------------------------------------------
// createFilterRule
// ---------------------------------------------------------------------------

describe("StreamClient.createFilterRule", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends POST to /v1/twitter/stream/filter-rules with required fields", async () => {
    mockFetch(RULE_FIXTURE);
    const client = makeClient();

    const result = await client.twitter.stream.createFilterRule({
      tag: "python news",
      query: "#python lang:en -is:retweet",
      interval_seconds: 60,
    });

    const { url, init } = capturedRequest();
    expect(url).toBe("https://api.scrapebadger.com/v1/twitter/stream/filter-rules");
    expect(init.method).toBe("POST");
    const sent = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(sent).toMatchObject({
      tag: "python news",
      query: "#python lang:en -is:retweet",
      interval_seconds: 60,
    });
    expect(result.id).toBe("rule-uuid-1");
    expect(result.pricing_tier).toBe("Standard");
  });

  it("includes optional fields when provided", async () => {
    mockFetch(RULE_FIXTURE);
    const client = makeClient();

    await client.twitter.stream.createFilterRule({
      tag: "python news",
      query: "#python",
      interval_seconds: 30,
      webhook_url: "https://example.com/hook",
      webhook_secret: "s3cr3t",
      max_results_per_poll: 20,
    });

    const { init } = capturedRequest();
    const sent = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(sent["webhook_url"]).toBe("https://example.com/hook");
    expect(sent["webhook_secret"]).toBe("s3cr3t");
    expect(sent["max_results_per_poll"]).toBe(20);
  });

  it("does not include optional fields when omitted", async () => {
    mockFetch(RULE_FIXTURE);
    const client = makeClient();

    await client.twitter.stream.createFilterRule({
      tag: "python news",
      query: "#python",
      interval_seconds: 30,
    });

    const { init } = capturedRequest();
    const sent = JSON.parse(init.body as string) as Record<string, unknown>;
    expect("webhook_url" in sent).toBe(false);
    expect("webhook_secret" in sent).toBe(false);
    expect("max_results_per_poll" in sent).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// listFilterRules
// ---------------------------------------------------------------------------

describe("StreamClient.listFilterRules", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/twitter/stream/filter-rules with defaults", async () => {
    const listResponse: FilterRuleListResponse = {
      rules: [RULE_FIXTURE],
      total: 1,
      limit: 20,
      offset: 0,
    };
    mockFetch(listResponse);
    const client = makeClient();

    const result = await client.twitter.stream.listFilterRules();

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain("/v1/twitter/stream/filter-rules");
    expect(url).toContain("limit=20");
    expect(url).toContain("offset=0");
    expect(result.rules).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it("passes status, limit, and offset as query params", async () => {
    mockFetch({ rules: [], total: 0, limit: 10, offset: 5 });
    const client = makeClient();

    await client.twitter.stream.listFilterRules({
      status: "paused",
      limit: 10,
      offset: 5,
    });

    const { url } = capturedRequest();
    expect(url).toContain("status=paused");
    expect(url).toContain("limit=10");
    expect(url).toContain("offset=5");
  });
});

// ---------------------------------------------------------------------------
// getFilterRule
// ---------------------------------------------------------------------------

describe("StreamClient.getFilterRule", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/twitter/stream/filter-rules/{id}", async () => {
    mockFetch(RULE_FIXTURE);
    const client = makeClient();

    const result = await client.twitter.stream.getFilterRule("rule-uuid-1");

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toBe(
      "https://api.scrapebadger.com/v1/twitter/stream/filter-rules/rule-uuid-1"
    );
    expect(result.id).toBe("rule-uuid-1");
  });
});

// ---------------------------------------------------------------------------
// updateFilterRule
// ---------------------------------------------------------------------------

describe("StreamClient.updateFilterRule", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends PATCH to /v1/twitter/stream/filter-rules/{id} with provided fields", async () => {
    const updated: FilterRuleResponse = { ...RULE_FIXTURE, interval_seconds: 120 };
    mockFetch(updated);
    const client = makeClient();

    const result = await client.twitter.stream.updateFilterRule("rule-uuid-1", {
      interval_seconds: 120,
    });

    const { url, init } = capturedRequest();
    expect(init.method).toBe("PATCH");
    expect(url).toBe(
      "https://api.scrapebadger.com/v1/twitter/stream/filter-rules/rule-uuid-1"
    );
    const sent = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(sent).toEqual({ interval_seconds: 120 });
    expect(result.interval_seconds).toBe(120);
  });

  it("sends all provided optional fields", async () => {
    mockFetch(RULE_FIXTURE);
    const client = makeClient();

    await client.twitter.stream.updateFilterRule("rule-uuid-1", {
      tag: "new tag",
      query: "new query",
      interval_seconds: 30,
      status: "paused",
      webhook_url: "https://example.com/new",
      webhook_secret: "newsecret",
      max_results_per_poll: 5,
    });

    const { init } = capturedRequest();
    const sent = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(sent).toMatchObject({
      tag: "new tag",
      query: "new query",
      interval_seconds: 30,
      status: "paused",
      webhook_url: "https://example.com/new",
      webhook_secret: "newsecret",
      max_results_per_poll: 5,
    });
  });

  it("sends empty body when no params provided", async () => {
    mockFetch(RULE_FIXTURE);
    const client = makeClient();

    await client.twitter.stream.updateFilterRule("rule-uuid-1", {});

    const { init } = capturedRequest();
    const sent = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(Object.keys(sent)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// deleteFilterRule
// ---------------------------------------------------------------------------

describe("StreamClient.deleteFilterRule", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends DELETE to /v1/twitter/stream/filter-rules/{id}", async () => {
    mockFetch({ detail: "Filter rule deleted" });
    const client = makeClient();

    await client.twitter.stream.deleteFilterRule("rule-uuid-1");

    const { url, init } = capturedRequest();
    expect(init.method).toBe("DELETE");
    expect(url).toBe(
      "https://api.scrapebadger.com/v1/twitter/stream/filter-rules/rule-uuid-1"
    );
  });
});

// ---------------------------------------------------------------------------
// validateFilterRuleQuery
// ---------------------------------------------------------------------------

describe("StreamClient.validateFilterRuleQuery", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends POST to /v1/twitter/stream/filter-rules/validate with query", async () => {
    const validateResponse: FilterRuleValidateResponse = {
      valid: true,
      sample_results: 42,
    };
    mockFetch(validateResponse);
    const client = makeClient();

    const result = await client.twitter.stream.validateFilterRuleQuery(
      "#python lang:en -is:retweet"
    );

    const { url, init } = capturedRequest();
    expect(init.method).toBe("POST");
    expect(url).toBe(
      "https://api.scrapebadger.com/v1/twitter/stream/filter-rules/validate"
    );
    const sent = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(sent["query"]).toBe("#python lang:en -is:retweet");
    expect(result.valid).toBe(true);
    expect(result.sample_results).toBe(42);
  });

  it("returns valid=false with error when query is invalid", async () => {
    const validateResponse: FilterRuleValidateResponse = {
      valid: false,
      error: "Unsupported operator near offset 3",
      sample_results: 0,
    };
    mockFetch(validateResponse);
    const client = makeClient();

    const result = await client.twitter.stream.validateFilterRuleQuery("BAD QUERY!!!");

    expect(result.valid).toBe(false);
    expect(result.error).toBe("Unsupported operator near offset 3");
    expect(result.sample_results).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// listFilterRuleLogs
// ---------------------------------------------------------------------------

describe("StreamClient.listFilterRuleLogs", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/twitter/stream/filter-rules/{id}/logs with defaults", async () => {
    const logsResponse: FilterRuleDeliveryLogListResponse = {
      logs: [],
      total: 0,
      limit: 20,
      offset: 0,
    };
    mockFetch(logsResponse);
    const client = makeClient();

    const result = await client.twitter.stream.listFilterRuleLogs("rule-uuid-1");

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toContain(
      "/v1/twitter/stream/filter-rules/rule-uuid-1/logs"
    );
    expect(url).toContain("limit=20");
    expect(url).toContain("offset=0");
    expect(url).toContain("sort=desc");
    expect(result.logs).toHaveLength(0);
  });

  it("passes limit, offset, deliveryStatus and sort as query params", async () => {
    mockFetch({ logs: [], total: 0, limit: 50, offset: 10 });
    const client = makeClient();

    await client.twitter.stream.listFilterRuleLogs("rule-uuid-1", {
      limit: 50,
      offset: 10,
      deliveryStatus: "webhook_delivered",
      sort: "asc",
    });

    const { url } = capturedRequest();
    expect(url).toContain("limit=50");
    expect(url).toContain("offset=10");
    expect(url).toContain("delivery_status=webhook_delivered");
    expect(url).toContain("sort=asc");
  });
});

// ---------------------------------------------------------------------------
// getFilterRulePricingTiers
// ---------------------------------------------------------------------------

describe("StreamClient.getFilterRulePricingTiers", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("sends GET to /v1/twitter/stream/filter-rules-pricing", async () => {
    const pricingResponse: FilterRulePricingTiersResponse = {
      tiers: [
        {
          id: "tier-uuid-1",
          tier_label: "Standard",
          max_interval_seconds: 300,
          credits_per_rule_per_day: 100,
          display_order: 1,
        },
      ],
    };
    mockFetch(pricingResponse);
    const client = makeClient();

    const result = await client.twitter.stream.getFilterRulePricingTiers();

    const { url, init } = capturedRequest();
    expect(init.method ?? "GET").toBe("GET");
    expect(url).toBe(
      "https://api.scrapebadger.com/v1/twitter/stream/filter-rules-pricing"
    );
    expect(result.tiers).toHaveLength(1);
    expect(result.tiers[0].tier_label).toBe("Standard");
  });
});
