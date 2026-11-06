import { test } from "node:test";
import assert from "node:assert/strict";

import { verifyPreviewToken } from "@/lib/preview-token";

// The panel decides whether a preview link is valid; fails closed otherwise.
const env = { CONTENT_API_URL: "https://panel.example.invalid/", CONTENT_API_TOKEN: "site-key" };

function fakeFetch(statusOrError, seen = []) {
  return async (url, init) => {
    seen.push({ url: String(url), init });
    if (statusOrError instanceof Error) throw statusOrError;
    return new Response("{}", { status: statusOrError });
  };
}

const quiet = async (fn) => {
  const original = console.error;
  console.error = () => {};
  try {
    return await fn();
  } finally {
    console.error = original;
  }
};

test("asks the panel's draft content route with the site key", async () => {
  const seen = [];
  assert.equal(await verifyPreviewToken("tok.123", { env, fetchImpl: fakeFetch(200, seen) }), "valid");
  const url = new URL(seen[0].url);
  assert.equal(url.origin + url.pathname, "https://panel.example.invalid/api/v1/content");
  assert.equal(url.searchParams.get("status"), "draft");
  assert.equal(url.searchParams.get("token"), "tok.123");
  assert.equal(seen[0].init.headers.authorization, "Bearer site-key");
  assert.equal(seen[0].init.cache, "no-store");
});

test("403 is an invalid link; anything else unexpected fails closed", async () => {
  assert.equal(await verifyPreviewToken("t", { env, fetchImpl: fakeFetch(403) }), "invalid");
  await quiet(async () => {
    assert.equal(await verifyPreviewToken("t", { env, fetchImpl: fakeFetch(401) }), "unavailable");
    assert.equal(await verifyPreviewToken("t", { env, fetchImpl: fakeFetch(500) }), "unavailable");
    assert.equal(await verifyPreviewToken("t", { env, fetchImpl: fakeFetch(new Error("timeout")) }), "unavailable");
  });
});

test("no panel configured, or no token at all, never enters preview", async () => {
  assert.equal(await verifyPreviewToken("t", { env: {}, fetchImpl: fakeFetch(200) }), "unconfigured");
  assert.equal(await verifyPreviewToken("", { env, fetchImpl: fakeFetch(200) }), "invalid");
  assert.equal(await verifyPreviewToken(null, { env, fetchImpl: fakeFetch(200) }), "invalid");
  assert.equal(await verifyPreviewToken("x".repeat(5000), { env, fetchImpl: fakeFetch(200) }), "invalid");
});
