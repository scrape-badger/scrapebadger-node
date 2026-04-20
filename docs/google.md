# Google API

The ScrapeBadger Google API provides structured JSON access to **16 Google product APIs** across 29 endpoints: Search, Maps, News, Hotels, Trends, Jobs, Shopping, Patents, Scholar, Autocomplete, Images, Videos, Finance, AI Mode, Lens, and immersive Products. All methods are available under `client.google`.

The service handles SearchGuard, proxy rotation, cookie warmup, and IP rotation on 429s automatically — you just call the endpoint.

## Usage Examples

### Web Search (SERP)

```typescript
import { ScrapeBadger } from "scrapebadger";

const client = new ScrapeBadger({ apiKey: "your-api-key" });

// Basic search
const serp = await client.google.search.search({ q: "python 3.13" });
for (const result of serp.organic_results as any[]) {
  console.log(result.title, result.link);
}

// Search with advanced parameters (21 supported)
const advanced = await client.google.search.search({
  q: "best laptops 2026",
  gl: "gb",
  hl: "en",
  num: 20,
  start: 10,
  domain: "google.co.uk",  // any of 185 Google domains
  device: "mobile",
  tbs: "qdr:w",  // past week
  safe: "off",
});
// Structured sections:
//   organic_results, knowledge_graph, ai_overview, related_questions,
//   related_searches, local_results, inline_videos, pagination
console.log(
  `About ${advanced.search_information.total_results.toLocaleString()} results ` +
  `in ${advanced.search_information.time_taken}s`
);
```

### Maps (Search, Place, Reviews, Photos, Posts)

```typescript
// Search for places
const places = await client.google.maps.search({
  q: "coffee shops in san francisco",
  ll: "@37.7749,-122.4194,14z",
});
for (const place of places.results as any[]) {
  console.log(`${place.title} — ${place.rating}★ (${place.reviews_count} reviews)`);
}

// Place details (either place_id or data_id)
const detail = await client.google.maps.place({ data_id: "0x808580a2:0x123abc" });

// Reviews (sorted + paginated)
const reviews = await client.google.maps.reviews({
  data_id: "0x808580a2:0x123abc",
  sort_by: "newestFirst",
  results: 20,
});

// Photos + business posts
const photos = await client.google.maps.photos({ data_id: "0x808580a2:0x123abc" });
const posts = await client.google.maps.posts({ data_id: "0x808580a2:0x123abc" });
```

### News (Search, Topics, Trending)

```typescript
// Article search
const articles = await client.google.news.search({
  q: "openai gpt-5",
  max_results: 20,
});
for (const a of articles.articles as any[]) {
  console.log(`[${a.source.name}] ${a.title} (${a.published_at})`);
}

// News by predefined topic
const tech = await client.google.news.topics({ topic: "TECHNOLOGY" });

// Trending stories (real-time)
const trending = await client.google.news.trending({ gl: "US" });
```

### Hotels

```typescript
const hotels = await client.google.hotels.search({
  q: "Paris",
  check_in: "2026-05-01",
  check_out: "2026-05-05",
  adults: 2,
  currency: "EUR",
});
for (const prop of hotels.properties as any[]) {
  const rate = prop.rate_per_night?.extracted;
  console.log(`${prop.name} — ${rate} EUR`);
}

// Detailed property info using property_token from search
const propertyToken = (hotels.properties as any[])[0].property_token;
const detail = await client.google.hotels.details({
  property_token: propertyToken,
  check_in: "2026-05-01",
  check_out: "2026-05-05",
});
```

### Trends (Interest, Regions, Related, Trending)

```typescript
// Interest over time — up to 5 comma-separated terms
const interest = await client.google.trends.interest({
  q: "python,javascript,rust,go,java",
  geo: "US",
  date: "today 12-m",
});
for (const point of interest.timeline as any[]) {
  console.log(point.date, point.values);
}

// Interest by region
const regions = await client.google.trends.regions({ q: "python" });

// Related topics + queries
const related = await client.google.trends.related({ q: "python" });
console.log(
  "Rising queries:",
  (related.related_queries as any).rising.map((q: any) => q.query)
);

// Real-time trending
const trendingSearches = await client.google.trends.trending({ geo: "US" });
```

