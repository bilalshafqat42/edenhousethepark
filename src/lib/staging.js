/*
 * Staging is recognised the way the admin panel recognises it: by a
 * hostname starting "stg-" (stg-edenhousethepark.refinedubai.com). Staging
 * must never be indexed, whatever the panel's robots toggle says, so the
 * robots.txt route, the page's meta robots tag and the X-Robots-Tag header
 * (next.config.mjs) all ask here.
 *
 * Pure, no dependencies, so the tests and next.config.mjs can use it.
 */
export function isStagingHost(host) {
  if (typeof host !== "string" || host === "") return false;
  const name = host.trim().toLowerCase().replace(/^[a-z]+:\/\//, "").split(/[/:]/)[0];
  return name.startsWith("stg-");
}

// SITE_URL is the deployment's own declaration of where it lives.
export function isStagingSite(siteUrl = process.env.SITE_URL) {
  return isStagingHost(siteUrl ?? "");
}
