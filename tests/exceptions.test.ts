import { describe, it, expect, vi } from "vitest";
import {
  ScrapeBadgerError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  ServerError,
  TimeoutError,
  InsufficientCreditsError,
  AccountRestrictedError,
  ConflictError,
} from "../src/internal/exceptions.js";

describe("Exceptions", () => {
  describe("ScrapeBadgerError", () => {
    it("creates error with message", () => {
      const error = new ScrapeBadgerError("Test error");
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("ScrapeBadgerError");
    });

    it("is instance of Error", () => {
      const error = new ScrapeBadgerError("Test error");
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("AuthenticationError", () => {
    it("creates error with default message", () => {
      const error = new AuthenticationError();
      expect(error.message).toBe("Authentication failed. Check your API key.");
      expect(error.name).toBe("AuthenticationError");
    });

    it("creates error with custom message", () => {
      const error = new AuthenticationError("Invalid key");
      expect(error.message).toBe("Invalid key");
    });

    it("is instance of ScrapeBadgerError", () => {
      const error = new AuthenticationError();
      expect(error).toBeInstanceOf(ScrapeBadgerError);
    });
  });

  describe("RateLimitError", () => {
    it("creates error with default message", () => {
      const error = new RateLimitError();
      expect(error.message).toBe("Rate limit exceeded.");
      expect(error.name).toBe("RateLimitError");
    });

    it("stores retry information", () => {
      const error = new RateLimitError("Rate limit", {
        retryAfter: 1234567890,
        limit: 100,
        remaining: 0,
      });
      expect(error.retryAfter).toBe(1234567890);
      expect(error.limit).toBe(100);
      expect(error.remaining).toBe(0);
    });
  });

  describe("NotFoundError", () => {
    it("creates error with resource info", () => {
      const error = new NotFoundError("Tweet not found", "tweet", "123");
      expect(error.message).toBe("Tweet not found");
      expect(error.resourceType).toBe("tweet");
      expect(error.resourceId).toBe("123");
    });
  });

  describe("ValidationError", () => {
    it("stores validation errors", () => {
      const errors = { username: ["Required"] };
      const error = new ValidationError("Validation failed", errors);
      expect(error.errors).toEqual(errors);
    });
  });

  describe("ServerError", () => {
    it("stores status code", () => {
      const error = new ServerError("Server error", 503);
      expect(error.statusCode).toBe(503);
    });

    it("defaults to 500", () => {
      const error = new ServerError();
      expect(error.statusCode).toBe(500);
    });
  });

  describe("TimeoutError", () => {
    it("stores timeout duration", () => {
      const error = new TimeoutError("Timeout", 30000);
      expect(error.timeout).toBe(30000);
    });
  });

  describe("InsufficientCreditsError", () => {
    it("stores credits balance", () => {
      const error = new InsufficientCreditsError("No credits", 0);
      expect(error.creditsBalance).toBe(0);
    });
  });

  describe("AccountRestrictedError", () => {
    it("stores restriction reason", () => {
      const error = new AccountRestrictedError("Restricted", "TOS violation");
      expect(error.reason).toBe("TOS violation");
    });
  });

  describe("ConflictError", () => {
    it("should be instance of ScrapeBadgerError", () => {
      const err = new ConflictError("Monitor already exists");
      expect(err).toBeInstanceOf(ScrapeBadgerError);
      expect(err).toBeInstanceOf(ConflictError);
      expect(err.name).toBe("ConflictError");
    });

    it("should have the correct message", () => {
      const err = new ConflictError("Monitor already exists");
      expect(err.message).toBe("Monitor already exists");
    });

    it("should use default message when none provided", () => {
      const err = new ConflictError();
      expect(err.message).toBe("Resource conflict.");
    });

    it("should be instance of Error", () => {
      const err = new ConflictError("conflict");
      expect(err).toBeInstanceOf(Error);
    });

    it("should be thrown on HTTP 409", async () => {
      const { BaseClient } = await import("../src/internal/client.js");
      const { resolveConfig } = await import("../src/internal/config.js");

      const config = resolveConfig({ apiKey: "test-key" });
      const client = new BaseClient(config);

      // Mock fetch to return 409
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: "Monitor name already exists" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        })
      );
      vi.stubGlobal("fetch", mockFetch);

      try {
        await client.request("/v1/twitter/stream/monitors", {
          method: "POST",
          body: { name: "Existing Monitor" },
        });
        expect.fail("Should have thrown ConflictError");
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictError);
        expect((err as ConflictError).message).toBe("Monitor name already exists");
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });
});
