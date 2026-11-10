import { test } from "node:test";
import assert from "node:assert/strict";
import { originalImageFor } from "../src/lib/cdn-cgi-fallback.js";

const env = { IMAGE_HOSTS: "media.refinedubai.com" };

test("local images are served as they are", () => {
  assert.deepEqual(
    originalImageFor("/cdn-cgi/image/width=828,quality=75,format=auto/images/renders/hero-aerial-canal.jpg", env),
    { rewrite: "/images/renders/hero-aerial-canal.jpg" },
  );
});

test("panel images on an allowed host are redirected to, including a collapsed https:/", () => {
  const url = "https://media.refinedubai.com/edenhousethepark/1-a.jpg";
  assert.deepEqual(originalImageFor(`/cdn-cgi/image/width=640/${url}`, env), { redirect: url });
  assert.deepEqual(originalImageFor("/cdn-cgi/image/width=640/https:/media.refinedubai.com/edenhousethepark/1-a.jpg", env), { redirect: url });
});

test("other hosts, path tricks and other /cdn-cgi paths are refused", () => {
  assert.equal(originalImageFor("/cdn-cgi/image/width=640/https://evil.example/x.jpg", env), null);
  assert.equal(originalImageFor("/cdn-cgi/image/width=640/../../etc/passwd", env), null);
  assert.equal(originalImageFor("/cdn-cgi/image/width=640//evil.example/x.jpg", env), null);
  assert.equal(originalImageFor("/cdn-cgi/trace", env), null);
});
