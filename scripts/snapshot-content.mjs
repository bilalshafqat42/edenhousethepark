/*
 * Refreshes src/content/snapshot.json: the published content the site falls
 * back to when the admin panel cannot be reached (getSectionContent in
 * src/lib/content.js).
 *
 * From the panel (use the LIVE site's values, so the snapshot matches what
 * is live), then commit the file:
 *   CONTENT_API_URL=https://projects-admin.refinedubai.com CONTENT_API_TOKEN=... \
 *   SITE_KEY=edenhousethepark npm run content:snapshot
 *
 * From the code defaults (no panel needed; how the first snapshot was made):
 *   npm run content:snapshot -- --from-defaults
 *
 * Privacy and Terms are left out on purpose, and so is any section or field
 * the site no longer declares.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { register } from "node:module";

register(new URL("./alias-loader.mjs", import.meta.url));
const { SECTION_REGISTRY } = await import("@/content/sections");

const EXCLUDE = new Set(["privacy", "terms"]);
const fromDefaults = process.argv.includes("--from-defaults");
const siteKey = process.env.SITE_KEY || "edenhousethepark";

function defaultRow(field) {
  if (field.type === "LIST") return { key: field.key, type: "LIST", items: field.defaultValue ?? [] };
  if (field.type === "IMAGE") return { key: field.key, type: "IMAGE", value: null, imageUrl: field.defaultValue || null };
  return { key: field.key, type: field.type, value: String(field.defaultValue ?? ""), imageUrl: null };
}

let sections = {};

if (fromDefaults) {
  for (const [slug, config] of Object.entries(SECTION_REGISTRY)) {
    if (EXCLUDE.has(slug) || config.fields.length === 0) continue;
    sections[slug] = config.fields.map(defaultRow);
  }
} else {
  const baseUrl = process.env.CONTENT_API_URL?.replace(/\/+$/, "");
  const token = process.env.CONTENT_API_TOKEN;
  if (!baseUrl || !token) {
    console.error("Set CONTENT_API_URL and CONTENT_API_TOKEN (live values), or pass --from-defaults.");
    process.exit(1);
  }

  const response = await fetch(`${baseUrl}/api/content?site=${encodeURIComponent(siteKey)}`, {
    headers: { authorization: `Bearer ${token}`, "x-api-key": token },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    console.error(`Panel responded ${response.status}; snapshot not changed.`);
    process.exit(1);
  }
  const payload = await response.json();
  const all = payload?.sections ?? {};

  for (const [slug, rows] of Object.entries(all)) {
    if (EXCLUDE.has(slug) || !SECTION_REGISTRY[slug] || !Array.isArray(rows)) continue;
    const keys = new Set(SECTION_REGISTRY[slug].fields.map((f) => f.key));
    sections[slug] = rows.filter((row) => keys.has(row.key));
  }
}

const file = new URL("../src/content/snapshot.json", import.meta.url);
let previous = {};
try {
  previous = JSON.parse(readFileSync(file, "utf8"));
} catch {
  // First run.
}

writeFileSync(
  file,
  JSON.stringify(
    { ...previous, site: siteKey, source: fromDefaults ? "defaults" : "panel", generatedAt: new Date().toISOString(), sections },
    null,
    1,
  ) + "\n",
);
console.log(`Snapshot updated from ${fromDefaults ? "code defaults" : "the panel"}: ${Object.keys(sections).length} sections.`);
