# Vinted API

The ScrapeBadger Vinted API provides endpoints for searching items, fetching item details, user profiles, user listings, and reference data (brands, colors, statuses, markets) across all Vinted marketplaces. All methods are available under `client.vinted`.

## Usage Examples

### Search Items

```typescript
import { ScrapeBadger } from "scrapebadger";

const client = new ScrapeBadger({ apiKey: "your-api-key" });

// Basic search
const results = await client.vinted.search.search({ query: "nike air max" });
for (const item of results.items) {
  console.log(`${item.title} — ${item.price.amount} ${item.price.currency_code}`);
}

// Search with filters
const filtered = await client.vinted.search.search({
  query: "adidas",
  market: "de",
  page: 1,
  per_page: 20,
  price_from: 10,
  price_to: 50,
  brand_ids: "53",
  color_ids: "1,2",
  status_ids: "1",
  order: "price_low_to_high",
});
console.log(`Found ${filtered.pagination.total_entries} items`);
console.log(`Page ${filtered.pagination.current_page} of ${filtered.pagination.total_pages}`);
```

### Get Item Details

```typescript
// Fetch full item details by ID
const response = await client.vinted.items.get(123456789);
const { item } = response;
console.log(`${item.title}: ${item.description}`);
console.log(`Brand: ${item.brand_title}, Size: ${item.size_title}`);
console.log(`Price: ${item.price.amount} ${item.price.currency_code}`);
console.log(`Seller: ${item.seller.login} (${item.seller.feedback_reputation} reputation)`);
console.log(`Photos: ${item.photos.length}`);

// Specify a different market
const deItem = await client.vinted.items.get(123456789, { market: "de" });
```

### User Profiles

```typescript
// Get user profile
const profile = await client.vinted.users.getProfile(12345);
const { user } = profile;
console.log(`${user.login} from ${user.city}, ${user.country_code}`);
console.log(`Reputation: ${user.feedback_reputation}`);
console.log(`Items: ${user.item_count}, Followers: ${user.followers_count}`);
console.log(`Positive: ${user.positive_feedback_count}, Negative: ${user.negative_feedback_count}`);

// Get user's items with pagination
const items = await client.vinted.users.getItems(12345, {
  market: "fr",
  page: 1,
  per_page: 20,
});
for (const item of items.items) {
  console.log(`${item.title} — ${item.price.amount} ${item.price.currency_code}`);
}
console.log(`Page ${items.pagination.current_page} of ${items.pagination.total_pages}`);
```

### Reference Data

```typescript
// Get available markets
const markets = await client.vinted.reference.markets();
for (const market of markets.markets) {
  console.log(`${market.name} (${market.code}) — ${market.domain} — ${market.currency}`);
}

// Search brands by keyword
const brands = await client.vinted.reference.brands({
  keyword: "nike",
  market: "fr",
  per_page: 10,
});
for (const brand of brands.brands) {
  console.log(`${brand.title} (${brand.slug}): ${brand.item_count} items`);
}

// Get available colors for a market
const colors = await client.vinted.reference.colors({ market: "fr" });
for (const color of colors.colors) {
  console.log(`${color.title} (#${color.hex})`);
}

// Get item condition statuses
const statuses = await client.vinted.reference.statuses({ market: "fr" });
for (const status of statuses.statuses) {
  console.log(`${status.id}: ${status.title}`);
}
```

## API Reference

### Vinted Modules

| Module | Description |
|--------|-------------|
| `client.vinted.search` | Search for items across Vinted marketplaces |
| `client.vinted.items` | Get individual item details |
| `client.vinted.users` | User profiles and their item listings |
| `client.vinted.reference` | Reference data (brands, colors, statuses, markets) |

### Search Methods

| Method | Description |
|--------|-------------|
| `search(params)` | Search for items with query, filters, and pagination |

### Items Methods

| Method | Description |
|--------|-------------|
| `get(itemId, options?)` | Get full item details by ID |

### Users Methods

| Method | Description |
|--------|-------------|
| `getProfile(userId, options?)` | Get a user's profile |
| `getItems(userId, options?)` | Get items listed by a user |

### Reference Methods

| Method | Description |
|--------|-------------|
| `brands(options?)` | Search for brands by keyword |
| `colors(options?)` | Get available colors for a market |
| `statuses(options?)` | Get item condition statuses for a market |
| `markets()` | Get all available Vinted markets |

## Types

### VintedSearchParams

| Option | Type | Description |
|--------|------|-------------|
| `query` | `string` | Search query string (required) |
| `market` | `string` | Market code (default: `"fr"`) |
| `page` | `number` | Page number |
| `per_page` | `number` | Items per page |
| `price_from` | `number` | Minimum price filter |
| `price_to` | `number` | Maximum price filter |
| `brand_ids` | `string` | Comma-separated brand IDs |
| `color_ids` | `string` | Comma-separated color IDs |
| `status_ids` | `string` | Comma-separated status IDs |
| `order` | `string` | Sort order: `"relevance"`, `"newest_first"`, `"price_low_to_high"`, `"price_high_to_low"` |

### VintedItemSummary

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Unique item identifier |
| `title` | `string` | Item title |
| `price` | `VintedPrice` | Price with amount and currency |
| `brand_title` | `string` | Brand name |
| `size_title` | `string` | Size label |
| `status` | `string` | Item condition status |
| `url` | `string` | Item URL on Vinted |
| `favourite_count` | `number` | Number of favorites |
| `view_count` | `number` | Number of views |
| `user` | `VintedUserSummary` | Item owner summary |
| `photo` | `VintedPhoto` | Main photo |
| `photos` | `VintedPhoto[]` | All photos |

### VintedItemDetail

Extends `VintedItemSummary` with:

| Field | Type | Description |
|-------|------|-------------|
| `description` | `string` | Item description |
| `catalog_id` | `number` | Catalog category identifier |
| `color1` | `string` | Primary color |
| `seller` | `VintedSellerSummary` | Seller details with feedback stats |
| `category` | `string` | Category name |
| `upload_date` | `string` | Upload timestamp (ISO format) |
| `can_buy` | `boolean` | Whether the item can be purchased |
| `instant_buy` | `boolean` | Whether instant buy is enabled |
| `is_closed` | `boolean` | Whether the listing is closed |
| `is_reserved` | `boolean` | Whether the item is reserved |
| `is_hidden` | `boolean` | Whether the item is hidden |

### VintedUserProfile

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Unique user identifier |
| `login` | `string` | Username |
| `photo_url` | `string \| null` | Profile photo URL |
| `business` | `boolean` | Whether the user is a business account |
| `country_code` | `string` | ISO country code |
| `city` | `string` | City name |
| `feedback_count` | `number` | Total feedback count |
| `feedback_reputation` | `number` | Overall reputation (0-1) |
| `positive_feedback_count` | `number` | Positive ratings |
| `neutral_feedback_count` | `number` | Neutral ratings |
| `negative_feedback_count` | `number` | Negative ratings |
| `item_count` | `number` | Number of items listed |
| `followers_count` | `number` | Number of followers |
| `following_count` | `number` | Number following |
| `is_online` | `boolean` | Whether currently online |
| `is_on_holiday` | `boolean` | Whether on holiday mode |

---

[Back to main README](../README.md)
