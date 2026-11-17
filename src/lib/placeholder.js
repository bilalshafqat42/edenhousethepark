/*
 * Holding text that must never reach a visitor or a search engine: a
 * bracketed gap ("[number]") or a note to the team ("TO CONFIRM", "TBC").
 * Used to hide a value as if it were blank.
 *
 * Pure, no dependencies.
 */
const PLACEHOLDER = /\[[^\]]*\]|\bTO CONFIRM\b|\bTBC\b|\bTBA\b|\bTODO\b|lorem ipsum/i;

export function isPlaceholder(value) {
  return PLACEHOLDER.test(String(value ?? ""));
}

// The trimmed value, or "" when it is blank or a placeholder.
export function realValue(value) {
  const text = String(value ?? "").trim();
  return text && !isPlaceholder(text) ? text : "";
}
