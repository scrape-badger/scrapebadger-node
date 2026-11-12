/**
 * TypeScript types for LinkedIn API responses.
 *
 * These interfaces mirror the backend `linkedin_scraper` response schema
 * field-for-field. Keys are snake_case exactly as the backend serialises
 * them (`job_id`, `company_url`, `posted_relative`); optional / nullable
 * backend fields are typed as `Type | null` or left `?`-optional.
 *
 * Public data comes from LinkedIn's logged-out guest APIs and SSR pages. The
 * separately labelled full-profile route uses a server-owned authenticated
 * projection when configured. Requests are localised by a `country`
 * residential-proxy param.
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
// Profile (public or separately authenticated)
// =============================================================================

export interface ProfileExperience {
  title?: string | null;
  company?: string | null;
  company_url?: string | null;
  location?: string | null;
  employment_type?: string | null;
  description?: string | null;
  date_range?: string | null;
  duration?: string | null;
  start_year?: number | null;
  end_year?: number | null;
  is_current?: boolean | null;
}

export interface ProfileEducation {
  school?: string | null;
  school_url?: string | null;
  degree?: string | null;
  field_of_study?: string | null;
  description?: string | null;
  date_range?: string | null;
  start_year?: number | null;
  end_year?: number | null;
}

export interface ProfileLanguage {
  name: string;
  proficiency?: string | null;
}

export interface ProfileAward {
  title: string;
  issuer?: string | null;
  issued_on?: string | null;
  url?: string | null;
  description?: string | null;
}

export interface ProfileVolunteering {
  title: string;
  organization?: string | null;
  organization_url?: string | null;
  date_range?: string | null;
  start_year?: number | null;
  end_year?: number | null;
  description?: string | null;
}

export interface ProfileRecommendation {
  author_name?: string | null;
  author_url?: string | null;
  text: string;
}

export interface ProfileInstructorCourse {
  title: string;
  url?: string | null;
  instructor?: string | null;
  duration?: string | null;
  viewers?: string | null;
}

export interface ProfileActivity {
  type: string;
  url?: string | null;
  title?: string | null;
  text?: string | null;
  published_at?: string | null;
  like_count?: number | null;
  comment_count?: number | null;
  author_name?: string | null;
  author_url?: string | null;
}

export interface ProfileEntry {
  name?: string | null;
  title?: string | null;
  subtitle?: string | null;
  role?: string | null;
  organization?: string | null;
  issuer?: string | null;
  proficiency?: string | null;
  number?: string | null;
  score?: string | null;
  cause?: string | null;
  url?: string | null;
  date_range?: string | null;
  start_year?: number | null;
  end_year?: number | null;
  issued_on?: string | null;
  published_on?: string | null;
  description?: string | null;
}

export interface ProfileSimilar {
  name?: string | null;
  headline?: string | null;
  url: string;
  follower_count?: number | null;
  location?: string | null;
}

export interface ProfileSectionCount {
  shown: number;
  total?: number | null;
}

/** A LinkedIn profile from the public page or an authenticated projection. */
export interface Profile {
  public_id: string;
  linkedin_url: string;
  access_scope: "public" | "authenticated";
  name?: string | null;
  headline?: string | null;
  location?: string | null;
  country?: string | null;
  about?: string | null;
  image?: string | null;
  cover_image?: string | null;
  follower_count?: number | null;
  connection_count?: string | null;
  badges: string[];
  websites: string[];
  job_titles: string[];
  current_company?: string | null;
  current_company_url?: string | null;
  experience: ProfileExperience[];
  education: ProfileEducation[];
  languages: string[];
  language_details: ProfileLanguage[];
  awards: string[];
  award_details: ProfileAward[];
  volunteering: ProfileVolunteering[];
  recommendations: ProfileRecommendation[];
  instructor_courses: ProfileInstructorCourse[];
  recent_posts: ProfileActivity[];
  recent_articles: ProfileActivity[];
  similar_profiles: ProfileSimilar[];
  skills: string[];
  certifications: ProfileEntry[];
  honors: ProfileEntry[];
  publications: ProfileEntry[];
  projects: ProfileEntry[];
  courses: ProfileEntry[];
  organizations: ProfileEntry[];
  patents: ProfileEntry[];
  test_scores: ProfileEntry[];
  counts: Record<string, ProfileSectionCount>;
  partial_sections: string[];
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
