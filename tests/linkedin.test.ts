/**
 * Tests for the LinkedIn API client.
 *
 * Uses vitest and a simple fetch mock that intercepts calls made by BaseClient.
 * Focus: camelCase option keys must serialise to the snake_case query keys the
 * backend expects (geo_id, company_id, date_posted, job_type), and path
 * building for the resource endpoints.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrapeBadger } from "../src/client.js";
import type {
  LinkedInJobsSearchResponse,
  LinkedInGeoSuggestResponse,
} from "../src/linkedin/types.js";

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

function capturedUrl(): string {
  const mock = vi.mocked(fetch);
  expect(mock).toHaveBeenCalledOnce();
  return mock.mock.calls[0][0] as string;
}

const JOBS_FIXTURE: LinkedInJobsSearchResponse = {
  jobs: [
    {
      job_id: "3901234567",
      title: "Senior Python Engineer",
      is_new: false,
      benefits: [],
    },
  ],
  meta: { result_count: 1, start: 0, has_more: false },
};

const GEO_FIXTURE: LinkedInGeoSuggestResponse = {
  query: "London",
  type: "geo",
  suggestions: [{ id: "90009496", display_name: "London, England", type: "GEO" }],
};

describe("LinkedInClient on ScrapeBadger", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("is accessible via client.linkedin", () => {
    expect(makeClient().linkedin).toBeDefined();
  });
});

describe("LinkedInClient.jobsSearch", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("maps camelCase options to snake_case query keys", async () => {
    mockFetch(JOBS_FIXTURE);
    const client = makeClient();

    const result = await client.linkedin.jobsSearch({
      keywords: "python",
      location: "New York",
      geoId: "90000070",
      companyId: "1035",
      datePosted: "past-week",
      jobType: "full-time",
      workplace: "remote",
      start: 25,
    });

    const url = capturedUrl();
    expect(url).toContain("/v1/linkedin/jobs/search");
    expect(url).toContain("keywords=python");
    expect(url).toContain("geo_id=90000070");
    expect(url).toContain("company_id=1035");
    expect(url).toContain("date_posted=past-week");
    expect(url).toContain("job_type=full-time");
    expect(url).toContain("workplace=remote");
    expect(url).toContain("start=25");
    expect(url).toContain("country=us");
    expect(result.jobs).toHaveLength(1);
    expect(result.meta.result_count).toBe(1);
  });

  it("defaults start=0 and country=us", async () => {
    mockFetch(JOBS_FIXTURE);
    await makeClient().linkedin.jobsSearch();
    const url = capturedUrl();
    expect(url).toContain("start=0");
    expect(url).toContain("country=us");
  });
});

describe("LinkedInClient resource getters", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("getJob builds jobs/{jobId}", async () => {
    mockFetch({ job_id: "3901234567", job_functions: [], industries: [] });
    await makeClient().linkedin.getJob("3901234567");
    expect(capturedUrl()).toContain("/v1/linkedin/jobs/3901234567?country=us");
  });

  it("companyJobs builds companies/{companyId}/jobs", async () => {
    mockFetch(JOBS_FIXTURE);
    await makeClient().linkedin.companyJobs("1035", { start: 50 });
    const url = capturedUrl();
    expect(url).toContain("/v1/linkedin/companies/1035/jobs");
    expect(url).toContain("start=50");
  });

  it("getCompany builds companies/{universalName}", async () => {
    mockFetch({ universal_name: "microsoft", linkedin_url: "x", specialties: [] });
    await makeClient().linkedin.getCompany("microsoft");
    expect(capturedUrl()).toContain("/v1/linkedin/companies/microsoft?country=us");
  });

  it("getSchool builds schools/{universalName}", async () => {
    mockFetch({ universal_name: "stanford-university", linkedin_url: "x" });
    await makeClient().linkedin.getSchool("stanford-university", { country: "gb" });
    expect(capturedUrl()).toContain("/v1/linkedin/schools/stanford-university?country=gb");
  });

  it("getProfile builds profiles/{publicId}", async () => {
    mockFetch({ public_id: "williamhgates", linkedin_url: "x" });
    await makeClient().linkedin.getProfile("williamhgates");
    expect(capturedUrl()).toContain("/v1/linkedin/profiles/williamhgates");
  });

  it("getPost builds posts/{postSlug}", async () => {
    mockFetch({ post_id: "abc", comments: [] });
    await makeClient().linkedin.getPost("some-post-slug");
    expect(capturedUrl()).toContain("/v1/linkedin/posts/some-post-slug");
  });

  it("getArticle builds articles/{articleSlug}", async () => {
    mockFetch({ post_id: "abc", comments: [] });
    await makeClient().linkedin.getArticle("some-article-slug");
    expect(capturedUrl()).toContain("/v1/linkedin/articles/some-article-slug");
  });

  it("getCourse builds learning/{courseSlug}", async () => {
    mockFetch({ slug: "learning-python", url: "x", instructors: [] });
    await makeClient().linkedin.getCourse("learning-python");
    expect(capturedUrl()).toContain("/v1/linkedin/learning/learning-python");
  });
});

describe("LinkedInClient.geoSuggest & health", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("geoSuggest passes query and defaults type=geo", async () => {
    mockFetch(GEO_FIXTURE);
    const result = await makeClient().linkedin.geoSuggest("London");
    const url = capturedUrl();
    expect(url).toContain("/v1/linkedin/geo/suggest");
    expect(url).toContain("query=London");
    expect(url).toContain("type=geo");
    expect(result.suggestions).toHaveLength(1);
  });

  it("health hits /v1/linkedin/health", async () => {
    mockFetch({ status: "ok", service: "linkedin-scraper" });
    const result = await makeClient().linkedin.health();
    expect(capturedUrl()).toBe("https://api.scrapebadger.com/v1/linkedin/health");
    expect(result.status).toBe("ok");
  });
});
