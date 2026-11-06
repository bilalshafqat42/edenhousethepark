/*
 * Runs once when a server instance starts: pushes this site's content
 * manifest to the admin panel, so the panel's editor always matches what the
 * code declares (src/lib/push-manifest.js).
 *
 * Deliberately NOT awaited: Next waits for register() before serving, and
 * the site's availability must never depend on the panel answering.
 * pushManifestToPanel never throws; the .catch is a second guard.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  try {
    const { pushManifestToPanel } = await import("@/lib/push-manifest");
    void pushManifestToPanel().catch((error) => console.error("Manifest push failed:", error?.message));
  } catch (error) {
    console.error("Manifest push could not start:", error?.message);
  }
}
