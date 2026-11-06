import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { PREVIEW_TOKEN_COOKIE, PREVIEW_TOKEN_MAX_AGE_SECONDS } from "@/lib/preview-mode";
import { verifyPreviewToken } from "@/lib/preview-token";

/*
 * Turns the panel's preview link (/api/preview?token=...) into a rendered
 * page showing the draft. The token is checked with the panel first (see
 * src/lib/preview-token.js); only then is Next's draft mode enabled and the
 * token stored in its own httpOnly cookie, which content-api.js sends back
 * to the panel to fetch the draft. Draft mode's own cookie only carries an
 * on/off flag.
 */
export async function GET(request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return new Response("Missing preview token.", { status: 400 });
  }

  const verdict = await verifyPreviewToken(token);

  if (verdict === "unconfigured") {
    return new Response("Preview is not available on this site.", { status: 400 });
  }
  if (verdict === "invalid") {
    return new Response("Invalid or expired preview link.", { status: 403 });
  }
  if (verdict !== "valid") {
    return new Response("Could not verify the preview link. Please try again.", { status: 503 });
  }

  const draft = await draftMode();
  draft.enable();

  const cookieStore = await cookies();
  cookieStore.set(PREVIEW_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PREVIEW_TOKEN_MAX_AGE_SECONDS,
  });

  redirect("/");
}
