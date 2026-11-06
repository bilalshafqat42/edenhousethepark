import "server-only";

import { CLIENT_IP_HEADER, leadRateLimitBucket } from "@/lib/lead-contract";
import { getClientIp } from "@/lib/client-ip";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getSiteKey } from "@/lib/site-key";

/*
 * Stores an enquiry in the central admin panel: POST
 * <LEAD_API_URL or CONTENT_API_URL>/api/leads/intake with
 * { site, source, submissionId, body }, authenticated with this site's API
 * key (LEAD_INTAKE_TOKEN, or CONTENT_API_TOKEN when that is not set: the
 * panel accepts the same per-site key on both routes). The same contract
 * Movenpick and Oceara use.
 *
 * The local rate limit is applied HERE, before anything leaves this server,
 * so a flood never reaches the panel or any webhook.
 *
 * `submissionId` comes from the visitor's browser and is the same on every
 * retry of one submission, so the panel stores it once however many times
 * it arrives. That is what makes the single retry below safe.
 *
 * Never throws. Logs status codes and messages only, never the body (it
 * holds the visitor's name, email and phone) or the token.
 */
const REQUEST_TIMEOUT_MS = 5000;
const RETRY_DELAY_MS = 300;

function intakeConfig(env = process.env) {
  return {
    baseUrl: env.LEAD_API_URL || env.CONTENT_API_URL || "",
    token: env.LEAD_INTAKE_TOKEN || env.CONTENT_API_TOKEN || "",
  };
}

async function postOnce(url, token, clientIp, payload) {
  return fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      // The visitor's IP, so the panel's own limit keys on the visitor, not on this server.
      [CLIENT_IP_HEADER]: clientIp,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });
}

export async function persistLead(source, body, requestHeaders, submissionId = null) {
  const clientIp = getClientIp(requestHeaders);

  const limit = checkRateLimit(
    leadRateLimitBucket(source, clientIp),
    source === "slot" ? RATE_LIMITS.slot : RATE_LIMITS.publicForm,
  );
  if (!limit.allowed) {
    return { saved: false, rateLimited: true, retryAfterSeconds: limit.retryAfterSeconds };
  }

  const { baseUrl, token } = intakeConfig();

  if (!baseUrl) {
    return { saved: false, rateLimited: false, noSinkConfigured: true };
  }
  if (!token) {
    console.error("Lead intake URL is set but no token (LEAD_INTAKE_TOKEN or CONTENT_API_TOKEN). Enquiries cannot be stored.");
    return { saved: false, rateLimited: false };
  }

  const url = `${baseUrl.replace(/\/+$/, "")}/api/leads/intake`;
  const payload = { site: getSiteKey(), source, ...(submissionId ? { submissionId } : {}), body };
  // A retry is only safe when the panel can recognise it as the same submission.
  const attempts = submissionId ? 2 : 1;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await postOnce(url, token, clientIp, payload);

      if (response.ok) {
        const result = await response.json().catch(() => ({}));
        return { saved: result?.saved === true, rateLimited: false };
      }

      await response.body?.cancel().catch(() => {});
      console.error("Lead intake responded with status:", response.status);

      // A 4xx (bad key, bad shape, the panel's own limit) will not improve on a retry.
      if (response.status < 500) {
        return { saved: false, rateLimited: false };
      }
    } catch (error) {
      console.error("Lead intake request failed:", error?.message);
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  return { saved: false, rateLimited: false };
}
