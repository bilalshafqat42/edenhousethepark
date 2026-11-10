import { test } from "node:test";
import assert from "node:assert/strict";
import { shareImage } from "@/lib/share-image";

test("an uploaded share image wins over the hero", () => {
  assert.deepEqual(shareImage({ shareSrc: "/a.jpg", heroSrc: "/hero.jpg", resize: true }), { url: "/a.jpg" });
});

test("blank share image falls back to the hero, cropped to 1200x630 by Cloudflare", () => {
  assert.deepEqual(shareImage({ shareSrc: "", heroSrc: "/images/hero.jpg", resize: true }), {
    url: "/cdn-cgi/image/width=1200,height=630,fit=cover,quality=80,format=jpeg/images/hero.jpg",
    width: 1200,
    height: 630,
  });
});

test("without Cloudflare resizing the hero goes out as it is", () => {
  assert.deepEqual(shareImage({ shareSrc: "", heroSrc: "/images/hero.jpg", resize: false }), { url: "/images/hero.jpg" });
});

test("no share image and no hero: no preview image", () => {
  assert.equal(shareImage({ shareSrc: "", heroSrc: "", resize: true }), null);
});
