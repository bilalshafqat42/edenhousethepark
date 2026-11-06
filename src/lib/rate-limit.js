import "server-only";

/*
 * Fixed-window rate limit per visitor IP, held in memory. Render runs this
 * site as one long-lived Node process, so the Map is shared by every
 * request. With more than one instance, move this to a shared store.
 */
const buckets = new Map();
const MAX_BUCKETS = 10_000;

export const LIMITS = {
  lead: { max: 5, windowMs: 10 * 60 * 1000 },
  slot: { max: 10, windowMs: 10 * 60 * 1000 },
};

/*
 * The visitor's IP. Cloudflare sets CF-Connecting-IP; without it, the
 * right-most X-Forwarded-For entry is the one Render's proxy added, which
 * a sender cannot forge (the left-most entries can be anything).
 */
export function clientIp(headers) {
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const forwarded = headers.get("x-forwarded-for");
  return forwarded?.split(",").map((part) => part.trim()).filter(Boolean).at(-1) || "unknown";
}

/* Returns { limited, retryAfterSeconds } and counts this request. */
export function checkRateLimit(kind, ip, now = Date.now()) {
  const { max, windowMs } = LIMITS[kind];
  const key = `${kind}:${ip}`;
  let bucket = buckets.get(key);

  if (!bucket || now - bucket.start >= windowMs) {
    bucket = { start: now, count: 0 };
    // Bound memory: drop the oldest entry once the map is full.
    if (buckets.size >= MAX_BUCKETS) buckets.delete(buckets.keys().next().value);
  }

  bucket.count += 1;
  buckets.delete(key);
  buckets.set(key, bucket);

  if (bucket.count > max) {
    return { limited: true, retryAfterSeconds: Math.ceil((bucket.start + windowMs - now) / 1000) };
  }
  return { limited: false };
}
