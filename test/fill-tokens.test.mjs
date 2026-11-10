import { test } from "node:test";
import assert from "node:assert/strict";
import { fillTokens } from "../src/lib/fill-tokens.js";

test("fills known placeholders", () => {
  assert.equal(fillTokens("{n} of {total}", { n: 2, total: 5 }), "2 of 5");
  assert.equal(fillTokens("{layout} floor plan {n}", { layout: "1 Bedroom", n: 1 }), "1 Bedroom floor plan 1");
});

test("leaves unknown placeholders and handles empty input", () => {
  assert.equal(fillTokens("{n} van {totaal}", { n: 1, total: 3 }), "1 van {totaal}");
  assert.equal(fillTokens(undefined, { n: 1 }), "");
  assert.equal(fillTokens("No tokens"), "No tokens");
});
