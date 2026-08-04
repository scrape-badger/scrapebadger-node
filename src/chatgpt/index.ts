/**
 * ChatGPT API module.
 *
 * @module chatgpt
 */

export { ChatGPTClient } from "./client.js";
export { AskClient as ChatGPTAskClient } from "./ask.js";
export { BrandClient as ChatGPTBrandClient } from "./brand.js";
export { ReferenceClient as ChatGPTReferenceClient } from "./reference.js";

// Export all types
export type {
  // Request types
  ChatGPTWebSearchMode,
  ChatGPTAskParams,
  ChatGPTBrandVisibilityParams,
  ChatGPTModelsParams,
  // Source types
  ChatGPTCitation,
  ChatGPTSearchResult,
  // Brand types
  ChatGPTCompetitorMention,
  // Reference types
  ChatGPTModel,
  // Response types
  ChatGPTAskResponse,
  ChatGPTBrandVisibilityResponse,
  ChatGPTModelsResponse,
} from "./types.js";
