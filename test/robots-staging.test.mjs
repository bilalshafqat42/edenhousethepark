import { test } from "node:test";
import assert from "node:assert/strict";

import { robotsRules } from "@/lib/robots-rules";
import { isStagingHost, isStagingSite } from "@/lib/staging";

const SITE = "https://edenhousethepark.refinedubai.com";
const star = (rules) => rules.rules.find((rule) => rule.userAgent === "*");

test("stg- hosts are staging, in any form they arrive", () => {
  for (const host of ["stg-edenhousethepark.refinedubai.com", "STG-edenhousethepark.refinedubai.com:443", "https://stg-edenhousethepark.refinedubai.com/x"]) {
    assert.equal(isStagingHost(host), true, host);
  }
  for (const host of ["edenhousethepark.refinedubai.com", "edenhousethepark-stg.refinedubai.com", "", undefined, "localhost:3000"]) {
    assert.equal(isStagingHost(host), false, String(host));
  }
  assert.equal(isStagingSite("https://stg-edenhousethepark.refinedubai.com"), true);
  assert.equal(isStagingSite(SITE), false);
});

test("indexing is off by default", () => {
  const rules = robotsRules({ allowIndexing: false, staging: false, siteUrl: SITE });
  assert.equal(star(rules).disallow, "/");
  assert.equal(rules.sitemap, undefined);
});

test("live with indexing on: allowed, with the sitemap", () => {
  const rules = robotsRules({ allowIndexing: true, staging: false, siteUrl: SITE });
  assert.equal(star(rules).allow, "/");
  assert.equal(rules.sitemap, `${SITE}/sitemap.xml`);
});

test("staging is never indexed, even with the toggle on", () => {
  const rules = robotsRules({ allowIndexing: true, staging: true, siteUrl: SITE });
  assert.equal(star(rules).disallow, "/");
});

test("a truthy non-boolean toggle does not open indexing", () => {
  assert.equal(star(robotsRules({ allowIndexing: "true", staging: false, siteUrl: SITE })).disallow, "/");
});

test("link-preview bots are always allowed", () => {
  const preview = robotsRules({ allowIndexing: false, staging: true, siteUrl: SITE }).rules[1];
  assert.ok(preview.userAgent.includes("WhatsApp"));
  assert.equal(preview.allow, "/");
});
