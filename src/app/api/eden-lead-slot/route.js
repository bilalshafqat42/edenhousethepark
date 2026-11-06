import { handleLeadPost } from "@/lib/lead-route";

/*
 * The chat's callback slot, sent after an enquiry with its reference. The
 * panel joins it to that enquiry's lead.
 */
export async function POST(request) {
  return handleLeadPost(request, { slot: true });
}
