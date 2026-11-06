/*
 * Which site this deployment is, from the central admin panel's point of
 * view: "edenhousethepark" on the live service and
 * "edenhousethepark-staging" on the staging service. Sent with every
 * content, manifest and lead request, so the multi-site panel knows whose
 * content to return and where an enquiry came from.
 *
 * The key identifies, it does not authorise: the panel checks each site's
 * own API key (CONTENT_API_TOKEN) against it. Set SITE_KEY explicitly on
 * Render; the default only keeps local runs working.
 */
export function getSiteKey() {
  return process.env.SITE_KEY?.trim() || "edenhousethepark";
}
