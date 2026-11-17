import { test } from "node:test";
import assert from "node:assert/strict";

import { isPlaceholder, realValue } from "@/lib/placeholder";
import { SECTION_REGISTRY } from "@/content/sections";
import { buildDefaultsFromFields } from "@/lib/section-defaults";

test("bracketed gaps and notes to the team count as placeholders", () => {
  for (const value of ["[number]", "Trakheesi permit no. [number]", "TO CONFIRM", "tbc", "Lorem ipsum"]) {
    assert.equal(isPlaceholder(value), true, value);
    assert.equal(realValue(value), "", value);
  }
});

test("real values are kept, trimmed", () => {
  assert.equal(realValue(" 71234567890 "), "71234567890");
  assert.equal(realValue("Madmoun QR code"), "Madmoun QR code");
  assert.equal(realValue(""), "");
  assert.equal(realValue(null), "");
});

test("the footer's permit number and QR code start blank, so nothing invented shows", () => {
  const footer = buildDefaultsFromFields(SECTION_REGISTRY.footer.fields);
  assert.equal(footer["permit-number"], "");
  assert.equal(footer["permit-qr"], "");
  assert.equal(footer["permit-text"], undefined, "the old placeholder field is gone");
});
