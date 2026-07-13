/**
 * TypeScript types for LinkedIn API responses.
 *
 * These interfaces mirror the backend `linkedin_scraper` response schema
 * field-for-field. Keys are snake_case exactly as the backend serialises
 * them (`job_id`, `company_url`, `posted_relative`); optional / nullable
 * backend fields are typed as `Type | null` or left `?`-optional.
 *
 * All data comes from LinkedIn's public, logged-out surface: the
 * `/jobs-guest/...` guest APIs for jobs, and the SSR public pages (JSON-LD +
 * og:* meta) for profiles, companies, schools, posts, and courses. Requests
 * are localised by a `country` residential-proxy param.
 */

// =============================================================================
// Jobs
// =============================================================================

/** One job posting as it appears in a guest search result list. */
export interface JobCard {
  job_id: string;
  title?: string | null;
  job_url?: string | null;
  company?: string | null;
  company_url?: string | null;
  company_logo?: string | null;
  location?: string | null;
  /** ISO date (from the `<time datetime=...>` attr). */
  posted_at?: string | null;
  /** e.g. "2 days ago". */
  posted_relative?: string | null;
  /** Posted < 24h (LinkedIn's `--new` listdate variant). */
  is_new: boolean;
  /** e.g. "Actively Hiring", "Medical insurance". */
  benefits: string[];
}

/** Result-set metadata for a paginated jobs listing. */
export interface JobsSearchMeta {
  result_count: number;
  start: number;
  has_more: boolean;
}

/** Full detail for one job posting (guest `jobPosting/{id}` fragment). */
export interface JobDetail {
  job_id: string;
  title?: string | null;
  job_url?: string | null;
  company?: string | null;
  company_url?: string | null;
  company_logo?: string | null;
  location?: string | null;
  posted_relative?: string | null;
  /** e.g. "Over 200 applicants". */
  applicants?: string | null;
  applicants_count?: number | null;
  description_html?: string | null;
  description_text?: string | null;
  /** Raw display, e.g. "$150,000.00/yr - $220,000.00/yr". */
  salary?: string | null;
  seniority_level?: string | null;
  employment_type?: string | null;
  job_functions: string[];
  industries: string[];
  /** External apply link when present. */
  apply_url?: string | null;
}

// =============================================================================
// Profile (public)
// =============================================================================

/** A current/past role from the public JSON-LD `worksFor`. */
export interface ProfileExperience {
  title?: string | null;
  company?: string | null;
  company_url?: string | null;
  start_year?: number | null;
  end_year?: number | null;
}

/** A school from the public JSON-LD `alumniOf`. */
export interface ProfileEducation {
  school?: string | null;
  school_url?: string | null;
  start_year?: number | null;
  end_year?: number | null;
}

/** A public LinkedIn profile (JSON-LD `Person` + og/top-card subset). */
export interface Profile {
  public_id: string;
  linkedin_url: string;
  name?: string | null;
  headline?: string | null;
  location?: string | null;
  country?: string | null;
  about?: string | null;
  image?: string | null;
  follower_count?: number | null;
  job_titles: string[];
  current_company?: string | null;
  current_company_url?: string | null;
  experience: ProfileExperience[];
  education: ProfileEducation[];
  languages: string[];
  awards: string[];
}

// =============================================================================
// Company / School
// =============================================================================

export interface Address {
  street?: string | null;
  city?: string | null;
  region?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

/** A public company page (JSON-LD `Organization` + about-us module). */
export interface Company {
  universal_name: string;
  linkedin_url: string;
  name?: string | null;
  description?: string | null;
  website?: string | null;
  industry?: string | null;
  /** e.g. "10,001+ employees". */
  company_size?: string | null;
  /** e.g. "Public Company". */
  company_type?: string | null;
  headquarters?: string | null;
  founded?: number | null;
  specialties: string[];
  employee_count?: number | null;
  follower_count?: number | null;
  logo?: string | null;
  address?: Address | null;
}

/** A public school page (JSON-LD `Organization`). */
export interface School {
  universal_name: string;
  linkedin_url: string;
  name?: string | null;
  description?: string | null;
  website?: string | null;
  follower_count?: number | null;
  student_alumni_count?: number | null;
  logo?: string | null;
  address?: Address | null;
}

// =============================================================================
// Posts / Articles
// =============================================================================

export interface PostComment {
  author?: string | null;
  author_url?: string | null;
  text?: string | null;
  published_at?: string | null;
  like_count?: number | null;
}

/** A public post: an article (`/pulse/`) or an activity share (`/posts/`). */
export interface Post {
  post_id: string;
  url?: string | null;
  /** "article" | "social". */
  type?: string | null;
  author_name?: string | null;
  author_url?: string | null;
  title?: string | null;
  text?: string | null;
  published_at?: string | null;
  like_count?: number | null;
  comment_count?: number | null;
  comments: PostComment[];
}

// =============================================================================
// Learning
// =============================================================================

export interface CourseInstructor {
  name?: string | null;
  job_title?: string | null;
  url?: string | null;
}

/** A public LinkedIn Learning course (JSON-LD `Course`). */
export interface LearningCourse {
  slug: string;
  url: string;
  name?: string | null;
  description?: string | null;
  provider?: string | null;
  /** ISO-8601 duration, e.g. "PT3H41M22S". */
  workload?: string | null;
  rating_value?: string | null;
  rating_count?: number | null;
  instructors: CourseInstructor[];
}

// =============================================================================
// Reference / typeahead
// =============================================================================

export interface GeoSuggestion {
  id: string;
  display_name?: string | null;
  /** GEO | COMPANY. */
  type?: string | null;
}

// =============================================================================
// Response Envelopes
// =============================================================================

export interface LinkedInJobsSearchResponse {
  jobs: JobCard[];
  meta: JobsSearchMeta;
}

export interface LinkedInGeoSuggestResponse {
  query: string;
  type: string;
  suggestions: GeoSuggestion[];
}

/** LinkedIn scraper health payload. */
export interface LinkedInHealthResponse {
  status: string;
  service: string;
  version?: string;
  products?: string[];
}

// =============================================================================
// Request Parameter Types
// =============================================================================

/** Options for the /jobs/search endpoint (all optional). */
export interface LinkedInJobsSearchParams {
  /** Job title / keywords. */
  keywords?: string;
  /** Location text, e.g. "New York". */
  location?: string;
  /** LinkedIn geo id (overrides `location`). */
  geoId?: string;
  /** Restrict to a company (numeric id). */
  companyId?: string;
  /** Date-posted filter. */
  datePosted?: string;
  /** Experience-level filter. */
  experience?: string;
  /** Job-type filter. */
  jobType?: string;
  /** Workplace filter (on-site | remote | hybrid). */
  workplace?: string;
  /** relevant | recent. */
  sort?: string;
  /** Pagination offset (0, 25, 50, ...). Default: 0. */
  start?: number;
  /** Residential proxy country. Default: "us". */
  country?: string;
}

/** Options for the /companies/{companyId}/jobs endpoint. */
export interface LinkedInCompanyJobsParams {
  /** Pagination offset (0, 25, 50, ...). Default: 0. */
  start?: number;
  /** Residential proxy country. Default: "us". */
  country?: string;
}

/** Options for the single-resource endpoints (job, company, school, profile,
 * post, article, course). */
export interface LinkedInCountryParams {
  /** Residential proxy country. Default: "us". */
  country?: string;
}
