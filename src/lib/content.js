import "server-only";

import { mergeRowsOverDefaults } from "@/lib/section-defaults";
import snapshot from "@/content/snapshot.json";
import { SECTION_REGISTRY } from "@/content/sections";
import { hasInlineMarkup, sanitiseInline } from "@/lib/inline-html";

export { buildDefaultsFromFields } from "@/lib/section-defaults";

/*
 * The site's single content entry point. page.js, the root layout, the
 * privacy and terms pages and robots.js read through this one function.
 *
 * This app holds no database. Each field resolves, in order, to:
 *
 * 1. the central admin panel, over HTTPS (when CONTENT_API_URL is set);
 * 2. the published-content snapshot committed in src/content/snapshot.json
 *    (see withSnapshot below), so a fallback shows real, approved copy;
 * 3. the field defaults in src/content/sections/*.js.
 *
 * Running without the panel is a first-class supported state, not a
 * broken one. It
 * is how the site runs locally with no setup, and how it runs on Render
 * before the panel is connected: a complete, correct landing page that
 * simply cannot be edited yet. Deploying is therefore never blocked on
 * the panel being ready.
 *
 * The same path is also the failure mode: if the panel is unreachable,
 * misconfigured, or returns an error, getSectionRowsFromApi resolves to an
 * empty row list rather than throwing, so every field falls back to its
 * default and the site keeps serving real copy. That is what makes it safe
 * for a public marketing site to depend on another service to render.
 */
/*
 * The last published panel content, committed as a file
 * (src/content/snapshot.json, refreshed with `npm run content:snapshot`).
 * It sits between the code defaults and the live panel: if the panel cannot
 * be reached, or a list arrives empty, the site shows this approved copy.
 * Privacy and Terms are not in it. Until the first real snapshot is taken it
 * holds the code defaults (`npm run content:snapshot -- --from-defaults`).
 */
function withSnapshot(section, defaults) {
  const rows = snapshot.sections?.[section];
  return Array.isArray(rows) ? mergeRowsOverDefaults(rows, defaults) : { ...defaults };
}

/*
 * Any TEXT field may hold simple inline formatting and links (see
 * src/lib/inline-html.js). Every TEXT value, and every TEXT field inside a
 * LIST item, is sanitised here, on the server, before any component sees
 * it, so <InlineText> can render it as HTML without shipping a sanitiser
 * to the browser.
 *
 * Deny by default: a field the section declares as another type (RICHTEXT
 * has its own sanitiser, sanitize-rich-text.js; LINK, IMAGE, BOOLEAN are
 * not rendered as HTML) is left alone, and every other string is treated
 * as TEXT, including keys a section no longer declares. Only a value that contains markup
 * is touched; plain text (nearly all of it) passes through exactly as it
 * was.
 */
const isText = (field) => !field || field.type === "TEXT";

function cleanText(value) {
  return hasInlineMarkup(value) ? sanitiseInline(value) : value;
}

function cleanItems(items, itemFields) {
  const declared = new Map((itemFields ?? []).map((field) => [field.key, field]));

  return items.map((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return item;
    }
    let cleaned = item;
    for (const [key, value] of Object.entries(item)) {
      if (isText(declared.get(key)) && hasInlineMarkup(value)) {
        if (cleaned === item) cleaned = { ...item };
        cleaned[key] = sanitiseInline(value);
      }
    }
    return cleaned;
  });
}

function sanitiseTextFields(section, content) {
  const declared = new Map(
    (SECTION_REGISTRY[section]?.fields ?? []).map((field) => [field.key, field]),
  );

  for (const [key, value] of Object.entries(content)) {
    const field = declared.get(key);
    if (Array.isArray(value)) {
      if (!field || field.type === "LIST") {
        content[key] = cleanItems(value, field?.itemFields);
      }
    } else if (isText(field)) {
      content[key] = cleanText(value);
    }
  }

  return content;
}

export async function getSectionContent(section, sectionDefaults) {
  return sanitiseTextFields(section, await readSectionContent(section, sectionDefaults));
}

async function readSectionContent(section, sectionDefaults) {
  const defaults = withSnapshot(section, sectionDefaults);

  if (!process.env.CONTENT_API_URL) {
    return { ...defaults };
  }

  /*
   * Imported dynamically so the module is only loaded when the panel is
   * actually configured, keeping it out of the work done on a request that
   * will just return defaults.
   */
  const { getSectionRowsFromApi } = await import("@/lib/content-api");

  const rows = await getSectionRowsFromApi(section);

  const merged = mergeRowsOverDefaults(rows, defaults);

  /*
   * An empty list from the panel would otherwise make a section fall back
   * to the code's placeholder items (see each shape function); the
   * snapshot's real items are the better fallback.
   */
  for (const [key, value] of Object.entries(merged)) {
    if (Array.isArray(value) && value.length === 0 && Array.isArray(defaults[key]) && defaults[key].length > 0) {
      merged[key] = defaults[key];
    }
  }

  return merged;
}
