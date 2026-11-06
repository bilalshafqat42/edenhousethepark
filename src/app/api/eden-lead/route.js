import { newLeadReference } from "@/lib/lead-reference";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { neutraliseFormulas, readJsonBody, validateLead } from "@/lib/validation/leadRequest";

/*
 * Chat widget lead. Checks, rate-limits and cleans the submission, then
 * returns a reference. DELIVERY IS A PLACEHOLDER: the cleaned `lead` below
 * is where the admin panel, Zoho and Zapier are connected later.
 */
export async function POST(request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return Response.json({ success: false, message: parsed.message }, { status: parsed.status });
  }

  const checked = validateLead(parsed.body);
  if (!checked.ok) {
    return Response.json({ success: false, message: checked.message }, { status: checked.status });
  }

  // Off only for local test runs (RATE_LIMIT_DISABLED=1); never set it on Render.
  if (process.env.RATE_LIMIT_DISABLED !== "1") {
    const { limited, retryAfterSeconds } = checkRateLimit("lead", clientIp(request.headers));
    if (limited) {
      return Response.json(
        { success: false, message: "Too many submissions. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
      );
    }
  }

  const reference = newLeadReference();
  const lead = { ...neutraliseFormulas(parsed.body), reference };
  // TODO(integration): send `lead` to the admin panel, Zoho and Zapier.

  return Response.json({ success: true, reference, message: "Lead received successfully." });
}
