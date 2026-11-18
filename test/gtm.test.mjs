import { test } from "node:test";
import assert from "node:assert/strict";

import { gtmId, gtmScriptUrl } from "@/lib/gtm";
import { allowsAnalytics } from "@/lib/consent";

test("no container ID anywhere means nothing to load", () => {
  assert.equal(gtmId("", {}), "");
  assert.equal(gtmId(undefined, {}), "");
});

test("the panel's ID wins, then NEXT_PUBLIC_GTM_ID", () => {
  assert.equal(gtmId(" gtm-abc1234 ", { NEXT_PUBLIC_GTM_ID: "GTM-ENV1234" }), "GTM-ABC1234");
  assert.equal(gtmId("", { NEXT_PUBLIC_GTM_ID: "GTM-ENV1234" }), "GTM-ENV1234");
});

test("anything that is not a GTM ID is refused", () => {
  for (const value of ["G-ABC123", "GTM-", "GTM-AB", "GTM-ABC1234\"><script>", "UA-1-1"]) {
    assert.equal(gtmId(value, {}), "", value);
  }
  assert.equal(gtmScriptUrl("GTM-ABC1234"), "https://www.googletagmanager.com/gtm.js?id=GTM-ABC1234");
});

test("only Accept allows analytics", () => {
  assert.equal(allowsAnalytics("all"), true);
  for (const choice of ["essential", "custom", null, ""]) assert.equal(allowsAnalytics(choice), false);
});
