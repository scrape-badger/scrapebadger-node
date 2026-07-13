/**
 * LinkedIn API client.
 *
 * LinkedIn endpoints cover the public, logged-out surface: guest job search +
 * detail + company jobs, public company / school / profile pages, public
 * posts / articles, LinkedIn Learning courses, and a geo/company typeahead.
 * Requests are localised by a `country` residential-proxy param.
 *
 * Company/school/profile/post/course data is SSR-rendered, so those calls take
 * a few seconds to return; the guest job APIs are faster HTML fragments.
 */

import type { BaseClient } from "../internal/client.js";
import type {
  LinkedInJobsSearchParams,
  LinkedInCompanyJobsParams,
  LinkedInCountryParams,
  LinkedInJobsSearchResponse,
  JobDetail,
  Company,
  School,
  Profile,
  Post,
  LearningCourse,
  LinkedInGeoSuggestResponse,
  LinkedInHealthResponse,
} from "./types.js";

/**
 * Client for all LinkedIn API operations.
 *
 * @example
 * ```typescript
 * const client = new ScrapeBadger({ apiKey: "key" });
 *
 * // Search jobs
 * const results = await client.linkedin.jobsSearch({ keywords: "python", location: "New York" });
 * for (const job of results.jobs) {
 *   console.log(`${job.title} — ${job.company}`);
 * }
 *
 * // Single job detail
 * const job = await client.linkedin.getJob("3901234567");
 *
 * // Company / school / profile
 * const company = await client.linkedin.getCompany("microsoft");
 * const school = await client.linkedin.getSchool("stanford-university");
 * const profile = await client.linkedin.getProfile("williamhgates");
 *
 * // Posts, articles, courses
 * const post = await client.linkedin.getPost("some-post-slug");
 * const course = await client.linkedin.getCourse("learning-python");
 *
 * // Geo / company typeahead
 * const geo = await client.linkedin.geoSuggest("London");
 * ```
 */
export class LinkedInClient {
  private readonly client: BaseClient;

  constructor(client: BaseClient) {
    this.client = client;
  }

  /**
   * Search LinkedIn jobs (guest search API).
   *
   * @param options - Optional parameters (keywords, location, geoId, companyId,
   *   datePosted, experience, jobType, workplace, sort, start, country).
   * @returns Jobs search response with matching job cards and pagination meta.
   * @throws AuthenticationError - If the API key is invalid.
   * @throws ValidationError - If the parameters are invalid.
   */
  async jobsSearch(options: LinkedInJobsSearchParams = {}): Promise<LinkedInJobsSearchResponse> {
    return this.client.request<LinkedInJobsSearchResponse>("/v1/linkedin/jobs/search", {
      params: {
        keywords: options.keywords,
        location: options.location,
        geo_id: options.geoId,
        company_id: options.companyId,
        date_posted: options.datePosted,
        experience: options.experience,
        job_type: options.jobType,
        workplace: options.workplace,
        sort: options.sort,
        start: options.start ?? 0,
        country: options.country ?? "us",
      },
    });
  }

  /**
   * Get full detail for one LinkedIn job posting.
   *
   * @param jobId - The numeric LinkedIn job id.
   * @param options - Optional parameters (country).
   * @returns Full job detail.
   * @throws NotFoundError - If the job doesn't exist.
   */
  async getJob(jobId: string, options: LinkedInCountryParams = {}): Promise<JobDetail> {
    return this.client.request<JobDetail>(`/v1/linkedin/jobs/${jobId}`, {
      params: { country: options.country ?? "us" },
    });
  }

  /**
   * Get a company's job postings.
   *
   * @param companyId - The numeric LinkedIn company id.
   * @param options - Optional parameters (start, country).
   * @returns Jobs search response with the company's job cards and pagination meta.
   * @throws NotFoundError - If the company doesn't exist.
   */
  async companyJobs(
    companyId: string,
    options: LinkedInCompanyJobsParams = {}
  ): Promise<LinkedInJobsSearchResponse> {
    return this.client.request<LinkedInJobsSearchResponse>(
      `/v1/linkedin/companies/${companyId}/jobs`,
      {
        params: {
          start: options.start ?? 0,
          country: options.country ?? "us",
        },
      }
    );
  }

