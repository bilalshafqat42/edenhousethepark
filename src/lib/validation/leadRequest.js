import "server-only";

import { BUDGET_BRACKETS, ROLES, SEARCH_STAGES, UNIT_TYPES } from "@/components/Chat/chatFlow";

/*
 * Server-side checks for the chat's lead and slot requests. The chat
 * validates before it posts, so these only ever refuse requests that did
 * not come from the real page.
 */

const MAX_BODY_BYTES = 16 * 1024;
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const COMPANY_MAX = 150;

const ids = (items) => new Set(items.map((item) => item.id));
const INTENTS = ids(ROLES);
const STAGES = ids(SEARCH_STAGES);
const UNITS = ids(UNIT_TYPES);
const BUDGETS = ids(BUDGET_BRACKETS);
const LANGUAGES = new Set(["en", "ar"]);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+[1-9]\d{6,14}$/; // E.164: + then up to 15 digits
const HAS_LETTER = /\p{L}/u;
const REFERENCE = /^EHP-[A-Z0-9]+-[A-F0-9]{6}$/;

const fail = (message) => ({ ok: false, status: 400, message });
const text = (value) => (typeof value === "string" ? value.trim() : "");

/* Reads the body as JSON, refusing anything that is not JSON or too large. */
export async function readJsonBody(request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return { ok: false, status: 415, message: "Invalid submission." };
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return { ok: false, status: 413, message: "Invalid submission." };
  }
  try {
    const body = JSON.parse(raw);
    return body && typeof body === "object" && !Array.isArray(body)
      ? { ok: true, body }
      : fail("Invalid submission.");
  } catch {
    return fail("Invalid submission.");
  }
}

function validName(value) {
  const name = text(value);
  return name.length >= 2 && name.length <= NAME_MAX && HAS_LETTER.test(name);
}

export function validateLead(body) {
  if (body.consent !== true) return fail("Please confirm you agree to be contacted.");
  if (!INTENTS.has(body.intent)) return fail("Invalid submission.");
  if (!STAGES.has(body.search_stage)) return fail("Invalid submission.");
  if (!UNITS.has(body.unit_type)) return fail("Invalid submission.");
  if (!BUDGETS.has(body.budget_bracket)) return fail("Invalid submission.");
  if (!LANGUAGES.has(body.language)) return fail("Invalid submission.");
  if (!validName(body.first_name) || !validName(body.last_name)) return fail("Please check your name.");
  if (!PHONE.test(text(body.phone).replace(/[\s-]/g, ""))) return fail("Please check your phone number.");
  const email = text(body.email);
  if (!EMAIL.test(email) || email.length > EMAIL_MAX) return fail("Please check your email address.");
  if (body.intent === "broker") {
    const company = text(body.company);
    if (company.length < 2 || company.length > COMPANY_MAX) return fail("Please check your company name.");
  }
  return { ok: true };
}

export function validateSlot(body) {
  if (!REFERENCE.test(text(body.reference))) return fail("Invalid slot booking.");
  const slot = text(body.slotLabel);
  if (!slot || slot.length > 80) return fail("Invalid slot booking.");
  if (!LANGUAGES.has(body.language)) return fail("Invalid slot booking.");
  return { ok: true };
}

/*
 * A value starting with = + - @ (or a tab or carriage return) is run as a
 * formula when a lead export is opened in Excel or Google Sheets. Prefixing
 * a quote makes it plain text. Applied to every string before a lead is
 * stored or forwarded. A plain "+digits" value (a phone number) is left
 * alone: it is not a formula, and a quote would corrupt it in the CRM.
 */
const FORMULA_START = /^[=+\-@\t\r]/;
const PLAIN_NUMBER = /^\+\d+$/;

export function neutraliseFormulas(body) {
  return Object.fromEntries(
    Object.entries(body).map(([key, value]) => [
      key,
      typeof value === "string" && FORMULA_START.test(value) && !PLAIN_NUMBER.test(value)
        ? `'${value}`
        : value,
    ]),
  );
}
