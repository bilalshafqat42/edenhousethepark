/*
 * Inline markup in TEXT fields: the parts that are safe to run anywhere,
 * including in the browser. No dependencies, so a Client Component can
 * import this without shipping an HTML sanitiser to every visitor.
 *
 * Any TEXT field in the admin panel may hold simple formatting and links
 * (b, strong, i, em, u, br, span with a font-weight or font-style, a).
 * The panel sanitises TEXT values on save; this site sanitises them again,
 * on the server, in getSectionContent (src/lib/content.js, using
 * sanitiseInline from src/lib/inline-html.js). So by the time a value
 * reaches a component it is either plain text or sanitised inline HTML.
 *
 * - hasInlineMarkup: does the value contain a tag or an HTML entity? A
 *   plain value (the case for nearly all copy) is rendered exactly as
 *   before, as a plain string.
 * - toPlainText: the text of a value, for every place HTML cannot apply
 *   (alt, aria-label, title, meta tags, JSON-LD, anything split into
 *   words or letters for an animation). A value with no markup is
 *   returned unchanged, character for character.
 */

/*
 * A tag (<b>, </a>, <br/>) or an entity (&amp; &#39; &#x2019;). The panel's
 * sanitiser encodes a bare "&" as "&amp;", so an entity on its own counts:
 * it has to be rendered as HTML (or decoded) to show the right character.
 * A lone "<" or "&" followed by a space is ordinary text, not markup.
 */
const MARKUP = /<\/?[a-z][^>]*>|&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]*);/i;

export function hasInlineMarkup(value) {
  return typeof value === "string" && MARKUP.test(value);
}

/*
 * Named entities decoded by toPlainText. The site's sanitiser only ever
 * outputs &amp; &lt; &gt; &quot; (every other character is written out
 * as itself), so this list is generous; an unknown entity is left as
 * typed rather than guessed at.
 */
const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  copy: "©",
  reg: "®",
  trade: "™",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  bull: "•",
  middot: "·",
  deg: "°",
  times: "×",
  euro: "€",
  pound: "£",
};

function decodeCodePoint(codePoint, original) {
  if (!Number.isFinite(codePoint) || codePoint <= 0 || codePoint > 0x10ffff) {
    return original;
  }
  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return original;
  }
}

export function decodeEntities(text) {
  return text.replace(/&(#\d+|#x[\da-f]+|[a-z][a-z\d]*);/gi, (match, name) => {
    if (name[0] === "#") {
      const isHex = name[1] === "x" || name[1] === "X";
      return decodeCodePoint(Number.parseInt(name.slice(isHex ? 2 : 1), isHex ? 16 : 10), match);
    }
    return NAMED_ENTITIES[name.toLowerCase()] ?? match;
  });
}

/*
 * Tags removed (a <br> becomes a space, so two lines do not run together
 * in an alt text or a page title), then entities decoded. Anything that
 * is not a string with markup is returned as it came, so swapping
 * `value` for `toPlainText(value)` can never change a plain value, an
 * empty string, or an undefined one.
 */
export function toPlainText(value) {
  if (!hasInlineMarkup(value)) {
    return value;
  }
  return decodeEntities(value.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]*>/g, ""));
}

/*
 * A whole section's content with every string value made plain text, for
 * sections that are never shown as HTML at all (SEO: meta tags, Open
 * Graph, JSON-LD; Integrations: verification codes and tag IDs). Values
 * without markup, and anything that is not a string, are unchanged.
 */
export function plainTextValues(content) {
  const out = {};
  for (const [key, value] of Object.entries(content ?? {})) {
    out[key] = toPlainText(value);
  }
  return out;
}

/*
 * For text animated word by word (the hero heading, the Project Overview
 * sweep): splits sanitised inline HTML into words without breaking its
 * tags apart. Returns tokens in order:
 *   { type: "word", html }  one word as self-contained HTML, re-opening and
 *                           closing whatever formatting it sits inside, so
 *                           "<b>two words</b>" gives "<b>two</b>" and
 *                           "<b>words</b>" (a word part-formatted, like
 *                           "Mö<b>ven</b>pick", stays one word);
 *   { type: "space", text } the white space between words, as written;
 *   { type: "break" }       a <br>.
 * Only for values that hasInlineMarkup: a plain value keeps the
 * component's own split, so plain text renders exactly as before.
 */
const TAG = /^<(\/?)([a-z][a-z\d]*)\b[^>]*>$/i;
const VOID_TAGS = new Set(["br"]);

export function splitInlineWords(html) {
  const tokens = [];
  const open = []; // [{ name, tag }] currently open formatting tags
  let word = null;

  const closeWord = () => {
    if (word !== null) {
      tokens.push({
        type: "word",
        html: word + open.map(({ name }) => `</${name}>`).reverse().join(""),
      });
      word = null;
    }
  };

  for (const part of String(html ?? "").split(/(<[^>]*>)/)) {
    if (part === "") continue;

    const tag = part.match(TAG);
    if (tag) {
      const name = tag[2].toLowerCase();
      if (VOID_TAGS.has(name)) {
        closeWord();
        tokens.push({ type: "break" });
      } else if (tag[1]) {
        const index = open.findLastIndex((entry) => entry.name === name);
        if (index !== -1) {
          if (word !== null) word += part;
          open.splice(index, 1);
        }
      } else {
        if (word !== null) word += part;
        open.push({ name, tag: part });
      }
      continue;
    }

    for (const piece of part.split(/(\s+)/)) {
      if (piece === "") continue;
      if (/^\s+$/.test(piece)) {
        closeWord();
        tokens.push({ type: "space", text: piece });
      } else {
        if (word === null) word = open.map((entry) => entry.tag).join("");
        word += piece;
      }
    }
  }

  closeWord();
  return tokens;
}
