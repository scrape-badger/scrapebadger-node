/**
 * Tests for async requests (`client.requests`: submit, get, wait,
 * callbackStatus) and the account webhook endpoints (SCR-652).
 *
 * Uses vitest and a fetch mock that intercepts calls made by BaseClient.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import { WaitTimeoutError } from "../src/requests/client.js";
import {
  ConflictError,
  NotFoundError,
  PermissionDeniedError,
  RateLimitError,
  ScrapeBadgerError,
  ServerError,
  TimeoutError,
} from "../src/internal/exceptions.js";
import type { AsyncAccepted } from "../src/agent/index.js";

function makeClient(config: { maxRetries?: number; timeout?: number } = {}): ScrapeBadger {
  return new ScrapeBadger({
    apiKey: "test-api-key",
    baseUrl: "https://api.scrapebadger.com",
    maxRetries: 0,
    retryDelay: 1,
    ...config,
  });
}

interface MockResponse {
  ok: boolean;
  status: number;
  headers: Headers;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
}

function response(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
  contentType = "application/json"
): MockResponse {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": contentType, ...headers }),
    json: () => Promise.resolve(JSON.parse(text)),
    text: () => Promise.resolve(text),
  };
}

function mockFetch(...responses: Array<MockResponse | Error>): ReturnType<typeof vi.fn> {
  const fn = vi.fn();
  for (const r of responses) {
    if (r instanceof Error) fn.mockRejectedValueOnce(r);
    else fn.mockResolvedValueOnce(r);
  }
  vi.stubGlobal("fetch", fn);
  return fn;
}

/** A fetch failure the way undici reports one: TypeError("fetch failed") with a coded cause. */
function fetchFailed(code: string): TypeError {
  return Object.assign(new TypeError("fetch failed"), {
    cause: Object.assign(new Error(code), { code }),
  });
}

function call(n = 0): { url: URL; init: RequestInit; headers: Record<string, string> } {
  const [url, init] = vi.mocked(fetch).mock.calls[n] as [string, RequestInit];
  return { url: new URL(url), init, headers: init.headers as Record<string, string> };
}

const ACCEPTED: AsyncAccepted = {
  request_id: "req-1",
  status: "running",
  retry_after_seconds: 5,
  next_action: { method: "GET", url: "/v1/requests/req-1" },
};

const ACCEPTED_HEADERS = { Location: "/v1/requests/req-1", "Retry-After": "5" };

