/**
 * TypeScript types for Reddit API responses.
 *
 * This module contains all the data types used by the Reddit API client.
 */

// =============================================================================
// Helper / Nested Types
// =============================================================================

/**
 * A preview image with dimensions.
 */
export interface RedditPreviewImage {
  /** Image URL */
  url: string;
  /** Image width in pixels */
  width: number;
  /** Image height in pixels */
  height: number;
}

/**
 * Embedded media attached to a post.
 */
export interface RedditMedia {
  /** Media type identifier */
  type: string | null;
  /** Direct media URL */
  url: string | null;
  /** Thumbnail URL */
  thumbnail_url: string | null;
  /** Media width in pixels */
  width: number | null;
  /** Media height in pixels */
  height: number | null;
}

/**
 * An award given to a post or comment.
 */
export interface RedditAward {
  /** Award ID */
  id: string | null;
  /** Award name */
  name: string;
  /** Number of this award given */
  count: number;
  /** Award icon URL */
  icon_url: string | null;
}

// =============================================================================
// Core Entity Types
// =============================================================================

/**
 * A Reddit post (link or self post).
 */
export interface RedditPost {
  /** Unique post identifier (without t3_ prefix) */
  id: string;
  /** Fullname with t3_ prefix */
  fullname: string;
  /** Post title */
  title: string;
  /** Self post text body */
  selftext: string;
  /** Self post text as HTML */
  selftext_html: string | null;
  /** External or self URL */
  url: string;
  /** Permalink to post on Reddit */
  permalink: string;
  /** Post domain */
  domain: string;
  /** Author username */
  author: string;
  /** Author fullname (t2_ prefixed) */
  author_fullname: string | null;
  /** Author flair text */
  author_flair_text: string | null;
  /** Author flair type (text or richtext) */
  author_flair_type: string | null;
  /** Author flair template ID */
  author_flair_template_id: string | null;
  /** Subreddit name (without r/ prefix) */
  subreddit: string;
  /** Subreddit fullname (t5_ prefixed) */
  subreddit_id: string | null;
  /** Subreddit with r/ prefix */
  subreddit_name_prefixed: string | null;
  /** Subreddit type (public, private, restricted, etc.) */
  subreddit_type: string | null;
  /** Number of subscribers in the subreddit */
  subreddit_subscribers: number | null;
  /** Post score (upvotes minus downvotes) */
  score: number;
  /** Raw upvotes */
  ups: number;
  /** Raw downvotes */
  downs: number;
  /** Upvote ratio as a decimal (e.g. 0.95) */
  upvote_ratio: number | null;
  /** Number of comments */
  num_comments: number;
  /** Number of crossposts */
  num_crossposts: number;
  /** Number of duplicate submissions */
  num_duplicates: number | null;
  /** View count (null if not available) */
  view_count: number | null;
  /** Post creation timestamp (Unix) */
  created_utc: number;
  /** Post creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Edited timestamp as float, false if not edited, or null */
  edited: number | boolean | null;
  /** Edit time as ISO 8601 UTC string (null if not edited) */
  edited_at: string | null;
  /** Whether the post is a self (text) post */
  is_self: boolean;
  /** Whether the post is a video */
  is_video: boolean;
  /** Whether the post is a gallery */
  is_gallery: boolean;
  /** Whether the post is marked NSFW */
  is_nsfw: boolean;
  /** Whether the post is marked as a spoiler */
  is_spoiler: boolean;
  /** Whether the post is locked */
  is_locked: boolean;
  /** Whether the post is stickied */
  is_stickied: boolean;
  /** Whether the post is archived */
  is_archived: boolean;
  /** Whether the post is pinned */
  is_pinned: boolean;
  /** Whether the post is original content */
  is_original_content: boolean;
  /** Whether the post is robot-indexable */
  is_robot_indexable: boolean;
  /** Whether the post is a meta post */
  is_meta: boolean;
  /** Whether the post can be crossposted */
  is_crosspostable: boolean;
  /** Whether to send reply notifications */
  send_replies: boolean;
  /** Post flair text (null if no flair) */
  link_flair_text: string | null;
  /** Post flair background color */
  link_flair_background_color: string | null;
  /** Post flair text color */
  link_flair_text_color: string | null;
  /** Post flair template ID */
  link_flair_template_id: string | null;
  /** Post flair type (text or richtext) */
  link_flair_type: string | null;
  /** Post flair CSS class */
  link_flair_css_class: string | null;
  /** Distinguished status (moderator, admin, or null) */
  distinguished: string | null;
  /** Post thumbnail URL (may be "self", "default", or "nsfw") */
  thumbnail: string | null;
  /** Thumbnail width in pixels */
  thumbnail_width: number | null;
  /** Thumbnail height in pixels */
  thumbnail_height: number | null;
  /** Post hint (image, video, link, self, etc.) */
  post_hint: string | null;
  /** Preview images */
  preview_images: RedditPreviewImage[];
  /** Embedded media metadata */
  media: RedditMedia | null;
  /** Gallery item data */
  gallery_data: Record<string, unknown>[] | null;
  /** Parent post fullname if this is a crosspost */
  crosspost_parent: string | null;
  /** Suggested sort for comments (null if default) */
  suggested_sort: string | null;
  /** Total awards received */
  total_awards: number;
  /** Award details */
  awards: RedditAward[];
  /** Number of gildings */
  gilded: number;
  /** Content categories */
  content_categories: string[] | null;
  /** Removal category (null if not removed) */
  removed_by_category: string | null;
  /** Treatment tags */
  treatment_tags: string[];
}

