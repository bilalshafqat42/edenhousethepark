import "./globals.css";

// Brand fonts are declared by name in globals.css (@font-face). These are the
// faces the first screen needs (hero headline and figures in Ivy Presto
// Regular, hero text and buttons in Beausite Regular, nav in Beausite Light),
// so the browser fetches them before it reads the stylesheet.
const PRELOAD_FONTS = [
  "/webfonts/IvyPrestoDisplay-Regular.woff2",
  "/webfonts/BeausiteClassicWeb-Regular.woff2",
  "/webfonts/BeausiteClassicWeb-Light.woff2",
];

export const metadata = {
  title: "Eden House The Park by Refine | Low-Rise Living On The Canal",
  description:
    "Low-Rise Residences On The Dubai Water Canal, Developed By H&H",
};

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