  /**
   * Get a public LinkedIn company page.
   *
   * @param universalName - The company's universal name (URL slug).
   * @param options - Optional parameters (country).
   * @returns Company profile.
   * @throws NotFoundError - If the company doesn't exist.
   */
  async getCompany(universalName: string, options: LinkedInCountryParams = {}): Promise<Company> {
    return this.client.request<Company>(`/v1/linkedin/companies/${universalName}`, {
      params: { country: options.country ?? "us" },
    });
  }

  /**
   * Get a public LinkedIn school page.
   *
   * @param universalName - The school's universal name (URL slug).
   * @param options - Optional parameters (country).
   * @returns School profile.
   * @throws NotFoundError - If the school doesn't exist.
   */
  async getSchool(universalName: string, options: LinkedInCountryParams = {}): Promise<School> {
    return this.client.request<School>(`/v1/linkedin/schools/${universalName}`, {
      params: { country: options.country ?? "us" },
    });
  }

  /**
   * Get a public LinkedIn profile.
   *
   * @param publicId - The profile's public id (URL slug).
   * @param options - Optional parameters (country).
   * @returns Public profile.
   * @throws NotFoundError - If the profile doesn't exist.
   */
  async getProfile(publicId: string, options: LinkedInCountryParams = {}): Promise<Profile> {
    return this.client.request<Profile>(`/v1/linkedin/profiles/${publicId}`, {
      params: { country: options.country ?? "us" },
    });
  }

  /**
   * Get a public LinkedIn post (activity share).
   *
   * @param postSlug - The post slug (last URL segment).
   * @param options - Optional parameters (country).
   * @returns Post detail.
   * @throws NotFoundError - If the post doesn't exist.
   */
  async getPost(postSlug: string, options: LinkedInCountryParams = {}): Promise<Post> {
    return this.client.request<Post>(`/v1/linkedin/posts/${postSlug}`, {
      params: { country: options.country ?? "us" },
    });
  }

  /**
   * Get a public LinkedIn article (`/pulse/`).
   *
   * @param articleSlug - The article slug (last URL segment).
   * @param options - Optional parameters (country).
   * @returns Article detail (Post shape).
   * @throws NotFoundError - If the article doesn't exist.
   */
  async getArticle(articleSlug: string, options: LinkedInCountryParams = {}): Promise<Post> {
    return this.client.request<Post>(`/v1/linkedin/articles/${articleSlug}`, {
      params: { country: options.country ?? "us" },
    });
  }

  /**
   * Get a public LinkedIn Learning course.
   *
   * @param courseSlug - The course slug (last URL segment).
   * @param options - Optional parameters (country).
   * @returns Course detail.
   * @throws NotFoundError - If the course doesn't exist.
   */
  async getCourse(courseSlug: string, options: LinkedInCountryParams = {}): Promise<LearningCourse> {
    return this.client.request<LearningCourse>(`/v1/linkedin/learning/${courseSlug}`, {
      params: { country: options.country ?? "us" },
    });
  }

  /**
   * Suggest geo / company ids for a query (typeahead).
   *
   * @param query - Location or company name, e.g. "London".
   * @param type - "geo" | "company" (default: "geo").
   * @returns Geo-suggest response with matching suggestions.
   */
  async geoSuggest(query: string, type = "geo"): Promise<LinkedInGeoSuggestResponse> {
    return this.client.request<LinkedInGeoSuggestResponse>("/v1/linkedin/geo/suggest", {
      params: { query, type },
    });
  }

  /**
   * LinkedIn scraper health check.
   *
   * Free — this endpoint costs no credits.
   *
   * @returns Health payload (status, service, version, products).
   */
  async health(): Promise<LinkedInHealthResponse> {
    return this.client.request<LinkedInHealthResponse>("/v1/linkedin/health");
  }
}
