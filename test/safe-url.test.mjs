import { test } from "node:test";
import assert from "node:assert/strict";

import { lngLat, safeHref, safeImageSrc, slugify, wholeNumber } from "@/lib/safe-url";

test("safeHref keeps http(s), mailto, tel, site paths and anchors", () => {
  for (const href of ["https://x.example/a.pdf", "http://x.example", "mailto:a@b.c", "tel:+97144230167", "/privacy", "#contact"]) {
    assert.equal(safeHref(href, "F"), href);
  }
});

test("safeHref refuses javascript:, data:, protocol-relative and blank values", () => {
  for (const href of ["javascript:alert(1)", " JavaScript:alert(1)", "data:text/html,x", "//evil.example", "", null, undefined, "vbscript:x", "https://x y"]) {
    assert.equal(safeHref(href, "#contact"), "#contact", String(href));
  }
});

test("images: site paths and IMAGE_HOSTS only", () => {
  const env = { IMAGE_HOSTS: "media.refinedubai.com, *.cdn.example" };
  assert.equal(safeImageSrc("/images/renders/gym.jpg", "D", env), "/images/renders/gym.jpg");
  assert.equal(safeImageSrc("https://media.refinedubai.com/a.webp", "D", env), "https://media.refinedubai.com/a.webp");
  assert.equal(safeImageSrc("https://a.cdn.example/a.webp", "D", env), "https://a.cdn.example/a.webp");
  for (const src of ["https://evil.example/a.jpg", "http://media.refinedubai.com/a.jpg", "//media.refinedubai.com/a.jpg", "javascript:x", "", null]) {
    assert.equal(safeImageSrc(src, "D", env), "D", String(src));
  }
  // IMAGE_HOSTS unset: the panel's media host is still allowed.
  assert.equal(safeImageSrc("https://media.refinedubai.com/a.webp", "D", {}), "https://media.refinedubai.com/a.webp");
});

test("numbers and coordinates from text fields", () => {
  assert.equal(wholeNumber("459"), 459);
  assert.equal(wholeNumber(" 30 "), 30);
  for (const value of ["", "2 & 3", "6.4", "-1", null]) assert.equal(wholeNumber(value), null, String(value));
  assert.deepEqual(lngLat("55.2398", "25.1878"), [55.2398, 25.1878]);
  assert.equal(lngLat("", ""), null);
  assert.equal(lngLat("200", "25"), null);
  assert.equal(slugify("Al Safa Park"), "al-safa-park");
  assert.equal(slugify("DXB"), "dxb");
});
