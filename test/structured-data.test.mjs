import { test } from "node:test";
import assert from "node:assert/strict";

import { SECTION_REGISTRY } from "@/content/sections";
import { buildDefaultsFromFields } from "@/lib/section-defaults";
import { buildStructuredData, jsonLdScript } from "@/lib/structured-data";

const SITE = "https://edenhousethepark.example.invalid";
const defaults = (slug) => buildDefaultsFromFields(SECTION_REGISTRY[slug].fields);
const sections = () => ({
  siteUrl: SITE,
  seo: defaults("seo"),
  hero: defaults("hero"),
  intro: defaults("intro"),
  about: defaults("about"),
  contact: defaults("contact"),
  footer: defaults("footer"),
  location: defaults("location"),
});

test("today's content gives the developer and the project, with no blank or invented property", () => {
  const data = buildStructuredData(sections());
  assert.equal(data["@context"], "https://schema.org");
  const [org, project] = data["@graph"];
  assert.deepEqual(org, { "@type": "Organization", "@id": `${SITE}/#developer`, name: "H&H" });
  assert.equal(project["@type"], "ApartmentComplex");
  assert.equal(project.name, "Eden House The Park");
  assert.equal(project.url, `${SITE}/`);
  assert.equal(project.image, `${SITE}/images/renders/hero-aerial-canal.jpg`);
  assert.deepEqual(project.numberOfAccommodationUnits, { "@type": "QuantitativeValue", value: 459 });
  assert.equal(project.telephone, "+97144230167");
  // Not supplied yet, so not published
  assert.equal(project.address, undefined);
  assert.equal(project.geo, undefined);
  for (const value of Object.values(project)) assert.notEqual(value, "");
});

test("address, map point and logo appear once filled in; placeholders never do", () => {
  const s = sections();
  s.footer = { ...s.footer, address: "Al Safa, Dubai" };
  s.location = { ...s.location, "project-latitude": "25.18", "project-longitude": "55.24" };
  s.about = { ...s.about, logo: "/logo/hh.svg" };
  let [org, project] = buildStructuredData(s)["@graph"];
  assert.deepEqual(project.address, { "@type": "PostalAddress", streetAddress: "Al Safa, Dubai" });
  assert.deepEqual(project.geo, { "@type": "GeoCoordinates", latitude: 25.18, longitude: 55.24 });
  assert.equal(org.logo, `${SITE}/logo/hh.svg`);

  s.footer = { ...s.footer, address: "[address]" };
  s.seo = { ...s.seo, "meta-description": "TO CONFIRM" };
  [, project] = buildStructuredData(s)["@graph"];
  assert.equal(project.address, undefined);
  assert.equal(project.description, undefined);
});

test("nothing to describe gives no script at all", () => {
  assert.equal(buildStructuredData({ siteUrl: SITE }), null);
});

test("the script text cannot close its own tag", () => {
  assert.equal(jsonLdScript({ name: "</script><b>" }).includes("<"), false);
});
