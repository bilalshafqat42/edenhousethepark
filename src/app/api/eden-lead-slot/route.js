import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { neutraliseFormulas, readJsonBody, validateSlot } from "@/lib/validation/leadRequest";

/*
 * Chat widget callback slot ({ reference, project, slotLabel, firstName,
 * lastName, phone, email, language }). Checked, rate-limited and cleaned;
 * DELIVERY IS A PLACEHOLDER, connected with the lead endpoint later.
 */
export async function POST(request) {
  const parsed = await readJsonBody(request);
  if (!parsed.ok) {
    return Response.json({ success: false, message: parsed.message }, { status: parsed.status });
  }

  const checked = validateSlot(parsed.body);
  if (!checked.ok) {
    return Response.json({ success: false, message: checked.message }, { status: checked.status });
  }

  // Off only for local test runs (RATE_LIMIT_DISABLED=1); never set it on Render.
  if (process.env.RATE_LIMIT_DISABLED !== "1") {
    const { limited, retryAfterSeconds } = checkRateLimit("slot", clientIp(request.headers));
    if (limited) {
      return Response.json(
        { success: false, message: "Too many submissions. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
      );
    }
  }

  const slot = neutraliseFormulas(parsed.body);
  // TODO(integration): send `slot` to the admin panel, Zoho and Zapier.

  return Response.json({ success: true });
}
