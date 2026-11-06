import { createElement } from "react";

import { hasInlineMarkup } from "@/lib/inline-text";

/*
 * Renders a TEXT field from the admin panel, which may hold simple inline
 * formatting and links (see src/lib/inline-html.js for the allowlist).
 *
 * Plain text, the case for nearly all copy, is returned as the string
 * itself: no wrapper element, so it renders exactly as `{value}` did
 * before, with no change to layout, styling or animations. Only a value
 * that actually contains markup is rendered as HTML, inside a span with no
 * class that inherits everything from its parent and stays inline.
 *
 * Safe to render as HTML because every TEXT value is sanitised on the
 * server (getSectionContent in src/lib/content.js runs sanitiseInline on
 * each one) before it reaches a component. Doing it there rather than
 * here keeps the sanitiser out of the browser bundle, since most sections
 * are Client Components. Pass only values that came from getSectionContent.
 *
 * Usable from Server and Client Components alike (no hooks, no "use
 * client" needed). Written with createElement rather than JSX so the unit
 * tests can import it under plain Node.
 */
const INHERIT = {
  display: "inline",
  font: "inherit",
  color: "inherit",
  letterSpacing: "inherit",
  textTransform: "inherit",
};

/*
 * `inLink`: the text sits inside a link or a button (a button label, a
 * menu item). A link inside a link is invalid HTML (the browser closes
 * the outer one early, breaking the layout), so any <a> in the value is
 * unwrapped, its text kept; the bold, italic and so on still apply.
 */
const LINK_TAG = /<\/?a\b[^>]*>/gi;

export default function InlineText({ value, inLink = false }) {
  if (!hasInlineMarkup(value)) {
    return value;
  }
  const html = inLink ? value.replace(LINK_TAG, "") : value;
  return createElement("span", { style: INHERIT, dangerouslySetInnerHTML: { __html: html } });
}
