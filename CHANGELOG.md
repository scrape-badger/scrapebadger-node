# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
