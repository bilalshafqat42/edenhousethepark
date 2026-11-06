import { SECTION_GROUPS, SECTION_REGISTRY } from "@/content/sections";

/*
 * The manifest the admin panel builds its editor from, made straight from
 * SECTION_REGISTRY so it can never drift from what the site reads.
 *
 * Shape: refine-admin src/lib/manifest/schema.mjs. A section with no fields
 * (the sitemap) is left out: the panel requires at least one. Defaults are
 * strings except BOOLEAN (true/false) and LIST (an array of flat items, so
 * the editor opens showing today's items). test/manifest-limits.test.mjs
 * checks the panel's limits, because the panel refuses the WHOLE manifest
 * when any part breaks them.
 */
function toDefault(field) {
  if (field.defaultValue === undefined || field.defaultValue === null) return {};
  if (field.type === "BOOLEAN") return { default: field.defaultValue === true || field.defaultValue === "true" };
  if (field.type === "LIST") {
    return Array.isArray(field.defaultValue) ? { default: field.defaultValue } : {};
  }
  return { default: String(field.defaultValue) };
}

function toManifestField(field) {
  return {
    key: field.key,
    label: field.label,
    type: field.type,
    ...(field.long || field.multiline ? { multiline: true } : {}),
    ...(field.helperText ? { helperText: field.helperText } : {}),
    ...(field.options ? { options: field.options } : {}),
    ...(field.itemLabel ? { itemLabel: field.itemLabel } : {}),
    ...(field.itemFields ? { itemFields: field.itemFields.map(toManifestField) } : {}),
    ...toDefault(field),
  };
}

export function buildManifestPayload() {
  const sections = Object.entries(SECTION_REGISTRY)
    .filter(([, config]) => config.fields.length > 0)
    .map(([slug, config]) => ({
      slug,
      label: config.label,
      group: config.group,
      minRole: config.minRole,
      fields: config.fields.map(toManifestField),
    }));

  return { groups: SECTION_GROUPS, sections };
}

/*
 * Pushes the manifest to the panel. Called once per server boot from
 * instrumentation.js, never awaited there.
 *
 * Never throws and never hangs: a hard timeout, and every failure is logged
 * (status or message only; the request carries the API key) and swallowed.
 * The panel keeps the last manifest it accepted until the next boot.
 */
const REQUEST_TIMEOUT_MS = 8000;

export async function pushManifestToPanel({ fetchImpl = fetch, env = process.env } = {}) {
  const apiUrl = env.CONTENT_API_URL;
  const apiToken = env.CONTENT_API_TOKEN;

  if (!apiUrl || !apiToken) {
    return { pushed: false, reason: "unconfigured" };
  }

  try {
    const response = await fetchImpl(`${apiUrl.replace(/\/+$/, "")}/api/v1/manifest`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiToken}` },
      body: JSON.stringify(buildManifestPayload()),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      await response.body?.cancel().catch(() => {});
      console.error("Manifest push failed:", response.status, response.statusText);
      return { pushed: false, reason: `status ${response.status}` };
    }

    const result = await response.json().catch(() => ({}));
    console.log(`Manifest pushed to panel: version ${result?.version ?? "unknown"}`);
    return { pushed: true };
  } catch (error) {
    console.error("Manifest push failed:", error?.message);
    return { pushed: false, reason: "error" };
  }
}
