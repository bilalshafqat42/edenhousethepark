import { test } from "node:test";
import assert from "node:assert/strict";

import { getClientIp } from "@/lib/client-ip";

const h = (o) => new Headers(o);

test("a forged left-most X-Forwarded-For entry is never used", () => {
  const ip = getClientIp(h({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" }), "");
  assert.equal(ip, "203.0.113.9");
});

test("without a secret, Cloudflare's CF-Connecting-IP is used", () => {
  const ip = getClientIp(
    h({ "cf-connecting-ip": "198.51.100.4", "x-forwarded-for": "6.6.6.6, 172.70.1.1" }),
    ""
  );
  assert.equal(ip, "198.51.100.4");
});

test("with a secret, CF-Connecting-IP is trusted only when the secret matches", () => {
  const viaCloudflare = h({
    "cf-connecting-ip": "198.51.100.4",
    "x-origin-secret": "s3cret",
    "x-forwarded-for": "6.6.6.6, 172.70.1.1",
  });
  assert.equal(getClientIp(viaCloudflare, "s3cret"), "198.51.100.4");

  const direct = h({
    "cf-connecting-ip": "1.2.3.4",
    "x-origin-secret": "guess",
    "x-forwarded-for": "1.2.3.4, 203.0.113.50",
  });
  assert.equal(getClientIp(direct, "s3cret"), "203.0.113.50");
});

test("falls back to x-real-ip, then a shared bucket", () => {
  assert.equal(getClientIp(h({ "x-real-ip": "192.0.2.7" }), ""), "192.0.2.7");
  assert.equal(getClientIp(h({}), ""), "unknown");
});