describe("requests.submit()", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("returns a running request on 202 and sends the async headers", async () => {
    mockFetch(response(ACCEPTED, 202, ACCEPTED_HEADERS));
    const run = await makeClient().requests.submit("/v1/perplexity/ask", {
      params: { prompt: "best crm", country: "us", skipped: undefined, alsoSkipped: null },
      callbackUrl: "https://example.com/hook",
      wait: 10,
      idempotencyKey: "crm-1",
    });

    const { url, init, headers } = call();
    expect(url.pathname).toBe("/v1/perplexity/ask");
    expect(Object.fromEntries(url.searchParams)).toEqual({ prompt: "best crm", country: "us" });
    expect(init.method).toBe("GET");
    expect(init.body).toBeUndefined();
    expect(headers.Prefer).toBe("respond-async, wait=10");
    expect(headers["X-Callback-URL"]).toBe("https://example.com/hook");
    expect(headers["Idempotency-Key"]).toBe("crm-1");

    expect(run.status).toBe("running");
    expect(run.running).toBe(true);
    expect(run.requestId).toBe("req-1");
    expect(run.statusCode).toBe(202);
    expect(run.retryAfterSeconds).toBe(5);
    expect(run.replayed).toBe(false);
    expect(run.headers.location).toBe("/v1/requests/req-1");
    expect(run.body).toEqual(ACCEPTED);
  });

  it("returns a completed request when the call finishes within wait (200 inline)", async () => {
    mockFetch(
      response({ answer: "HubSpot", sources: ["a"] }, 200, {
        "X-Request-ID": "req-2",
        "X-Credits-Used": "25",
      })
    );
    const done = await makeClient().requests.submit<{ answer: string }>("/v1/perplexity/ask", {
      params: { prompt: "best crm" },
      wait: 60,
    });
    expect(done.status).toBe("completed");
    expect(done.running).toBe(false);
    expect(done.requestId).toBe("req-2");
    expect(done.statusCode).toBe(200);
    expect(done.retryAfterSeconds).toBeNull();
    expect(done.creditsUsed).toBe(25);
    expect(done.headers["x-credits-used"]).toBe("25");
    expect(done.body.answer).toBe("HubSpot");
    expect(done.replayed).toBe(false);
  });

  it("returns a non-JSON body as text", async () => {
    mockFetch(response("<html>ok</html>", 200, { "X-Request-ID": "req-3" }, "text/html"));
    const done = await makeClient().requests.submit("/v1/web/scrape", { wait: 30 });
    expect(done.status).toBe("completed");
    expect(done.body).toBe("<html>ok</html>");

    mockFetch(response("a,b\n1,2", 200, {}, "text/csv"));
    const csv = await makeClient().requests.submit("/v1/web/scrape", { wait: 30 });
    expect(csv.body).toBe("a,b\n1,2");
  });

  it("sends Prefer: respond-async, wait=0 for a callback without a wait", async () => {
    mockFetch(response(ACCEPTED, 202, ACCEPTED_HEADERS));
    await makeClient().requests.submit("/v1/chatgpt/ask", {
      params: { prompt: "x" },
      callbackUrl: "https://example.com/hook",
    });
    expect(call().headers.Prefer).toBe("respond-async, wait=0");
  });

  it("sends plain Prefer: respond-async without a wait or callback", async () => {
    mockFetch(response(ACCEPTED, 202, ACCEPTED_HEADERS));
    await makeClient().requests.submit("/v1/chatgpt/ask", { params: { prompt: "x" } });
    const { headers } = call();
    expect(headers.Prefer).toBe("respond-async");
    expect(headers).not.toHaveProperty("X-Callback-URL");
    expect(headers).not.toHaveProperty("Idempotency-Key");
  });

  it("sends a JSON body with the method", async () => {
    mockFetch(response(ACCEPTED, 202, ACCEPTED_HEADERS));
    await makeClient().requests.submit("/v1/perplexity/ask", {
      method: "POST",
      body: { prompt: "best crm", strict_country: true },
    });
    const { init } = call();
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ prompt: "best crm", strict_country: true });
  });

  it("adds the /v1 prefix and refuses URLs", async () => {
    const fn = mockFetch(response(ACCEPTED, 202), response(ACCEPTED, 202));
    await makeClient().requests.submit("perplexity/ask");
    await makeClient().requests.submit("/v1/perplexity/ask");
    expect(call(0).url.pathname).toBe("/v1/perplexity/ask");
    expect(call(1).url.pathname).toBe("/v1/perplexity/ask");

    for (const bad of ["https://evil.example/v1/x", "//evil.example/v1/x"]) {
      await expect(makeClient().requests.submit(bad)).rejects.toBeInstanceOf(TypeError);
    }
    await expect(makeClient().requests.submit("/v1/x", { wait: -1 })).rejects.toBeInstanceOf(
      RangeError
    );
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("gives the fetch room for the wait", async () => {
    const timeout = vi.spyOn(globalThis, "setTimeout");
    mockFetch(response(ACCEPTED, 202));
    await makeClient({ timeout: 30_000 }).requests.submit("/v1/chatgpt/ask", { wait: 120 });
    expect(timeout.mock.calls.some((c) => c[1] === 135_000)).toBe(true);
  });

  it("marks an idempotent replay of a running call (Idempotent-Replayed)", async () => {
    mockFetch(response(ACCEPTED, 202, { ...ACCEPTED_HEADERS, "Idempotent-Replayed": "true" }));
    const run = await makeClient().requests.submit("/v1/perplexity/ask", {
      params: { prompt: "best crm" },
      idempotencyKey: "crm-1",
    });
    expect(run.status).toBe("running");
    expect(run.requestId).toBe("req-1");
    expect(run.replayed).toBe(true);
  });

  it("marks an idempotent replay of a completed call", async () => {
    mockFetch(
      response({ answer: "HubSpot" }, 200, {
        "Idempotent-Replayed": "true",
        "X-Request-ID": "req-1",
        "X-Credits-Used": "25",
      })
    );
    const done = await makeClient().requests.submit("/v1/perplexity/ask", {
      params: { prompt: "best crm" },
      idempotencyKey: "crm-1",
    });
    expect(done.status).toBe("completed");
    expect(done.replayed).toBe(true);
    expect(done.body).toEqual({ answer: "HubSpot" });
  });

  it("throws ConflictError when the key was used for another call", async () => {
    mockFetch(
      response({ error: "idempotency_key_reused", detail: "Key used for another call" }, 409)
    );
    await expect(
      makeClient().requests.submit("/v1/perplexity/ask", { idempotencyKey: "crm-1" })
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("throws a refusal before the call runs", async () => {
    mockFetch(response({ error: "async_not_supported", detail: "Not on this route" }, 400));
    const err = await makeClient()
      .requests.submit("/v1/account/me")
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ScrapeBadgerError);
    expect((err as Error).message).toContain("Not on this route");
  });

  it("never retries a timed-out submit without an idempotency key", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const abort = Object.assign(new Error("aborted"), { name: "AbortError" });
    const fn = mockFetch(abort, response(ACCEPTED, 202));
    await expect(
      makeClient({ maxRetries: 3 }).requests.submit("/v1/chatgpt/ask")
    ).rejects.toBeInstanceOf(TimeoutError);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("never retries a network fault without an idempotency key", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fn = mockFetch(new TypeError("fetch failed"), response(ACCEPTED, 202));
    await expect(
      makeClient({ maxRetries: 3 }).requests.submit("/v1/chatgpt/ask")
    ).rejects.toBeInstanceOf(TypeError);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries a connection that failed before anything was sent, even without a key", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const refused = Object.assign(new TypeError("fetch failed"), {
      cause: Object.assign(new AggregateError([]), {
        errors: [{ code: "ECONNREFUSED" }, { code: "ENETUNREACH" }],
      }),
    });
    const fn = mockFetch(fetchFailed("ENOTFOUND"), refused, response(ACCEPTED, 202));
    const run = await makeClient({ maxRetries: 3 }).requests.submit("/v1/chatgpt/ask");
    expect(fn).toHaveBeenCalledTimes(3);
    expect(run.status).toBe("running");
  });

  it("never retries a connection reset (the request may have been sent) without a key", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fn = mockFetch(fetchFailed("ECONNRESET"), response(ACCEPTED, 202));
    await expect(
      makeClient({ maxRetries: 3 }).requests.submit("/v1/chatgpt/ask")
    ).rejects.toBeInstanceOf(TypeError);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("never retries a 5xx or 429 without a key (a lost 202 would bill twice)", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    let fn = mockFetch(response({ detail: "edge timeout" }, 504), response(ACCEPTED, 202));
    await expect(
      makeClient({ maxRetries: 3 }).requests.submit("/v1/chatgpt/ask")
    ).rejects.toBeInstanceOf(ServerError);
    expect(fn).toHaveBeenCalledTimes(1);

    fn = mockFetch(response({ detail: "slow down" }, 429), response(ACCEPTED, 202));
    await expect(
      makeClient({ maxRetries: 3 }).requests.submit("/v1/chatgpt/ask")
    ).rejects.toBeInstanceOf(RateLimitError);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries a 5xx with an idempotency key", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fn = mockFetch(response({ detail: "edge timeout" }, 504), response(ACCEPTED, 202));
    const run = await makeClient({ maxRetries: 3 }).requests.submit("/v1/chatgpt/ask", {
      idempotencyKey: "k-1",
    });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(run.status).toBe("running");
  });

  it("retries a timed-out submit with an idempotency key (the replay is safe)", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const abort = Object.assign(new Error("aborted"), { name: "AbortError" });
    const fn = mockFetch(
      abort,
      response(ACCEPTED, 202, { ...ACCEPTED_HEADERS, "Idempotent-Replayed": "true" })
    );
    const run = await makeClient({ maxRetries: 3 }).requests.submit("/v1/chatgpt/ask", {
      idempotencyKey: "k-1",
    });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(call(1).headers["Idempotency-Key"]).toBe("k-1");
    expect(run.replayed).toBe(true);
  });

  it("does not retry a replayed error result", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fn = mockFetch(
      response({ detail: "no usable answer" }, 502, { "Idempotent-Replayed": "true" }),
      response({ answer: "x" }, 200)
    );
    await expect(
      makeClient({ maxRetries: 3 }).requests.submit("/v1/chatgpt/ask", { idempotencyKey: "k-1" })
    ).rejects.toBeInstanceOf(ServerError);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("requests.get()", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("returns a completed request with the original status, headers and body", async () => {
    mockFetch(response({ answer: "HubSpot" }, 200, { "X-Credits-Used": "25" }));
    const done = await makeClient().requests.get<{ answer: string }>("req/1");
    expect(call().url.pathname).toBe("/v1/requests/req%2F1");
    expect(done.status).toBe("completed");
    expect(done.requestId).toBe("req/1");
    expect(done.statusCode).toBe(200);
    expect(done.headers["x-credits-used"]).toBe("25");
    expect(done.body.answer).toBe("HubSpot");
    expect(done.creditsUsed).toBe(25);
    expect(done.replayed).toBe(false);
  });

  it("returns a running request with retryAfterSeconds from Retry-After", async () => {
    mockFetch(response(ACCEPTED, 202, { "Retry-After": "7" }));
    const run = await makeClient().requests.get("req-1");
    expect(run.status).toBe("running");
    expect(run.retryAfterSeconds).toBe(7);
  });

  it("falls back to the body's retry_after_seconds", async () => {
    mockFetch(response({ ...ACCEPTED, retry_after_seconds: 3 }, 202));
    const run = await makeClient().requests.get("req-1");
    expect(run.retryAfterSeconds).toBe(3);
  });
});

describe("requests.wait()", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
  });
  afterEach(() => vi.useRealTimers());

  it("polls until completed, pausing as long as Retry-After says", async () => {
    const fn = mockFetch(
      response(ACCEPTED, 202, { "Retry-After": "3" }),
      response(ACCEPTED, 202, { "Retry-After": "2" }),
      response({ answer: "HubSpot" }, 200)
    );
    const promise = makeClient().requests.wait("req-1", { timeoutMs: 60_000 });

    await vi.advanceTimersByTimeAsync(0);
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(2_999);
    expect(fn).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1_999);
    expect(fn).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(fn).toHaveBeenCalledTimes(3);

    const done = await promise;
    expect(done.status).toBe("completed");
    expect(done.body).toEqual({ answer: "HubSpot" });
    for (let i = 0; i < 3; i++) expect(call(i).url.pathname).toBe("/v1/requests/req-1");
  });

  it("throws WaitTimeoutError (a TimeoutError) when still running at the deadline", async () => {
    const running = (): MockResponse => response(ACCEPTED, 202, { "Retry-After": "5" });
    const fn = mockFetch(running(), running(), running(), running(), running());
    const promise = makeClient().requests.wait("req-1", { timeoutMs: 12_000 });
    const assertion = expect(promise).rejects.toSatisfy(
      (e: unknown) =>
        e instanceof WaitTimeoutError &&
        e instanceof TimeoutError &&
        e.requestId === "req-1" &&
        e.timeout === 12_000
    );
    await vi.advanceTimersByTimeAsync(13_000);
    await assertion;
    // Polls at 0, 5 s, 10 s and a last one at the 12 s deadline.
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("throws a stored error status at once, without retrying it", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fn = mockFetch(
      response({ detail: "no usable answer" }, 502),
      response({ answer: "x" }, 200)
    );
    const assertion = expect(
      makeClient({ maxRetries: 3 }).requests.wait("req-1")
    ).rejects.toBeInstanceOf(ServerError);
    await vi.advanceTimersByTimeAsync(10_000);
    await assertion;
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries a network fault while polling", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fn = mockFetch(fetchFailed("ECONNRESET"), response({ answer: "x" }, 200));
    const promise = makeClient({ maxRetries: 3 }).requests.wait("req-1");
    await vi.advanceTimersByTimeAsync(10);
    const done = await promise;
    expect(done.body).toEqual({ answer: "x" });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws the original call's error", async () => {
    mockFetch(response({ error: "request_not_found", detail: "expired" }, 404));
    const assertion = expect(makeClient().requests.wait("req-1")).rejects.toBeInstanceOf(
      NotFoundError
    );
    await vi.advanceTimersByTimeAsync(0);
    await assertion;
  });
});

