import { ABOUT_FIELDS } from "@/content/sections/about";
import { APPEARANCE_FIELDS } from "@/content/sections/appearance";
import { BROCHURE_FIELDS } from "@/content/sections/brochure";
import { CHAT_AGENT_FIELDS } from "@/content/sections/chatAgent";
import { CHAT_TEXT_AR_FIELDS, CHAT_TEXT_EN_FIELDS } from "@/content/sections/chatText";
import { CONTACT_FIELDS } from "@/content/sections/contact";
import { CONTACT_FORM_FIELDS } from "@/content/sections/contactForm";
import { COOKIES_FIELDS } from "@/content/sections/cookies";
import { FEATURES_FIELDS } from "@/content/sections/features";
import { FLOOR_PLANS_FIELDS } from "@/content/sections/floorPlans";
import { FOOTER_FIELDS } from "@/content/sections/footer";
import { GALLERY_FIELDS } from "@/content/sections/gallery";
import { HERO_FIELDS } from "@/content/sections/hero";
import { IMAGE_STRIPS_FIELDS } from "@/content/sections/imageStrips";
import { INTRO_FIELDS } from "@/content/sections/intro";
import { PRIVACY_FIELDS, TERMS_FIELDS } from "@/content/sections/legal";
import { LOCATION_FIELDS } from "@/content/sections/location";
import { NAVIGATION_FIELDS } from "@/content/sections/navigation";
import { PAYMENT_FIELDS } from "@/content/sections/payment";
import { ROBOTS_FIELDS } from "@/content/sections/robotsTxt";
import { SEO_FIELDS } from "@/content/sections/seo";

/*
 * Every editable section: its slug (the key the panel stores values under),
 * the label and group shown in the panel's sidebar, the minimum role that
 * may edit it, and its fields. The manifest pushed to the panel at boot
 * (src/lib/push-manifest.js) is built from this, so a section added here
 * appears in the panel on the next deploy.
 *
 * Do not rename a slug or a field key once content has been saved: values
 * are stored per slug and key, and a renamed one starts empty.
 */
export const SECTION_REGISTRY = {
  navigation: { label: "Menu & Header", group: "header", minRole: "EDITOR", fields: NAVIGATION_FIELDS },
  appearance: { label: "Logo & Favicon", group: "header", minRole: "ADMIN", fields: APPEARANCE_FIELDS },
  hero: { label: "Hero", group: "content", minRole: "EDITOR", fields: HERO_FIELDS },
  intro: { label: "Intro Statement", group: "content", minRole: "EDITOR", fields: INTRO_FIELDS },
  features: { label: "Project Features", group: "content", minRole: "EDITOR", fields: FEATURES_FIELDS },
  imageStrips: { label: "Image Rows", group: "content", minRole: "EDITOR", fields: IMAGE_STRIPS_FIELDS },
  gallery: { label: "Amenities", group: "content", minRole: "EDITOR", fields: GALLERY_FIELDS },
  floorPlans: { label: "Floor Plans", group: "content", minRole: "EDITOR", fields: FLOOR_PLANS_FIELDS },
  location: { label: "Location & Map", group: "content", minRole: "EDITOR", fields: LOCATION_FIELDS },
  payment: { label: "Payment Plan", group: "content", minRole: "EDITOR", fields: PAYMENT_FIELDS },
  brochure: { label: "Brochure", group: "content", minRole: "EDITOR", fields: BROCHURE_FIELDS },
  about: { label: "About The Developer", group: "content", minRole: "EDITOR", fields: ABOUT_FIELDS },
  contact: { label: "Contact", group: "content", minRole: "EDITOR", fields: CONTACT_FIELDS },
  contactForm: { label: "Contact Form", group: "content", minRole: "EDITOR", fields: CONTACT_FORM_FIELDS },
  footer: { label: "Footer", group: "content", minRole: "EDITOR", fields: FOOTER_FIELDS },
  cookies: { label: "Cookie Banner", group: "content", minRole: "EDITOR", fields: COOKIES_FIELDS },
  chatAgent: { label: "Chat Widget", group: "chat", minRole: "EDITOR", fields: CHAT_AGENT_FIELDS },
  chatTextEn: { label: "Chat Text (English)", group: "chat", minRole: "EDITOR", fields: CHAT_TEXT_EN_FIELDS },
  chatTextAr: { label: "Chat Text (Arabic)", group: "chat", minRole: "EDITOR", fields: CHAT_TEXT_AR_FIELDS },
  // ADMIN: legal copy has consequences closer to SEO than to a heading.
  privacy: {
    label: "Privacy Policy",
    group: "legal",
    minRole: "ADMIN",
    fields: PRIVACY_FIELDS,
    viewLiveHref: "/privacy",
    viewLiveLabel: "View live page",
  },
  terms: {
    label: "Terms & Conditions",
    group: "legal",
    minRole: "ADMIN",
    fields: TERMS_FIELDS,
    viewLiveHref: "/terms",
    viewLiveLabel: "View live page",
  },
  seo: { label: "SEO & Sharing", group: "seo", minRole: "ADMIN", fields: SEO_FIELDS },
  robots: {
    label: "robots.txt",
    group: "seo",
    minRole: "ADMIN",
    fields: ROBOTS_FIELDS,
    viewLiveHref: "/robots.txt",
    viewLiveLabel: "View robots.txt",
  },
  // Generated, not edited: no fields, so it is not sent in the manifest.
  sitemap: {
    label: "Sitemap",
    group: "seo",
    minRole: "ADMIN",
    fields: [],
    viewLiveHref: "/sitemap.xml",
    viewLiveLabel: "View sitemap.xml",
  },
};

// Sidebar groups, in display order.
export const SECTION_GROUPS = [
  { key: "header", label: "Header" },
  { key: "content", label: "Content" },
  { key: "chat", label: "Chat" },
  { key: "legal", label: "Legal" },
  { key: "seo", label: "SEO & Sharing" },
];

export function getSectionConfig(slug) {
  return SECTION_REGISTRY[slug] ?? null;
}

export function listSectionSlugs() {
  return Object.keys(SECTION_REGISTRY);
}
