/*
 * The site's own absolute base URL, for canonical links, Open Graph URLs,
 * robots.txt's Sitemap line and sitemap.xml.
 *
 * SITE_URL is required in production. Without it (and off Render) everything
 * still works but points at http://localhost:3000, which nothing reports as
 * an error: the sitemap advertises localhost and share previews break.
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

/*
 * SITE_URL wins. Without it, on Render, the service's own public address
 * (RENDER_EXTERNAL_URL, set by Render on every web service) is used, so a
 * Render service never advertises localhost. Set SITE_URL anyway once a
 * custom domain is attached: RENDER_EXTERNAL_URL is the onrender.com address.
 */
export function getSiteUrl(env = process.env) {
  const explicit = env.SITE_URL?.trim();
  if (explicit) return normaliseSiteUrl(explicit, "SITE_URL");
  const render = env.RENDER_EXTERNAL_URL?.trim();
  if (render) return normaliseSiteUrl(render, "RENDER_EXTERNAL_URL");
  return "http://localhost:3000";
}
