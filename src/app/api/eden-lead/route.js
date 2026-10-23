import { newLeadReference } from "@/lib/lead-reference";

/*
 * Chat widget lead. PLACEHOLDER: accepts the same payload as the
 * Mövenpick endpoint (see the chat hand-off kit, BRIEF.md section 4) and
 * returns a reference, but does not deliver the lead anywhere yet.
 * The admin panel, Zoho and Zapier are connected here later.
 */
export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid lead submission." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object" || body.consent !== true) {
    return Response.json(
      { success: false, message: "Invalid lead submission." },
      { status: 400 },
    );
  }

  return Response.json({
    success: true,
    reference: newLeadReference(),
    message: "Lead received successfully.",
  });
}
