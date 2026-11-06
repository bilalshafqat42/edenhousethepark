import { headers } from "next/headers";

import { readSection } from "@/lib/page-content";
import { robotsRules } from "@/lib/robots-rules";
import { getSiteUrl } from "@/lib/site-url";
import { isStagingHost, isStagingSite } from "@/lib/staging";

/*
 * Disallow everything unless the panel's "Allow search engines" toggle is on
 * and this is not the staging site, judged by SITE_URL and by the address
 * the request came to (a stg- host is staging either way).
 */
export default async function robots() {
  const content = await readSection("robots");
  const host = (await headers()).get("host") ?? "";

  return robotsRules({
    allowIndexing: String(content["allow-indexing"]) === "true",
    staging: isStagingSite() || isStagingHost(host),
    siteUrl: getSiteUrl(),
  });
}
