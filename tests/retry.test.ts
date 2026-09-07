import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BaseClient } from "../src/internal/client.js";
import { resolveConfig } from "../src/internal/config.js";
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
  ServerError,
} from "../src/internal/exceptions.js";

/** Build a JSON Response the client's handleResponse understands. */
const jsonResponse = (
  status: number,
  body: unknown = {},
  headers: Record<string, string> = {}
): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });

/** Client with a near-zero backoff so tests don't actually wait. */
const makeClient = (maxRetries = 5): BaseClient =>
  new BaseClient(resolveConfig({ apiKey: "test-key", maxRetries, retryDelay: 1 }));

describe("retry behaviour", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    // The retry path logs a warning per attempt; keep test output readable.
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe("transient server errors", () => {
    // Regression: ServerError extends ScrapeBadgerError, and the retry loop
    // rethrew every ScrapeBadgerError except RateLimitError — so no 5xx was
    // ever retried and the ServerError warning branch was dead code.
    it.each([500, 502, 503, 504])(
      "retries a %i and returns the eventual success",
      async (status) => {
        fetchMock
          .mockResolvedValueOnce(jsonResponse(status, { detail: "upstream blip" }))
          .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

        const result = await makeClient().request<{ ok: boolean }>("/v1/test");

        expect(result).toEqual({ ok: true });
        expect(fetchMock).toHaveBeenCalledTimes(2);
      }
    );

    it("recovers from the real-world 502 then 500 sequence", async () => {
      fetchMock
        .mockResolvedValueOnce(jsonResponse(502, { detail: "Bad Gateway" }))
        .mockResolvedValueOnce(jsonResponse(500, { detail: "Internal Server Error" }))
        .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

      const result = await makeClient().request<{ ok: boolean }>("/v1/test");

      expect(result).toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("gives up with a ServerError once retries are exhausted", async () => {
      // A fresh Response per call — a body can only be consumed once.
      fetchMock.mockImplementation(() =>
        Promise.resolve(jsonResponse(503, { detail: "still down" }))
      );

      await expect(makeClient(2).request("/v1/test")).rejects.toBeInstanceOf(ServerError);
      // initial attempt + 2 retries
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });
  });

  describe("Retry-After backpressure", () => {
    beforeEach(() => {
      vi.stubEnv("TZ", "America/New_York");
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-09-07T12:00:00Z"));
    });

    afterEach(() => vi.unstubAllEnvs());

    it.each([
      [503, "5", 5000],
      [503, "Mon, 07 Sep 2026 12:00:07 GMT", 7000],
      [503, "Monday, 07-Sep-26 12:00:07 GMT", 7000],
      [503, "Mon Sep  7 12:00:07 2026", 7000],
      [429, "5", 5000],
    ])("waits for a %i Retry-After %s before retrying", async (status, header, delay) => {
      fetchMock
        .mockResolvedValueOnce(
          jsonResponse(status, { reset_at: Date.now() / 1000 + 1 }, { "Retry-After": header })
        )
        .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

      const result = makeClient().request("/v1/google/ai-mode/search");
      await vi.advanceTimersByTimeAsync(delay - 1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);
      await expect(result).resolves.toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it.each([
      "",
      "invalid",
      "-1",
      "-2",
      "1.5",
      "Infinity",
      "NaN",
      "999999999999999999999999",
      "2026-09-08",
      "9.8.2026",
      "08 Sep 2026",
      "Mon Sep 07 2026 12:00:07 GMT+0000",
      "Mon, 07 Sep 2026 11:59:00 GMT",
    ])("uses normal backoff for an unusable Retry-After %s", async (header) => {
      fetchMock
        .mockResolvedValueOnce(jsonResponse(503, {}, { "Retry-After": header }))
        .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

      const result = makeClient().request("/v1/test");
      await vi.advanceTimersByTimeAsync(0);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);
      await expect(result).resolves.toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("does not shorten a longer configured backoff", async () => {
      fetchMock
        .mockResolvedValueOnce(jsonResponse(503, {}, { "Retry-After": "1" }))
        .mockResolvedValueOnce(jsonResponse(200, { ok: true }));
      const client = new BaseClient(resolveConfig({ apiKey: "test-key", retryDelay: 6000 }));

      const result = client.request("/v1/test");
      await vi.advanceTimersByTimeAsync(5999);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);
      await expect(result).resolves.toEqual({ ok: true });
    });

    it("does not carry a previous response's delay into a network retry", async () => {
      fetchMock
        .mockResolvedValueOnce(jsonResponse(503, {}, { "Retry-After": "5" }))
        .mockRejectedValueOnce(new TypeError("fetch failed"))
        .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

      const result = makeClient().request("/v1/test");
      await vi.advanceTimersByTimeAsync(5001);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      await vi.advanceTimersByTimeAsync(1);
      await expect(result).resolves.toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("does not add retries when they are disabled", async () => {
      fetchMock.mockResolvedValueOnce(jsonResponse(503, {}, { "Retry-After": "5" }));

      await expect(makeClient(0).request("/v1/test")).rejects.toBeInstanceOf(ServerError);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe("timeouts and network faults", () => {
    it("retries a request timeout", async () => {
      const abort = new Error("The operation was aborted");
      abort.name = "AbortError";
      fetchMock.mockRejectedValueOnce(abort).mockResolvedValueOnce(jsonResponse(200, { ok: true }));

      const result = await makeClient().request<{ ok: boolean }>("/v1/test");

      expect(result).toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("retries a raw network failure from fetch", async () => {
      fetchMock
        .mockRejectedValueOnce(new TypeError("fetch failed"))
        .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

      const result = await makeClient().request<{ ok: boolean }>("/v1/test");

      expect(result).toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe("client errors are final", () => {
    it.each([
      [401, AuthenticationError],
      [404, NotFoundError],
      [422, ValidationError],
    ])("does not retry a %i", async (status, expected) => {
      fetchMock.mockImplementation(() => Promise.resolve(jsonResponse(status, { detail: "nope" })));

      await expect(makeClient().request("/v1/test")).rejects.toBeInstanceOf(expected);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
