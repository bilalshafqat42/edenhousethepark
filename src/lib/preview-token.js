/*
 * Checks a preview link's token with the admin panel before /api/preview
 * turns on draft mode.
 *
 * The signing key lives on the panel, so this site cannot check a token
 * itself, but it can ask: GET /api/v1/content?status=draft&token=... answers
 * 200 for a good token and 403 for an invalid or expired one. Draft mode
 * switches the homepage to uncached, per-request rendering, so entering it
 * on an unchecked token would let anyone (or any crawler) opt out of the
 * cache at will.
 *
 * Returns "valid", "invalid", "unconfigured" or "unavailable". Never throws.
 * Fails closed: anything but a clear 200 refuses the preview. The token is
 * never logged (it travels in the URL).
 *
 * `fetchImpl` and `env` are parameters only so the tests can run it without
 * a network.
 */
const VERIFY_TIMEOUT_MS = 5000;
const TOKEN_MAX_LENGTH = 4096;

export async function verifyPreviewToken(token, { fetchImpl = fetch, env = process.env } = {}) {
  if (typeof token !== "string" || token === "" || token.length > TOKEN_MAX_LENGTH) {
    return "invalid";
  }

  const baseUrl = env.CONTENT_API_URL;
  const apiToken = env.CONTENT_API_TOKEN;

  if (!baseUrl || !apiToken) {
    return "unconfigured";
  }

  try {
    const url = new URL(`${baseUrl.replace(/\/+$/, "")}/api/v1/content`);
    url.searchParams.set("status", "draft");
    url.searchParams.set("token", token);

    const response = await fetchImpl(url, {
      // Bearer only: the /api/v1 routes read the Authorization header.
      headers: { authorization: `Bearer ${apiToken}` },
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
      cache: "no-store",
    });

    // The body is the full draft content, which is not needed here.
    await response.body?.cancel().catch(() => {});

    if (response.ok) return "valid";
    if (response.status === 403) return "invalid";

    // 401 here means this site's own CONTENT_API_TOKEN is wrong.
    console.error("Preview token check responded with status:", response.status);
    return "unavailable";
  } catch (error) {
    console.error("Preview token check failed:", error?.message);
    return "unavailable";
  }
}
