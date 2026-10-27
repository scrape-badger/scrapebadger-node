/**
 * Tests for the agent platform clients: quote, feedback, results and requests.
 *
 * Uses vitest and a fetch mock that intercepts calls made by BaseClient.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import { AgentClient, RequestsClient, ResultsClient } from "../src/agent/client.js";
import { NotFoundError, ServerError } from "../src/internal/exceptions.js";
import type { Quote } from "../src/agent/index.js";

function makeClient(): ScrapeBadger {
  return new ScrapeBadger({
    apiKey: "test-api-key",
    baseUrl: "https://api.scrapebadger.com",
    maxRetries: 0,
  });
}

function mockFetch(body: unknown, status = 200, headers: Record<string, string> = {}): void {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: new Headers({ "content-type": "application/json", ...headers }),
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    })
  );
}

function captured(): { url: URL; init: RequestInit } {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  const [url, init] = mock.mock.calls[0] as [string, RequestInit];
  return { url: new URL(url), init };
}

const QUOTE: Quote = {
  method: "GET",
  path: "/v1/google/search",
  scraper: "google",
  endpoint_pattern: "search",
  valid: false,
  errors: [{ field: "q", message: "required" }],
  billing: "flat",
  credits: { min: 0, max: 20, base: 20, per_item: 0 },
  usd: { max_per_call_list: 0.004, per_1k_calls_list: 4.0, per_1k_calls_best: 2.0 },
  latency: { p50_ms: 900, p95_ms: 2500, p99_ms: 6000, samples: 1234, window_days: 30 },
  notes: ["Empty or blocked results are not billed."],
};

const RECEIPT = { id: "fb-1", status: "received", message: "Thanks" };

describe("agent platform clients", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("are wired onto the top-level client", () => {
    const client = makeClient();
    expect(client.agent).toBeInstanceOf(AgentClient);
    expect(client.results).toBeInstanceOf(ResultsClient);
    expect(client.requests).toBeInstanceOf(RequestsClient);
  });

  describe("agent.quote()", () => {
    it("POSTs the call to /v1/quote and returns the quote", async () => {
      mockFetch(QUOTE);
      const quote = await makeClient().agent.quote("GET", "/v1/google/search", {
        params: { hl: "en" },
      });
      const { url, init } = captured();
      expect(url.pathname).toBe("/v1/quote");
      expect(init.method).toBe("POST");
      expect(JSON.parse(init.body as string)).toEqual({
        method: "GET",
        path: "/v1/google/search",
        params: { hl: "en" },
      });
      expect(quote.valid).toBe(false);
      expect(quote.errors[0]?.field).toBe("q");
      expect(quote.credits.max).toBe(20);
      expect(quote.latency?.p95_ms).toBe(2500);
    });

    it("sends a POST body", async () => {
      mockFetch({ ...QUOTE, billing: "dynamic" });
      await makeClient().agent.quote("POST", "web/scrape", { body: { url: "https://x.com" } });
      expect(JSON.parse(captured().init.body as string).body).toEqual({ url: "https://x.com" });
    });

    it("throws NotFoundError for an unknown endpoint", async () => {
      mockFetch({ error: "unknown_endpoint", detail: "No endpoint", suggestions: [] }, 404);
      await expect(makeClient().agent.quote("GET", "/v1/nope")).rejects.toBeInstanceOf(
        NotFoundError
      );
    });
  });

  describe("agent.feedback() / reportBug()", () => {
    it("feedback() defaults to type feedback and maps option names", async () => {
      mockFetch(RECEIPT, 201);
      const receipt = await makeClient().agent.feedback("Need a Maps photos endpoint", {
        details: "for listings",
      });
      expect(JSON.parse(captured().init.body as string)).toEqual({
        type: "feedback",
        summary: "Need a Maps photos endpoint",
        details: "for listings",
      });
      expect(receipt.id).toBe("fb-1");
    });

    it("reportBug() sends type bug with request_id", async () => {
      mockFetch(RECEIPT, 201);
      await makeClient().agent.reportBug("Empty results", {
        requestId: "req-1",
        endpoint: "/v1/google/search",
        contact: "me@example.com",
      });
      const { url, init } = captured();
      expect(url.pathname).toBe("/v1/feedback");
      expect(JSON.parse(init.body as string)).toEqual({
        type: "bug",
        summary: "Empty results",
        request_id: "req-1",
        endpoint: "/v1/google/search",
        contact: "me@example.com",
      });
    });
  });

  describe("results.get()", () => {
    it("sends plain (un-prefixed) view params", async () => {
      mockFetch(["a", "b"]);
      const data = await makeClient().results.get<string[]>("res-1", {
        jq: ".results[].title",
        fields: ["title", "link"],
        maxItems: 5,
        summary: true,
      });
      const { url } = captured();
      expect(url.pathname).toBe("/v1/results/res-1");
      expect(Object.fromEntries(url.searchParams)).toEqual({
        jq: ".results[].title",
        fields: "title,link",
        max_items: "5",
        summary: "true",
      });
      expect(data).toEqual(["a", "b"]);
    });

    it("sends no view params by default", async () => {
      mockFetch({ results: [] });
      await makeClient().results.get("res-1");
      expect([...captured().url.searchParams]).toEqual([]);
    });

    it("throws NotFoundError once the result expired", async () => {
      mockFetch({ error: "result_not_found", detail: "expired" }, 404);
      await expect(makeClient().results.get("gone")).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("requests.get()", () => {
    it("reports a running request (202)", async () => {
      mockFetch(
        {
          request_id: "req-1",
          status: "running",
          retry_after_seconds: 5,
          next_action: { method: "GET", url: "/v1/requests/req-1" },
        },
        202,
        { "Retry-After": "5" }
      );
      const state = await makeClient().requests.get("req-1");
      expect(captured().url.pathname).toBe("/v1/requests/req-1");
      expect(state.running).toBe(true);
      expect(state.status).toBe(202);
      expect(state.retryAfterSeconds).toBe(5);
      expect(state.resultId).toBeNull();
    });

    it("returns the original body and headers once done", async () => {
      mockFetch({ status: "ok", results: [1, 2] }, 200, {
        "X-Credits-Used": "20",
        "X-Result-ID": "req-1",
      });
      const state = await makeClient().requests.get("req-1");
      expect(state.running).toBe(false);
      expect(state.status).toBe(200);
      expect(state.retryAfterSeconds).toBeNull();
      expect(state.resultId).toBe("req-1");
      expect(state.creditsUsed).toBe(20);
      expect(state.data).toEqual({ status: "ok", results: [1, 2] });
    });

    it("throws the original call's error", async () => {
      mockFetch({ detail: "upstream failed" }, 502);
      await expect(makeClient().requests.get("req-1")).rejects.toBeInstanceOf(ServerError);
    });

    it("throws NotFoundError for an unknown request", async () => {
      mockFetch({ error: "request_not_found", detail: "not billed" }, 404);
      await expect(makeClient().requests.get("nope")).rejects.toBeInstanceOf(NotFoundError);
    });
  });

  describe("requests.batch()", () => {
    it("posts the items and callback_url and returns each outcome", async () => {
      mockFetch(
        {
          batch_id: "b-1",
          count: 2,
          accepted: 1,
          requests: [
            {
              index: 0,
              accepted: true,
              status: 202,
              request_id: "r-0",
              poll_url: "/v1/requests/r-0",
            },
            {
              index: 1,
              accepted: false,
              status: 429,
              request_id: "r-1",
              error: { detail: "Rate limit exceeded" },
            },
          ],
        },
        202
      );
      const items = ["a", "b"].map((prompt) => ({ path: "/v1/chatgpt/ask", query: { prompt } }));
      const sub = await makeClient().requests.batch(items, {
        callbackUrl: "https://example.com/hook",
      });
      const { url, init } = captured();
      expect(url.pathname).toBe("/v1/batch");
      expect(init.method).toBe("POST");
      expect(JSON.parse(init.body as string)).toEqual({
        requests: items,
        callback_url: "https://example.com/hook",
      });
      expect(sub.accepted).toBe(1);
      expect(sub.requests[0]?.poll_url).toBe("/v1/requests/r-0");
      expect(sub.requests[1]?.accepted).toBe(false);
    });

    it("omits callback_url when not given", async () => {
      mockFetch({ batch_id: "b-2", count: 1, accepted: 1, requests: [] }, 202);
      await makeClient().requests.batch([{ path: "/v1/google/search", query: { q: "x" } }]);
      expect(JSON.parse(captured().init.body as string)).not.toHaveProperty("callback_url");
    });
  });
});