/**
 * A Reddit comment.
 */
export interface RedditComment {
  /** Unique comment identifier (without t1_ prefix) */
  id: string;
  /** Fullname with t1_ prefix */
  fullname: string;
  /** Comment body text */
  body: string;
  /** Comment body as HTML */
  body_html: string | null;
  /** Author username */
  author: string;
  /** Author fullname (t2_ prefixed) */
  author_fullname: string | null;
  /** Author flair text */
  author_flair_text: string | null;
  /** Author flair type (text or richtext) */
  author_flair_type: string | null;
  /** Subreddit name (without r/ prefix) */
  subreddit: string;
  /** Subreddit fullname (t5_ prefixed) */
  subreddit_id: string | null;
  /** Subreddit with r/ prefix */
  subreddit_name_prefixed: string | null;
  /** Subreddit type (public, private, restricted, etc.) */
  subreddit_type: string | null;
  /** Post ID this comment belongs to */
  post_id: string | null;
  /** Title of the parent post */
  post_title: string | null;
  /** Parent ID (t3_ for top-level, t1_ for reply) */
  parent_id: string | null;
  /** Permalink to comment */
  permalink: string;
  /** Comment score (upvotes minus downvotes) */
  score: number;
  /** Raw upvotes */
  ups: number;
  /** Raw downvotes */
  downs: number;
  /** Controversiality score */
  controversiality: number;
  /** Depth level (0 for top-level comments) */
  depth: number;
  /** Comment creation timestamp (Unix) */
  created_utc: number;
  /** Comment creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Edited timestamp as float, false if not edited, or null */
  edited: number | boolean | null;
  /** Edit time as ISO 8601 UTC string (null if not edited) */
  edited_at: string | null;
  /** Whether the author is the post submitter */
  is_submitter: boolean;
  /** Whether the comment is stickied */
  is_stickied: boolean;
  /** Whether the comment is locked */
  is_locked: boolean;
  /** Whether the comment score is hidden */
  is_score_hidden: boolean;
  /** Whether to send reply notifications */
  send_replies: boolean;
  /** Distinguished status (moderator, admin, or null) */
  distinguished: string | null;
  /** Total awards received */
  total_awards: number;
  /** Number of gildings */
  gilded: number;
  /** Nested replies (empty array if none) */
  replies: RedditComment[];
}

/**
 * A Reddit subreddit.
 */
