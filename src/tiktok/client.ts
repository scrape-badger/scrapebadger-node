/**
 * TikTok API client.
 *
 * Provides access to all TikTok API endpoints through specialized sub-clients.
 */

import type { BaseClient } from "../internal/client.js";
import { UsersClient } from "./users.js";
import { VideosClient } from "./videos.js";
import { SearchClient } from "./search.js";
import { MusicClient } from "./music.js";
import { HashtagsClient } from "./hashtags.js";
import { TrendingClient } from "./trending.js";
import { AdsClient } from "./ads.js";
import { ReferenceClient } from "./reference.js";

/**
 * TikTok API client with access to all TikTok endpoints.
 *
 * Provides sub-clients for different resource types:
 * - `users` - Profiles, videos, followers, following, liked, reposts
 * - `videos` - Detail, comments, replies, related, transcript, oEmbed
 * - `search` - Keyword search across videos, users, and hashtags
 * - `music` - Sound/music detail and videos using a sound
 * - `hashtags` - Hashtag detail and tagged videos
 * - `trending` - Trending videos, hashtags, and songs
 * - `ads` - The Commercial Content Library (ad transparency)
 * - `reference` - Reference data (regions) and service health
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Get a user profile
 * const profile = await client.tiktok.users.get("charlidamelio");
 *
 * // Get video detail
 * const video = await client.tiktok.videos.get("7372...");
 *
 * // Search videos
 * const results = await client.tiktok.search.videos({ query: "skincare" });
 *
 * // Get trending songs
 * const songs = await client.tiktok.trending.songs({ region: "US" });
 *
 * // Search the ad library
 * const ads = await client.tiktok.ads.search({ query: "shoes", region: "DE" });
 *
 * // List regions
 * const regions = await client.tiktok.reference.regions();
 * ```
 */
export class TikTokClient {
  /** Client for profiles, videos, followers, following, liked, reposts */
  readonly users: UsersClient;

  /** Client for video detail, comments, replies, related, transcript, oEmbed */
  readonly videos: VideosClient;

  /** Client for keyword search across videos, users, and hashtags */
  readonly search: SearchClient;

  /** Client for sound/music detail and videos using a sound */
  readonly music: MusicClient;

  /** Client for hashtag detail and tagged videos */
  readonly hashtags: HashtagsClient;

  /** Client for trending videos, hashtags, and songs */
  readonly trending: TrendingClient;

  /** Client for the Commercial Content Library (ad transparency) */
  readonly ads: AdsClient;

  /** Client for reference data (regions) and service health */
  readonly reference: ReferenceClient;

  /**
   * Create a new TikTok client.
   *
   * @param client - The base HTTP client for making requests.
   */
  constructor(client: BaseClient) {
    this.users = new UsersClient(client);
    this.videos = new VideosClient(client);
    this.search = new SearchClient(client);
    this.music = new MusicClient(client);
    this.hashtags = new HashtagsClient(client);
    this.trending = new TrendingClient(client);
    this.ads = new AdsClient(client);
    this.reference = new ReferenceClient(client);
  }
}
