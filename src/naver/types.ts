/**
 * Naver API types.
 *
 * Naver is South Korea's #1 portal — web/news/blog search, Place (local),
 * Shopping (search, rankings, DataLab insight), SmartStore / brand stores,
 * commerce products, reviews & Q&A, and Shopping Live broadcasts, channels
 * and shortclips.
 *
 * Responses are passed through from the scraper service, whose payloads vary
 * widely across the 55 endpoints (SERP docs, ranking rows, Place graphs,
 * commerce product graphs, live-broadcast product lists). Like the Google
 * module, every call therefore returns a loose {@link NaverResponse} rather
 * than a narrow per-endpoint shape that would drift from upstream. Request
 * parameters, which the SDK owns, are typed precisely.
 *
 * @module naver
 */

/**
 * A Naver API response.
 *
 * An untyped JSON object — the concrete shape depends on the endpoint. Index
 * into it with the field names from the API docs (e.g. `results`, `reviews`,
 * `products`, `broadcast`).
 */
export type NaverResponse = Record<string, unknown>;

// ---------------------------------------------------------------------------
// Search family
// ---------------------------------------------------------------------------

/** Sort order for the news vertical. */
export type NaverNewsSort = "relevance" | "recent" | "old";

/** Options for {@link SearchClient.search}. */
export interface NaverSearchParams {
  /** Result page, 1-based. 1..40 (clamped); with `view: "more"`, 1..10. */
  page?: number;
  /** `"more"` for the extended (`ur.all`) view. */
  view?: "more";
}

/** Options for {@link SearchClient.news}. */
export interface NaverNewsParams {
  /** Result page, 1-based (1..40). */
  page?: number;
  /** Sort order (default `relevance`). */
  sort?: NaverNewsSort;
}

/** Options for {@link SearchClient.blog}. */
export interface NaverBlogParams {
  /** Result page, 1-based (1..40). */
  page?: number;
}

// ---------------------------------------------------------------------------
// Places family
// ---------------------------------------------------------------------------

/** Options for {@link PlacesClient.local}. */
export interface NaverLocalParams {
  /** Result offset (>=1). Its presence switches to the paged placeList lane. */
  start?: number;
  /** Results per page (1..100). */
  display?: number;
  /** Search-centre longitude to bias results. */
  x?: number;
  /** Search-centre latitude to bias results. */
  y?: number;
}

/** Options for {@link PlacesClient.reviews}. */
export interface NaverPlaceReviewsParams {
  /** Opaque `after` cursor from a prior page. */
  cursor?: string;
  /** Reviews per page (1..50, default 20). */
  size?: number;
}

/** Visitor-review photos vs. owner/place photos. */
export type NaverPlaceMediaSource = "placeReview" | "biz";

/** Options for {@link PlacesClient.photos}. */
export interface NaverPlacePhotosParams {
  /**
   * `placeReview` = visitor-review photos (default); `biz` = owner/place
   * photos.
   */
  media_source?: NaverPlaceMediaSource;
  /** Opaque `lastCursor` from a prior page. */
  cursor?: string;
}

// ---------------------------------------------------------------------------
// Shopping family
// ---------------------------------------------------------------------------

/** Ranking window for bestseller / keyword rankings. */
export type NaverPeriodType = "DAILY" | "WEEKLY";

/** Options for {@link ShoppingClient.bestsellers}. */
export interface NaverShoppingBestsellersParams {
  /** Category id or `"ALL"` (default `ALL`). */
  category_id?: string;
  /** Shopper age bucket or `"ALL"` (default `ALL`). */
  age_type?: string;
  /** Ranking metric (default `PRODUCT_CLICK`). */
  sort_type?: "PRODUCT_CLICK" | "PRODUCT_BUY";
  /** Ranking window (default `DAILY`). */
  period_type?: NaverPeriodType;
}

/** Options for {@link ShoppingClient.keywords}. */
export interface NaverShoppingKeywordsParams {
  /** Shopper age bucket or `"ALL"` (default `ALL`). */
  age_type?: string;
  /** Ranking metric (default `KEYWORD_POPULAR`). */
  sort_type?: string;
  /** Ranking window (default `WEEKLY`). */
  period_type?: NaverPeriodType;
}

/** DataLab aggregation unit for shopping insight. */
export type NaverInsightTimeUnit = "date" | "week" | "month";

/** Options for {@link ShoppingClient.insight}. */
export interface NaverShoppingInsightParams {
  /** Aggregation unit (default `date`). */
  time_unit?: NaverInsightTimeUnit;
  /** Age filter. */
  age?: string;
  /** Gender filter. */
  gender?: "" | "f" | "m";
  /** Device filter. */
  device?: "" | "pc" | "mo";
  /** Top keywords to return (1..100, default 20). */
  count?: number;
}

