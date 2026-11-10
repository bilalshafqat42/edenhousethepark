/*
 * Fills {name} placeholders in a panel label, e.g. "{n} of {total}" with
 * { n: 2, total: 5 } gives "2 of 5". Unknown placeholders are left as they
 * are, so a typo shows up on the page instead of vanishing. Plain text in,
 * plain text out: used only for captions and screen-reader labels.
 */
export function fillTokens(template, values = {}) {
  return String(template ?? "").replace(/\{([a-zA-Z]+)\}/g, (match, name) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match,
  );
}
