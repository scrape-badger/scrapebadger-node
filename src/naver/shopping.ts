/**
 * Naver Shopping API client.
 *
 * Shopping search (finder preview, catalog, price-compare, filtered), ranking
 * feeds (bestsellers, keywords, brands, deals, verticals, IT items), category
 * trees and DataLab insight.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  NaverDealsGender,
  NaverResponse,
  NaverShoppingBestsellersParams,
  NaverShoppingBrandCategoriesParams,
  NaverShoppingBrandRankParams,
  NaverShoppingCategoryTreeParams,
  NaverShoppingInsightParams,
  NaverShoppingKeywordPeriodsParams,
  NaverShoppingKeywordsParams,
  NaverShoppingSearchCatalogParams,
  NaverShoppingSearchFilteredParams,
  NaverShoppingSearchProductsParams,
  NaverShoppingVertical,
} from "./types.js";

/**
 * Client for Naver Shopping endpoints.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * const products = await client.naver.shopping.searchProducts("무선 이어폰");
 * const catalog = await client.naver.shopping.searchCatalog("아이폰 15", { sort: "LOW_PRICE" });
 * const best = await client.naver.shopping.bestsellers({ period_type: "WEEKLY" });
 * const insight = await client.naver.shopping.insight("50000000", "2026-01-01", "2026-01-31");
 * ```
 */
export class ShoppingClient {
  constructor(private readonly client: BaseClient) {}

  /**
   * Bestseller product ranking.
   *
   * @param params - Optional category, age bucket, sort and period.
   */
  async bestsellers(params: NaverShoppingBestsellersParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/bestsellers", {
      params: {
        category_id: params.category_id,
        age_type: params.age_type,
        sort_type: params.sort_type,
        period_type: params.period_type,
      },
    });
  }

  /**
   * Trending shopping keyword ranking.
   *
   * @param categoryId - Category id (required; `ALL` returns empty).
   * @param params - Optional age bucket, sort and period.
   */
  async keywords(
    categoryId: string,
    params: NaverShoppingKeywordsParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/keywords", {
      params: {
        category_id: categoryId,
        age_type: params.age_type,
        sort_type: params.sort_type,
        period_type: params.period_type,
      },
    });
  }

  /**
   * DataLab Shopping Insight — category keyword rank over a date range.
   *
   * @param categoryId - DataLab cid, e.g. `"50000000"`.
   * @param startDate - Range start, `YYYY-MM-DD`.
   * @param endDate - Range end, `YYYY-MM-DD`.
   * @param params - Optional time unit, demographics and count.
   */
  async insight(
    categoryId: string,
    startDate: string,
    endDate: string,
    params: NaverShoppingInsightParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/insight", {
      params: {
        category_id: categoryId,
        start_date: startDate,
        end_date: endDate,
        time_unit: params.time_unit,
        age: params.age,
        gender: params.gender,
        device: params.device,
        count: params.count,
      },
    });
  }

  /**
   * Static top-level shopping taxonomy (11 cids). Costs 0 credits.
   */
  async categories(): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/categories");
  }

  /**
   * Product search via the mobile integrated-search finder preview.
   *
   * @param query - Search keywords.
   * @param params - Optional `tab` (`m_view` | `m_shop`).
   */
  async searchProducts(
    query: string,
    params: NaverShoppingSearchProductsParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/search-products", {
      params: { query, tab: params.tab },
    });
  }

  /**
   * Query-dependent filter facets (BRAND / ATTRIBUTE) for a search term.
   *
   * @param query - Search keywords.
   */
  async searchFilters(query: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/search-filters", {
      params: { query },
    });
  }

  /**
   * Curated deal products (snxbest), gender-scoped.
   *
   * @param gender - `"M"` or `"F"` (required; blank returns `[]` upstream).
   */
  async deals(gender: NaverDealsGender): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/deals", {
      params: { gender },
    });
  }

  /**
   * Curated products for a snxbest vertical.
   *
   * @param vertical - `fashiontown`, `shoppinglive` or `logistics`.
   */
  async vertical(vertical: NaverShoppingVertical): Promise<NaverResponse> {
    return this.client.request<NaverResponse>(`/v1/naver/shopping/verticals/${vertical}`);
  }

  /**
   * Curated IT item card list.
   */
  async itItems(): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/it-items");
  }

  /**
   * Ranking category tree — DIV1 roots, or the DIV2 children of `parent_id`.
   *
   * @param params - Optional `parent_id`.
   */
  async categoryTree(params: NaverShoppingCategoryTreeParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/category-tree", {
      params: { parent_id: params.parent_id },
    });
  }

  /**
   * Filtered finder products via the ns-portal BFF (finite 10 pages x 8 slots).
   *
   * @param query - Search keywords.
   * @param params - Optional `brand_id` and `attribute_id` filters.
   */
  async searchFiltered(
    query: string,
    params: NaverShoppingSearchFilteredParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/search-filtered", {
      params: { query, brand_id: params.brand_id, attribute_id: params.attribute_id },
    });
  }

  /**
   * snxbest brand ranking (top 20 fixed list).
   *
   * @param params - Optional category, age bucket, sort and period.
   */
  async brandRank(params: NaverShoppingBrandRankParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/brand-rank", {
      params: {
        category_id: params.category_id,
        age_type: params.age_type,
        sort_type: params.sort_type,
        period_type: params.period_type,
      },
    });
  }

  /**
   * snxbest brand-ranking category tree (DIV1, or DIV2 children).
   *
   * @param params - Optional `parent_id`.
   */
  async brandCategories(params: NaverShoppingBrandCategoriesParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/brand-categories", {
      params: { parent_id: params.parent_id },
    });
  }

  /**
   * Available snxbest keyword-rank periods.
   *
   * @param params - Optional category, age bucket, sort and period.
   */
  async keywordPeriods(params: NaverShoppingKeywordPeriodsParams = {}): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/keyword-periods", {
      params: {
        category_id: params.category_id,
        age_type: params.age_type,
        sort_type: params.sort_type,
        period_type: params.period_type,
      },
    });
  }

  /**
   * Full-catalog shopping search (SSR page 1 + paged-composite-cards XHR).
   *
   * @param query - Search keywords (max 200 chars).
   * @param params - Optional `sort` and `page` (1..5).
   */
  async searchCatalog(
    query: string,
    params: NaverShoppingSearchCatalogParams = {}
  ): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/search-catalog", {
      params: { query, sort: params.sort, page: params.page },
    });
  }

  /**
   * Seller offers per catalog product from Naver's price-compare page.
   *
   * @param query - Search keywords (max 200 chars).
   */
  async priceCompare(query: string): Promise<NaverResponse> {
    return this.client.request<NaverResponse>("/v1/naver/shopping/price-compare", {
      params: { query },
    });
  }
}