export interface RedditSubreddit {
  /** Unique subreddit identifier */
  id: string;
  /** Fullname with t5_ prefix */
  fullname: string;
  /** Subreddit name (without r/ prefix) */
  name: string;
  /** Subreddit with r/ prefix */
  display_name_prefixed: string | null;
  /** Subreddit title */
  title: string;
  /** Full sidebar description (markdown) */
  description: string;
  /** Full sidebar description as HTML */
  description_html: string | null;
  /** Short public description */
  public_description: string;
  /** Short public description as HTML */
  public_description_html: string | null;
  /** Text shown when submitting a new post */
  submit_text: string;
  /** Submit text as HTML */
  submit_text_html: string | null;
  /** Header title text */
  header_title: string | null;
  /** Subreddit URL path */
  url: string;
  /** Subreddit type (public, private, restricted, etc.) */
  type: string;
  /** Allowed submission type (any, link, self) */
  submission_type: string | null;
  /** Number of subscribers */
  subscribers: number;
  /** Number of users currently online */
  active_users: number | null;
  /** Creation timestamp (Unix) */
  created_utc: number;
  /** Creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Whether the subreddit is marked NSFW */
  is_nsfw: boolean;
  /** Whether the subreddit is quarantined */
  is_quarantined: boolean;
  /** Whether the subreddit is advertiser-friendly */
  is_advertiser_friendly: boolean;
  /** Advertiser category */
  advertiser_category: string | null;
  /** Subreddit language code */
  language: string | null;
  /** Subreddit icon URL */
  icon_url: string | null;
  /** Header image URL */
  header_url: string | null;
  /** Banner image URL */
  banner_url: string | null;
  /** Banner background color (hex) */
  banner_background_color: string | null;
  /** Primary theme color (hex) */
  primary_color: string | null;
  /** Key theme color (hex) */
  key_color: string | null;
  /** Whether the wiki is enabled */
  wiki_enabled: boolean;
  /** Whether image posts are allowed */
  allow_images: boolean;
  /** Whether video posts are allowed */
  allow_videos: boolean;
  /** Whether gallery posts are allowed */
  allow_galleries: boolean;
  /** Whether polls are allowed */
  allow_polls: boolean;
  /** Whether the subreddit appears in discovery feeds */
  allow_discovery: boolean;
  /** Whether spoiler tags are enabled */
  spoilers_enabled: boolean;
  /** Whether custom emojis are enabled */
  emojis_enabled: boolean;
  /** Whether free-form reports are enabled */
  free_form_reports: boolean;
  /** Whether the subreddit accepts followers */
  accept_followers: boolean;
  /** Whether posting is restricted */
  restrict_posting: boolean;
  /** Whether link flairs are enabled */
  link_flair_enabled: boolean;
  /** Position of link flair (left, right, or null) */
  link_flair_position: string | null;
  /** Whether user flairs are enabled */
  user_flair_enabled: boolean;
  /** Position of user flair (left, right, or null) */
  user_flair_position: string | null;
  /** Minutes before comment scores are shown */
  comment_score_hide_mins: number;
  /** Whether posts are automatically archived */
  should_archive_posts: boolean;
  /** Media types allowed in comments */
  allowed_media_in_comments: string[];
}

/**
 * A Reddit user profile.
 */
export interface RedditUser {
  /** Unique user identifier */
  id: string;
  /** Fullname with t2_ prefix */
  fullname: string | null;
  /** Username (without u/ prefix) */
  name: string;
  /** Username with u/ prefix */
  display_name_prefixed: string | null;
  /** Avatar/profile icon URL */
  icon_url: string | null;
  /** Snoovatar image URL */
  snoovatar_url: string | null;
  /** Profile banner URL */
  banner_url: string | null;
  /** Profile title/tagline */
  profile_title: string | null;
  /** Profile page URL */
  profile_url: string | null;
  /** User description / about text */
  description: string;
  /** Post karma */
  link_karma: number;
  /** Comment karma */
  comment_karma: number;
  /** Karma from received awards */
  awardee_karma: number;
  /** Karma from given awards */
  awarder_karma: number;
  /** Combined total karma */
  total_karma: number;
  /** Account creation timestamp (Unix) */
  created_utc: number;
  /** Account creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Whether the account email is verified */
  has_verified_email: boolean;
  /** Whether the account is verified */
  verified: boolean;
  /** Whether the account accepts followers */
  accepts_followers: boolean;
  /** Whether the account has subscribed to Reddit */
  has_subscribed: boolean;
  /** Whether the account is a Reddit employee */
  is_employee: boolean;
  /** Whether the account is a moderator somewhere */
  is_mod: boolean;
  /** Whether the account has Reddit Premium */
  is_gold: boolean;
  /** Whether the account is suspended */
  is_suspended: boolean;
  /** Whether the profile is NSFW */
  is_nsfw: boolean;
  /** Whether the snoovatar is shown in comments */
  pref_show_snoovatar: boolean;
}

/**
 * A subreddit rule.
 */
export interface RedditRule {
  /** Rule priority order */
  priority: number;
  /** Short name / title of the rule */
  short_name: string;
  /** Full rule description (markdown) */
  description: string;
  /** Full rule description as HTML */
  description_html: string | null;
  /** What the rule applies to (link, comment, all) */
  kind: "link" | "comment" | "all" | string;
  /** Violation reason label */
  violation_reason: string | null;
}

/**
 * A subreddit wiki page.
 */
export interface RedditWikiPage {
  /** Wiki page title/slug */
  title: string;
  /** Page content (markdown) */
  content_md: string;
  /** Page content as HTML */
  content_html: string | null;
  /** Author of latest revision */
  revision_by: string | null;
  /** Revision timestamp (Unix), null if unknown */
  revision_date: number | null;
}

