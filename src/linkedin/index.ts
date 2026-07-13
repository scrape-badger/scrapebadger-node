/**
 * LinkedIn API module.
 *
 * @module linkedin
 */

export { LinkedInClient } from "./client.js";

// Export all types — LinkedIn-prefixed to avoid collisions in the top-level
// barrel (other scrapers also export generic names like Company/School/Address).
export type {
  // Jobs
  JobCard as LinkedInJobCard,
  JobsSearchMeta as LinkedInJobsSearchMeta,
  JobDetail as LinkedInJobDetail,
  // Profile
  ProfileExperience as LinkedInProfileExperience,
  ProfileEducation as LinkedInProfileEducation,
  Profile as LinkedInProfile,
  // Company / school
  Address as LinkedInAddress,
  Company as LinkedInCompany,
  School as LinkedInSchool,
  // Posts / articles
  PostComment as LinkedInPostComment,
  Post as LinkedInPost,
  // Learning
  CourseInstructor as LinkedInCourseInstructor,
  LearningCourse as LinkedInLearningCourse,
  // Reference
  GeoSuggestion as LinkedInGeoSuggestion,
  // Response envelopes
  LinkedInJobsSearchResponse,
  LinkedInGeoSuggestResponse,
  LinkedInHealthResponse,
  // Request params
  LinkedInJobsSearchParams,
  LinkedInCompanyJobsParams,
  LinkedInCountryParams,
} from "./types.js";
