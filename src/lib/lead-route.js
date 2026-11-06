import "server-only";

import { dispatchLead } from "@/lib/lead-dispatch";
import { newLeadReference } from "@/lib/lead-reference";
import {
  isHoneypotFilled,
  leadKind,
  neutraliseFormulas,
  readLeadBody,
  validateLeadRequest,
} from "@/lib/validation/leadRequest";

const NO_STORE = { "Cache-Control": "no-store" };

function reply(status, payload, headers = {}) {
  return Response.json(payload, { status, headers: { ...NO_STORE, ...headers } });
}

/*
 * The shared body of /api/eden-lead and /api/eden-lead-slot: size-capped
 * JSON read, honeypot, validation, formula guard, then delivery. Success
 * (200, success: true) is returned ONLY when a destination confirmed the
 * lead; the forms show "Thank you" on that alone.
 *
 * Logs never include the body or any part of it.
 */
export async function handleLeadPost(request, { slot = false } = {}) {
  try {
    const parsed = await readLeadBody(request);
    if (!parsed.ok) {
      return reply(parsed.status, { success: false, message: parsed.message });
    }

    const kind = slot ? "slot" : leadKind(parsed.body);

    // A bot filled the hidden field: answer like a success, deliver nothing.
    if (isHoneypotFilled(parsed.body)) {
      return reply(200, slot ? { success: true } : { success: true, reference: newLeadReference() });
    }

    const checked = validateLeadRequest(kind, parsed.body);
    if (!checked.ok) {
      return reply(checked.status, { success: false, message: checked.message });
    }

    // Ours, generated before delivery, so the panel stores the reference the visitor is shown.
    const reference = slot ? null : newLeadReference();
    const body = neutraliseFormulas(slot ? checked.body : { ...checked.body, reference });

    const { rateLimited, retryAfterSeconds, delivered } = await dispatchLead({
      source: kind,
      body,
      submissionId: checked.submissionId,
      requestHeaders: request.headers,
      zapierUrl: slot ? process.env.ZAPIER_EDEN_SLOT_WEBHOOK : process.env.ZAPIER_EDEN_LEAD_WEBHOOK,
    });

    if (rateLimited) {
      return reply(
        429,
        { success: false, message: "Too many submissions. Please try again shortly." },
        { "Retry-After": String(retryAfterSeconds ?? 600) },
      );
    }

    if (!delivered) {
      return reply(502, {
        success: false,
        message: slot
          ? "We could not book that slot. Please try again."
          : "We could not submit your enquiry. Please try again.",
      });
    }

    return reply(200, slot ? { success: true } : { success: true, reference });
  } catch (error) {
    console.error("Lead endpoint error:", error?.message);
    return reply(500, { success: false, message: "We could not submit your enquiry. Please try again." });
  }
}
