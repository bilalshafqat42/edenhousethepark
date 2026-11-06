import { handleLeadPost } from "@/lib/lead-route";

/*
 * Contact form and chat enquiries. Validated, rate-limited by the visitor's
 * real IP, then stored in the admin panel (src/lib/lead-dispatch.js).
 */
export async function POST(request) {
  return handleLeadPost(request);
}
