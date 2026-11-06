import sanitizeHtml from "sanitize-html";

export { hasInlineMarkup, toPlainText } from "@/lib/inline-text";

/*
 * Inline HTML in TEXT fields, made safe to render.
 *
 * The admin panel sanitises every TEXT value on save with the same
 * allowlist as below; this is the second line of defence, run on the
 * server in getSectionContent (src/lib/content.js) before any value
 * reaches a component, so nothing unsafe can run on this public site even
 * if it reached the panel's database. Server-side only: the sanitiser
 * (and the CSS parser it brings) never ships to the browser. Components
 * render the result with <InlineText> (src/components/InlineText.js).
 *
 * The allowlist, matching the panel:
 * - b, strong, i, em, u, br;
 * - span, with a style holding only font-weight (100 to 900, bold, normal)
 *   and font-style (italic, normal);
 * - a, with href only http(s)://, mailto:, tel:, "/..." or "#...", and
 *   target only _blank or _self. A _blank link always gets
 *   rel="noopener noreferrer"; no other rel is kept.
 * Everything else is unwrapped, its text kept (script, style, textarea
 * and noscript contents are dropped). Tag and attribute names are matched
 * case-insensitively (the parser lowercases them); target and style
 * values are too.
 */
const SAFE_HREF = /^(?:https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i;
const TARGETS = new Set(["_blank", "_self"]);

function transformLink(tagName, attribs) {
  const out = {};

  const href = typeof attribs.href === "string" ? attribs.href.trim() : "";
  if (SAFE_HREF.test(href)) {
    out.href = href;
  }

  const target = typeof attribs.target === "string" ? attribs.target.trim().toLowerCase() : "";
  if (TARGETS.has(target)) {
    out.target = target;
    if (target === "_blank") {
      out.rel = "noopener noreferrer";
    }
  }

  return { tagName, attribs: out };
}

/*
 * The CSS filter matches property names case-sensitively, so
 * "FONT-WEIGHT: BOLD" would be dropped. Every allowed property and value
 * is lowercase, so lowercasing the whole style first loses nothing.
 */
function transformSpan(tagName, attribs) {
  return typeof attribs.style === "string"
    ? { tagName, attribs: { ...attribs, style: attribs.style.toLowerCase() } }
    : { tagName, attribs };
}

const OPTIONS = {
  allowedTags: ["b", "strong", "i", "em", "u", "br", "span", "a"],
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

export function sanitiseInline(value) {
  return typeof value === "string" ? sanitizeHtml(value, OPTIONS) : "";
}
