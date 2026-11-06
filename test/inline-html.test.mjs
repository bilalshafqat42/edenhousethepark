import { test } from "node:test";
import assert from "node:assert/strict";

import { sanitiseInline, hasInlineMarkup, toPlainText } from "@/lib/inline-html";
import { splitInlineWords } from "@/lib/inline-text";
import InlineText from "@/components/InlineText";

test("keeps the inline allowlist", () => {
  assert.equal(
    sanitiseInline('<b>a</b> <strong>b</strong> <i>c</i> <em>d</em> <u>e</u><br>f'),
    "<b>a</b> <strong>b</strong> <i>c</i> <em>d</em> <u>e</u><br />f",
  );
});

test("removes javascript: and data: links but keeps the text", () => {
  assert.equal(sanitiseInline('<a href="javascript:alert(1)">x</a>'), "<a>x</a>");
  assert.equal(sanitiseInline('<a href="JaVaScRiPt:alert(1)">x</a>'), "<a>x</a>");
  assert.equal(sanitiseInline('<a href=" javascript:alert(1)">x</a>'), "<a>x</a>");
  assert.equal(sanitiseInline('<a href="data:text/html,<script>alert(1)</script>">x</a>'), "<a>x</a>");
  assert.equal(sanitiseInline('<a href="//evil.example">x</a>'), "<a>x</a>");
  assert.equal(sanitiseInline('<a href="page.html">x</a>'), "<a>x</a>");
});

test("keeps http(s), mailto, tel, /path and #anchor links", () => {
  for (const href of ["https://all.accor.com", "http://example.com", "mailto:a@b.co", "tel:+97140000000", "/privacy", "#contact"]) {
    assert.equal(sanitiseInline(`<a href="${href}">x</a>`), `<a href="${href}">x</a>`);
  }
});

test("target is case-insensitive, only _blank/_self, and _blank always gets noopener noreferrer", () => {
  assert.equal(
    sanitiseInline('<A HREF="https://x.com" TARGET="_BLANK">x</A>'),
    '<a href="https://x.com" target="_blank" rel="noopener noreferrer">x</a>',
  );
  assert.equal(
    sanitiseInline('<a href="https://x.com" target="_blank" rel="opener">x</a>'),
    '<a href="https://x.com" target="_blank" rel="noopener noreferrer">x</a>',
  );
  assert.equal(sanitiseInline('<a href="/p" target="_Self">x</a>'), '<a href="/p" target="_self">x</a>');
  assert.equal(sanitiseInline('<a href="/p" target="_top" rel="x">x</a>'), '<a href="/p">x</a>');
});

test("span keeps only font-weight and font-style, case-insensitively", () => {
  assert.equal(
    sanitiseInline('<span style="FONT-WEIGHT: 800; font-style: Italic; color: red">x</span>'),
    '<span style="font-weight:800;font-style:italic">x</span>',
  );
  assert.equal(sanitiseInline('<span style="font-weight: bold">x</span>'), '<span style="font-weight:bold">x</span>');
  assert.equal(sanitiseInline('<span style="font-weight: 950">x</span>'), "<span>x</span>");
  assert.equal(sanitiseInline('<span style="font-weight: expression(alert(1))">x</span>'), "<span>x</span>");
  assert.equal(sanitiseInline('<span style="background:url(javascript:alert(1))">x</span>'), "<span>x</span>");
});

test("drops event handlers and unwraps every other tag, keeping its text", () => {
  assert.equal(sanitiseInline('<b onclick="x()">a</b>'), "<b>a</b>");
  assert.equal(sanitiseInline('<span onmouseover="x()" class="c" id="i">a</span>'), "<span>a</span>");
  assert.equal(
    sanitiseInline('<p><div>Hello <b><i onclick="x"><u>there</u></i></b></div></p><img src=x onerror=alert(1)>'),
    "Hello <b><i><u>there</u></i></b>",
  );
  assert.equal(sanitiseInline("A<script>alert(1)</script>B<style>b{}</style>C"), "ABC");
  assert.equal(sanitiseInline('<h1>Big</h1><a href="/x"><b>bold link</b></a>'), 'Big<a href="/x"><b>bold link</b></a>');
});

