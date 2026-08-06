/**
 * Instagram hashtag, location, and audio API clients.
 *
 * These endpoints return standalone entities plus their associated media
 * feeds, so they live together in one reference module.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  Audio,
  Hashtag,
  Location,
  Media,
  Paginated,
} from "./types.js";

function mediaFeed(
  client: BaseClient,
  path: string,
  options: { amount?: number; cursor?: string }
): Promise<Paginated<Media>> {
  return client.request<Paginated<Media>>(path, {
    params: { amount: options.amount, cursor: options.cursor },
  });
}

/** Client for Instagram hashtag endpoints. */
export class HashtagsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /** Get a hashtag's info (media count, cover). */
  async get(tag: string): Promise<Hashtag> {
    return this.client.request<Hashtag>(`/v1/instagram/hashtags/${tag}`);
  }

  /**
   * Get the top/popular media for a hashtag.
   * @deprecated Temporarily unavailable — authenticated data is temporarily offline.
   */
  async top(
    tag: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Media>> {
    return mediaFeed(this.client, `/v1/instagram/hashtags/${tag}/top`, options);
  }

  /** Get the most recent media for a hashtag. */
  async recent(
    tag: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Media>> {
    return mediaFeed(
      this.client,
      `/v1/instagram/hashtags/${tag}/recent`,
      options
    );
  }

  /**
   * Get reels for a hashtag.
   * @deprecated Temporarily unavailable — authenticated data is temporarily offline.
   */
  async reels(
    tag: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Media>> {
    return mediaFeed(
      this.client,
      `/v1/instagram/hashtags/${tag}/reels`,
      options
    );
  }
}

/** Client for Instagram location endpoints. */
export class LocationsClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get a location's info.
   * @deprecated Temporarily unavailable — authenticated data is temporarily offline.
   */
  async get(pk: string): Promise<Location> {
    return this.client.request<Location>(`/v1/instagram/locations/${pk}`);
  }

  /**
   * Get the top/popular media for a location.
   * @deprecated Temporarily unavailable — authenticated data is temporarily offline.
   */
  async top(
    pk: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Media>> {
    return mediaFeed(this.client, `/v1/instagram/locations/${pk}/top`, options);
  }

  /**
   * Get the most recent media for a location.
   * @deprecated Temporarily unavailable — authenticated data is temporarily offline.
   */
  async recent(
    pk: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Media>> {
    return mediaFeed(
      this.client,
      `/v1/instagram/locations/${pk}/recent`,
      options
    );
  }

  /**
   * Search locations by name.
   * @deprecated Temporarily unavailable — authenticated data is temporarily offline.
   */
  async search(query: string): Promise<Paginated<Location>> {
    return this.client.request<Paginated<Location>>(
      "/v1/instagram/locations/search",
      { params: { query } }
    );
  }
}

/** Client for Instagram audio/music endpoints. */
export class AudioClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Get an audio track's info.
   * @deprecated Temporarily unavailable — authenticated data is temporarily offline.
   */
  async get(audioId: string): Promise<Audio> {
    return this.client.request<Audio>(`/v1/instagram/audio/${audioId}`);
  }

  /**
   * Get media that use an audio track.
   * @deprecated Temporarily unavailable — authenticated data is temporarily offline.
   */
  async media(
    audioId: string,
    options: { amount?: number; cursor?: string } = {}
  ): Promise<Paginated<Media>> {
    return mediaFeed(
      this.client,
      `/v1/instagram/audio/${audioId}/media`,
      options
    );
  }

  /**
   * Get currently-trending audio tracks.
   * @deprecated Temporarily unavailable — authenticated data is temporarily offline.
   */
  async trending(): Promise<Paginated<Audio>> {
    return this.client.request<Paginated<Audio>>("/v1/instagram/audio/trending");
  }
}
