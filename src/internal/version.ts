/**
 * Single source-of-truth for the SDK version string.
 *
 * This constant is kept in sync with package.json by the release workflow.
 * It is used to set the User-Agent header on all outgoing requests.
 *
 * @internal
 */
export const SDK_VERSION = "0.16.0";