test("encodes a bare ampersand and non-strings become empty", () => {
  assert.equal(sanitiseInline("Terms & Conditions"), "Terms &amp; Conditions");
  assert.equal(sanitiseInline(undefined), "");
  assert.equal(sanitiseInline(42), "");
});

test("hasInlineMarkup spots tags and entities, not ordinary text", () => {
  assert.equal(hasInlineMarkup("<b>x</b>"), true);
  assert.equal(hasInlineMarkup("a<br/>b"), true);
  assert.equal(hasInlineMarkup("Terms &amp; Conditions"), true);
  assert.equal(hasInlineMarkup("&#39;quoted&#x27;"), true);
  assert.equal(hasInlineMarkup("Terms & Conditions"), false);
  assert.equal(hasInlineMarkup("Price < 2M and > 1M"), false);
  assert.equal(hasInlineMarkup("The Art of  Coming Home"), false);
  assert.equal(hasInlineMarkup(undefined), false);
  assert.equal(hasInlineMarkup(5), false);
});

test("toPlainText strips tags and decodes entities", () => {
  assert.equal(toPlainText("Terms &amp; Conditions"), "Terms & Conditions");
  assert.equal(toPlainText("1 &lt; 2 &gt; 0 &quot;q&quot; &#39;s&#x2019;"), "1 < 2 > 0 \"q\" 's’");
  assert.equal(toPlainText('<b>Bold</b> and <a href="/x" target="_blank">link</a>'), "Bold and link");
  assert.equal(toPlainText("Line one<br />line two"), "Line one line two");
  assert.equal(toPlainText("&nbsp;&copy;&unknown;"), " ©&unknown;");
  assert.equal(toPlainText(sanitiseInline("A & B <i>c</i>")), "A & B c");
});

test("toPlainText returns plain values unchanged, character for character", () => {
  for (const value of ["", "  spaced  ", "Terms & Conditions", "Price < 2M", "MÖVENPICK RESIDENCES", "a\nb"]) {
    assert.equal(toPlainText(value), value);
  }
  assert.equal(toPlainText(undefined), undefined);
  assert.equal(toPlainText(null), null);
});

test("InlineText returns a plain string as the string itself", () => {
  for (const value of ["The Art of  Coming Home", "Terms & Conditions", "", "  x  "]) {
    assert.equal(InlineText({ value }), value);
    assert.equal(InlineText({ value, inLink: true }), value);
  }
  assert.equal(InlineText({ value: undefined }), undefined);
});

test("InlineText renders markup as an unstyled inline span", () => {
  const element = InlineText({ value: "<b>Bold</b> text" });
  assert.equal(element.type, "span");
  assert.equal(element.props.className, undefined);
  assert.equal(element.props.style.display, "inline");
  assert.equal(element.props.dangerouslySetInnerHTML.__html, "<b>Bold</b> text");
});

test("InlineText unwraps links inside a link or button (inLink)", () => {
  const element = InlineText({
    value: '<b>Call</b> <a href="tel:+971" target="_blank" rel="noopener noreferrer">now</a>',
    inLink: true,
  });
  assert.equal(element.props.dangerouslySetInnerHTML.__html, "<b>Call</b> now");
});

test("splitInlineWords keeps tags whole and spacing as written", () => {
  assert.deepEqual(splitInlineWords("The <b>Art of</b>  Mö<i>ven</i>pick<br />x"), [
    { type: "word", html: "The" },
    { type: "space", text: " " },
    { type: "word", html: "<b>Art</b>" },
    { type: "space", text: " " },
    { type: "word", html: "<b>of</b>" },
    { type: "space", text: "  " },
    { type: "word", html: "Mö<i>ven</i>pick" },
    { type: "break" },
    { type: "word", html: "x" },
  ]);
});
