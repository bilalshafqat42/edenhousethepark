// Standard browser protections, sent with every response.
const securityHeaders = [
  // Only this site may frame the page (clickjacking).
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Browsers must not guess file types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Other sites see only the domain we came from, not full URLs.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The page never needs these device features.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // HTTPS only, for two years. Ignored on plain-HTTP localhost.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not advertise the framework.
  poweredByHeader: false,
  headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
