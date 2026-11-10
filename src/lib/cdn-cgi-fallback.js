import { safeImageSrc } from "@/lib/safe-url";

/*
 * With CLOUDFLARE_IMAGE_RESIZING=true every image is requested as
 * /cdn-cgi/image/<options>/<source>. On the refinedubai.com addresses
 * Cloudflare answers those itself and they never reach this site. On the
 * Render address (stg-edenhousethepark.onrender.com) there is no Cloudflare,
 * so they used to 404 and every image vanished (10 November 2026).
 *
 * So when such a request does reach the site, it is answered with the
 * original, unresized image instead:
 *   - a local file ("images/renders/x.jpg") is served from /images/...
 *   - a panel image on an allowed host (IMAGE_HOSTS) is redirected to;
 *   - anything else is refused.
 * Returns { rewrite: "/path" }, { redirect: "https://..." } or null.
 */
export function originalImageFor(pathname, env = process.env) {
  const match = /^\/cdn-cgi\/image\/[^/]+\/(.+)$/.exec(String(pathname ?? ""));
  if (!match) return null;

  // Paths can arrive with "https://" collapsed to "https:/".
  const source = match[1].replace(/^(https?):\/(?!\/)/i, "$1://");

  if (/^https?:\/\//i.test(source)) {
    const allowed = safeImageSrc(source, "", env);
    return allowed ? { redirect: allowed } : null;
  }

  const local = `/${source}`;
  if (local.includes("..") || local.startsWith("//")) return null;
  return { rewrite: local };
}
