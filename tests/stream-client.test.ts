import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import {
  InsufficientCreditsError,
  NotFoundError,
  ScrapeBadgerError,
} from "../src/internal/exceptions.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMonitor(overrides: Record<string, unknown> = {}) {
  return {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "My Monitor",
    usernames: ["elonmusk", "naval"],
    poll_interval_seconds: 5.0,
    status: "active",
    status_reason: null,
    webhook_url: null,
    webhook_secret_set: false,
    estimated_credits_per_hour: 1440.0,
    pricing_tier: "Ultra",
    created_at: "2026-03-03T10:00:00+00:00",
    updated_at: "2026-03-03T10:00:00+00:00",
    ...overrides,
  };
}

function makeMonitorList(monitors: unknown[] = [], overrides: Record<string, unknown> = {}) {
  return {
    monitors,
    total: monitors.length,
    page: 1,
    page_size: 20,
    ...overrides,
  };
}

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "application/json" },
    json: async () => body,
    text: async () => JSON.stringify(body),
  });
}

function getClient() {
  return new ScrapeBadger({ apiKey: "test-key", baseUrl: "http://localhost:8000" });
}

// ---------------------------------------------------------------------------
// createMonitor
// ---------------------------------------------------------------------------

describe("StreamClient REST methods", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("createMonitor", () => {
    it("creates a monitor with minimal params", async () => {
      const monitor = makeMonitor();
      vi.stubGlobal("fetch", mockFetch(200, monitor));

      const client = getClient();
      const result = await client.twitter.stream.createMonitor({
        name: "My Monitor",
        usernames: ["elonmusk", "naval"],
        pollIntervalSeconds: 5.0,
      });

      expect(result.id).toBe(monitor.id);
      expect(result.name).toBe("My Monitor");
      expect(result.poll_interval_seconds).toBe(5.0);

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body as string) as Record<string, unknown>;
      expect(requestBody["poll_interval_seconds"]).toBe(5.0);
      expect(requestBody["webhook_url"]).toBeUndefined();
    });

    it("creates a monitor with webhook params", async () => {
      const monitor = makeMonitor({
        webhook_url: "https://example.com/hook",
        webhook_secret_set: true,
      });
      vi.stubGlobal("fetch", mockFetch(200, monitor));

      const client = getClient();
      const result = await client.twitter.stream.createMonitor({
        name: "My Monitor",
        usernames: ["elonmusk"],
        pollIntervalSeconds: 10,
        webhookUrl: "https://example.com/hook",
        webhookSecret: "my-secret",
      });

      expect(result.webhook_url).toBe("https://example.com/hook");
      expect(result.webhook_secret_set).toBe(true);

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body as string) as Record<string, unknown>;
      expect(requestBody["webhook_url"]).toBe("https://example.com/hook");
      expect(requestBody["webhook_secret"]).toBe("my-secret");
    });

    it("throws InsufficientCreditsError on 402", async () => {
      vi.stubGlobal(
        "fetch",
        mockFetch(402, { detail: "Insufficient credits", credits_balance: 0 })
      );

      const client = getClient();
      await expect(
        client.twitter.stream.createMonitor({
          name: "My Monitor",
          usernames: ["elonmusk"],
          pollIntervalSeconds: 5,
        })
      ).rejects.toThrow(InsufficientCreditsError);
    });

    it("throws ScrapeBadgerError on 409 name conflict", async () => {
      vi.stubGlobal("fetch", mockFetch(409, { detail: "Monitor name already exists" }));

      const client = getClient();
      await expect(
        client.twitter.stream.createMonitor({
          name: "My Monitor",
          usernames: ["elonmusk"],
          pollIntervalSeconds: 5,
        })
      ).rejects.toThrow(ScrapeBadgerError);
    });
  });

  // ---------------------------------------------------------------------------
  // listMonitors
  // ---------------------------------------------------------------------------

  describe("listMonitors", () => {
    it("returns all monitors without filter", async () => {
      const list = makeMonitorList([makeMonitor(), makeMonitor({ id: "another-id" })]);
      vi.stubGlobal("fetch", mockFetch(200, list));

      const client = getClient();
      const result = await client.twitter.stream.listMonitors();

      expect(result.total).toBe(2);
      expect(result.monitors).toHaveLength(2);
    });

    it("passes status filter as query param", async () => {
      const list = makeMonitorList([makeMonitor()]);
      vi.stubGlobal("fetch", mockFetch(200, list));

      const client = getClient();
      await client.twitter.stream.listMonitors({ status: "active" });

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const url = fetchCall[0] as string;
      expect(url).toContain("status=active");
    });

    it("passes pagination params", async () => {
      const list = makeMonitorList([], { page: 2, page_size: 10 });
      vi.stubGlobal("fetch", mockFetch(200, list));

      const client = getClient();
      await client.twitter.stream.listMonitors({ page: 2, pageSize: 10 });

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const url = fetchCall[0] as string;
      expect(url).toContain("page=2");
      expect(url).toContain("page_size=10");
    });
  });

  // ---------------------------------------------------------------------------
  // getMonitor
  // ---------------------------------------------------------------------------

  describe("getMonitor", () => {
    it("fetches a monitor by ID", async () => {
      const monitor = makeMonitor();
      vi.stubGlobal("fetch", mockFetch(200, monitor));

      const client = getClient();
      const result = await client.twitter.stream.getMonitor("550e8400-e29b-41d4-a716-446655440001");

      expect(result.id).toBe(monitor.id);
    });

    it("throws NotFoundError on 404", async () => {
      vi.stubGlobal("fetch", mockFetch(404, { detail: "Monitor not found" }));

      const client = getClient();
      await expect(client.twitter.stream.getMonitor("nonexistent-id")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  // ---------------------------------------------------------------------------
  // updateMonitor
  // ---------------------------------------------------------------------------

  describe("updateMonitor", () => {
    it("sends only defined fields in PATCH body", async () => {
      const monitor = makeMonitor({ poll_interval_seconds: 60.0, pricing_tier: "Low" });
      vi.stubGlobal("fetch", mockFetch(200, monitor));

      const client = getClient();
      await client.twitter.stream.updateMonitor("550e8400-e29b-41d4-a716-446655440001", {
        pollIntervalSeconds: 60.0,
      });

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body as string) as Record<string, unknown>;
      // Only poll_interval_seconds should be sent
      expect(requestBody["poll_interval_seconds"]).toBe(60.0);
      expect(requestBody["name"]).toBeUndefined();
      expect(requestBody["usernames"]).toBeUndefined();
      expect(requestBody["status"]).toBeUndefined();
    });

    it("uses PATCH method", async () => {
      vi.stubGlobal("fetch", mockFetch(200, makeMonitor()));

      const client = getClient();
      await client.twitter.stream.updateMonitor("some-id", { name: "New Name" });

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect((fetchCall[1] as RequestInit).method).toBe("PATCH");
    });

    it("throws NotFoundError on 404", async () => {
      vi.stubGlobal("fetch", mockFetch(404, { detail: "Monitor not found" }));

      const client = getClient();
      await expect(
        client.twitter.stream.updateMonitor("nonexistent-id", { name: "New" })
      ).rejects.toThrow(NotFoundError);
    });
  });

  // ---------------------------------------------------------------------------
  // pauseMonitor / resumeMonitor
  // ---------------------------------------------------------------------------

  describe("pauseMonitor", () => {
    it("sends status=paused", async () => {
      const monitor = makeMonitor({ status: "paused" });
      vi.stubGlobal("fetch", mockFetch(200, monitor));

      const client = getClient();
      const result = await client.twitter.stream.pauseMonitor("some-id");

      expect(result.status).toBe("paused");
      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body as string) as Record<string, unknown>;
      expect(requestBody["status"]).toBe("paused");
    });
  });

  describe("resumeMonitor", () => {
    it("sends status=active", async () => {
      const monitor = makeMonitor({ status: "active" });
      vi.stubGlobal("fetch", mockFetch(200, monitor));

      const client = getClient();
      const result = await client.twitter.stream.resumeMonitor("some-id");

      expect(result.status).toBe("active");
      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body as string) as Record<string, unknown>;
      expect(requestBody["status"]).toBe("active");
    });

    it("throws InsufficientCreditsError on 402", async () => {
      vi.stubGlobal(
        "fetch",
        mockFetch(402, { detail: "Insufficient credits", credits_balance: 5 })
      );

      const client = getClient();
      await expect(client.twitter.stream.resumeMonitor("some-id")).rejects.toThrow(
        InsufficientCreditsError
      );
    });
  });

  // ---------------------------------------------------------------------------
  // deleteMonitor
  // ---------------------------------------------------------------------------

  describe("deleteMonitor", () => {
    it("returns void on success", async () => {
      // 204 No Content -- empty body
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 204,
          headers: { get: () => null },
          json: async () => {
            throw new Error("no body");
          },
          text: async () => "",
        })
      );

      const client = getClient();
      const result = await client.twitter.stream.deleteMonitor("some-id");

      expect(result).toBeUndefined();
    });

    it("uses DELETE method", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 204,
          headers: { get: () => null },
          json: async () => {
            throw new Error("no body");
          },
          text: async () => "",
        })
      );

      const client = getClient();
      await client.twitter.stream.deleteMonitor("some-id");

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      expect((fetchCall[1] as RequestInit).method).toBe("DELETE");
    });

    it("throws NotFoundError on 404", async () => {
      vi.stubGlobal("fetch", mockFetch(404, { detail: "Monitor not found" }));

      const client = getClient();
      await expect(client.twitter.stream.deleteMonitor("nonexistent-id")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  // ---------------------------------------------------------------------------
  // listDeliveryLogs
  // ---------------------------------------------------------------------------

  describe("listDeliveryLogs", () => {
    it("returns paginated delivery logs", async () => {
      const logList = {
        logs: [
          {
            id: "log-1",
            monitor_id: "monitor-1",
            monitor_name: "My Monitor",
            tweet_id: "tweet-1",
            author_username: "elonmusk",
            tweet_text_preview: "Hello world",
            tweet_url: "https://twitter.com/elonmusk/status/tweet-1",
            tweet_published_at: "2026-03-03T10:00:00+00:00",
            detected_at: "2026-03-03T10:00:01+00:00",
            latency_ms: 1000,
            latency_badge: "green",
            delivery_status: "websocket_delivered",
            webhook_status_code: null,
            webhook_attempts: 0,
          },
        ],
        total: 1,
        page: 1,
        page_size: 20,
      };
      vi.stubGlobal("fetch", mockFetch(200, logList));

      const client = getClient();
      const result = await client.twitter.stream.listDeliveryLogs();

      expect(result.logs).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("passes filter params", async () => {
      vi.stubGlobal("fetch", mockFetch(200, { logs: [], total: 0, page: 1, page_size: 20 }));

      const client = getClient();
      await client.twitter.stream.listDeliveryLogs({
        monitorId: "monitor-id",
        authorUsername: "elonmusk",
        deliveryStatus: "webhook_delivered",
      });

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const url = fetchCall[0] as string;
      expect(url).toContain("monitor_id=monitor-id");
      expect(url).toContain("author_username=elonmusk");
      expect(url).toContain("delivery_status=webhook_delivered");
    });
  });

  // ---------------------------------------------------------------------------
  // listBillingLogs
  // ---------------------------------------------------------------------------

  describe("listBillingLogs", () => {
    it("returns paginated billing logs", async () => {
      const logList = {
        logs: [
          {
            id: "billing-1",
            monitor_id: "monitor-1",
            monitor_name: "My Monitor",
            billed_at: "2026-03-03T10:00:00+00:00",
            num_accounts: 2,
            credits_deducted: 10.0,
            tier_label: "Ultra",
            rate_applied: 5.0,
          },
        ],
        total: 1,
        page: 1,
        page_size: 20,
      };
      vi.stubGlobal("fetch", mockFetch(200, logList));

      const client = getClient();
      const result = await client.twitter.stream.listBillingLogs();

      expect(result.logs).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("passes monitorId filter", async () => {
      vi.stubGlobal("fetch", mockFetch(200, { logs: [], total: 0, page: 1, page_size: 20 }));

      const client = getClient();
      await client.twitter.stream.listBillingLogs({ monitorId: "some-monitor-id" });

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const url = fetchCall[0] as string;
      expect(url).toContain("monitor_id=some-monitor-id");
    });
  });

  // ---------------------------------------------------------------------------
  // stream property on TwitterClient
  // ---------------------------------------------------------------------------

  describe("stream client on TwitterClient", () => {
    it("is accessible via client.twitter.stream", () => {
      const client = getClient();
      expect(client.twitter.stream).toBeDefined();
    });
  });
});
