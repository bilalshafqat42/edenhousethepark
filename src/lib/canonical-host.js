/*
 * Where a page request on the Render address (*.onrender.com) should go
 * instead: the same path on SITE_URL. Images are resized by Cloudflare at
 * /cdn-cgi/image/..., which only works on the refinedubai.com addresses
 * (Render's own Cloudflare answers /cdn-cgi/ with a 404), so on the Render
 * address every image was broken. Returns the URL to redirect to, or null.
 *
 * Only GET/HEAD page loads move; API calls and anything off the Render
 * address (localhost, Render's internal health checks) are left alone.
 * Pure, no dependencies.
 */
export function canonicalRedirect({ method, host, pathname, search = "" }, siteUrl) {
  if (method !== "GET" && method !== "HEAD") return null;
  if (!siteUrl || !host) return null;
  const hostname = host.split(":")[0].toLowerCase();
  if (!hostname.endsWith(".onrender.com")) return null;
  if (pathname.startsWith("/api/")) return null;
  let target;
  try {
    target = new URL(siteUrl);
  } catch {
    return null;
  }
  if (target.hostname.toLowerCase() === hostname) return null;
  return `${target.origin}${pathname}${search}`;
}
