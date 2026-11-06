import "server-only";

import { SECTION_REGISTRY } from "@/content/sections";
import { buildDefaultsFromFields, getSectionContent } from "@/lib/content";

/*
 * Reads several sections at once, each merged over its defaults
 * (panel > snapshot > code). One panel request serves them all
 * (content-api.js), so this costs no more than reading one.
 */
export async function readSection(slug) {
  const config = SECTION_REGISTRY[slug];
  if (!config) throw new Error(`Unknown content section: ${slug}`);
  return getSectionContent(slug, buildDefaultsFromFields(config.fields));
}

export async function readSections(slugs) {
  const values = await Promise.all(slugs.map(readSection));
  return Object.fromEntries(slugs.map((slug, i) => [slug, values[i]]));
}
