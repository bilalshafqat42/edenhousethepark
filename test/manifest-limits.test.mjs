import { test } from "node:test";
import assert from "node:assert/strict";

import { buildManifestPayload } from "@/lib/push-manifest";

/*
 * The admin panel refuses a whole manifest when any part of it breaks the
 * panel's rules (refine-admin src/lib/manifest/schema.mjs), and the site only
 * logs the refusal at boot. The editor then silently lacks every new field
 * (it happened to Oceara on 8 October 2026). These are the panel's limits,
 * checked here so the same mistake fails CI before it reaches staging or
 * live. Keep them in step with the panel's schema.
 */
const LIMITS = {
  sections: 100,
  groups: 20,
  // refine-admin MAX_FIELDS_PER_SECTION (raised from 60 on 22 October 2026).
  fieldsPerSection: 100,
  optionsPerField: 50,
  optionLength: 100,
  keyLength: 64,
  labelLength: 200,
  helperTextLength: 500,
  groupLabelLength: 100,
  sectionLabelLength: 200,
  itemFieldsPerList: 20,
  itemLabelLength: 100,
  defaultLength: 10_000,
  listDefaultItems: 50,
};
const KEY_PATTERN = /^[a-z][a-zA-Z0-9-]*$/;
const FIELD_TYPES = ["TEXT", "RICHTEXT", "IMAGE", "LINK", "BOOLEAN", "LIST"];

const payload = buildManifestPayload();

function checkDefault(field, where) {
  if (field.default === undefined) {
    return;
  }
  if (field.type === "LIST") {
    // Up to 50 flat items, keyed by the list's own itemFields, each value a
    // string (true/false for a BOOLEAN item field).
    assert.ok(Array.isArray(field.default), `${where}: a LIST default must be an array of items`);
    assert.ok(field.default.length <= LIMITS.listDefaultItems, `${where}: more than ${LIMITS.listDefaultItems} default items`);
    const types = new Map((field.itemFields ?? []).map((item) => [item.key, item.type]));
    field.default.forEach((item, index) => {
      for (const [key, value] of Object.entries(item)) {
        const at = `${where}[${index}].${key}`;
        assert.ok(types.has(key), `${at} is not one of the list's itemFields`);
        if (types.get(key) === "BOOLEAN") {
          assert.equal(typeof value, "boolean", `${at} must be true/false`);
        } else {
          assert.equal(typeof value, "string", `${at} must be a string`);
          assert.ok(value.length <= LIMITS.defaultLength, `${at} too long`);
        }
      }
    });
    return;
  }
  if (field.type === "BOOLEAN") {
    assert.equal(typeof field.default, "boolean", `${where}: a BOOLEAN default must be true/false`);
  } else {
    assert.equal(typeof field.default, "string", `${where}: default must be a string`);
    assert.ok(field.default.length <= LIMITS.defaultLength, `${where} default too long`);
  }
}

function checkItemFields(field, where) {
  assert.ok(
    Array.isArray(field.itemFields) &&
      field.itemFields.length >= 1 &&
      field.itemFields.length <= LIMITS.itemFieldsPerList,
    `${where} needs 1 to ${LIMITS.itemFieldsPerList} itemFields`,
  );
  if (field.itemLabel !== undefined) {
    assert.ok(field.itemLabel.length >= 1 && field.itemLabel.length <= LIMITS.itemLabelLength, `${where} itemLabel`);
  }
  const keys = new Set();
  for (const item of field.itemFields) {
    const itemWhere = `${where}.${item.key}`;
    assert.match(item.key, KEY_PATTERN, itemWhere);
    assert.ok(item.key.length <= LIMITS.keyLength, `${itemWhere} key too long`);
    assert.ok(!keys.has(item.key), `duplicate item field ${itemWhere}`);
    keys.add(item.key);
    assert.ok(
      FIELD_TYPES.includes(item.type) && item.type !== "LIST",
      `${itemWhere} has type ${item.type}; a list item cannot be a LIST`,
    );
    assert.ok(item.label && item.label.length <= LIMITS.labelLength, `${itemWhere} label`);
    assert.ok((item.helperText ?? "").length <= LIMITS.helperTextLength, `${itemWhere} helper text`);
    checkDefault(item, itemWhere);
  }
}

test("stays within the panel's section and group limits", () => {
  assert.ok(payload.sections.length >= 1 && payload.sections.length <= LIMITS.sections);
  assert.ok(payload.groups.length >= 1 && payload.groups.length <= LIMITS.groups);
  for (const group of payload.groups) {
    assert.match(group.key, KEY_PATTERN, `group key ${group.key}`);
    assert.ok(group.label && group.label.length <= LIMITS.groupLabelLength, `group ${group.key} label`);
  }
  for (const section of payload.sections) {
    assert.ok(
      section.label && section.label.length <= LIMITS.sectionLabelLength,
      `${section.slug} label`,
    );
  }
});

