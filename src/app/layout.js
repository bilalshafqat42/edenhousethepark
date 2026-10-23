import localFont from "next/font/local";
import "./globals.css";

// Eden House brand fonts (identity guidelines, pp. 26-31).
// Display: Ivy Presto Display, Light for headlines and pull quotes.
const display = localFont({
  src: [
    { path: "../fonts/IvyPrestoDisplay-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/IvyPrestoDisplay-Regular.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  // No generated Arial/Times fallback face: it has Arabic letters and
  // would win over The Sans Arabic in the chat's Arabic mode.
  adjustFontFallback: false,
});

// Text: Beausite Classic, Light for body copy and titles.
const sans = localFont({
  src: [
    { path: "../fonts/BeausiteClassicWeb-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/BeausiteClassicWeb-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/BeausiteClassicWeb-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
  // No generated Arial/Times fallback face: it has Arabic letters and
  // would win over The Sans Arabic in the chat's Arabic mode.
  adjustFontFallback: false,
});

// Arabic text: The Sans Arabic, Semi Light for body copy. Only used by the
// chat's Arabic mode, so it is not preloaded.
const arabic = localFont({
  src: [
    { path: "../fonts/TheSansArabic-SemiLight.woff2", weight: "300", style: "normal" },
    { path: "../fonts/TheSansArabic-Plain.woff2", weight: "400", style: "normal" },
    { path: "../fonts/TheSansArabic-SemiBold.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

export const metadata = {
  title: "Eden House The Park by Refine | Low-Rise Living On The Canal",
  description:
    "Low-Rise Residences On The Dubai Water Canal, Developed By H&H",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${arabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
