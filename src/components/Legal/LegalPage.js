import Image from "next/image";
import Link from "next/link";

import InlineText from "@/components/InlineText";
import { readSections } from "@/lib/page-content";
import { plainTextValues, toPlainText } from "@/lib/inline-text";
import { safeHref, safeImageSrc } from "@/lib/safe-url";
import { sanitizeRichText } from "@/lib/sanitize-rich-text";

/*
 * /privacy and /terms: the panel's RICHTEXT body (sanitised again here, on
 * the server) in the site's own type styles: the header bar and logo, the
 * h2 heading and body text of the About section, and the footer's base
 * line. Nothing here is new design; .legal-body in globals.css only gives
 * lists and headings inside the text their markers and spacing.
 */
// A same-page anchor from the panel ("#contact") points back at the home page here.
function homeHref(value) {
  const href = safeHref(value, "#contact");
  return href.startsWith("#") ? `/${href}` : href;
}

export async function legalMetadata(slug, path) {
  const { [slug]: raw } = await readSections([slug]);
  const content = plainTextValues(raw);
  return {
    title: `${content.title} | Eden House The Park`,
    description: content["meta-description"],
    alternates: { canonical: path },
  };
}

export default async function LegalPage({ slug }) {
  const c = await readSections([slug, "navigation", "appearance", "footer"]);
  const page = c[slug];
  const nav = c.navigation;

  return (
    <>
      <a href="#main" className="skip-link"><InlineText value={nav["skip-link-label"]} inLink /></a>
      <header className="header is-scrolled">
        <div className="container header__inner">
          <Link href="/" className="logo" aria-label={toPlainText(nav["logo-aria-label"] ?? "")}>
            <Image src={safeImageSrc(c.appearance["logo-header"], "/logo/eden-house-black.svg")} alt="" width={638} height={458} priority />
          </Link>
          <a href={homeHref(nav["cta-href"])} className="btn btn--fill">
            <InlineText value={nav["cta-label"]} inLink />
          </a>
        </div>
      </header>

      <main id="main" className="section about legal-main">
        <div className="container">
          <h1 className="h2"><InlineText value={page.title} /></h1>
          <div className="body about__body legal-body" dangerouslySetInnerHTML={{ __html: sanitizeRichText(page.body) }} />
        </div>
      </main>

      <footer className="footer bg-caffe">
        <div className="container">
          <div className="footer__base fine">
            <span><InlineText value={c.footer.copyright} /></span>
            <span>
              <a
                href={c.footer["privacy-href"] || "/privacy"}
                {...(/^https?:/i.test(c.footer["privacy-href"] || "") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <InlineText value={c.footer["privacy-label"]} inLink />
              </a> ·{" "}
              <Link href="/terms"><InlineText value={c.footer["terms-label"]} inLink /></Link>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
