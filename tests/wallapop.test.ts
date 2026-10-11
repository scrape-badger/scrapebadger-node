/**
 * Tests for the Wallapop API client.
 *
 * Uses vitest and a simple fetch mock that intercepts calls made by BaseClient.
 * Fixtures are live Wallapop responses (SCR-253) after the scraper's own
 * normalisation, i.e. exactly what the API returns.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  WallapopSearchResponse,
  WallapopItemDetail,
  WallapopUserProfile,
  WallapopUserItemsResponse,
  WallapopReviewsResponse,
  WallapopAutocompleteResponse,
  WallapopCategoriesResponse,
  WallapopFiltersResponse,
  WallapopFilterOptionsResponse,
  WallapopMarketsResponse,
} from "../src/index.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeClient(): ScrapeBadger {
  return new ScrapeBadger({
    apiKey: "test-api-key",
    baseUrl: "https://api.scrapebadger.com",
    maxRetries: 0,
  });
}

function mockFetch(body: unknown, status = 200): void {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    })
  );
}

function capturedUrl(): URL {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  const [url] = mock.mock.calls[0] as [string, RequestInit];
  return new URL(url);
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SEARCH: WallapopSearchResponse = {
  items: [
    {
      id: "nzxeknm5x562",
      user_id: "dqjwdd53wwzo",
      title: "iPhone 14 128GB Negro",
      description: "iPhone 14 de color negro, con 128GB de almacenamiento.",
      price: 250.0,
      currency: "EUR",
      category_id: 24200,
      taxonomy: [
        {
          id: 24200,
          name: "Tecnología y electrónica",
        },
        {
          id: 24201,
          name: "Telefonía: móviles y smartwatches",
        },
        {
          id: 9447,
          name: "Smartphones",
        },
      ],
      condition: null,
      brand: null,
      model: null,
      attributes: {},
      images: [
        {
          id: "e65ve2rg0l2j",
          small:
            "https://cdn.wallapop.com/images/10420/lo/q3/__/c10420p1311318554/i6787540572.jpg?pictureSize=W320",
          medium:
            "https://cdn.wallapop.com/images/10420/lo/q3/__/c10420p1311318554/i6787540572.jpg?pictureSize=W640",
          large:
            "https://cdn.wallapop.com/images/10420/lo/q3/__/c10420p1311318554/i6787540572.jpg?pictureSize=W800",
          average_color: "13C1AC",
        },
      ],
      location: {
        latitude: 40.47122907944395,
        longitude: -3.8786801592876357,
        postal_code: "28222",
        city: "Majadahonda",
        region: "Comunidad de Madrid",
        region2: "Madrid",
        country_code: "ES",
        approximated: null,
      },
      shippable: true,
      user_allows_shipping: true,
      reserved: false,
      bumped: true,
      bump_type: "city",
      is_top_profile: true,
      is_refurbished: false,
      has_warranty: false,
      slug: "iphone-14-128gb-1311318554",
      url: "https://es.wallapop.com/item/iphone-14-128gb-1311318554",
      created_utc: 1791580490.949,
      created_at: "2026-10-09T21:14:50.949000Z",
      modified_utc: 1791753563.082,
      modified_at: "2026-10-11T21:19:23.082000Z",
    },
  ],
  result_count: 1,
  total_results: 49371,
  next_page: "eyJhbGciOiJIUzI1NiJ9.eyJwYXJhbXMiOnt9fQ.sig",
  order_by: "most_relevance",
  market: "es",
  country_code: "ES",
  search_id: "a6e9213a-8d01-481f-8f3d-bd6ffaf2a61c",
};

const ITEM: WallapopItemDetail = {
  id: "nzxeknm5x562",
  user_id: "dqjwdd53wwzo",
  title: "iPhone 14 128GB Negro",
  description: "iPhone 14 de color negro, con 128GB de almacenamiento.",
  vertical: "consumer_goods",
  price: 250.0,
  currency: "EUR",
  category_id: 9447,
  taxonomy: [
    {
      id: 24200,
      name: "Tecnología y electrónica",
    },
    {
      id: 24201,
      name: "Telefonía: móviles y smartwatches",
    },
    {
      id: 9447,
      name: "Smartphones",
    },
  ],
  condition: "good",
  brand: "Apple",
  model: "iPhone 14",
  attributes: {
    condition: {
      value: "good",
      title: "Estado",
      text: "Buen estado",
    },
    brand: {
      value: "Apple",
      title: "Marca",
      text: "Apple",
    },
  },
  characteristics: "Buen estado · Apple · iPhone 14 · 128 GB · Negro",
  characteristics_details: [
    {
      attribute: "Modelo",
      value: "iPhone 14",
    },
  ],
  hashtags: [],
  images: [
    {
      id: "e65ve2rg0l2j",
      small:
        "https://cdn.wallapop.com/images/10420/lo/q3/__/c10420p1311318554/i6787540572.jpg?pictureSize=W320",
      medium:
        "https://cdn.wallapop.com/images/10420/lo/q3/__/c10420p1311318554/i6787540572.jpg?pictureSize=W640",
      large:
        "https://cdn.wallapop.com/images/10420/lo/q3/__/c10420p1311318554/i6787540572.jpg?pictureSize=W800",
      average_color: "13C1AC",
    },
  ],
  location: {
    latitude: 40.47122907944395,
    longitude: -3.8786801592876357,
    postal_code: "28222",
    city: "Majadahonda",
    region: null,
    region2: null,
    country_code: "ES",
    approximated: true,
  },
  shippable: true,
  user_allows_shipping: true,
  supports_shipping: true,
  bumped: true,
  bump_type: "city",
  is_top_profile: true,
  views: 225,
  favorites: 14,
  conversations: 4,
  slug: "iphone-14-128gb-1311318554",
  url: "https://es.wallapop.com/item/iphone-14-128gb-1311318554",
  modified_utc: 1791753563.0,
  modified_at: "2026-10-11T21:19:23Z",
};

const USER: WallapopUserProfile = {
  id: "dqjwdd53wwzo",
  name: "Alejandro C.",
  type: "normal",
  seller_type: "Private",
  verified: true,
  is_top_profile: true,
  featured: false,
  image: {
    id: "0j2w7pmkmdjy",
    small:
      "https://cdn.wallapop.com/images/13/0e/yb/__/c13p25115753/i333760311.jpg?pictureSize=W320",
    medium:
      "https://cdn.wallapop.com/images/13/0e/yb/__/c13p25115753/i333760311.jpg?pictureSize=W640",
    large:
      "https://cdn.wallapop.com/images/13/0e/yb/__/c13p25115753/i333760311.jpg?pictureSize=W800",
    average_color: "5b5651",
  },
  location: {
    latitude: 40.47122907944395,
    longitude: -3.8786801592876357,
    postal_code: "28222",
    city: "Majadahonda",
    region: null,
    region2: null,
    country_code: "ES",
    approximated: false,
  },
  rating_average: 4.9,
  scoring_stars: 98.0,
  reviews_count: 108,
  published_count: 6,
  sold_count: 107,
  sells_count: 121,
  buys_count: 40,
  reports_received_count: 14,
  response_rate: "less_than_one_hour",
  activity_level: "unknown",
  deliveries_on_time_in_days: 0,
  validations: {
    level: "partially_verified",
    email: true,
    mobile: false,
    facebook: false,
    google: true,
    picture: true,
    location: true,
    birthday: true,
    kyc: true,
  },
  slug: "alexc-25115753",
  url: "https://es.wallapop.com/user/alexc-25115753",
  registered_utc: 1442055921.0,
  registered_at: "2015-09-12T11:05:21Z",
};

const USER_ITEMS: WallapopUserItemsResponse = {
  user_id: "dqjwdd53wwzo",
  items: [
    {
      id: "3zlm3y52kpjx",
      title: "Caja Cooler Master c700m",
      description:
        "En buen estado , valorada en 300€ , nueva 600€ , le falta solo una pata de goma ",
      price: 150.0,
      currency: "EUR",
      category_id: 24200,
      condition: "good",
      attributes: {
        brand: "Cooler Master ",
        condition: "good",
        up_to_kg: "30.0",
      },
      images: [
        {
          id: "0j2wey3lm2rj",
          small:
            "https://cdn.wallapop.com/images/10420/lf/ul/__/c10420p1296410893/i6706063683.jpg?pictureSize=W320",
          medium:
            "https://cdn.wallapop.com/images/10420/lf/ul/__/c10420p1296410893/i6706063683.jpg?pictureSize=W640",
          large:
            "https://cdn.wallapop.com/images/10420/lf/ul/__/c10420p1296410893/i6706063683.jpg?pictureSize=W800",
          average_color: "13C1AC",
        },
      ],
      shippable: true,
      user_allows_shipping: true,
      is_refurbished: false,
      has_warranty: false,
      slug: "caja-cooler-master-c700m-1296410893",
      url: "https://es.wallapop.com/item/caja-cooler-master-c700m-1296410893",
    },
  ],
  result_count: 1,
  next_page: "SSMxMjg3NDgyMTc1X0RfVSMyNTUwMTU0Nl9QIzIwMjYtMTAtMDJUMTI6NDE6NTQuOTY3Wg==",
  market: "es",
};

const REVIEWS: WallapopReviewsResponse = {
  user_id: "dqjwdd53wwzo",
  reviews: [
    {
      id: "7035191d-0156-40e3-90c3-736a0bf6f24c",
      rating: 5,
      scoring: 100,
      comment:
        "Muy agradable y super facil de hacer tratos con el, lo recomiendo al 100%, se preocupa mucho.",
      type: "sell",
      is_shipping_transaction: true,
      item: {
        id: "3zlmy547v8jx",
        title: "Sony Alpha a6400 Cámara Mirrorless APS-C",
        category_id: 24200,
        image:
          "https://cdn.wallapop.com/images/10420/li/xd/__/c10420p1301579669/i6739066786.jpg?pictureSize=W800",
        slug: "sony-alpha-a6400-camara-mirrorless-aps-c-1301579669",
        url: "https://es.wallapop.com/item/sony-alpha-a6400-camara-mirrorless-aps-c-1301579669",
      },
      reviewer: {
        id: "pj9yxer3go6e",
        name: "Markel L.",
        image:
          "https://cdn.wallapop.com/images/13/7f/qs/__/c13p449707485/i3608964288.jpg?pictureSize=W800",
        slug: "unknown-449707485",
      },
      created_utc: 1790438569.0,
      created_at: "2026-09-26T16:02:49Z",
    },
  ],
  result_count: 1,
  next_page: "40",
  market: "es",
};

const SUGGEST: WallapopAutocompleteResponse = {
  query: "bici",
  suggestions: [
    {
      text: "bicicleta look",
      subtitle: null,
      type: "regular",
    },
    {
      text: "bicis",
      subtitle: null,
      type: "regular",
    },
  ],
  market: "es",
};

const CATEGORIES: WallapopCategoriesResponse = {
  categories: [
    {
      id: 100,
      name: "Cars",
      parent_id: null,
      vertical: "cars",
      icon: "car",
      subcategories: [],
    },
  ],
  market: "es",
};

const FILTERS: WallapopFiltersResponse = {
  filters: [
    {
      id: "is_shippable",
      title: "Opciones de envío",
      type: "toggle",
      params: ["is_shippable"],
      multi: null,
      options: [],
      options_endpoint: false,
    },
    {
      id: "condition",
      title: "Estado",
      type: "list",
      params: ["condition"],
      multi: true,
      options: [
        {
          id: "un_opened",
          title: "Sin abrir",
        },
        {
          id: "in_box",
          title: "En su caja",
        },
      ],
      options_endpoint: false,
    },
    {
      id: "brand",
      title: "Marca",
      type: "list",
      params: ["brand"],
      multi: true,
      options: [],
      options_endpoint: true,
    },
  ],
  market: "es",
};

const FILTER_OPTIONS: WallapopFilterOptionsResponse = {
  filter_id: "brand",
  options: [
    {
      id: "2K",
      title: "2K",
    },
    {
      id: "2K Games",
      title: "2K Games",
    },
  ],
  market: "es",
};

const MARKETS: WallapopMarketsResponse = {
  markets: [
    {
      code: "es",
      country_code: "ES",
      name: "Spain",
      currency: "EUR",
      language: "es-ES",
      default_latitude: 40.4168,
      default_longitude: -3.7038,
    },
    {
      code: "it",
      country_code: "IT",
      name: "Italy",
      currency: "EUR",
      language: "it-IT",
      default_latitude: 41.9028,
      default_longitude: 12.4964,
    },
    {
      code: "pt",
      country_code: "PT",
      name: "Portugal",
      currency: "EUR",
      language: "pt-PT",
      default_latitude: 38.7223,
      default_longitude: -9.1393,
    },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("WallapopClient", () => {
  let client: ScrapeBadger;

  beforeEach(() => {
    vi.unstubAllGlobals();
    client = makeClient();
  });

  it("is registered on the top-level client", () => {
    expect(client.wallapop).toBeDefined();
  });

  describe("search", () => {
    it("sends only the query when no options are set", async () => {
      mockFetch(SEARCH);
      const result = await client.wallapop.search("iphone");

      const url = capturedUrl();
      expect(url.pathname).toBe("/v1/wallapop/search");
      expect([...url.searchParams.keys()]).toEqual(["query"]);
      expect(url.searchParams.get("query")).toBe("iphone");

      expect(result.items[0]?.id).toBe("nzxeknm5x562");
      expect(result.items[0]?.price).toBe(250);
      expect(result.items[0]?.taxonomy.at(-1)?.name).toBe("Smartphones");
      expect(result.total_results).toBe(49371);
      expect(result.next_page).toBe(SEARCH.next_page);
    });

    it("maps camelCase options to snake_case params", async () => {
      mockFetch(SEARCH);
      await client.wallapop.search("golf", {
        market: "it",
        latitude: 41.9,
        longitude: 12.5,
        distanceKm: 50,
        categoryId: 100,
        minPrice: 1000,
        maxPrice: 9000,
        condition: "good,as_good_as_new",
        brand: "Volkswagen",
        model: "Golf",
        color: "black",
        timeFilter: "lastWeek",
        minYear: 2015,
        maxYear: 2020,
        minKm: 0,
        maxKm: 150000,
        gearbox: "manual",
        minHorsepower: 90,
        maxHorsepower: 150,
        orderBy: "price_low_to_high",
      });

      const params = Object.fromEntries(capturedUrl().searchParams);
      expect(params).toEqual({
        query: "golf",
        market: "it",
        latitude: "41.9",
        longitude: "12.5",
        distance_km: "50",
        category_id: "100",
        min_price: "1000",
        max_price: "9000",
        condition: "good,as_good_as_new",
        brand: "Volkswagen",
        model: "Golf",
        color: "black",
        time_filter: "lastWeek",
        min_year: "2015",
        max_year: "2020",
        min_km: "0",
        max_km: "150000",
        gearbox: "manual",
        min_horsepower: "90",
        max_horsepower: "150",
        order_by: "price_low_to_high",
      });
    });

    it("sends boolean filters only when true", async () => {
      mockFetch(SEARCH);
      await client.wallapop.search("iphone", {
        shippable: true,
        hasWarranty: false,
        refurbished: true,
      });

      const params = capturedUrl().searchParams;
      expect(params.get("shippable")).toBe("true");
      expect(params.get("refurbished")).toBe("true");
      expect(params.has("has_warranty")).toBe(false);
    });

    it("pages with nextPage and no query", async () => {
      mockFetch(SEARCH);
      await client.wallapop.search(undefined, { nextPage: "cursor-token" });

      const params = Object.fromEntries(capturedUrl().searchParams);
      expect(params).toEqual({ next_page: "cursor-token" });
    });
  });

  describe("getItem", () => {
    it("fetches a listing and URL-encodes the id", async () => {
      mockFetch(ITEM);
      const item = await client.wallapop.getItem("iphone 14/128gb", { market: "es" });

      const url = capturedUrl();
      expect(url.pathname).toBe("/v1/wallapop/items/iphone%2014%2F128gb");
      expect(url.searchParams.get("market")).toBe("es");
      expect(item.vertical).toBe("consumer_goods");
      expect(item.category_id).toBe(9447);
      expect(item.attributes["condition"]?.text).toBe("Buen estado");
      expect(item.views).toBe(225);
    });

    it("omits market when not set", async () => {
      mockFetch(ITEM);
      await client.wallapop.getItem("nzxeknm5x562");

      const url = capturedUrl();
      expect(url.pathname).toBe("/v1/wallapop/items/nzxeknm5x562");
      expect(url.search).toBe("");
    });
  });

  describe("users", () => {
    it("getUser returns the merged profile", async () => {
      mockFetch(USER);
      const user = await client.wallapop.getUser("alexc-25115753");

      expect(capturedUrl().pathname).toBe("/v1/wallapop/users/alexc-25115753");
      expect(user.id).toBe("dqjwdd53wwzo");
      expect(user.rating_average).toBe(4.9);
      expect(user.validations?.kyc).toBe(true);
      expect(user.registered_at).toBe("2015-09-12T11:05:21Z");
    });

    it("getUserItems passes the cursor as next_page", async () => {
      mockFetch(USER_ITEMS);
      const page = await client.wallapop.getUserItems("dqjwdd53wwzo", {
        market: "es",
        nextPage: "abc==",
      });

      const url = capturedUrl();
      expect(url.pathname).toBe("/v1/wallapop/users/dqjwdd53wwzo/items");
      expect(Object.fromEntries(url.searchParams)).toEqual({ market: "es", next_page: "abc==" });
      expect(page.items[0]?.attributes["brand"]).toBe("Cooler Master ");
      expect(page.next_page).toBe(USER_ITEMS.next_page);
    });

    it("getUserReviews returns reviews with item and reviewer", async () => {
      mockFetch(REVIEWS);
      const page = await client.wallapop.getUserReviews("dqjwdd53wwzo");

      expect(capturedUrl().pathname).toBe("/v1/wallapop/users/dqjwdd53wwzo/reviews");
      const review = page.reviews[0];
      expect(review?.rating).toBe(5);
      expect(review?.type).toBe("sell");
      expect(review?.item?.slug).toBe("sony-alpha-a6400-camara-mirrorless-aps-c-1301579669");
      expect(review?.reviewer?.name).toBe("Markel L.");
      expect(page.next_page).toBe("40");
    });
  });

  describe("reference", () => {
    it("autocomplete", async () => {
      mockFetch(SUGGEST);
      const result = await client.wallapop.autocomplete("bici", { market: "es" });

      const url = capturedUrl();
      expect(url.pathname).toBe("/v1/wallapop/autocomplete");
      expect(Object.fromEntries(url.searchParams)).toEqual({ query: "bici", market: "es" });
      expect(result.suggestions.map((s) => s.text)).toEqual(["bicicleta look", "bicis"]);
    });

    it("listCategories", async () => {
      mockFetch(CATEGORIES);
      const result = await client.wallapop.listCategories({ market: "it" });

      const url = capturedUrl();
      expect(url.pathname).toBe("/v1/wallapop/categories");
      expect(url.searchParams.get("market")).toBe("it");
      expect(result.categories[0]?.vertical).toBe("cars");
    });

    it("listFilters", async () => {
      mockFetch(FILTERS);
      const result = await client.wallapop.listFilters({ categoryId: 24200, query: "iphone" });

      const url = capturedUrl();
      expect(url.pathname).toBe("/v1/wallapop/filters");
      expect(Object.fromEntries(url.searchParams)).toEqual({
        category_id: "24200",
        query: "iphone",
      });
      const brand = result.filters.find((f) => f.id === "brand");
      expect(brand?.options_endpoint).toBe(true);
      expect(result.filters.find((f) => f.id === "condition")?.options.length).toBe(2);
    });

    it("listFilterOptions URL-encodes the filter id", async () => {
      mockFetch(FILTER_OPTIONS);
      const result = await client.wallapop.listFilterOptions("brand", { query: "iphone" });

      const url = capturedUrl();
      expect(url.pathname).toBe("/v1/wallapop/filters/brand/options");
      expect(Object.fromEntries(url.searchParams)).toEqual({ query: "iphone" });
      expect(result.filter_id).toBe("brand");
      expect(result.options[0]?.id).toBe("2K");
    });

    it("listMarkets", async () => {
      mockFetch(MARKETS);
      const result = await client.wallapop.listMarkets();

      const url = capturedUrl();
      expect(url.pathname).toBe("/v1/wallapop/markets");
      expect(result.markets.map((m) => m.code)).toEqual(["es", "it", "pt"]);
    });
  });

  it("surfaces API errors", async () => {
    mockFetch({ detail: "Provide a query, a category_id, or both." }, 422);
    await expect(client.wallapop.search()).rejects.toThrow();
  });
});
