/**
 * Google Autocomplete API client.
 */

import type { BaseClient } from "../internal/client.js";
import type { AutocompleteParams, GoogleResponse } from "./types.js";

/**
 * Client for Google Autocomplete (search suggestions).
 */
export class AutocompleteClient {
  constructor(private readonly client: BaseClient) {}

  async get(params: AutocompleteParams): Promise<GoogleResponse> {
    return this.client.request<GoogleResponse>("/v1/google/autocomplete", {
      params: { ...params },
    });
  }
}
