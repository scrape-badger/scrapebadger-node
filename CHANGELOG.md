# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.21.0] - 2026-07-17

### Added

- **eBay** — new `sold_date` / `sold_date_at` fields on `SearchResult` cards (search, seller items, category, completed). `sold_date` is the sale date text as rendered by eBay (e.g. `"2 Jul 2026"`, localized on non-English markets, always set on completed/sold cards); `sold_date_at` is a best-effort ISO date (e.g. `"2026-07-02"`, `null` when the market's format isn't English). (SCR-122)

## [0.20.0] - 2026-07-13

### Added

- **LinkedIn client** (`client.linkedin`) — LinkedIn's public, logged-out surface across 11 no-auth endpoints: `jobsSearch()`, `getJob()`, `companyJobs()`, `getCompany()`, `getSchool()`, `getProfile()`, `getPost()`, `getArticle()`, `getCourse()`, `geoSuggest()`, `health()`. Covers guest job search + detail, public company/school/profile pages, posts/articles, LinkedIn Learning courses, and geo/company typeahead, with fully-typed `LinkedIn*`-prefixed types (`LinkedInJobsSearchResponse`, `LinkedInJobDetail`, `LinkedInCompany`, `LinkedInSchool`, `LinkedInProfile`, `LinkedInPost`, `LinkedInLearningCourse`, `LinkedInGeoSuggestResponse`, etc.). Requests are localised by a `country` residential-proxy param.

## [0.18.0] - 2026-07-12

### Added

- **Redfin client** (`client.redfin`) — Redfin (redfin.com, US) for-sale search, property detail, agent profiles, autocomplete, and markets. Methods: `search()`, `getProperty()`, `getAgent()`, `autocomplete()`, `listMarkets()`, mirroring the Immobiliare flat-client pattern, with fully-typed maximal-coverage `Redfin*`-prefixed types (`RedfinSearchResponse`, `RedfinProperty` incl. nested `address`/`price_history`/`tax_history`/`schools`/`amenities`, `RedfinAgent`, etc.). Single market: redfin.com (US, USD, en-US). (SCR-116)

## [0.17.0] - 2026-07-08

### Added

- **LoopNet client** (`client.loopnet`) — commercial-real-estate (CoStar) listings, brokers, and reference data across loopnet.com/.ca/.co.uk/.fr/.es (US/CA/UK/FR/ES). Sub-clients: `search.search()` (for-lease / for-sale / auctions, all property types, filters, pagination), `listings.get()`, `brokers.get()`, `reference.markets()`, `reference.propertyTypes()`, with fully-typed maximal-coverage `LoopNet*`-prefixed types (`LoopNetSearchResponse`, `LoopNetListingDetail`, `LoopNetBrokerProfile`, `LoopNetListingCard`, etc.). LoopNet is behind Akamai Bot Manager (browser-farm-only) — served via the ScrapeBadger farm. (SCR-102)

## [0.15.6] - 2026-07-07

### Added

- **Zillow client** (`client.zillow`) — real-estate coverage over zillow.com (US + Canadian inventory). Five endpoints across four sub-clients: `search.search()`, `search.autocomplete()`, `properties.getProperty()`, `agent.getAgent()`, `reference.listMarkets()`, with `Zillow*`-prefixed exported types (`ZillowSearchResponse`, `ZillowProperty`, `ZillowAgent`, …). (SCR-99)

## [0.15.5] - 2026-07-07

### Added

- Add Leboncoin Scraper API client (France) — 10 endpoints.

## [0.15.4] - 2026-07-02

### Added

- **Realtor client** (`client.realtor`) — real-estate listings across realtor.com (US) and realtor.ca (Canada) behind a single `market` param. Four endpoints: `search.search()`, `search.autocomplete()`, `properties.getProperty()`, `reference.listMarkets()`, with `Realtor*`-prefixed exported types (`RealtorSearchResponse`, `RealtorPropertyDetail`, …). (SCR-98)

## [0.15.3] - 2026-06-30

### Added

- Google Shopping barcode offers: `client.google.shopping.offers({ barcode, gl?, hl? })` calls `GET /v1/google/shopping/offers`, resolving a product by barcode (GTIN-8/UPC-A/EAN-13/GTIN-14) and returning its multi-seller Google Shopping offers. New `ShoppingOffersParams` type. Costs 14 credits; returns 422 for an invalid/checksum-failing barcode and 404 when the barcode can't be resolved.

## [0.13.1] - 2026-06-13

### Added

- TikTok cursor pagination: `cursor?: string` added to `TikTokCommentsParams`, `TikTokCommentRepliesParams`, `TikTokListVideosParams`, and `TikTokSearchParams`; all 9 affected methods (`videos.comments`, `videos.commentReplies`, `hashtags.videos`, `music.videos`, `search.search`, `search.videos`, `search.users`, `search.hashtags`, and `users.videos` which already had it) now forward the cursor as the `cursor` query parameter.

## [0.9.0] - 2026-05-29

### Removed (Breaking)

