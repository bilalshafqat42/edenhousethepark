import Link from "next/link";

import InlineText from "@/components/InlineText";
import { SubPageFrame } from "@/components/Legal/LegalPage";
import { readSections } from "@/lib/page-content";
import { plainTextValues } from "@/lib/inline-text";

// Branded 404 for any address that does not exist. Next adds noindex itself.
export async function generateMetadata() {
  const { notFound } = await readSections(["notFound"]);
  return { title: `${plainTextValues(notFound).title} | Eden House The Park` };
}

export default async function NotFound() {
  const { notFound: page } = await readSections(["notFound"]);

  return (
    <SubPageFrame>
      <main id="main" className="section about legal-main">
        <div className="container">
          <h1 className="h2"><InlineText value={page.title} /></h1>
          <p className="lead legal-body"><InlineText value={page.body} /></p>
          <div className="not-found__actions">
            <Link href="/" className="btn btn--line"><InlineText value={page["home-label"]} inLink /></Link>
          </div>
        </div>
      </main>
    </SubPageFrame>
  );
}
