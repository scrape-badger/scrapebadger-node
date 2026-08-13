/**
 * Google Ads Transparency Center API module.
 *
 * @module googleads
 */

export { GoogleAdsClient } from "./client.js";

// Export all types
export type {
  // Creatives
  GoogleAdsCreative,
  GoogleAdsAppliedFilters,
  GoogleAdsCreativeVariation,
  // Political disclosure
  GoogleAdsPoliticalRegionSpend,
  GoogleAdsPoliticalDisclosure,
  // Advertisers
  GoogleAdsAdvertiserSuggestion,
  GoogleAdsAdvertiserAdMix,
  GoogleAdsAdvertiserSpendPoint,
  // Response envelopes
  GoogleAdsSearchResponse,
  GoogleAdsCreativeResponse,
  GoogleAdsAdvertisersResponse,
  GoogleAdsAdvertiserResponse,
  // Param enums
  GoogleAdsFormat,
  GoogleAdsPlatform,
  // Request params
  GoogleAdsSearchParams,
  GoogleAdsCreativeParams,
  GoogleAdsAdvertisersParams,
  GoogleAdsAdvertiserParams,
} from "./types.js";
