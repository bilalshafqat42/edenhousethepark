import { timingSafeEqual } from "node:crypto";

/*
 * The real visitor's IP, for rate limiting lead forms.
 *
 * Every visitor reaches this app through Cloudflare, then Render. Both add
 * to X-Forwarded-For rather than replacing it, so its LEFT-most entry is
 * whatever the sender put there: a script could send a new fake address on
 * every request and never be rate limited. Cloudflare instead puts the
 * address it actually saw in CF-Connecting-IP.
 *
 * CF-Connecting-IP is only trustworthy on a request that really came
 * through Cloudflare. A request sent straight to the *.onrender.com address
 * skips Cloudflare and can set that header to anything. So:
 *
 * - With CF_ORIGIN_SECRET set (and a Cloudflare Transform Rule adding the
 *   same value as an `x-origin-secret` request header), CF-Connecting-IP is
 *   trusted only when the secret matches. Anything else, including a direct
 *   hit on onrender.com, is keyed on the RIGHT-most X-Forwarded-For entry,
 *   which Render's own proxy appends and a sender cannot forge.
 * - Without the secret configured, CF-Connecting-IP is used when present.
 *   That closes the spoofing hole for all traffic through Cloudflare; the
 *   secret closes the remaining direct-to-Render gap.
 *
 * Takes a Headers object, from a Route Handler or `await headers()`.
 */
function secretMatches(provided, expected) {
  if (typeof provided !== "string" || provided.length === 0) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function rightMostForwarded(requestHeaders) {
  const forwarded = requestHeaders.get("x-forwarded-for");
  if (!forwarded) return null;
  const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
  return parts.at(-1) ?? null;
}

export function getClientIp(requestHeaders, secret = process.env.CF_ORIGIN_SECRET) {
  const cfIp = requestHeaders.get("cf-connecting-ip")?.trim() || null;

  if (secret) {
    if (cfIp && secretMatches(requestHeaders.get("x-origin-secret"), secret)) {
      return cfIp;
    }
  } else if (cfIp) {
    return cfIp;
  }

  return rightMostForwarded(requestHeaders) ?? requestHeaders.get("x-real-ip") ?? "unknown";
}
