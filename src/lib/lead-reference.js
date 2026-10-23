import { randomBytes } from "node:crypto";

/*
 * The reference a visitor is shown and sales search for, e.g.
 * "EHP-LX3K9Q-7F2A9C". The time part keeps it roughly sortable; the random
 * part makes it unique under concurrent submissions.
 */
export function newLeadReference(now = Date.now()) {
  const time = now.toString(36).toUpperCase();
  const random = randomBytes(3).toString("hex").toUpperCase();
  return `EHP-${time}-${random}`;
}