- **Reddit response types trimmed to fields available from the old.reddit.com HTML/RSS source.** The Reddit `.json` API is no longer used; the scraper now parses old.reddit.com HTML and RSS. Many fields that were only available from the `.json` API have been removed from the TypeScript types.
  - **`RedditPost`**: removed `ups`, `downs`, `upvote_ratio`, `view_count`, `num_duplicates`, `edited`, `edited_at`, `is_video`, `is_locked`, `is_archived`, `is_pinned`, `is_robot_indexable`, `is_meta`, `is_crosspostable`, `send_replies`, `author_flair_text`, `author_flair_type`, `author_flair_template_id`, `link_flair_background_color`, `link_flair_text_color`, `link_flair_template_id`, `link_flair_type`, `link_flair_css_class`, `distinguished`, `thumbnail`, `thumbnail_width`, `thumbnail_height`, `post_hint`, `preview_images`, `media`, `gallery_data`, `crosspost_parent`, `suggested_sort`, `total_awards`, `awards`, `content_categories`, `removed_by_category`, `treatment_tags`, `subreddit_subscribers`
  - **`RedditComment`**: removed `ups`, `downs`, `controversiality`, `edited`, `edited_at`, `gilded`, `is_locked`, `is_score_hidden`, `is_submitter`, `parent_id`, `post_title`, `send_replies`, `subreddit_type`, `total_awards`, `distinguished`, `author_flair_text`, `author_flair_type`
  - **`RedditSubreddit`**: removed `subscribers`, `active_users`, `description_html`, `public_description_html`, `submit_text`, `submit_text_html`, `header_title`, `type`, `submission_type`, `icon_url`, `header_url`, `banner_url`, `banner_background_color`, `primary_color`, `key_color`, `wiki_enabled`, `allow_images`, `allow_videos`, `allow_galleries`, `allow_polls`, `allow_discovery`, `spoilers_enabled`, `emojis_enabled`, `free_form_reports`, `accept_followers`, `restrict_posting`, `link_flair_enabled`, `link_flair_position`, `user_flair_enabled`, `user_flair_position`, `comment_score_hide_mins`, `should_archive_posts`, `allowed_media_in_comments`, `is_quarantined`, `is_advertiser_friendly`, `advertiser_category`, `language`
  - **`RedditUser`**: removed `id`, `fullname`, `icon_url`, `snoovatar_url`, `banner_url`, `profile_title`, `profile_url`, `description`, `awardee_karma`, `awarder_karma`, `has_verified_email`, `verified`, `accepts_followers`, `has_subscribed`, `is_employee`, `is_mod`, `is_suspended`, `is_nsfw`, `pref_show_snoovatar`
  - **`RedditRule`**: removed `description_html`, `kind`, `violation_reason`
  - **Helper types deleted entirely**: `RedditPreviewImage`, `RedditMedia`, `RedditAward` (were only used by removed `RedditPost` fields; never exported from the package index)

## [0.8.1] - 2026-05-28

### Removed

- **`client.reddit.subreddits.moderators(...)`** — Reddit gated the moderator listing behind authentication in 2024. There is no public path that yields the data. Removed the method along with `RedditModerator` and `SubredditModeratorsResponse` types rather than ship a permanently-broken endpoint.

### Fixed

- `client.reddit.search.subreddits(...)` no longer crashes when Reddit returns banned/quarantined subreddits with `null` values for required-typed fields (previously raised a backend 500 / ValidationError).

## [0.8.0] - 2026-05-28

### Added

- **Reddit Scraper API** — new `client.reddit.*` namespace covering 22 endpoints across search, posts, subreddits, users, and wiki:
  - `client.reddit.search.posts({ q, ... })` — global or subreddit-scoped post search with full Reddit syntax (title:, author:, subreddit:, flair:, AND/OR/NOT)
  - `client.reddit.search.subreddits({ q, ... })`, `client.reddit.search.users({ q, ... })`
  - `client.reddit.search.domainPosts(domain, { ... })` — posts linking to an external domain
  - `client.reddit.posts.trending({ ... })`, `client.reddit.posts.get(postId)`
  - `client.reddit.posts.comments(postId, { depth, ... })` — full nested comment trees with configurable depth (0–10)
  - `client.reddit.posts.duplicates(postId, { ... })` — cross-post detection
  - `client.reddit.subreddits.get(name)`, `.posts(name, { ... })`, `.rules(name)`, `.moderators(name)`, `.wikiPages(name)`, `.wikiPage(name, page)`, `.popular({ ... })`, `.newSubreddits({ ... })`
  - `client.reddit.users.get(name)`, `.posts(name, { ... })`, `.comments(name, { ... })`, `.moderated(name)`, `.trophies(name)`
- **Comprehensive Reddit TypeScript types** — `RedditPost` (66 fields), `RedditComment` (34), `RedditSubreddit` (48), `RedditUser` (27)
- **Datetime parity** — every datetime field ships both Unix timestamp (`*_utc`) and ISO 8601 UTC string (`*_at`)

## [0.7.0] - 2026-04-21

### Added

