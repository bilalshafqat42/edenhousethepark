import { test } from "node:test";
import assert from "node:assert/strict";

import { bearerTokenMatches, requireBearer } from "@/lib/bearer-auth";

// The check behind POST /api/revalidate (REVALIDATE_SECRET).
const post = (authorization) =>
  new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: authorization === undefined ? {} : { authorization },
  });

test("only the exact Bearer secret is accepted", () => {
  assert.equal(bearerTokenMatches("Bearer s3cret-value", "s3cret-value"), true);
  for (const header of ["Bearer wrong", "bearer s3cret-value", "s3cret-value", "Basic s3cret-value", "Bearer ", "Bearer s3cret-value ", undefined, null]) {
    assert.equal(bearerTokenMatches(header, "s3cret-value"), false, String(header));
  }
});

test("an unset secret never authorises anything", () => {
  assert.equal(bearerTokenMatches("Bearer undefined", undefined), false);
  assert.equal(bearerTokenMatches("Bearer ", ""), false);
});

test("requireBearer: null when authorised, 401 when not, 500 when the secret is missing", async () => {
  assert.equal(requireBearer(post("Bearer abc"), "abc", "REVALIDATE_SECRET"), null);

  const denied = requireBearer(post("Bearer nope"), "abc", "REVALIDATE_SECRET");
  assert.equal(denied.status, 401);
  assert.equal(requireBearer(post(undefined), "abc", "REVALIDATE_SECRET").status, 401);

  const original = console.error;
  console.error = () => {};
  try {
    const misconfigured = requireBearer(post("Bearer abc"), undefined, "REVALIDATE_SECRET");
    assert.equal(misconfigured.status, 500);
    assert.doesNotMatch(JSON.stringify(await misconfigured.json()), /abc/);
  } finally {
    console.error = original;
  }
});
