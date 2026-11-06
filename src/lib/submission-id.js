/*
 * A random id for one form submission, made in the browser and sent with
 * every retry of it, so the admin panel stores the lead once however many
 * times it arrives (refine-admin /api/leads/intake: 1 to 128 of
 * A-Z a-z 0-9 . _ : -).
 *
 * crypto.randomUUID needs a secure context; getRandomValues does not.
 */
export function newSubmissionId(prefix = "ehp") {
  const c = globalThis.crypto;
  if (c?.randomUUID) return `${prefix}-${c.randomUUID()}`;
  const bytes = new Uint8Array(16);
  if (c?.getRandomValues) {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return `${prefix}-${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}