test("every section has between 1 and 100 fields", () => {
  for (const section of payload.sections) {
    assert.ok(
      section.fields.length >= 1 && section.fields.length <= LIMITS.fieldsPerSection,
      `${section.slug} has ${section.fields.length} fields; the panel allows at most ${LIMITS.fieldsPerSection}`,
    );
  }
});

test("section slugs, field keys, types, labels, defaults and list items follow the panel's pattern and are unique", () => {
  const groupKeys = new Set(payload.groups.map((group) => group.key));
  const slugs = new Set();
  for (const section of payload.sections) {
    assert.match(section.slug, KEY_PATTERN, `section slug ${section.slug}`);
    assert.ok(section.slug.length <= LIMITS.keyLength);
    assert.ok(!slugs.has(section.slug), `duplicate section ${section.slug}`);
    slugs.add(section.slug);
    assert.ok(groupKeys.has(section.group), `${section.slug} names unknown group ${section.group}`);

    const keys = new Set();
    for (const field of section.fields) {
      const where = `${section.slug}.${field.key}`;
      assert.match(field.key, KEY_PATTERN, where);
      assert.ok(field.key.length <= LIMITS.keyLength, `${where} key too long`);
      assert.ok(!keys.has(field.key), `duplicate field ${where}`);
      keys.add(field.key);
      assert.ok(FIELD_TYPES.includes(field.type), `${where} has unknown type ${field.type}`);
      assert.ok(field.label && field.label.length <= LIMITS.labelLength, `${where} label`);
      assert.ok((field.helperText ?? "").length <= LIMITS.helperTextLength, `${where} helper text`);
      checkDefault(field, where);
      if (field.type === "LIST") {
        checkItemFields(field, where);
      } else {
        assert.equal(field.itemFields, undefined, `${where}: only a LIST field may have itemFields`);
      }
    }
  }
});

function checkOptions(field, where) {
  if (field.options === undefined) return;
  assert.equal(field.type, "TEXT", `${where}: only a TEXT field may declare options`);
  assert.ok(Array.isArray(field.options) && field.options.length >= 1 && field.options.length <= LIMITS.optionsPerField, `${where} options`);
  assert.equal(new Set(field.options).size, field.options.length, `${where}: options repeat a value`);
  for (const option of field.options) {
    assert.ok(typeof option === "string" && option.length >= 1 && option.length <= LIMITS.optionLength, `${where} option ${option}`);
  }
  if (typeof field.default === "string" && field.default !== "") {
    assert.ok(field.options.includes(field.default), `${where}: default is not one of the options`);
  }
}

test("TEXT options are valid, and every default (list items included) is one of them", () => {
  for (const section of payload.sections) {
    for (const field of section.fields) {
      const where = `${section.slug}.${field.key}`;
      checkOptions(field, where);
      for (const item of field.itemFields ?? []) {
        checkOptions(item, `${where}.${item.key}`);
        for (const [index, value] of (Array.isArray(field.default) ? field.default : []).entries()) {
          if (item.options && typeof value[item.key] === "string" && value[item.key] !== "") {
            assert.ok(item.options.includes(value[item.key]), `${where}[${index}].${item.key} "${value[item.key]}" is not an option`);
          }
        }
      }
    }
  }
});

test("only the panel's fields are sent: no stray keys the panel's strict schema would refuse", () => {
  const SECTION_KEYS = new Set(["slug", "label", "description", "group", "minRole", "fields"]);
  const FIELD_KEYS = new Set(["key", "type", "label", "helperText", "placeholder", "multiline", "minRole", "itemLabel", "itemFields", "options", "default"]);
  const ROLES = new Set(["EDITOR", "MANAGER", "ADMIN", "SUPER_ADMIN"]);
  for (const section of payload.sections) {
    for (const key of Object.keys(section)) assert.ok(SECTION_KEYS.has(key), `${section.slug} sends unknown key ${key}`);
    assert.ok(ROLES.has(section.minRole), `${section.slug} minRole`);
    for (const field of section.fields) {
      for (const key of Object.keys(field)) assert.ok(FIELD_KEYS.has(key), `${section.slug}.${field.key} sends unknown key ${key}`);
      for (const item of field.itemFields ?? []) {
        for (const key of Object.keys(item)) {
          assert.ok(FIELD_KEYS.has(key) && key !== "itemFields" && key !== "itemLabel" && key !== "minRole", `${section.slug}.${field.key}.${item.key} sends ${key}`);
        }
      }
    }
  }
});