describe("requests.callbackStatus()", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("GETs /v1/requests/{id}/callback", async () => {
    const status = {
      request_id: "req-1",
      state: "delivered",
      attempts: 1,
      last_status: 200,
      last_error: null,
      next_attempt_at: null,
      delivered_at: 1793138852,
      callback_host: "example.com",
    };
    mockFetch(response(status));
    const got = await makeClient().requests.callbackStatus("req-1");
    expect(call().url.pathname).toBe("/v1/requests/req-1/callback");
    expect(call().init.method).toBe("GET");
    expect(got).toEqual(status);
  });

  it("throws NotFoundError for a request without a callback", async () => {
    mockFetch(response({ error: "callback_not_found", detail: "No callback" }, 404));
    await expect(makeClient().requests.callbackStatus("req-1")).rejects.toBeInstanceOf(
      NotFoundError
    );
  });
});

describe("account webhook endpoints", () => {
  beforeEach(() => vi.restoreAllMocks());

  const SECRET = {
    secret: "whsec_test",
    signature_header: "X-ScrapeBadger-Signature",
    algorithm: "sha256=<hex HMAC-SHA256 of the raw request body>",
  };

  it("webhookSecret() GETs the secret", async () => {
    mockFetch(response(SECRET));
    const got = await makeClient().account.webhookSecret();
    expect(call().url.pathname).toBe("/v1/account/webhook-secret");
    expect(call().init.method).toBe("GET");
    expect(got.secret).toBe("whsec_test");
  });

  it("rotateWebhookSecret() POSTs the rotation", async () => {
    mockFetch(response({ ...SECRET, secret: "whsec_new" }));
    const got = await makeClient().account.rotateWebhookSecret();
    expect(call().url.pathname).toBe("/v1/account/webhook-secret/rotate");
    expect(call().init.method).toBe("POST");
    expect(got.secret).toBe("whsec_new");
  });

  it("webhookDeliveries() sends limit and returns the log", async () => {
    const log = {
      deliveries: [
        {
          request_id: "req-1",
          endpoint: "/v1/perplexity/ask",
          state: "failed",
          attempts: 4,
          last_status: 500,
          last_error: "http_500",
          created_at: 1793138800,
          delivered_at: null,
          callback_host: "example.com",
        },
      ],
      window_hours: 24,
    };
    mockFetch(response(log), response(log));
    const got = await makeClient().account.webhookDeliveries({ limit: 10 });
    expect(call().url.pathname).toBe("/v1/account/webhook-deliveries");
    expect(call().url.searchParams.get("limit")).toBe("10");
    expect(got.deliveries[0]?.state).toBe("failed");
    expect(got.window_hours).toBe(24);

    await makeClient().account.webhookDeliveries();
    expect(call(1).url.search).toBe("");
  });

  it("throws PermissionDeniedError for a key that is not full-access", async () => {
    mockFetch(
      response({ error: "full_access_required", detail: "Needs a full-access API key" }, 403)
    );
    const err = await makeClient()
      .account.webhookSecret()
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(PermissionDeniedError);
    expect((err as Error).message).toContain("full-access");
  });

  it("keeps the generated raw-object methods", () => {
    const account = makeClient().account;
    expect(typeof account.getAccountInfo).toBe("function");
    expect(typeof account.getTheWebhookSigningSecret).toBe("function");
    expect(typeof account.rotateTheWebhookSigningSecret).toBe("function");
  });
});
