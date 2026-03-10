import { describe, it, expect, vi } from "vitest";
import { createPaginatedResponse, paginate, collectAll } from "../src/internal/pagination.js";

describe("Pagination", () => {
  describe("createPaginatedResponse", () => {
    it("creates response with data and no cursor", () => {
      const response = createPaginatedResponse([1, 2, 3]);
      expect(response.data).toEqual([1, 2, 3]);
      expect(response.nextCursor).toBeUndefined();
      expect(response.hasMore).toBe(false);
    });

    it("creates response with data and cursor", () => {
      const response = createPaginatedResponse([1, 2, 3], "next-cursor");
      expect(response.data).toEqual([1, 2, 3]);
      expect(response.nextCursor).toBe("next-cursor");
      expect(response.hasMore).toBe(true);
    });

    it("handles empty data", () => {
      const response = createPaginatedResponse([]);
      expect(response.data).toEqual([]);
      expect(response.hasMore).toBe(false);
    });
  });

  describe("paginate", () => {
    // Helper to wrap a PaginatedResponse in the PageResult shape paginate() expects
    const page = (data: number[], nextCursor?: string) => ({
      response: { data, nextCursor, hasMore: !!nextCursor },
    });

    it("yields items from single page", async () => {
      const fetchPage = vi.fn().mockResolvedValueOnce(page([1, 2, 3]));

      const items: number[] = [];
      for await (const item of paginate(fetchPage)) {
        items.push(item);
      }

      expect(items).toEqual([1, 2, 3]);
      expect(fetchPage).toHaveBeenCalledTimes(1);
    });

    it("yields items from multiple pages", async () => {
      const fetchPage = vi
        .fn()
        .mockResolvedValueOnce(page([1, 2], "page2"))
        .mockResolvedValueOnce(page([3, 4], "page3"))
        .mockResolvedValueOnce(page([5]));

      const items: number[] = [];
      for await (const item of paginate(fetchPage)) {
        items.push(item);
      }

      expect(items).toEqual([1, 2, 3, 4, 5]);
      expect(fetchPage).toHaveBeenCalledTimes(3);
    });

    it("respects maxItems limit", async () => {
      const fetchPage = vi
        .fn()
        .mockResolvedValueOnce(page([1, 2, 3], "page2"))
        .mockResolvedValueOnce(page([4, 5, 6], "page3"));

      const items: number[] = [];
      for await (const item of paginate(fetchPage, { maxItems: 4 })) {
        items.push(item);
      }

      expect(items).toEqual([1, 2, 3, 4]);
    });

    it("handles empty first page", async () => {
      const fetchPage = vi.fn().mockResolvedValueOnce(page([]));

      const items: number[] = [];
      for await (const item of paginate(fetchPage)) {
        items.push(item);
      }

      expect(items).toEqual([]);
    });
  });

  describe("collectAll", () => {
    it("collects all items from generator", async () => {
      async function* generator(): AsyncGenerator<number> {
        yield 1;
        yield 2;
        yield 3;
      }

      const items = await collectAll(generator());
      expect(items).toEqual([1, 2, 3]);
    });

    it("handles empty generator", async () => {
      async function* generator(): AsyncGenerator<number> {
        // Empty generator
      }

      const items = await collectAll(generator());
      expect(items).toEqual([]);
    });
  });
});
