/*
 * The site's own absolute base URL, for canonical links, Open Graph URLs,
 * robots.txt's Sitemap line and sitemap.xml.
 *
 * SITE_URL is required in production. Without it everything still works but
 * points at http://localhost:3000, which nothing reports as an error: the
 * sitemap advertises localhost and share previews show no image.
 *
 * A value typed without a scheme ("edenhousethepark.refinedubai.com") is
 * repaired; anything unparseable fails loudly, naming the variable.
 */
function normaliseSiteUrl(value, variableName) {
  let candidate = value.trim().replace(/\/+$/, "");

  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate.replace(/^\/+/, "")}`;
  }

  try {
    const parsed = new URL(candidate);
    return `${parsed.origin}${parsed.pathname.replace(/\/+$/, "")}`;
  } catch {
    throw new Error(
      `${variableName} is not a valid URL: "${value}". ` +
        "Use the full origin including the scheme, e.g. https://edenhousethepark.refinedubai.com",
    );
  }
}

export function getSiteUrl() {
  const explicit = process.env.SITE_URL?.trim();
  return explicit ? normaliseSiteUrl(explicit, "SITE_URL") : "http://localhost:3000";
}
