"use client";

/*
 * Used only when CLOUDFLARE_IMAGE_RESIZING=true (see next.config.mjs).
 * Replaces next/image's own resizing, which this instance's 0.5 CPU / 512 MB
 * cannot do reliably (see the images.unoptimized comment in next.config.mjs
 * for the 27 August 2026 incident this is the real fix for) — Cloudflare
 * resizes at its edge instead, so the container never encodes anything.
 *
 * Relative, not an absolute host: the browser resolves /cdn-cgi/image/...
 * against whichever domain served the page, so this works unchanged whether
 * `src` is a local /images path or an absolute URL from the admin panel's
 * media host. Image Resizing, including "Resize images from any origin", is
 * enabled on refinedubai.com (checked 6 October 2026: a 224 KB JPEG comes
 * back as a 21 KB AVIF at 640px, cached).
 *
 * Which files go through Cloudflare is decided in src/lib/cloudflare-image.js
 * (AVIF and SVG are served as they are).
 */
import { cloudflareImageUrl, isCloudflareResizable } from "@/lib/cloudflare-image";

export default function cloudflareImageLoader({ src, width, quality }) {
  if (!isCloudflareResizable(src)) {
    return src;
  }
  return cloudflareImageUrl(src, { width, quality: quality || 75, format: "auto" });
}
