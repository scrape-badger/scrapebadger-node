/**
 * Tests for StreamClient WebSocket methods and utility functions.
 *
 * The ws module is mocked at the module level so each test controls
 * what the fake WebSocket instance does.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { EventEmitter } from "node:events";

// ---------------------------------------------------------------------------
// Mock the ws module before any imports that use it.
// vi.hoisted() ensures the factory runs before vi.mock hoisting evaluates.
// ---------------------------------------------------------------------------

const { FakeWebSocket, getLastWs, resetLastWs } = vi.hoisted(() => {
  // We must import EventEmitter dynamically inside hoisted since normal
  // imports aren't available yet at hoist time.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { EventEmitter: EE } = require("node:events") as typeof import("node:events");

  let _lastWs: InstanceType<typeof _FakeWebSocket> | null = null;

  class _FakeWebSocket extends EE {
    readonly url: string;
    readonly options: unknown;
    sentMessages: string[] = [];

    constructor(url: string, options?: unknown) {
      super();
      this.url = url;
      this.options = options;
      _lastWs = this;
    }

    send(data: string): void {
      this.sentMessages.push(data);
    }

    close(code?: number, reason?: string | Buffer): void {
      const reasonStr = typeof reason === "string" ? reason : (reason?.toString() ?? "");
      this.emit("close", code ?? 1000, Buffer.from(reasonStr));
    }

    // -- Test helpers --
    receiveMessage(payload: Record<string, unknown>): void {
      this.emit("message", Buffer.from(JSON.stringify(payload)));
    }

    receiveClose(code = 1000, reason = ""): void {
      this.emit("close", code, Buffer.from(reason));
    }

    receiveError(message: string): void {
      this.emit("error", new Error(message));
    }
  }

  return {
    FakeWebSocket: _FakeWebSocket,
    getLastWs: () => _lastWs as _FakeWebSocket,
    resetLastWs: () => {
      _lastWs = null;
    },
  };
});

vi.mock("ws", () => {
  return { default: FakeWebSocket };
});

// ---------------------------------------------------------------------------
// Imports that depend on the mock (must come AFTER vi.mock)
// ---------------------------------------------------------------------------

import { wsUrlFromBase, parseEvent } from "../src/twitter/stream.js";
import { WebSocketStreamError } from "../src/internal/exceptions.js";
import { ScrapeBadger } from "../src/client.js";

// ---------------------------------------------------------------------------
// wsUrlFromBase utility
// ---------------------------------------------------------------------------

describe("wsUrlFromBase", () => {
  it("converts https to wss", () => {
    expect(wsUrlFromBase("https://scrapebadger.com")).toBe(
      "wss://scrapebadger.com/v1/twitter/stream"
    );
  });

  it("converts http to ws", () => {
    expect(wsUrlFromBase("http://localhost:8000")).toBe("ws://localhost:8000/v1/twitter/stream");
  });

  it("handles staging URL", () => {
    expect(wsUrlFromBase("https://staging.scrapebadger.com")).toBe(
      "wss://staging.scrapebadger.com/v1/twitter/stream"
    );
  });

  it("falls back to appending path for unknown scheme", () => {
    expect(wsUrlFromBase("custom://host")).toBe("custom://host/v1/twitter/stream");
  });
});

// ---------------------------------------------------------------------------
// parseEvent utility
// ---------------------------------------------------------------------------

describe("parseEvent", () => {
  it("parses a connected event", () => {
    const raw = {
      type: "connected",
      connection_id: "abc-123",
      api_key_id: "ak_test",
    };
    const event = parseEvent(raw);
    expect(event.type).toBe("connected");
    if (event.type === "connected") {
      expect(event.connectionId).toBe("abc-123");
      expect(event.apiKeyId).toBe("ak_test");
    }
  });

  it("parses a ping event", () => {
    const raw = { type: "ping", timestamp: "2026-03-03T10:00:00.000000+00:00" };
    const event = parseEvent(raw);
    expect(event.type).toBe("ping");
    if (event.type === "ping") {
      expect(event.timestamp).toBe("2026-03-03T10:00:00.000000+00:00");
    }
  });

  it("parses a tweet event with camelCase fields", () => {
    const raw = {
      type: "tweet",
      monitor_id: "monitor-uuid",
      tweet_id: "1895234567890123456",
      author_username: "elonmusk",
      tweet_published_at: "2026-03-03T09:59:57.123000+00:00",
      detected_at: "2026-03-03T10:00:00.456000+00:00",
      latency_ms: 3333,
      tweet: {
        id: "1895234567890123456",
        text: "Tweet content",
        favorite_count: 0,
        retweet_count: 0,
        reply_count: 0,
        media: [],
        urls: [],
        hashtags: [],
      },
    };
    const event = parseEvent(raw);
    expect(event.type).toBe("tweet");
    if (event.type === "tweet") {
      expect(event.monitorId).toBe("monitor-uuid");
      expect(event.tweetId).toBe("1895234567890123456");
      expect(event.authorUsername).toBe("elonmusk");
      expect(event.latencyMs).toBe(3333);
      expect(event.tweet.text).toBe("Tweet content");
    }
  });

  it("parses an error event", () => {
    const raw = { type: "error", code: 4001, message: "Invalid or missing API key" };
    const event = parseEvent(raw);
    expect(event.type).toBe("error");
    if (event.type === "error") {
      expect(event.code).toBe(4001);
      expect(event.message).toBe("Invalid or missing API key");
    }
  });

  it("returns an ErrorEvent with code 0 for unknown types", () => {
    const raw = { type: "unknown_type", data: "foo" };
    const event = parseEvent(raw);
    expect(event.type).toBe("error");
    if (event.type === "error") {
      expect(event.code).toBe(0);
      expect(event.message).toContain("Unknown event type");
    }
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeClient() {
  vi.stubGlobal("fetch", vi.fn());
  return new ScrapeBadger({ apiKey: "test-key", baseUrl: "http://localhost:8000" });
}

// ---------------------------------------------------------------------------
// StreamClient.connect() -- EventEmitter style
// ---------------------------------------------------------------------------

describe("StreamClient.connect() -- EventEmitter", () => {
  beforeEach(() => {
    resetLastWs();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("emits connected event when server sends connected message", async () => {
    const client = makeClient();
    const stream = client.twitter.stream.connect();

    const connectedPromise = new Promise<{ connectionId: string; apiKeyId: string }>((resolve) =>
      stream.on("connected", resolve as (e: unknown) => void)
    );

    getLastWs()!.receiveMessage({
      type: "connected",
      connection_id: "conn-uuid",
      api_key_id: "ak_test",
    });

    const event = await connectedPromise;
    expect(event.connectionId).toBe("conn-uuid");
    expect(event.apiKeyId).toBe("ak_test");

    stream.close();
  });

  it("emits tweet event on tweet message", async () => {
    const client = makeClient();
    const stream = client.twitter.stream.connect();

    const tweetPromise = new Promise<{ authorUsername: string; latencyMs: number }>((resolve) =>
      stream.on("tweet", resolve as (e: unknown) => void)
    );

    getLastWs()!.receiveMessage({
      type: "tweet",
      monitor_id: "monitor-1",
      tweet_id: "tweet-1",
      author_username: "elonmusk",
      tweet_published_at: "2026-03-03T10:00:00+00:00",
      detected_at: "2026-03-03T10:00:01+00:00",
      latency_ms: 1000,
      tweet: {
        id: "tweet-1",
        text: "Hello world",
        favorite_count: 0,
        retweet_count: 0,
        reply_count: 0,
        media: [],
        urls: [],
        hashtags: [],
      },
    });

    const event = await tweetPromise;
    expect(event.authorUsername).toBe("elonmusk");
    expect(event.latencyMs).toBe(1000);

    stream.close();
  });

  it("auto-sends pong on ping event and emits ping to caller", async () => {
    const client = makeClient();
    const stream = client.twitter.stream.connect();

    const pingPromise = new Promise<void>((resolve) => stream.on("ping", () => resolve()));

    getLastWs()!.receiveMessage({ type: "ping", timestamp: "2026-03-03T10:00:00+00:00" });

    await pingPromise;

    expect(getLastWs()!.sentMessages).toContain(JSON.stringify({ type: "pong" }));

    stream.close();
  });

  it("emits error with code 4001 on auth failure", async () => {
    const client = makeClient();
    const stream = client.twitter.stream.connect();

    const errorPromise = new Promise<WebSocketStreamError>((resolve) =>
      stream.on("error", resolve)
    );

    getLastWs()!.receiveMessage({ type: "error", code: 4001, message: "Invalid API key" });

    const err = await errorPromise;
    expect(err).toBeInstanceOf(WebSocketStreamError);
    expect(err.code).toBe(4001);
    expect(err.message).toBe("Invalid API key");

    stream.close();
  });

  it("emits error with code 4003 on connection limit", async () => {
    const client = makeClient();
    const stream = client.twitter.stream.connect();

    const errorPromise = new Promise<WebSocketStreamError>((resolve) =>
      stream.on("error", resolve)
    );

    getLastWs()!.receiveMessage({
      type: "error",
      code: 4003,
      message: "Connection limit exceeded",
    });

    const err = await errorPromise;
    expect(err).toBeInstanceOf(WebSocketStreamError);
    expect(err.code).toBe(4003);

    stream.close();
  });

  it("emits error on unexpected close when reconnect=false (default)", async () => {
    const client = makeClient();
    const stream = client.twitter.stream.connect({ reconnect: false });

    const errorPromise = new Promise<WebSocketStreamError>((resolve) =>
      stream.on("error", resolve)
    );

    getLastWs()!.receiveClose(1006, "Connection dropped");

    const err = await errorPromise;
    expect(err).toBeInstanceOf(WebSocketStreamError);
    expect(err.message).toContain("WebSocket closed");
  });

  it("emits close event after stream.close() is called", async () => {
    const client = makeClient();
    const stream = client.twitter.stream.connect();

    const closePromise = new Promise<void>((resolve) => stream.on("close", resolve));

    stream.close();

    await closePromise;
  });

  it("does not reconnect on auth failure even when reconnect=true", async () => {
    const client = makeClient();
    const stream = client.twitter.stream.connect({ reconnect: true, reconnectDelaySeconds: 5 });

    const errorPromise = new Promise<WebSocketStreamError>((resolve) =>
      stream.on("error", resolve)
    );

    getLastWs()!.receiveMessage({ type: "error", code: 4001, message: "Auth failed" });

    const err = await errorPromise;
    expect(err.code).toBe(4001);

    stream.close();
  });

  it("emits error when maxReconnects is exhausted", async () => {
    const client = makeClient();
    const stream = client.twitter.stream.connect({
      reconnect: true,
      reconnectDelaySeconds: 5,
      maxReconnects: 0,
    });

    const errors: WebSocketStreamError[] = [];
    stream.on("error", (e) => errors.push(e));

    const closePromise = new Promise<void>((resolve) => stream.on("close", resolve));

    // First close triggers reconnect check -- maxReconnects=0, so exhausted immediately
    getLastWs()!.receiveClose(1006, "");

    await closePromise;

    expect(errors.some((e) => e.message.includes("exhausted"))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// StreamClient.connectIter() -- AsyncIterator style
// ---------------------------------------------------------------------------

describe("StreamClient.connectIter() -- AsyncIterator", () => {
  beforeEach(() => {
    resetLastWs();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("yields connected and tweet events", async () => {
    const client = makeClient();
    const iter = client.twitter.stream.connectIter();

    setImmediate(() => {
      getLastWs()!.receiveMessage({
        type: "connected",
        connection_id: "conn-1",
        api_key_id: "ak_1",
      });
      getLastWs()!.receiveMessage({
        type: "tweet",
        monitor_id: "m1",
        tweet_id: "t1",
        author_username: "user",
        tweet_published_at: "2026-03-03T10:00:00+00:00",
        detected_at: "2026-03-03T10:00:01+00:00",
        latency_ms: 500,
        tweet: {
          id: "t1",
          text: "hi",
          favorite_count: 0,
          retweet_count: 0,
          reply_count: 0,
          media: [],
          urls: [],
          hashtags: [],
        },
      });
      getLastWs()!.receiveClose(1000, "");
    });

    const collected: { type: string }[] = [];
    for await (const event of iter) {
      collected.push(event as { type: string });
    }

    expect(collected).toHaveLength(2);
    expect(collected[0]!.type).toBe("connected");
    expect(collected[1]!.type).toBe("tweet");
  });

  it("auto-sends pong on ping without requiring caller to handle it", async () => {
    const client = makeClient();
    const iter = client.twitter.stream.connectIter();

    setImmediate(() => {
      getLastWs()!.receiveMessage({ type: "ping", timestamp: "2026-03-03T10:00:00+00:00" });
      getLastWs()!.receiveClose(1000, "");
    });

    const collected: { type: string }[] = [];
    for await (const event of iter) {
      collected.push(event as { type: string });
    }

    // ping IS yielded to the caller in the async iterator
    expect(collected.some((e) => e.type === "ping")).toBe(true);
    // pong was sent
    expect(getLastWs()!.sentMessages).toContain(JSON.stringify({ type: "pong" }));
  });

  it("throws WebSocketStreamError on auth failure (4001)", async () => {
    const client = makeClient();
    const iter = client.twitter.stream.connectIter();

    setImmediate(() => {
      getLastWs()!.receiveMessage({ type: "error", code: 4001, message: "Invalid API key" });
    });

    await expect(async () => {
      for await (const _event of iter) {
        // consume
      }
    }).rejects.toThrow(WebSocketStreamError);
  });

  it("throws WebSocketStreamError on connection limit (4003)", async () => {
    const client = makeClient();
    const iter = client.twitter.stream.connectIter();

    setImmediate(() => {
      getLastWs()!.receiveMessage({
        type: "error",
        code: 4003,
        message: "Connection limit exceeded",
      });
    });

    await expect(async () => {
      for await (const _event of iter) {
        // consume
      }
    }).rejects.toThrow(WebSocketStreamError);
  });

  it("returns cleanly on server close when reconnect=false", async () => {
    const client = makeClient();
    const iter = client.twitter.stream.connectIter({ reconnect: false });

    setImmediate(() => {
      getLastWs()!.receiveClose(1000, "");
    });

    const collected: unknown[] = [];
    for await (const event of iter) {
      collected.push(event);
    }
    expect(collected).toHaveLength(0);
  });

  it("throws after maxReconnects is exhausted with reconnect=true", async () => {
    const client = makeClient();
    const iter = client.twitter.stream.connectIter({
      reconnect: true,
      reconnectDelaySeconds: 5,
      maxReconnects: 0,
    });

    setImmediate(() => {
      getLastWs()!.receiveClose(1000, "");
    });

    await expect(async () => {
      for await (const _event of iter) {
        // consume
      }
    }).rejects.toThrow(WebSocketStreamError);
  });
});
