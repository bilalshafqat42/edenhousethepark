import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { PREVIEW_TOKEN_COOKIE } from "@/lib/preview-mode";

// Leaves preview: the only way out short of the cookie expiring after an hour.
export async function GET() {
  const draft = await draftMode();
  draft.disable();

  const cookieStore = await cookies();
  cookieStore.delete(PREVIEW_TOKEN_COOKIE);

  redirect("/");
}
