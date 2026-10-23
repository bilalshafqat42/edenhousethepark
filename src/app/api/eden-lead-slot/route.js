/*
 * Chat widget callback slot. PLACEHOLDER: accepts the same payload as the
 * Mövenpick endpoint ({ reference, project, slotLabel, firstName, lastName,
 * phone, email, language }) but does not deliver it anywhere yet.
 */
export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (!body?.reference || !body?.slotLabel) {
    return Response.json(
      { success: false, message: "Invalid slot booking." },
      { status: 400 },
    );
  }

  return Response.json({ success: true });
}