### Jobs

```typescript
const jobs = await client.google.jobs.search({
  q: "software engineer",
  location: "San Francisco, CA",
  job_type: "FULLTIME",
  date_posted: "week",
});
for (const job of jobs.jobs as any[]) {
  console.log(`${job.title} @ ${job.company_name} — ${job.location}`);
}
```

### Shopping (Search + Product Detail + Merchant URL Enrichment)

```typescript
// Step 1: search
const products = await client.google.shopping.search({
  q: "laptop",
  min_price: 500,
  max_price: 2000,
  sort_by: "price_low",
});
for (const p of products.results as any[]) {
  console.log(
    `${p.title} — ${p.price.extracted} from ${p.source} ` +
    `(${p.rating}★, ${p.reviews})`
  );
}

// Step 2: per-product merchant URL enrichment (billed per call)
// Google has removed direct merchant links from organic Shopping HTML.
// The click endpoint uses an "I'm Feeling Lucky" redirect (scoped to
// the card's source merchant via the site: operator) to materialize
// the real product page URL. Mirrors 
// immersive product link pattern.
const first = (products.results as any[])[0];
const enriched = await client.google.shopping.click({
  title: first.title,
  source: first.source,       // scope: "site:walmart.com"
  product_id: first.product_id,
});
console.log("Merchant URL:", enriched.merchant_url);
// https://www.walmart.com/ip/Lenovo-IdeaPad-5-16IRU9-...

// Get detailed product information + seller list
const detail = await client.google.shopping.product({ product_id: first.product_id });
```

### Patents

```typescript
const results = await client.google.patents.search({
  q: "distributed lock manager",
  assignee: "Google",
  sort: "new",
});
for (const patent of results.results as any[]) {
  console.log(`${patent.patent_id}: ${patent.title}`);
}

// Full patent detail (abstract, claims, citations, classifications)
const detail = await client.google.patents.detail({ patent_id: "US10123456B2" });
console.log(detail.abstract);
console.log("Claims:", (detail.claims as any[]).length);
```

### Scholar, Autocomplete, Images, Videos

```typescript
// Scholarly articles
const papers = await client.google.scholar.search({
  q: "transformer attention mechanism",
  as_ylo: 2020,
  as_yhi: 2024,
  num: 20,
});

// Search suggestions
const suggestions = await client.google.autocomplete.get({ q: "pyth" });

// Image search with size + color + type filters
const images = await client.google.images.search({
  q: "golden retriever",
  imgsz: "l",          // large
  imgcolor: "color",
  imgtype: "photo",
});

// Video search
const videos = await client.google.videos.search({
  q: "python async tutorial",
  tbs: "qdr:w",
});
```

### Finance, AI Mode, Lens, Products

```typescript
// Stock / index / crypto quotes
const quote = await client.google.finance.quote({ q: "AAPL:NASDAQ" });
console.log(`${quote.symbol}: ${quote.price} (${quote.change}%)`);

// AI-generated answers (udm=50)
const answer = await client.google.aiMode.search({ q: "what is kubernetes?" });
for (const block of answer.text_blocks as any[]) {
  console.log(block.snippet);
}
for (const ref of answer.references as any[]) {
  console.log("Source:", ref.title, ref.link);
}

// Visual image search by URL
const lens = await client.google.lens.search({
  url: "https://example.com/photo.jpg",
});

// Immersive product detail (by product_id)
const product = await client.google.products.detail({ product_id: "1234567890" });
```

## API Reference

### Google Sub-clients

