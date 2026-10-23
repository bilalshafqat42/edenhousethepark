import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Brand fonts. When the licensed font files arrive, swap these for
// next/font/local (see public/fonts/README.md) and keep the same variable names.
const display = Bodoni_Moda({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Eden House The Park by Refine | Low-Rise Living On The Canal",
  description:
    "Low-Rise Residences On The Dubai Water Canal, Developed By H&H",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
