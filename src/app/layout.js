import "./globals.css";
import { readSections } from "@/lib/page-content";
import { plainTextValues } from "@/lib/inline-text";
import { safeImageSrc } from "@/lib/safe-url";
import { getSiteUrl } from "@/lib/site-url";
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
  const { seo: rawSeo, appearance } = await readSections(["seo", "appearance"]);
  const seo = plainTextValues(rawSeo);
  const siteUrl = getSiteUrl();
  const title = seo["meta-title"];
  const description = seo["meta-description"];
  const ogImage = safeImageSrc(seo["og-image"], "");
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
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    ...(favicon !== "/favicon.ico" ? { icons: { icon: favicon } } : {}),
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