/**
 * A Reddit user trophy.
 */
export interface RedditTrophy {
  /** Trophy name */
  name: string;
  /** Trophy description */
  description: string | null;
  /** Trophy icon URL */
  icon_url: string | null;
  /** URL associated with the trophy */
  url: string | null;
}

// =============================================================================
// Pagination
// =============================================================================

/**
 * Pagination metadata for list responses.
 */
export interface RedditPagination {
  /** Cursor for fetching the next page (null if no more pages) */
  after: string | null;
  /** Cursor for fetching the previous page (null if on first page) */
  before: string | null;
  /** Total number of items fetched so far */
  count: number;
  /** Maximum number of items per page */
  limit: number;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Response from the post search endpoint.
 */
export interface SearchPostsResponse {
  /** List of matching posts */
  posts: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Search query string */
  query: string;
  /** Sort method used */
  sort: string;
}

/**
 * Response from the subreddit posts endpoint.
 */
export interface SubredditPostsResponse {
  /** List of posts in the subreddit */
  posts: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Subreddit name */
  subreddit: string;
  /** Sort method used */
  sort: string;
}

/**
 * Response from the post detail endpoint.
 */
export interface PostDetailResponse {
  /** Full post details */
  post: RedditPost;
}

/**
 * Response from the post comments endpoint.
 */
export interface PostCommentsResponse {
  /** Post details */
  post: RedditPost;
  /** Top-level comments with nested replies */
  comments: RedditComment[];
  /** Pagination metadata */
  pagination: RedditPagination;
}

/**
 * Response from the post duplicates endpoint.
 */
export interface PostDuplicatesResponse {
  /** The original post */
  original: RedditPost;
  /** Cross-posts and duplicate submissions */
  duplicates: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
}

/**
 * Response from the subreddit detail endpoint.
 */
export interface SubredditDetailResponse {
  /** Full subreddit details */
  subreddit: RedditSubreddit;
}

/**
 * Response from the subreddit rules endpoint.
 */
export interface SubredditRulesResponse {
  /** List of subreddit rules */
  rules: RedditRule[];
  /** Subreddit name */
  subreddit: string;
}

/**
 * Response from the subreddit wiki pages list endpoint.
 */
export interface SubredditWikiPagesResponse {
  /** List of wiki page slugs */
  pages: string[];
  /** Subreddit name */
  subreddit: string;
}

/**
 * Response from the wiki page endpoint.
 */
export interface WikiPageResponse {
  /** The wiki page content */
  page: RedditWikiPage;
  /** Subreddit name */
  subreddit: string;
}

/**
 * Response from the user profile endpoint.
 */
export interface UserProfileResponse {
  /** Full user profile */
  user: RedditUser;
}

/**
 * Response from the user posts endpoint.
 */
export interface UserPostsResponse {
  /** List of user's posts */
  posts: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Username */
  username: string;
}

/**
 * Response from the user comments endpoint.
 */
export interface UserCommentsResponse {
  /** List of user's comments */
  comments: RedditComment[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Username */
  username: string;
}

/**
 * Response from the user moderated subreddits endpoint.
 */
export interface UserModeratedResponse {
  /** Subreddits moderated by the user */
  subreddits: RedditSubreddit[];
  /** Username */
  username: string;
}

/**
 * Response from the user trophies endpoint.
 */
export interface UserTrophiesResponse {
  /** List of trophies awarded to the user */
  trophies: RedditTrophy[];
  /** Username */
  username: string;
}

/**
 * Response from the subreddit search endpoint.
 */
export interface SearchSubredditsResponse {
  /** List of matching subreddits */
  subreddits: RedditSubreddit[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Search query string */
  query: string;
}

/**
 * Response from the user search endpoint.
 */
export interface SearchUsersResponse {
  /** List of matching users */
  users: RedditUser[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Search query string */
  query: string;
}

/**
 * Response from the trending posts endpoint.
 */
export interface TrendingPostsResponse {
  /** List of trending posts */
  posts: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Sort method used */
  sort: string;
}

/**
 * Response from the popular subreddits endpoint.
 */
export interface PopularSubredditsResponse {
  /** List of popular subreddits */
  subreddits: RedditSubreddit[];
  /** Pagination metadata */
  pagination: RedditPagination;
}

/**
 * Response from the domain posts endpoint.
 */
export interface DomainPostsResponse {
  /** List of posts linking to the domain */
  posts: RedditPost[];
  /** Pagination metadata */
  pagination: RedditPagination;
  /** Domain name */
  domain: string;
}
