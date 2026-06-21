/**
 * YouTube API client.
 *
 * Provides access to all YouTube API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { SearchClient } from "./search.js";
import { VideosClient } from "./videos.js";
import { ChannelsClient } from "./channels.js";
import { PlaylistsClient } from "./playlists.js";
import { CommunityClient } from "./community.js";
import { ShortsClient } from "./shorts.js";
import { TrendingClient } from "./trending.js";
import { MusicClient } from "./music.js";
import { ReferenceClient } from "./reference.js";

/**
 * YouTube API client with access to all YouTube endpoints.
 *
 * Provides sub-clients for different resource types:
 * - `search` - Full-matrix search and keyword autocomplete
 * - `videos` - Detail, related, comments, replies, transcript, captions, streams, live chat, batch, oEmbed
 * - `channels` - Detail, tab feeds, about, subscriber count, in-channel search, resolve
 * - `playlists` - Playlist detail, items pagination, mixes
 * - `community` - Community post detail and post comments
 * - `shorts` - Single Short detail and Shorts by sound
 * - `trending` - Trending feed, trending shorts, hashtag feed, home feed
 * - `music` - YouTube Music search
 * - `reference` - Reference data (categories, languages, regions, markets)
 *
 * All list endpoints paginate via an opaque `continuation` token (no page
 * numbers). Region is controlled by `gl` (content region) + `hl` (UI language).
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search
 * const results = await client.youtube.search.search({ query: "lofi beats" });
 *
 * // Video detail
 * const video = await client.youtube.videos.get("dQw4w9WgXcQ");
 *
 * // Channel detail (accepts a UC id, @handle, or custom URL)
 * const channel = await client.youtube.channels.get("@MrBeast");
 *
 * // Playlist items
 * const playlist = await client.youtube.playlists.get("PL1234567890");
 *
 * // Trending
 * const trending = await client.youtube.trending.get({ gl: "US" });
 *
 * // Reference data
 * const markets = await client.youtube.reference.markets();
 * ```
 */
export class YoutubeClient {
  /** Client for full-matrix search and keyword autocomplete */
  readonly search: SearchClient;

  /** Client for video detail, comments, transcript, captions, streams, live chat, batch, and oEmbed */
  readonly videos: VideosClient;

  /** Client for channel detail, tab feeds, about, subscriber count, search, and resolve */
  readonly channels: ChannelsClient;

  /** Client for playlist detail, items pagination, and mixes */
  readonly playlists: PlaylistsClient;

  /** Client for community post detail and post comments */
  readonly community: CommunityClient;

  /** Client for single-Short detail and Shorts by sound */
  readonly shorts: ShortsClient;

  /** Client for the trending feed, trending shorts, hashtag feed, and home feed */
  readonly trending: TrendingClient;

  /** Client for YouTube Music search */
  readonly music: MusicClient;

  /** Client for reference data (categories, languages, regions, markets) */
  readonly reference: ReferenceClient;

  /**
   * Create a new YouTube client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.search = new SearchClient(client);
    this.videos = new VideosClient(client);
    this.channels = new ChannelsClient(client);
    this.playlists = new PlaylistsClient(client);
    this.community = new CommunityClient(client);
    this.shorts = new ShortsClient(client);
    this.trending = new TrendingClient(client);
    this.music = new MusicClient(client);
    this.reference = new ReferenceClient(client);
  }
}