| Sub-client | Description |
|---|---|
| `client.google.search` | Google web search (SERP) |
| `client.google.maps` | Maps: search, place, reviews, photos, posts |
| `client.google.news` | News: search, topics, trending |
| `client.google.hotels` | Hotels: search, details |
| `client.google.trends` | Trends: interest, regions, related, trending |
| `client.google.jobs` | Job listings search |
| `client.google.shopping` | Shopping: search, product, click enrichment |
| `client.google.patents` | Patents: search, detail |
| `client.google.scholar` | Academic paper search |
| `client.google.autocomplete` | Search suggestion lookup |
| `client.google.images` | Image search |
| `client.google.videos` | Video search |
| `client.google.finance` | Stock / index / crypto quotes |
| `client.google.aiMode` | Generative AI answers (udm=50) |
| `client.google.lens` | Visual image search by URL |
| `client.google.products` | Immersive product detail |

### Methods

| Sub-client | Method | Description |
|---|---|---|
| `search` | `search(params)` | Web search with 21 parameters |
| `maps` | `search(params)` | Place search by query |
| `maps` | `place(params)` | Place detail (place_id or data_id) |
| `maps` | `reviews(params)` | Paginated reviews |
| `maps` | `photos(params)` | Place photos |
| `maps` | `posts(params)` | Business posts |
| `news` | `search(params)` | News article search |
| `news` | `topics(params)` | News by topic |
| `news` | `trending(params?)` | Trending stories |
| `hotels` | `search(params)` | Hotel search |
| `hotels` | `details(params)` | Property details |
| `trends` | `interest(params)` | Interest over time |
| `trends` | `regions(params)` | Interest by region |
| `trends` | `related(params)` | Related topics + queries |
| `trends` | `trending(params?)` | Real-time trending |
| `jobs` | `search(params)` | Job listings |
| `shopping` | `search(params)` | Product search |
| `shopping` | `product(params)` | Product detail + sellers |
| `shopping` | `click(params)` | Merchant URL enrichment |
| `patents` | `search(params)` | Patent search |
| `patents` | `detail(params)` | Patent document |
| `scholar` | `search(params)` | Academic papers |
| `autocomplete` | `get(params)` | Search suggestions |
| `images` | `search(params)` | Image search |
| `videos` | `search(params)` | Video search |
| `finance` | `quote(params)` | Stock / index / crypto quote |
| `aiMode` | `search(params)` | AI-generated answer |
| `lens` | `search(params)` | Visual search by URL |
| `products` | `detail(params)` | Immersive product |

All methods are async and return `Promise<GoogleResponse>` (aliased as `Record<string, unknown>`). Cast to your own types as needed.

## Types

All parameter types are strictly typed via TypeScript interfaces. The full list is exported from the `scrapebadger` package:

```typescript
import type {
  GoogleSearchParams,
  MapsSearchParams,
  MapsPlaceParams,
  MapsReviewsParams,
  MapsPhotosParams,
  MapsPostsParams,
  NewsSearchParams,
  NewsTopicsParams,
  NewsTrendingParams,
  HotelsSearchParams,
  HotelsDetailsParams,
  TrendsInterestParams,
  TrendsRegionsParams,
  TrendsRelatedParams,
  TrendsTrendingParams,
  JobsSearchParams,
  ShoppingSearchParams,
  ShoppingProductParams,
  ShoppingClickParams,
  PatentsSearchParams,
  PatentsDetailParams,
  ScholarSearchParams,
  AutocompleteParams,
  ImagesSearchParams,
  VideosSearchParams,
  FinanceQuoteParams,
  AiModeSearchParams,
  LensSearchParams,
  ProductsDetailParams,
  GoogleResponse,
} from "scrapebadger";
```

### ShoppingSearchParams

| Field | Type | Description |
|---|---|---|
| `q` | `string` | Product search query (required) |
| `gl` | `string` | Country code (default `"us"`) |
| `min_price` | `number` | Minimum price filter |
| `max_price` | `number` | Maximum price filter |
| `sort_by` | `"price_low" \| "price_high" \| "rating" \| "reviews"` | Sort order |

### ShoppingClickParams

