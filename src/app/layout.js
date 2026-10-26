import "./globals.css";

// Brand fonts are declared by name in globals.css (@font-face). These are the
// faces every visitor needs straight away, so the browser fetches them first.
const PRELOAD_FONTS = [
  "/webfonts/IvyPrestoDisplay-Light.woff2",
  "/webfonts/BeausiteClassicWeb-Light.woff2",
  "/webfonts/BeausiteClassicWeb-Regular.woff2",
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
