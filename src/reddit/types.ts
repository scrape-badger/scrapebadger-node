/**
 * TypeScript types for Reddit API responses.
 *
 * This module contains all the data types used by the Reddit API client.
 */

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
  /** Subreddit name (without r/ prefix) */
  subreddit: string;
  /** Subreddit fullname (t5_ prefixed) */
  subreddit_id: string | null;
  /** Subreddit with r/ prefix */
  subreddit_name_prefixed: string | null;
  /** Subreddit type (public, private, restricted, etc.) */
  subreddit_type: string | null;
  /** Post score (upvotes minus downvotes) */
  score: number;
  /** Number of comments */
  num_comments: number;
  /** Number of crossposts */
  num_crossposts: number;
  /** Post creation timestamp (Unix) */
  created_utc: number;
  /** Post creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Whether the post is a self (text) post */
  is_self: boolean;
  /** Whether the post is a gallery */
  is_gallery: boolean;
  /** Whether the post is marked NSFW */
  is_nsfw: boolean;
  /** Whether the post is marked as a spoiler */
  is_spoiler: boolean;
  /** Whether the post is stickied */
  is_stickied: boolean;
  /** Whether the post is original content */
  is_original_content: boolean;
  /** Post flair text (null if no flair) */
  link_flair_text: string | null;
  /** Number of gildings */
  gilded: number;
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
  /** Subreddit name (without r/ prefix) */
  subreddit: string;
  /** Subreddit fullname (t5_ prefixed) */
  subreddit_id: string | null;
  /** Subreddit with r/ prefix */
  subreddit_name_prefixed: string | null;
  /** Post ID this comment belongs to */
  post_id: string | null;
  /** Permalink to comment */
  permalink: string;
  /** Comment score (upvotes minus downvotes) */
  score: number;
  /** Depth level (0 for top-level comments) */
  depth: number;
  /** Comment creation timestamp (Unix) */
  created_utc: number;
  /** Comment creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Whether the comment is stickied */
  is_stickied: boolean;
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
  /** Short public description */
  public_description: string;
  /** Subreddit URL path */
  url: string;
  /** Creation timestamp (Unix) */
  created_utc: number;
  /** Creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Whether the subreddit is marked NSFW */
  is_nsfw: boolean;
}

/**
 * A Reddit user profile.
 */
export interface RedditUser {
  /** Username (without u/ prefix) */
  name: string;
  /** Username with u/ prefix */
  display_name_prefixed: string | null;
  /** Post karma */
  link_karma: number;
  /** Comment karma */
  comment_karma: number;
  /** Combined total karma */
  total_karma: number;
  /** Account creation timestamp (Unix) */
  created_utc: number;
  /** Account creation time as ISO 8601 UTC string */
  created_at: string | null;
  /** Whether the account has Reddit Premium */
  is_gold: boolean;
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
