/**
 * Apple App Store API module.
 *
 * @module appstore
 */

export { AppStoreClient } from "./client.js";

// Export all types
export type {
  // Storefront value objects (AppStoreApp.extras)
  AppStoreScreenshot,
  AppStoreInAppPurchase,
  AppStoreRatingHistogram,
  AppStorePrivacyType,
  AppStoreAppExtras,
  // App
  AppStoreApp,
  // Reviews
  AppStoreReview,
  // Charts
  AppStoreChartEntry,
  // Developer
  AppStoreDeveloper,
  // Reference
  AppStoreGenre,
  AppStoreMarket,
  // Response envelopes
  AppStoreSearchResponse,
  AppStoreReviewsResponse,
  AppStoreChartsResponse,
  AppStoreDeveloperResponse,
  AppStoreGenresResponse,
  AppStoreMarketsResponse,
  // Param enums
  AppStoreEntity,
  AppStoreReviewSort,
  AppStoreChartType,
  AppStoreChartEntity,
  // Request params
  AppStoreSearchParams,
  AppStoreAppParams,
  AppStoreReviewsParams,
  AppStoreDeveloperParams,
  AppStoreChartsParams,
} from "./types.js";
