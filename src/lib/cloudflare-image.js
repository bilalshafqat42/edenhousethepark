/*
 * The one place a Cloudflare image-resizing URL is built, used by the
 * next/image loader, the link-preview image and the menu photo, so the
 * three can never disagree about which files Cloudflare may resize.
 *
 * Cloudflare can resize JPEG, PNG, WebP and GIF. It cannot read AVIF (it
 * answers 415), and SVG, data: and blob: sources are not images it should
 * touch; all of those are served as they are. Image Resizing, including
 * "Resize images from any origin", is enabled on refinedubai.com.
 * Docs: https://developers.cloudflare.com/images/transform-images
 *
 * Returns a site-relative /cdn-cgi/image/... path: the browser resolves it
 * against whichever domain served the page. Pure, no dependencies.
 */
const RESIZABLE = /\.(jpe?g|png|webp|gif)$/i;

export function isCloudflareResizable(src) {
  if (typeof src !== "string" || src === "") return false;
  if (src.startsWith("data:") || src.startsWith("blob:")) return false;
  return RESIZABLE.test(src.split("?")[0]);
}

export function cloudflareImageUrl(src, options) {
  const params = Object.entries(options)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join(",");
  const source = src.startsWith("/") && !src.startsWith("//") ? src.slice(1) : src;
  return `/cdn-cgi/image/${params}/${source}`;
}