/** Preview tab for {@link ShoppingClient.searchProducts}. */
export type NaverShoppingSearchTab = "m_view" | "m_shop";

/** Options for {@link ShoppingClient.searchProducts}. */
export interface NaverShoppingSearchProductsParams {
  /** Preview tab (default `m_view`). */
  tab?: NaverShoppingSearchTab;
}

/** Options for {@link ShoppingClient.categoryTree}. */
export interface NaverShoppingCategoryTreeParams {
  /** Parent id — DIV1 roots when omitted, else the DIV2 children. */
  parent_id?: string;
}

/** Options for {@link ShoppingClient.searchFiltered}. */
export interface NaverShoppingSearchFilteredParams {
  /** Finder filterSet brand value id (`^[0-9]{1,12}$`) -> `brandIds`. */
  brand_id?: string;
  /** Finder filterSet attribute value id -> `attributeIds`. */
  attribute_id?: string;
}

/** Options for {@link ShoppingClient.brandRank}. */
export interface NaverShoppingBrandRankParams {
  /** Category id `A` or 8 digits (default `A`). */
  category_id?: string;
  /** Shopper age bucket (default `ALL`). */
  age_type?: string;
  /** Ranking metric (default `BRAND_POPULAR`). */
  sort_type?: "BRAND_POPULAR" | "BRAND_ISSUE";
  /** Ranking window (default `WEEKLY`). */
  period_type?: "WEEKLY" | "MONTHLY";
}

/** Options for {@link ShoppingClient.brandCategories}. */
export interface NaverShoppingBrandCategoriesParams {
  /** Parent id (8 digits) — DIV1 roots when omitted, else the DIV2 children. */
  parent_id?: string;
}

/** Options for {@link ShoppingClient.keywordPeriods}. */
export interface NaverShoppingKeywordPeriodsParams {
  /** Category id `A` or 8 digits (default `A`). */
  category_id?: string;
  /** Shopper age bucket (default `ALL`). */
  age_type?: string;
  /** Ranking metric (default `KEYWORD_NEW`). */
  sort_type?: "KEYWORD_NEW";
  /** Ranking window (default `WEEKLY`). */
  period_type?: "WEEKLY" | "MONTHLY";
}

/** Sort order for the catalog search. */
export type NaverCatalogSort =
  "RECOMMEND" | "LOW_PRICE" | "HIGH_PRICE" | "PURCHASE" | "REVIEW" | "RECENT";

/** Options for {@link ShoppingClient.searchCatalog}. */
export interface NaverShoppingSearchCatalogParams {
  /** Sort order (default `RECOMMEND`, which includes sponsored AD slots). */
  sort?: NaverCatalogSort;
  /** Page 1..5; page 1 is SSR, pages 2+ are the paged-composite-cards XHR. */
  page?: number;
}

/** Gender scope for {@link ShoppingClient.deals}. */
export type NaverDealsGender = "M" | "F";

/** Shopping vertical for {@link ShoppingClient.vertical}. */
export type NaverShoppingVertical = "fashiontown" | "shoppinglive" | "logistics";

// ---------------------------------------------------------------------------
// Stores family
// ---------------------------------------------------------------------------

/** Storefront host — SmartStore vs. a brand store. */
export type NaverStoreHost = "smartstore" | "brand";

/** Options for {@link StoresClient.get} and {@link StoresClient.categories}. */
export interface NaverStoreParams {
  /** Storefront host (default `smartstore`). */
  host?: NaverStoreHost;
}

/** Options for {@link StoresClient.products}. */
export interface NaverStoreProductsParams {
  /** Storefront host (default `smartstore`). */
  host?: NaverStoreHost;
  /** Scope the listing to one store category. */
  category_id?: string;
  /** Result page, 1-based (default 1). */
  page?: number;
  /** Results per page (default 20). */
  size?: number;
  /** Sort order (default `POPULARITY`). */
  sort?: string;
  /**
   * Storefront channel uid. With `host: "smartstore"` it routes the listing
   * through the brand-host same-origin lane; omitted uses the SSR path.
   */
  channel_uid?: string;
}

/** Options for {@link StoresClient.bestsellers}. */
export interface NaverStoreBestsellersParams {
  /** Storefront host (default `smartstore`). */
  host?: NaverStoreHost;
  /** Ranking window (default `DAILY`). */
  period?: "REALTIME" | "DAILY" | "WEEKLY" | "MONTHLY";
}

// ---------------------------------------------------------------------------
// Content family
// ---------------------------------------------------------------------------