- **`client.google.shopping.product({ product_id, ... })`** — Shopping product detail page fetch by `product_id`.
- **`client.google.shopping.click({ title, source, q, product_id? })`** — Resolve the direct merchant URL for a Shopping product tile via Google's "I'm Feeling Lucky" redirect.
- **`NewsSearchParams.{topic_token, publication_token, story_token}`** — Accept News tokens returned by previous responses (in addition to `q`).
- **`MapsSearchParams.{place_id, ludocid, page, type, data}`** — Direct-lookup Maps search by Place ID or CID, plus business-type / viewport overrides.
- **`MapsPostsParams.{place_id, hl, gl}`** — Alternative to `data_id` + country/language controls on business posts.

### Changed

- **Removed hardcoded per-endpoint credit numbers from JSDoc and docs.** Credit costs are configured per-endpoint by ScrapeBadger admins and returned live from `GET /public/pricing` — no more stale "costs 2 credits" comments that go out of sync when pricing changes.

### Removed

- **`client.google.local`** — removed. The Local Pack is exposed via the SERP `/v1/google/search` response's `local_results` field rather than a dedicated endpoint. **Breaking** for anyone using the dedicated local client; migrate to reading `local_results` from `client.google.search.search(...)`.

## [0.6.0] - 2026-04-11

### Added — Google parity (refs scrape-badger/scrapebadger#135)

Three new Google product sub-clients and deeper Scholar / Trends / Search surface:

- **`client.google.local`** — Local Pack business listings ranked for a SERP query (`tbm=lcl`). Driven by `q + location/uule`, returns ratings, reviews, addresses, phone numbers, and GPS coordinates. Complementary to the Maps API.
- **`client.google.shorts`** — Short-form vertical video results (YouTube Shorts, TikTok, Facebook Reels) via Google's Shorts SERP mode (`udm=39`).
- **`client.google.flights`** — One-way, round-trip, and multi-city flight search with passenger config, cabin class, stops filter, and max-price. Returns `best_flights`, `other_flights`, `price_insights`, and per-offer carbon emissions.
- **`client.google.scholar.profiles({ mauthors })`** — Author profile search by name with `after_author` / `before_author` pagination.
- **`client.google.scholar.author({ author_id })`** — Full author profile (articles, citation stats, co-authors).
- **`client.google.scholar.authorCitation({ author_id })`** — Citations-per-year chart for a Scholar author.
- **`client.google.scholar.cite({ q })`** — MLA / APA / Chicago / Harvard / Vancouver citation formats plus export links (BibTeX / RIS / EndNote / RefWorks).
- **`client.google.trends.autocomplete({ q })`** — Categorized Knowledge Graph topic entities (`mid`, `type`, link) for a query prefix. Distinct from Google Search autocomplete.
- **`client.google.search.search({ ..., ai_overview: true })`** — Optional flag that chases Google's deferred AI Overview `page_token` with a follow-up fetch and merges the result into `ai_overview`. Adds ~1s and 1 credit only when the SERP actually defers the overview.

New exported param types: `LocalSearchParams`, `ShortsSearchParams`, `FlightsSearchParams`, `FlightsTripType`, `FlightsTravelClass`, `FlightsStopsFilter`, `ScholarProfilesParams`, `ScholarAuthorParams`, `ScholarAuthorCitationParams`, `ScholarCiteParams`, `TrendsAutocompleteParams`.

The Google product roster is now **19** (was 16).

## [0.2.0] - 2026-03-05

### Added

- **Twitter Streams**: Real-time tweet monitoring via WebSocket and webhooks
  - `StreamClient` with full monitor CRUD: `createMonitor`, `listMonitors`, `getMonitor`, `updateMonitor`, `pauseMonitor`, `resumeMonitor`, `deleteMonitor`
  - WebSocket streaming via `connect()` (EventEmitter) and `connectIter()` (AsyncIterator) with auto-reconnect
  - `verifyWebhookSignature()` utility for HMAC-SHA256 webhook verification
  - Delivery log and billing log listing: `listDeliveryLogs`, `listBillingLogs`
  - Full TypeScript types: `StreamMonitor`, `StreamMonitorList`, `TweetEvent`, `ConnectedEvent`, `PingEvent`, `ErrorEvent`, `DeliveryLog`, `BillingLog`
  - `WebSocketStreamError` exception for stream connection failures
  - `ConflictError` exception for HTTP 409 responses (e.g. duplicate monitor name)

## [0.1.0] - 2024-01-01

### Added

- Initial release of the ScrapeBadger Node.js SDK
- Full TypeScript support with complete type definitions
- Twitter API client with sub-clients for:
  - Tweets (get, search, replies, retweeters, favoriters, similar)
  - Users (profiles, followers, following, search)
  - Lists (details, tweets, members, subscribers, search)
  - Communities (details, tweets, members, moderators, search)
  - Trends (trending topics, place trends, locations)
  - Geo (place details, search)
- Automatic pagination with async iterators
- Built-in retry logic with exponential backoff
- Typed exceptions for error handling
- ESM and CommonJS module support
- `collectAll` utility for collecting paginated results
