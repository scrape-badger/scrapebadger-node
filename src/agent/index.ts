/**
 * Agent platform API module: quotes, feedback, result re-reads, async request polling and batches.
 *
 * @module agent
 */

export { AgentClient, ResultsClient, RequestsClient } from "./client.js";

export type {
  QuoteOptions,
  FeedbackOptions,
  ResultViewOptions,
  QuoteFieldError,
  QuoteCredits,
  QuoteUsd,
  QuoteLatency,
  Quote,
  FeedbackReceipt,
  AsyncRequest,
  BatchItem,
  BatchOptions,
  BatchItemResult,
  BatchSubmission,
  AgentTrial,
} from "./types.js";
