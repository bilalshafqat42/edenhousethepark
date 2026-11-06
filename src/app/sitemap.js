import { getSiteUrl } from "@/lib/site-url";

/*
 * The site's three pages. lastModified is left out: the panel does not
 * publish edit times, and a date that is always "now" teaches search
 * engines to ignore it.
 */
export default function sitemap() {
  const siteUrl = getSiteUrl();
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
