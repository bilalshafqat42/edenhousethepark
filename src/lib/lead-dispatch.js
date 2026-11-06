import "server-only";

import { persistLead } from "@/lib/lead-sink";
import { sendToZapier } from "@/lib/destinations/zapier";

/*
 * Sends one enquiry to every configured destination:
 *
 *   admin panel  LEAD_API_URL / CONTENT_API_URL  -> the panel's Leads section
 *   Zapier       ZAPIER_EDEN_LEAD_WEBHOOK, ZAPIER_EDEN_SLOT_WEBHOOK  (optional, off unless set)
 *
 * `delivered` is true only when at least one configured destination
 * confirmed it. With nothing configured it is false and the visitor sees the
 * error state: an enquiry that reached nobody has been lost, and saying
 * "Thank you" would hide that.
 *
 * The rate limit inside persistLead runs first and stops everything, so a
 * throttled request reaches no destination at all.
 */
export async function dispatchLead({ source, body, submissionId = null, requestHeaders, zapierUrl }) {
  const panel = await persistLead(source, body, requestHeaders, submissionId);

  if (panel.rateLimited) {
    return { rateLimited: true, retryAfterSeconds: panel.retryAfterSeconds, delivered: false };
  }

  const zapier = await sendToZapier(zapierUrl, { ...body, ...(submissionId ? { submissionId } : {}) });

  const results = {
    panel: { configured: !panel.noSinkConfigured, ok: panel.saved },
    zapier,
  };
  const configured = Object.entries(results).filter(([, r]) => r.configured);
  const succeeded = configured.filter(([, r]) => r.ok);
  const delivered = succeeded.length > 0;

  if (!delivered) {
    console.error("Lead reached no destination. Configured:", configured.map(([name]) => name).join(",") || "none");
  } else if (succeeded.length < configured.length) {
    console.warn("Lead delivered, but some destinations failed:", configured.filter(([, r]) => !r.ok).map(([name]) => name).join(", "));
  }

  return { rateLimited: false, delivered };
}
