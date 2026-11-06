/*
 * Links and image addresses from the admin panel, checked before they reach
 * an href or an <Image>. The panel accepts anything `new URL()` parses,
 * which includes javascript: and data: URLs, so this is where they stop.
 *
 * Pure, no dependencies.
 */
const SAFE_HREF = /^(?:https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;

// A safe href, or `fallback` when the value is blank or not allowed.
export function safeHref(value, fallback = "") {
  const href = String(value ?? "").trim();
  return href && SAFE_HREF.test(href) && !/[\s<>"]/.test(href) ? href : fallback;
}

export function isExternalHref(href) {
  return /^https?:\/\//i.test(String(href ?? ""));
}

/*
 * The hosts an image may come from: this site ("/images/...") and the
 * IMAGE_HOSTS list (default media.refinedubai.com, the same default as
 * next.config.mjs). Next's image component refuses any other host with an
 * error that takes the page down, so an image from elsewhere falls back to
 * the default instead.
 */
export function imageHosts(env = process.env) {
  return String(env.IMAGE_HOSTS ?? "media.refinedubai.com")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function hostAllowed(hostname, hosts) {
  const name = hostname.toLowerCase();
  return hosts.some((host) =>
    host.startsWith("*.") ? name.endsWith(host.slice(1)) && name.length > host.length - 1 : name === host,
  );
}

export function safeImageSrc(value, fallback, env = process.env) {
  const src = String(value ?? "").trim();
  if (!src) return fallback;
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && hostAllowed(url.hostname, imageHosts(env)) ? src : fallback;
  } catch {
    return fallback;
  }
}

// A whole number from a panel text field ("459"), or null.
export function wholeNumber(value) {
  const text = String(value ?? "").trim();
  return /^\d{1,9}$/.test(text) ? Number(text) : null;
}

// A coordinate pair [longitude, latitude] from two text fields, or null.
export function lngLat(longitude, latitude) {
  const lng = Number.parseFloat(String(longitude ?? "").trim());
  const lat = Number.parseFloat(String(latitude ?? "").trim());
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) return null;
  return [lng, lat];
}

export function slugify(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
