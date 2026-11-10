import { test } from "node:test";
import assert from "node:assert/strict";
import { getSiteUrl } from "@/lib/site-url";

test("SITE_URL wins, and a missing scheme is repaired", () => {
  assert.equal(getSiteUrl({ SITE_URL: "edenhousethepark.com/", RENDER_EXTERNAL_URL: "https://x.onrender.com" }), "https://edenhousethepark.com");
});

test("on Render without SITE_URL, the service's own address is used, never localhost", () => {
  assert.equal(getSiteUrl({ RENDER_EXTERNAL_URL: "https://stg-edenhousethepark.onrender.com" }), "https://stg-edenhousethepark.onrender.com");
});

test("with neither set (local development), localhost", () => {
  assert.equal(getSiteUrl({}), "http://localhost:3000");
});
