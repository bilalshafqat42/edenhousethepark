import { toPlainText } from "@/lib/inline-text";
import { realValue } from "@/lib/placeholder";
import { lngLat, safeHref, safeImageSrc, wholeNumber } from "@/lib/safe-url";

/*
 * JSON-LD for the home page: the developer (Organization) and the project
 * (ApartmentComplex), built only from what the page already shows, read
 * from the same panel sections. A blank or placeholder value ("[number]",
 * "TO CONFIRM") is left out rather than published, so nothing here is
 * invented: an address, a map point or a logo appears once it is filled in.
 *
 * Pure, no dependencies beyond the site's own helpers, so it is unit tested.
 */
const text = (value) => realValue(toPlainText(String(value ?? "")));
const list = (value) => (Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : []);

function absolute(src, siteUrl) {
  if (!src) return "";
  try {
    return new URL(src, `${siteUrl}/`).href;
  } catch {
    return "";
  }
}

// Drops keys whose value is empty, so no property is ever published blank.
function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== "" && value !== null && value !== undefined),
  );
}

export function buildStructuredData({ siteUrl, seo = {}, hero = {}, intro = {}, about = {}, contact = {}, footer = {}, location = {} }) {
  const graph = [];

  // The developer: the footer partner whose role is "Development By"
  const developerPartner = list(footer.partners).find((p) => /develop/i.test(toPlainText(String(p.label ?? ""))));
  const developerName = text(developerPartner?.name);
  const developerLogo = absolute(safeImageSrc(about.logo, "") || safeImageSrc(developerPartner?.logo, ""), siteUrl);
  const developerId = `${siteUrl}/#developer`;
  if (developerName) {
    graph.push(compact({ "@type": "Organization", "@id": developerId, name: developerName, logo: developerLogo }));
  }

  // The project
  const name = text(location["project-name"]);
  if (name) {
    const residences = list(intro.stats).find((s) => /^residences?$/i.test(text(s.label)));
    const units = wholeNumber(residences?.count);
    const coords = lngLat(location["project-longitude"], location["project-latitude"]);
    const address = text(footer.address);
    const phone = list(contact.details)
      .map((d) => safeHref(d.href, ""))
      .find((href) => /^tel:\+\d{6,15}$/.test(href));
    graph.push(
      compact({
        "@type": "ApartmentComplex",
        "@id": `${siteUrl}/#project`,
        name,
        url: `${siteUrl}/`,
        description: text(seo["meta-description"]),
        image: absolute(safeImageSrc(hero.image, ""), siteUrl),
        address: address ? { "@type": "PostalAddress", streetAddress: address } : "",
        geo: coords ? { "@type": "GeoCoordinates", latitude: coords[1], longitude: coords[0] } : "",
        numberOfAccommodationUnits: units ? { "@type": "QuantitativeValue", value: units } : "",
        telephone: phone ? phone.slice(4) : "",
      }),
    );
  }

  if (graph.length === 0) return null;
  return { "@context": "https://schema.org", "@graph": graph };
}

// Safe inside <script type="application/ld+json">: no "<" can close the tag.
export function jsonLdScript(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
