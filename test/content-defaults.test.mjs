import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { SECTION_REGISTRY } from "@/content/sections";
import { buildDefaultsFromFields, mergeRowsOverDefaults } from "@/lib/section-defaults";
import { buildPlaces, directionsUrl } from "@/components/Location/places";

/*
 * With an empty panel the page must render exactly as it did before the
 * panel existed, so the snapshot (the first fallback) must hold the same
 * values as the code defaults until a real snapshot is taken.
 */
const snapshot = JSON.parse(readFileSync(new URL("../src/content/snapshot.json", import.meta.url), "utf8"));

test("every snapshot section and key is one the site declares", () => {
  for (const [slug, rows] of Object.entries(snapshot.sections)) {
    assert.ok(SECTION_REGISTRY[slug], `snapshot has unknown section ${slug}`);
    const keys = new Set(SECTION_REGISTRY[slug].fields.map((f) => f.key));
    for (const row of rows) assert.ok(keys.has(row.key), `snapshot has unknown field ${slug}.${row.key}`);
  }
  assert.equal(snapshot.sections.privacy, undefined);
  assert.equal(snapshot.sections.terms, undefined);
});

test("a snapshot taken from the defaults merges back to exactly the defaults", { skip: snapshot.source !== "defaults" }, () => {
  for (const [slug, rows] of Object.entries(snapshot.sections)) {
    const defaults = buildDefaultsFromFields(SECTION_REGISTRY[slug].fields);
    assert.deepEqual(mergeRowsOverDefaults(rows, defaults), defaults, slug);
  }
});

test("location defaults give the original places, pins and directions", () => {
  const content = buildDefaultsFromFields(SECTION_REGISTRY.location.fields);
  const { project, callouts, chips, places } = buildPlaces(content);
  assert.equal(project.coords, null, "the project coordinate is still to confirm");
  assert.deepEqual(callouts.map((c) => c.id), ["al-safa-park", "city-walk", "dubai-mall", "difc", "dxb"]);
  assert.deepEqual(chips.map((c) => c.id), ["jumeirah-beach", "burj-khalifa", "difc", "dxb"]);
  assert.deepEqual(
    places.map((p) => [p.id, p.icon ?? "project", p.side ?? "right", ...p.coords]),
    [
      ["al-safa-park", "park", "right", 55.2398, 25.1878],
      ["city-walk", "shopping", "right", 55.2622, 25.2075],
      ["dubai-mall", "shopping", "right", 55.2796, 25.1985],
      ["difc", "business", "right", 55.2818, 25.2133],
      ["dxb", "airport", "right", 55.3644, 25.2528],
      ["jumeirah-beach", "beach", "left", 55.2531, 25.2122],
      ["burj-khalifa", "landmark", "left", 55.2744, 25.1972],
    ],
  );
  assert.equal(
    directionsUrl(project),
    "https://www.google.com/maps/dir/?api=1&destination=Eden%20House%20The%20Park%2C%20Dubai",
  );
});

test("the chat text sections cover every chat string in both languages", async () => {
  const { STRINGS } = await import("@/components/Chat/chatFlow");
  const { chatTextFromContent } = await import("@/content/sections/chatText");
  for (const [slug, language] of [["chatTextEn", "en"], ["chatTextAr", "ar"]]) {
    const keys = new Set(SECTION_REGISTRY[slug].fields.map((f) => f.key));
    for (const key of Object.keys(STRINGS[language])) assert.ok(keys.has(key), `${slug} lacks ${key}`);
    const copy = chatTextFromContent(buildDefaultsFromFields(SECTION_REGISTRY[slug].fields), language);
    assert.deepEqual(copy.strings, STRINGS[language]);
    // A blank panel value falls back to the default rather than an empty button.
    assert.equal(chatTextFromContent({ continueCta: "" }, language).strings.continueCta, STRINGS[language].continueCta);
  }
});
