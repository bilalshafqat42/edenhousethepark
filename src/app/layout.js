import "./globals.css";
import { HERO_IMAGE_FALLBACK } from "@/content/sections/hero";
import { readSections } from "@/lib/page-content";
import { plainTextValues } from "@/lib/inline-text";
import { safeImageSrc } from "@/lib/safe-url";
import { getSiteUrl } from "@/lib/site-url";
import { shareImage } from "@/lib/share-image";
import { isStagingSite } from "@/lib/staging";

// Brand fonts are declared by name in globals.css (@font-face). These are the
// faces the first screen needs (hero headline and figures in Ivy Presto
// Regular, hero text and buttons in Beausite Regular, nav in Beausite Light),
// so the browser fetches them before it reads the stylesheet.
const PRELOAD_FONTS = [
  "/webfonts/IvyPrestoDisplay-Regular.woff2",
  "/webfonts/BeausiteClassicWeb-Regular.woff2",
  "/webfonts/BeausiteClassicWeb-Light.woff2",
];

/*
 * Title, description, share card, canonical address and favicon, from the
 * panel's SEO & Sharing and Logo & Favicon sections (plain text: meta tags
 * cannot hold formatting). The staging site (stg- address) always carries
 * noindex, nofollow, whatever the panel says.
 */
export async function generateMetadata() {
  const { seo: rawSeo, appearance, hero } = await readSections(["seo", "appearance", "hero"]);
  const seo = plainTextValues(rawSeo);
  const siteUrl = getSiteUrl();
  const title = seo["meta-title"];
  const description = seo["meta-description"];
  const ogImage = shareImage({
    shareSrc: safeImageSrc(seo["og-image"], ""),
    heroSrc: safeImageSrc(hero.image, HERO_IMAGE_FALLBACK),
    resize: process.env.CLOUDFLARE_IMAGE_RESIZING === "true",
  });
  const favicon = safeImageSrc(appearance.favicon, "/favicon.ico");

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      title: seo["og-title"] || title,
      description: seo["og-description"] || description,
      ...(ogImage ? { images: [{ ...ogImage, alt: seo["og-title"] || title }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: seo["og-title"] || title,
      description: seo["og-description"] || description,
      ...(ogImage ? { images: [ogImage.url] } : {}),
    },
    // Always set here: an app/favicon.ico file would override the panel's
    // favicon (file-based metadata wins), so the built-in icon lives in public/.
    // An SVG is labelled as one, and is not offered as the iPhone home-screen
    // icon (iOS needs a PNG there).
    icons: /\.svg(\?|$)/i.test(favicon)
      ? { icon: [{ url: favicon, type: "image/svg+xml" }], shortcut: favicon }
      : { icon: favicon, shortcut: favicon, apple: favicon },
    ...(isStagingSite() ? { robots: { index: false, follow: false } } : {}),
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {PRELOAD_FONTS.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
