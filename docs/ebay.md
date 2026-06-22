# eBay API

The ScrapeBadger eBay API provides access to eBay marketplace data across 12 endpoints over 18 markets: keyword search, completed/sold listings, item detail, item reviews, seller profile/items/feedback, category browse, category list, autocomplete, and reference markets. All methods are available via `client.ebay`.

[Back to main README](../README.md)

## Sub-clients

| Sub-client | Methods | Endpoints |
|------------|---------|-----------|
| `client.ebay.search` | `search`, `completed`, `autocomplete` | `/v1/ebay/search`, `/v1/ebay/completed`, `/v1/ebay/autocomplete` |
| `client.ebay.items` | `get`, `reviews` | `/v1/ebay/items/{itemId}`, `.../reviews` |
| `client.ebay.sellers` | `get`, `items`, `feedback` | `/v1/ebay/sellers/{username}`, `.../items`, `.../feedback` |
| `client.ebay.categories` | `browse`, `list` | `/v1/ebay/categories/{categoryId}/items`, `/v1/ebay/categories` |
| `client.ebay.reference` | `markets` | `/v1/ebay/markets` |

## Param enums

- `sort_by`: `best_match` | `ending_soonest` | `newly_listed` | `price_low_to_high` | `price_high_to_low`
- `condition`: `new` | `open_box` | `refurbished` | `used` | `for_parts`
- `buying_format`: `auction` | `buy_it_now` | `best_offer`
- `per_page`: `60` | `120` | `240` (clamped)
- `domain` (default `"com"`): `com`, `co.uk`, `de`, `fr`, `it`, `es`, `com.au`, `ca`, `at`, `ch`, `be`, `ie`, `nl`, `pl`, `com.hk`, `com.sg`, `com.my`, `ph` (aliases: `us`→`com`, `uk`/`gb`→`co.uk`, `au`→`com.au`)

## Auction fields

Auction listings populate the existing `is_auction` (bool), `bids` (count), and `time_left` (relative string, e.g. `"12h 16m"`) fields, plus these auction-specific fields:

- Search/listing cards (`SearchResult`) gain `current_bid` (`EbayPrice | null`) — the current high bid (mirrors `price`); `null` for non-auctions.
- Item detail (`Item`) gains:
  - `current_bid` (`EbayPrice | null`) — the current high bid (mirrors `price`); `null` for non-auctions.
  - `end_time_utc` (`number | null`) — absolute auction end time as a Unix timestamp (float seconds).
  - `end_time_at` (`string | null`) — absolute auction end time as an ISO-8601 Z string (e.g. `"2026-06-22T19:50:51Z"`).
  - `buy_it_now_price` (`EbayPrice | null`) — Buy-It-Now price for fixed-price listings (== `price`) or auctions with Buy-It-Now; `null` for pure auctions.

```typescript
const detail = await client.ebay.items.get("123456789012");
if (detail.item.is_auction) {
  console.log(`Current bid: ${detail.item.current_bid?.raw} (${detail.item.bids} bids)`);
  console.log(`Ends ${detail.item.end_time_at} — ${detail.item.time_left} left`);
}
```

## Usage Examples

### Search

```typescript
const client = new ScrapeBadger({ apiKey: "your-key" });

const results = await client.ebay.search.search({
  query: "nintendo switch",
  domain: "com",
  condition: "new",
  min_price: 100,
  max_price: 400,
  sort_by: "price_low_to_high",
  free_shipping: true,
});
for (const item of results.results) {
  console.log(`${item.position}. ${item.title} - ${item.price?.raw ?? "N/A"}`);
}

// Sold-price history (completed listings)
const sold = await client.ebay.search.completed({ query: "nintendo switch" });

// Autocomplete
const suggestions = await client.ebay.search.autocomplete("ipho");
```

### Item Detail / Reviews

```typescript
const detail = await client.ebay.items.get("123456789012", { domain: "com" });
console.log(`${detail.item.title} by ${detail.item.seller?.username}`);

const reviews = await client.ebay.items.reviews("123456789012", { page: 1 });
console.log(`${reviews.ratings_total} reviews, avg ${reviews.rating}`);

// Fetch reviews by catalog product id instead of item id
const byProduct = await client.ebay.items.reviews("123456789012", {
  productId: "987654321",
});
```

### Sellers

```typescript
const profile = await client.ebay.sellers.get("musicmagpie");
console.log(`${profile.seller.feedback_score} feedback (${profile.seller.feedback_percent}%)`);

const items = await client.ebay.sellers.items("musicmagpie", { query: "switch", page: 1 });
const feedback = await client.ebay.sellers.feedback("musicmagpie", { page: 1 });
```

### Categories

```typescript
const listings = await client.ebay.categories.browse("9355", {
  sort_by: "newly_listed",
  min_price: 50,
});

const categories = await client.ebay.categories.list();
```

### Reference

```typescript
const markets = await client.ebay.reference.markets();
for (const m of markets.markets) {
  console.log(`${m.code}: ${m.domain} (${m.currency})`);
}
```
