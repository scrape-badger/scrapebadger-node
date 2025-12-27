import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";

describe("ScrapeBadger", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("constructor", () => {
    it("creates client with API key from config", () => {
      const client = new ScrapeBadger({ apiKey: "test-api-key" });
      expect(client).toBeInstanceOf(ScrapeBadger);
      expect(client.twitter).toBeDefined();
    });

    it("creates client with API key from environment", () => {
      process.env.SCRAPEBADGER_API_KEY = "env-api-key";
      const client = new ScrapeBadger();
      expect(client).toBeInstanceOf(ScrapeBadger);
    });

    it("throws error when no API key is provided", () => {
      delete process.env.SCRAPEBADGER_API_KEY;
      expect(() => new ScrapeBadger()).toThrow("API key is required");
    });

    it("prefers config API key over environment", () => {
      process.env.SCRAPEBADGER_API_KEY = "env-api-key";
      const client = new ScrapeBadger({ apiKey: "config-api-key" });
      expect(client).toBeInstanceOf(ScrapeBadger);
    });

    it("accepts custom configuration", () => {
      const client = new ScrapeBadger({
        apiKey: "test-api-key",
        baseUrl: "https://custom.api.com",
        timeout: 60000,
        maxRetries: 5,
        retryDelay: 2000,
      });
      expect(client).toBeInstanceOf(ScrapeBadger);
    });
  });

  describe("twitter client", () => {
    it("has tweets client", () => {
      const client = new ScrapeBadger({ apiKey: "test-api-key" });
      expect(client.twitter.tweets).toBeDefined();
    });

    it("has users client", () => {
      const client = new ScrapeBadger({ apiKey: "test-api-key" });
      expect(client.twitter.users).toBeDefined();
    });

    it("has lists client", () => {
      const client = new ScrapeBadger({ apiKey: "test-api-key" });
      expect(client.twitter.lists).toBeDefined();
    });

    it("has communities client", () => {
      const client = new ScrapeBadger({ apiKey: "test-api-key" });
      expect(client.twitter.communities).toBeDefined();
    });

    it("has trends client", () => {
      const client = new ScrapeBadger({ apiKey: "test-api-key" });
      expect(client.twitter.trends).toBeDefined();
    });

    it("has geo client", () => {
      const client = new ScrapeBadger({ apiKey: "test-api-key" });
      expect(client.twitter.geo).toBeDefined();
    });
  });
});
