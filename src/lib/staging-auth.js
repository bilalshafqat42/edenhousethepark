import { timingSafeEqual } from "node:crypto";

/*
 * Password protection for the staging site, as plain HTTP Basic auth.
 *
 * Only active when STAGING_PASSWORD is set, which happens on the staging
 * deployment alone: the live site never sets it, so for it this is a no-op.
 * The browser shows its own sign-in prompt and then sends the credentials
 * with every same-site request, so the forms and chat keep working once
 * the visitor is in.
 *
 * Pure apart from reading the header, so it can be unit tested.
 */
function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

export function isAuthorised(authorizationHeader, { username, password }) {
  if (!password) return true;
  if (typeof authorizationHeader !== "string" || !authorizationHeader.startsWith("Basic ")) {
    return false;
  }
  let decoded;
  try {
    decoded = Buffer.from(authorizationHeader.slice(6).trim(), "base64").toString("utf8");
  } catch {
    return false;
  }
  const split = decoded.indexOf(":");
  if (split < 0) return false;
  // Both compared, always, so a wrong username takes as long as a wrong password.
  const userOk = safeEqual(decoded.slice(0, split), username);
  const passOk = safeEqual(decoded.slice(split + 1), password);
  return userOk && passOk;
}
