import { revalidatePath, revalidateTag } from "next/cache";

import { requireBearer } from "@/lib/bearer-auth";
import { CONTENT_CACHE_TAG } from "@/lib/content-api";

/*
 * Revalidation webhook, called by the admin panel right after an editor
 * saves (Authorization: Bearer <REVALIDATE_SECRET>). Purges the cached
 * panel content (tag "content") and the rendered pages, so the next visit
 * shows the edit.
 *
 * `{ expire: 0 }` rather than the "max" profile: "max" would serve the old
 * page once more while fresh content loads, which to an editor reloading
 * after Save reads as "my change did not save". updateTag() is only
 * available in Server Actions, and this is a Route Handler called by
 * another service.
 */
export async function POST(request) {
  const unauthorized = requireBearer(request, process.env.REVALIDATE_SECRET, "REVALIDATE_SECRET");

  if (unauthorized) {
    return unauthorized;
  }

  try {
    revalidateTag(CONTENT_CACHE_TAG, { expire: 0 });
    // The rendered routes too, including /robots.txt and /sitemap.xml.
    revalidatePath("/", "layout");

    return Response.json({ revalidated: true });
  } catch (error) {
    console.error("Revalidation failed:", error?.message);
    return Response.json({ error: "Revalidation failed." }, { status: 500 });
  }
}
