import { NextResponse } from "next/server";

import { isAuthorised } from "@/lib/staging-auth";

/*
 * Staging only: asks for a username and password (HTTP Basic) before
 * showing any page, so the site under review is not public. On when
 * STAGING_PASSWORD is set (and optionally STAGING_USERNAME, default
 * "refine") on the staging service; the live service never sets it, so
 * every request passes straight through there.
 */
export function proxy(request) {
  const password = process.env.STAGING_PASSWORD;
  if (!password) {
    return NextResponse.next();
  }

  const ok = isAuthorised(request.headers.get("authorization"), {
    username: process.env.STAGING_USERNAME || "refine",
    password,
  });

  if (ok) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Eden House The Park staging", charset="UTF-8"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

/*
 * Left open, because they are not pages or are called by something that
 * cannot answer a password prompt:
 * - _next/static, _next/image and the public folders (images, logo, icons,
 *   webfonts, fonts, favicon.ico): Cloudflare's image resizing fetches
 *   /images without credentials;
 * - /api/revalidate: the admin panel's instant refresh (it has its own secret);
 * - robots.txt: so crawlers still read "Disallow: /".
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images/|logo/|icons/|webfonts/|fonts/|favicon\\.ico|api/revalidate|robots\\.txt).*)",
  ],
};
