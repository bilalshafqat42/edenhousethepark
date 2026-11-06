import { test } from "node:test";
import assert from "node:assert/strict";

import loader from "@/lib/cloudflare-image-loader";

test("JPG/PNG/WebP go through Cloudflare resizing", () => {
  assert.equal(
    loader({ src: "/images/floor-plan/studio.png", width: 640, quality: 80 }),
    "/cdn-cgi/image/width=640,quality=80,format=auto/images/floor-plan/studio.png"
  );
  assert.equal(
    loader({ src: "https://media.refinedubai.com/movenpick/a.jpg", width: 1200 }),
    "/cdn-cgi/image/width=1200,quality=75,format=auto/https://media.refinedubai.com/movenpick/a.jpg"
  );
});

test("AVIF and SVG are served as they are (Cloudflare cannot read AVIF)", () => {
  for (const src of ["/images/hero/hero.avif", "https://media.refinedubai.com/m/a.avif", "/logo.svg"]) {
    assert.equal(loader({ src, width: 640, quality: 75 }), src);
  }
});