/** Options for the paged content verticals (cafe, kin, image, video, clip, web). */
export interface NaverContentParams {
  /** Result page, 1-based (default 1). */
  page?: number;
}

// ---------------------------------------------------------------------------
// Reviews / products family
// ---------------------------------------------------------------------------

/** Options for {@link ReviewsClient.productReviewSummary}. */
export interface NaverProductReviewSummaryParams {
  /**
   * `detailCategorizeCategoryId` if present, else `smallCategorizeCategoryId`.
   * Derived from the product detail category when omitted.
   */
  leaf_category_id?: string;
}

/** Review list sort order. */
export type NaverProductReviewSort = "REVIEW_RANKING" | "REVIEW_CREATE_DATE_DESC";

/** Options for {@link ReviewsClient.productReviews}. */
export interface NaverProductReviewsParams {
  /** Store/brand slug (required). */
  store_url: string;
  /** Channel product no — the storefront `/products/{no}` id (required). */
  product_no: string;
  /** Storefront host (default `smartstore`). */
  host?: NaverStoreHost;
  /** Accepted for family symmetry; unused for reviews. */
  channel_uid?: string;
  /** SmartStore only; passed through when known, never invented. */
  checkout_merchant_no?: number;
  /** Result page, 1-based (default 1). */
  page?: number;
  /** Sort order (default `REVIEW_RANKING`). */
  sort?: NaverProductReviewSort;
}

/** Options for {@link ReviewsClient.productQnas}. */
export interface NaverProductQnasParams {
  /** Store/brand slug (required). */
  store_url: string;
  /** Channel product no — the storefront `/products/{no}` id (required). */
  product_no: string;
  /** Storefront host (default `smartstore`). */
  host?: NaverStoreHost;
  /** Storefront channel uid; required for `host: "smartstore"`. */
  channel_uid?: string;
  /** Result page, 1-based (default 1). */
  page?: number;
}

/** Options for {@link ProductsClient.get}. */
export interface NaverProductDetailParams {
  /** Storefront host (default `brand`). */
  host?: NaverStoreHost;
  /** Store slug; required when `channel_uid` is omitted. */
  store_url?: string;
  /** Opaque storefront channel key; overrides store-home resolution. */
  channel_uid?: string;
  /** SmartStore partial-enrich only. */
  broadcast_id?: string;
  /** SmartStore partial-enrich only. */
  live_channel_id?: string;
  /** SmartStore partial-enrich only: `m.search` query matched to the card. */
  query?: string;
}

// ---------------------------------------------------------------------------
// Shopping Live family
// ---------------------------------------------------------------------------

/** Options for {@link ShoppingLiveClient.broadcastProducts}. */
export interface NaverLiveBroadcastProductsParams {
  /** 0-based page; omit for the first page (page 1 returns an empty list). */
  page?: number;
  /** Products per page (1..200); omit for the upstream default. */
  size?: number;
}

/** Options for {@link ShoppingLiveClient.channelProducts}. */
export interface NaverLiveChannelProductsParams {
  /** Cursor (`^\d{1,25}$`) from a prior page. */
  next?: string;
  /** Products per page (1..100); omit for the upstream default (10). */
  size?: number;
}

/** Sort order for channel shortclips. */
export type NaverLiveShortclipSort = "LATEST" | "VIEW" | "RECOMMEND";

/** Options for {@link ShoppingLiveClient.channelShortclips}. */
export interface NaverLiveChannelShortclipsParams {
  /** Sort order; omit for the upstream default. */
  sort_type?: NaverLiveShortclipSort;
  /** Cursor (`^\d{1,25}$`) from a prior page. */
  next?: string;
  /** Clips per page (1..100); omit for the upstream default (10). */
  size?: number;
}

/** Live product attachment type. */
export type NaverLiveAttachmentType = "MAIN" | "SUB";

/** Options for {@link ShoppingLiveClient.shortclipProducts}. */
export interface NaverLiveShortclipProductsParams {
  /** Attachment type filter. */
  attachment_type?: NaverLiveAttachmentType;
  /** 0-based page. */
  page?: number;
  /** Products per page (1..100). */
  size?: number;
  /** Sort order. */
  sort?: "RECOMMEND" | "POPULAR";
}

/** Options for {@link ShoppingLiveClient.replayProducts}. */
export interface NaverLiveReplayProductsParams {
  /** Include pre-start products (default true). */
  include_before?: boolean;
  /** Cursor (`^-?\d{1,25}$`); `0` = from the beginning (default `"0"`). */
  next?: string;
}

/** Options for {@link ShoppingLiveClient.broadcastProductCategories}. */
export interface NaverLiveBroadcastProductCategoriesParams {
  /** Attachment type filter. */
  attachment_type?: NaverLiveAttachmentType;
}
