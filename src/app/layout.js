import localFont from "next/font/local";
import "./globals.css";

// Eden House brand fonts (identity guidelines, pp. 26-31). next/font names each
// @font-face family after its variable, so the variables carry the brand names
// and DevTools shows those rather than generic ones.
// Display: Ivy Presto Display, Light for headlines and pull quotes.
const IvyPrestoDisplay = localFont({
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
const BeausiteClassic = localFont({
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
const TheSansArabic = localFont({
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
    <html lang="en" className={`${IvyPrestoDisplay.variable} ${BeausiteClassic.variable} ${TheSansArabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
