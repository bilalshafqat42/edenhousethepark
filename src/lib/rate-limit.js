/*
 * In-memory fixed-window rate limiting for the public lead endpoints, keyed
 * by the visitor's real IP (src/lib/client-ip.js).
 *
 * Correct because Render runs this site as ONE long-lived Node process, so
 * the Map is shared by every request. With more than one instance each
 * keeps its own counters and the effective limit multiplies: move this to
 * a shared store before scaling out. Counters reset on deploy, which is
 * fine: the goal is stopping floods, not exact quotas.
 *
 * No "server-only" import so the unit tests can load it under plain Node;
 * nothing here is secret.
 */
const buckets = new Map();
const MAX_TRACKED_BUCKETS = 10_000;

export const RATE_LIMITS = {
  // Contact form and chat: well above a real person correcting a typo and
  // retrying, far below a script.
  publicForm: { limit: 8, windowMs: 10 * 60 * 1000 },
  // Chat callback slots count separately, so an enquiry never uses up the
  // visitor's chance to book a call.
  slot: { limit: 10, windowMs: 10 * 60 * 1000 },
};

function prune(now) {
  for (const [key, entry] of buckets) {
    if (entry.expiresAt <= now) buckets.delete(key);
  }
  // Still full of live entries: drop the oldest half. Evicting can only
  // let a request through, the right way for a contact form to fail.
  if (buckets.size > MAX_TRACKED_BUCKETS) {
    let excess = buckets.size - Math.floor(MAX_TRACKED_BUCKETS / 2);
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (--excess <= 0) break;
    }
  }
}

/* Counts this request and returns { allowed, remaining, retryAfterSeconds }. */
export function checkRateLimit(bucket, { limit, windowMs }, now = Date.now()) {
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const expiresAt = windowStart + windowMs;
  const existing = buckets.get(bucket);
  const count = existing && existing.windowStart === windowStart ? existing.count + 1 : 1;

  buckets.set(bucket, { windowStart, expiresAt, count });
  if (buckets.size > MAX_TRACKED_BUCKETS) prune(now);

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds: Math.ceil((expiresAt - now) / 1000),
  };
}

// Tests only: start from a known state.
export function __resetRateLimits() {
  buckets.clear();
}
