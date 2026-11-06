import { test } from "node:test";
import assert from "node:assert/strict";

import { sanitizeRichText } from "@/lib/sanitize-rich-text";

test("keeps bold, italic and safe links", () => {
  assert.equal(
    sanitizeRichText('An <b>exclusive</b> <em>invitation</em> <a href="https://all.accor.com" target="_blank">here</a>'),
    'An <b>exclusive</b> <em>invitation</em> <a href="https://all.accor.com" target="_blank" rel="noopener noreferrer">here</a>'
  );
});

test("removes scripts, event handlers, styles and javascript: links", () => {
  const out = sanitizeRichText(
    '<p onclick="x()" style="color:red">Hi<script>alert(1)</script></p><a href="javascript:alert(1)">x</a><img src=x onerror=alert(1)>'
  );
  assert.equal(out, "<p>Hi</p><a>x</a>");
});

test("keeps a span's font-weight and nothing else in its style", () => {
  assert.equal(
    sanitizeRichText('a <span style="font-weight: 800">part</span> b'),
    'a <span style="font-weight:800">part</span> b'
  );
  assert.equal(
    sanitizeRichText('<span style="font-weight:700; color:red" onclick="x()">x</span>'),
    '<span style="font-weight:700">x</span>'
  );
  assert.equal(
    sanitizeRichText('<span style="font-weight: expression(alert(1))">x</span>'),
    "<span>x</span>"
  );
});

test("non-strings become empty", () => {
  assert.equal(sanitizeRichText(undefined), "");
});

test("link target is case-insensitive, only _blank/_self, and _blank forces noopener noreferrer", () => {
  assert.equal(
    sanitizeRichText('<a href="https://x.com" TARGET="_BLANK" rel="opener">x</a>'),
    '<a href="https://x.com" target="_blank" rel="noopener noreferrer">x</a>'
  );
  assert.equal(
    sanitizeRichText('<a href="https://x.com" target="_Self">x</a>'),
    '<a href="https://x.com" target="_self">x</a>'
  );
  assert.equal(
    sanitizeRichText('<a href="https://x.com" target="_parent">x</a>'),
    '<a href="https://x.com">x</a>'
  );
});

test("protocol-relative and other unsafe hrefs are dropped; rel is forced only for _blank", () => {
  assert.equal(sanitizeRichText('<a href="//evil.example">x</a>'), "<a>x</a>");
  assert.equal(sanitizeRichText('<a href="data:text/html,x">x</a>'), "<a>x</a>");
  assert.equal(sanitizeRichText('<a href="/privacy">x</a>'), '<a href="/privacy">x</a>');
  assert.equal(sanitizeRichText('<a href="mailto:a@b.c" target=" _blank ">x</a>'), '<a href="mailto:a@b.c" target="_blank" rel="noopener noreferrer">x</a>');
  assert.equal(sanitizeRichText('<a href="https://x.com" rel="nofollow">x</a>'), '<a href="https://x.com" rel="nofollow">x</a>');
});

test("keeps headings and lists for legal pages, drops images and iframes", () => {
  assert.equal(
    sanitizeRichText("<h2>Data</h2><ul><li>One</li></ul><img src=x><iframe src=x></iframe>"),
    "<h2>Data</h2><ul><li>One</li></ul>",
  );
});
