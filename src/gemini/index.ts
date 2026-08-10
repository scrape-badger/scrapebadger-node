/**
 * Gemini API module.
 *
 * @module gemini
 */

export { GeminiClient } from "./client.js";
export { AskClient as GeminiAskClient } from "./ask.js";
export { BrandClient as GeminiBrandClient } from "./brand.js";

// Export all types
export type {
  // Request types
  GeminiWebSearchMode,
  GeminiAskParams,
  GeminiBrandVisibilityParams,
  // Source types
  GeminiCitation,
  GeminiSearchResult,
  // Brand types
  GeminiCompetitorMention,
  // Response types
  GeminiAskResponse,
  GeminiBrandVisibilityResponse,
} from "./types.js";
