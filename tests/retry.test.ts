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
const jsonResponse = (status: number, body: unknown = {}): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
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
