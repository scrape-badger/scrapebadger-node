/**
 * TypeScript types for Instagram API responses.
 *
 * Fields mirror the canonical instagrapi entities returned by the ScrapeBadger
 * backend. Every datetime ships in two forms: a Unix `*_utc` number and an
 * ISO-8601 string (`taken_at`, `created_at`, ...).
 *
 * Paginated endpoints share one envelope shape: {@link Paginated}
 * (`{ items, count, next_cursor, has_more }`).
 */

// =============================================================================
// Reference / nested types
// =============================================================================

/** A link in a user's bio (element of `bio_links`). */
export interface BioLink {
  url: string;
  title: string;
  link_type: string | null;
  lynx_url: string | null;
}

/** A lightweight user reference (followers, likers, tags, authors). */
export interface UserShort {
  pk: string;
  username: string;
  full_name: string;
  profile_pic_url: string | null;
  is_private: boolean;
  is_verified: boolean;
}

/** An Instagram hashtag. */
export interface Hashtag {
  id: string | null;
  name: string;
  media_count: number;
  profile_pic_url: string | null;
}

/** An Instagram location / place. */
export interface Location {
  pk: string | null;
  name: string;
  address: string | null;
  city: string | null;
  lng: number | null;
  lat: number | null;
  external_id: string | null;
  external_id_source: string | null;
}

/** An Instagram audio / music track. */
export interface Audio {
  id: string | null;
  audio_cluster_id: string | null;
  title: string;
  subtitle: string | null;
  display_artist: string | null;
  duration_in_ms: number | null;
  cover_artwork_uri: string | null;
  is_explicit: boolean;
}

/** A single resource inside a carousel/album media. */
export interface Resource {
  pk: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  media_type: number;
}

/** A user story highlight reel. */
export interface Highlight {
  pk: string | null;
  id: string | null;
  title: string;
  media_count: number;
  cover_media_url: string | null;
}

/** oEmbed metadata for a media permalink. */
export interface Oembed {
  version: string | null;
  title: string | null;
  author_name: string | null;
  author_url: string | null;
  author_id: string | null;
  provider_name: string | null;
  provider_url: string | null;
  type: string | null;
  width: number | null;
  height: number | null;
  html: string | null;
  thumbnail_url: string | null;
  thumbnail_width: number | null;
  thumbnail_height: number | null;
}

// =============================================================================
// Core types
// =============================================================================

/** A full Instagram user profile. */
export interface User {
  pk: string;
  username: string;
  full_name: string;
  is_private: boolean;
  is_verified: boolean;
  profile_pic_url: string | null;
  profile_pic_url_hd: string | null;
  media_count: number;
  follower_count: number;
  following_count: number;
  biography: string;
  bio_links: BioLink[];
  external_url: string | null;
  account_type: number | null;
  is_business: boolean;
  is_professional_account: boolean;
  public_email: string | null;
  contact_phone_number: string | null;
  category: string | null;
  city_name: string | null;
  address_street: string | null;
  latitude: number | null;
  longitude: number | null;
}

/** "About this account" metadata for a user. */
export interface UserAbout {
  username: string;
  country: string | null;
  date_joined: string | null;
  date_joined_utc: number | null;
  former_username_count: number;
  is_verified: boolean;
  shared_follower_count: number;
}

/** An Instagram media (photo, video, album, reel, IGTV). */
export interface Media {
  pk: string;
  id: string;
  code: string;
  /** Taken-at time as an ISO-8601 UTC string. */
  taken_at: string | null;
  /** Taken-at time as a Unix timestamp. */
  taken_at_utc: number | null;
  media_type: number;
  product_type: string | null;
  caption_text: string;
  like_count: number;
  comment_count: number;
  play_count: number | null;
  view_count: number | null;
  video_url: string | null;
  thumbnail_url: string | null;
  image_versions2: Record<string, unknown>;
  usertags: Array<Record<string, unknown>>;
  coauthor_producers: UserShort[];
  location: Location | null;
  user: UserShort | null;
  resources: Resource[];
  url: string;
  hashtags: string[];
  mentions: string[];
}

/** A comment on an Instagram media. */
export interface Comment {
  pk: string;
  text: string;
  user: UserShort | null;
  /** Created-at time as an ISO-8601 UTC string. */
  created_at: string | null;
  /** Created-at time as a Unix timestamp. */
  created_at_utc: number | null;
  like_count: number;
  has_liked: boolean;
}

// =============================================================================
// Pagination envelope
// =============================================================================

/**
 * Cursor-paginated list envelope shared by all Instagram list endpoints.
 *
 * @typeParam T - The item type in `items`.
 */
export interface Paginated<T> {
  /** The page of results. */
  items: T[];
  /** Number of items in this page. */
  count: number;
  /** Cursor to pass as `cursor` for the next page (null when exhausted). */
  next_cursor: string | null;
  /** Whether another page is available. */
  has_more: boolean;
}

/** Blended "top"/autocomplete search results (mixed entity types). */
export interface SearchTopResponse {
  users?: UserShort[];
  hashtags?: Hashtag[];
  places?: Location[];
  [key: string]: unknown;
}