| Field | Type | Description |
|---|---|---|
| `title` | `string` | Exact product title from a search result (required) |
| `source` | `string?` | Merchant source name (e.g. `"Walmart"`) — scopes the lookup via `site:` operator |
| `q` | `string?` | Original search query — improves disambiguation |
| `product_id` | `string?` | Stable product_id from the search result |
| `gl` | `string?` | Country code |
| `hl` | `string?` | Language code |

### GoogleSearchParams

| Field | Type | Description |
|---|---|---|
| `q` | `string` | Search query (required, supports Google operators) |
| `gl` | `string?` | Country code |
| `hl` | `string?` | Language code |
| `num` | `number?` | Results per page (1-100) |
| `start` | `number?` | Page offset (0, 10, 20, ...) |
| `domain` | `string?` | Google domain (e.g. `"google.co.uk"`) |
| `device` | `"desktop" \| "mobile"?` | Device type |
| `location` | `string?` | City-level geo-targeting |
| `lr` | `string?` | Language restrict (e.g. `"lang_en"`) |
| `tbs` | `string?` | Time/filter string (e.g. `"qdr:d"` past day) |
| `safe` | `"off" \| "medium" \| "high"?` | Safe search |
| `uule` | `string?` | UULE encoded location |
| `filter` | `number?` | Set to 0 to show omitted results |
| `nfpr` | `number?` | Set to 1 to disable auto-correction |
| `cr` | `string?` | Country restrict |
| `ludocid` | `string?` | Google Place CID |
| `lsig` | `string?` | Knowledge Graph map ID |
| `kgmid` | `string?` | Knowledge Graph entity ID |
| `si` | `string?` | Cached search params token |
| `ibp` | `string?` | Layout control |
| `uds` | `string?` | Google filter string |

## Credit Costs

| Endpoint | Credits |
|---|---|
| `search`, `images`, `videos`, `maps/search`, `shopping/search`, `jobs/search`, `scholar/search`, `patents/search`, `finance/quote`, `trends/*` (except trending) | **2** |
| `maps/place`, `maps/reviews`, `patents/detail`, `ai-mode/search`, `lens/search`, `hotels/search`, `products/detail` | **3** |
| `hotels/details`, `shopping/product` | **5** |
| `news/*`, `autocomplete`, `trends/trending`, `maps/photos`, `maps/posts`, `shopping/product/click` | **1** |
| Failed requests | **0** |

## Anti-Bot Handling

Google deployed **SearchGuard** in January 2025 — a JavaScript challenge that blocks raw HTTP. The ScrapeBadger Google scraper handles it automatically:

1. First request attempts `curl_cffi` with cached cookies (~0.2s fast path)
2. On SearchGuard detection, a `patchright` browser warmup solves the challenge
3. Subsequent requests reuse the warm cookies for speed
4. On 429 or CAPTCHA, the cached residential proxy session is invalidated to rotate the exit IP (up to 3 rotations per request)

## Shopping Click Enrichment — Why It Exists

Google has removed direct merchant URLs from organic Shopping HTML — clicking a product card in the real Shopping UI opens a JavaScript modal that only fetches merchant info when you click "Visit site". Capturing that flow in a single synchronous scrape is impractical (~60-90s for 50 products).

Instead, the `shopping.click()` method exposes per-product merchant URL resolution as an **on-demand call** using Google's "I'm Feeling Lucky" redirect (`btnI=1`), scoped to the card's `source` merchant via a `site:` operator. You only pay for enrichment when you actually need the link — per-call credit cost is configured per-endpoint by admins (query `/public/pricing` for the live rate).

Known source → domain mappings include: Walmart, Best Buy, Amazon, Target, eBay, Newegg, Costco, Home Depot, Lowe's, Staples, Office Depot, Micro Center, Adorama, B&H Photo-Video-Pro Audio, HP, Dell, Lenovo, Apple, Razer, Asus, Acer, HyperX, MSI, Samsung. When the source is not in the map, the endpoint falls back to a bare-title query.

See the [full API documentation](https://docs.scrapebadger.com) for complete details on every endpoint and parameter.

---

[Back to main README](../README.md)
