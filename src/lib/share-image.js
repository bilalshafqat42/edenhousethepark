import { cloudflareImageUrl, isCloudflareResizable } from "@/lib/cloudflare-image";

/*
 * The link-preview image. A share image uploaded in the panel wins;
 * otherwise the hero image is used, so the preview always matches the
 * first screen. Where Cloudflare resizes images (CLOUDFLARE_IMAGE_RESIZING),
 * the hero goes out as a 1200×630 JPEG crop: chat apps skip heavy images,
 * and the hero source is around 2 MB. Pure, no dependencies beyond the
 * Cloudflare URL builder.
 */
export const SHARE_WIDTH = 1200;
export const SHARE_HEIGHT = 630;

export function shareImage({ shareSrc, heroSrc, resize }) {
  if (shareSrc) return { url: shareSrc };
  if (!heroSrc) return null;
  if (resize && isCloudflareResizable(heroSrc)) {
    return {
      url: cloudflareImageUrl(heroSrc, { width: SHARE_WIDTH, height: SHARE_HEIGHT, fit: "cover", quality: 80, format: "jpeg" }),
      width: SHARE_WIDTH,
      height: SHARE_HEIGHT,
    };
  }
  return { url: heroSrc };
}
