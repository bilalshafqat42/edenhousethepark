import sanitizeHtml from "sanitize-html";

/*
 * Rich text from the admin panel (the Privacy and Terms bodies), made safe
 * to render as HTML.
 *
 * The panel sanitises RICHTEXT on every save with the same allowlist; this
 * is the second line of defence, so nothing unsafe can run on this public
 * site even if it reached the panel's database. An allowlist: paragraphs,
 * headings, bold, italic, underline, lists, quotes and links. Anything else
 * is unwrapped (its text kept); script, style, textarea and noscript
 * contents are dropped.
 *
 * Links:
 * - href only http(s)://, mailto:, tel:, a site path ("/privacy") or an
 *   anchor ("#contact"); anything else (javascript:, data:,
 *   protocol-relative "//host") loses its href.
 * - target is matched case-insensitively and only _blank or _self is kept,
 *   lowercased ("_BLANK" is a new tab in every browser).
 * - a _blank link always gets rel="noopener noreferrer", whatever rel it
 *   came with, so the opened page cannot reach back through window.opener.
 *
 * One inline style, on <span> only: font-weight (100 to 900, bold, normal)
 * and font-style (italic, normal).
 *
 * Server-side only: called in Server Components, so the sanitiser never
 * ships to the browser.
 */
const SAFE_HREF = /^(?:https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;
const LINK_TARGETS = new Set(["_blank", "_self"]);

function transformLink(tagName, attribs) {
  const out = {};

  const href = typeof attribs.href === "string" ? attribs.href.trim() : "";
  if (SAFE_HREF.test(href)) {
    out.href = href;
  }

  const target = typeof attribs.target === "string" ? attribs.target.trim().toLowerCase() : "";
  if (LINK_TARGETS.has(target)) {
    out.target = target;
  }

  if (target === "_blank") {
    out.rel = "noopener noreferrer";
  } else if (typeof attribs.rel === "string" && attribs.rel.trim()) {
    out.rel = attribs.rel.trim();
  }

  return { tagName, attribs: out };
}

function transformSpan(tagName, attribs) {
  return typeof attribs.style === "string"
    ? { tagName, attribs: { ...attribs, style: attribs.style.toLowerCase() } }
    : { tagName, attribs };
}

const OPTIONS = {
  allowedTags: [
    "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a",
    "blockquote", "span", "h2", "h3", "h4",
  ],
  allowedAttributes: { a: ["href", "target", "rel"], span: ["style"] },
  allowedStyles: {
    span: {
      "font-weight": [/^(?:[1-9]00|bold|normal)$/],
      "font-style": [/^(?:italic|normal)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesAppliedToAttributes: ["href"],
  allowProtocolRelative: false,
  transformTags: { a: transformLink, span: transformSpan },
  nonTextTags: ["script", "style", "textarea", "noscript"],
};

export function sanitizeRichText(html) {
  return typeof html === "string" ? sanitizeHtml(html, OPTIONS) : "";
}
