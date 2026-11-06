const isDev = process.env.NODE_ENV !== "production";

/*
 * Hosts allowed to serve images: the admin panel's media host. Read at BUILD
 * time (a change needs a rebuild). Defaults to media.refinedubai.com so a
 * missing variable cannot break the page the moment an editor uploads an
 * image; src/lib/safe-url.js uses the same default.
 */
const imageHosts = (process.env.IMAGE_HOSTS ?? "media.refinedubai.com")
  .split(",")
  .map((host) => host.trim().toLowerCase())
  .filter(Boolean);

/*
 * Cloudflare Image Resizing instead of Next's own optimiser (the container
 * then never encodes an image). Only where Cloudflare serves the site with
 * Image Resizing on: true on refinedubai.com addresses, false elsewhere and
 * locally. AVIF and SVG are passed through (src/lib/cloudflare-image.js).
 */
const cloudflareImageResizing = process.env.CLOUDFLARE_IMAGE_RESIZING === "true";

// Staging is any stg- address (the panel's own rule); see src/lib/staging.js.
const STAGING_HOST = /^stg-/i;
function siteUrlIsStaging() {
  try {
    const raw = process.env.SITE_URL?.trim() ?? "";
    return raw !== "" && STAGING_HOST.test(new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).hostname);
  } catch {
    return false;
  }
}

/*
 * Content-Security-Policy, matched to what the page really loads:
 * - its own scripts, styles, fonts and images ('self'); 'unsafe-inline' for
 *   scripts and styles because Next's hydration and mapbox-gl need it
 *   without a per-request nonce (a nonce would end static rendering);
 * - Mapbox: styles, tiles, sprites and glyphs from api.mapbox.com,
 *   telemetry to events.mapbox.com, tile workers from blob: URLs;
 * - the panel's media host for images.
 * No analytics or tag manager: the site loads none.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://api.mapbox.com${imageHosts.map((host) => ` https://${host}`).join("")}`,
  "font-src 'self' data:",
  "connect-src 'self' https://api.mapbox.com https://events.mapbox.com",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  // Production only: on plain-http localhost Safari would upgrade every asset to https.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Older browsers; frame-ancestors above covers modern ones.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()" },
  // HTTPS only, for two years. Ignored on plain-HTTP localhost.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const NOINDEX = { key: "X-Robots-Tag", value: "noindex, nofollow" };

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not advertise the framework.
  poweredByHeader: false,

  headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Staging is never indexed: by the address a request came to...
      { source: "/:path*", has: [{ type: "host", value: "stg-.*" }], headers: [NOINDEX] },
      // ...and by the deployment's own SITE_URL (covers its onrender.com address too).
      ...(siteUrlIsStaging() ? [{ source: "/:path*", headers: [NOINDEX] }] : []),
      // Lead and admin endpoints are never cached by a CDN.
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },

  images: {
    ...(cloudflareImageResizing ? { loader: "custom", loaderFile: "./src/lib/cloudflare-image-loader.js" } : {}),
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https", hostname })),
    qualities: [75],
    formats: ["image/webp"],
  },
};

export default nextConfig;
