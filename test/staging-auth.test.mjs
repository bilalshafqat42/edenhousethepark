import { test } from "node:test";
import assert from "node:assert/strict";

import { isAuthorised } from "@/lib/staging-auth";

const basic = (u, p) => "Basic " + Buffer.from(`${u}:${p}`).toString("base64");
const creds = { username: "refine", password: "s3cret:with-colon" };

test("no password configured means no protection (the live site)", () => {
  assert.equal(isAuthorised(undefined, { username: "refine", password: undefined }), true);
});

test("correct username and password are accepted, including a colon in the password", () => {
  assert.equal(isAuthorised(basic("refine", "s3cret:with-colon"), creds), true);
});

test("wrong or missing credentials are refused", () => {
  assert.equal(isAuthorised(basic("refine", "nope"), creds), false);
  assert.equal(isAuthorised(basic("someone", "s3cret:with-colon"), creds), false);
  assert.equal(isAuthorised(null, creds), false);
  assert.equal(isAuthorised("Bearer abc", creds), false);
  assert.equal(isAuthorised("Basic !!!notbase64", creds), false);
});
