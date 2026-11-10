import { test } from "node:test";
import assert from "node:assert/strict";

import { canonicalRedirect } from "@/lib/canonical-host";

const SITE = "https://stg-edenhousethepark.refinedubai.com";
const req = (over = {}) => ({ method: "GET", host: "stg-edenhousethepark.onrender.com", pathname: "/", search: "", ...over });

test("a page on the Render address moves to SITE_URL, keeping path and query", () => {
  assert.equal(canonicalRedirect(req({ pathname: "/privacy", search: "?a=1" }), SITE), `${SITE}/privacy?a=1`);
});

test("API calls and non-GET requests stay put", () => {
  assert.equal(canonicalRedirect(req({ pathname: "/api/eden-lead" }), SITE), null);
  assert.equal(canonicalRedirect(req({ method: "POST" }), SITE), null);
});

test("other hosts and a missing SITE_URL are left alone", () => {
  assert.equal(canonicalRedirect(req({ host: "localhost:3000" }), SITE), null);
  assert.equal(canonicalRedirect(req({ host: "stg-edenhousethepark.refinedubai.com" }), SITE), null);
  assert.equal(canonicalRedirect(req(), ""), null);
  assert.equal(canonicalRedirect(req(), "https://stg-edenhousethepark.onrender.com"), null);
});
