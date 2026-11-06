import { BUDGET_BRACKETS, ROLES, SEARCH_STAGES, UNIT_TYPES } from "@/components/Chat/chatFlow";

/*
 * Server-side checks for the public lead endpoints (/api/eden-lead for the
 * contact form and the chat, /api/eden-lead-slot for the chat's callback
 * slots).
 *
 * The browser validates every form before it posts, so on the real site
 * none of this should fire. It exists for everything that is not the real
 * site: a script posting straight to the endpoint, a tampered request, or a
 * body big enough to be a problem on its own. Each of those would otherwise
 * be forwarded to the admin panel as if a visitor had sent it.
 *
 * No "server-only" and no Next imports, so the unit tests can run it under
 * plain Node. Error messages never quote the input: it is a visitor's name,
 * email and phone.
 */

// About four times the largest real submission. Anything above is not a form post.
export const MAX_LEAD_BODY_BYTES = 16 * 1024;

// The longest legitimate value is a landing-page URL full of UTM parameters.
const DEFAULT_MAX_LENGTH = 4096;

const FIELD_MAX_LENGTHS = {
  firstName: 100,
  first_name: 100,
  lastName: 100,
  last_name: 100,
  email: 254,
  phone: 32,
  company: 150,
  userType: 100,
  unitType: 100,
  intent: 100,
  search_stage: 100,
  unit_type: 100,
  budget_bracket: 100,
  language: 16,
  reference: 64,
  slotLabel: 80,
  project: 200,
  source: 200,
  form_source: 100,
  submittedAt: 64,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// E.164: a plus, then 7 to 15 digits. What every form on this site sends.
export const PHONE_PATTERN = /^\+[1-9][0-9]{6,14}$/;
const HAS_LETTER = /\p{L}/u;
const REFERENCE_PATTERN = /^EHP-[A-Z0-9]+-[A-F0-9]{6}$/;
// The panel's own rule for a submission id (refine-admin /api/leads/intake).
export const SUBMISSION_ID_PATTERN = /^[A-Za-z0-9._:-]{1,128}$/;

/*
 * The honeypot: a field hidden from people (and from screen readers) that
 * only a bot fills in. A request with it filled is answered as if accepted
 * and delivered nowhere.
 */
export const HONEYPOT_FIELD = "website";

const ids = (items) => new Set(items.map((item) => item.id));
const INTENTS = ids(ROLES);
const STAGES = ids(SEARCH_STAGES);
const UNITS = ids(UNIT_TYPES);
const BUDGETS = ids(BUDGET_BRACKETS);
const LANGUAGES = new Set(["en", "ar"]);

function invalid(status, message) {
  return { ok: false, status, message };
}

// Never throws on null, numbers or anything else a tampered body might hold.
const text = (value) => String(value ?? "").trim();

/*
 * The request's media type, without parameters, lowercased:
 * "Application/JSON; charset=utf-8" -> "application/json". Exact match only,
 * so "text/plain; x=application/json" or "application/json-patch+json" is
 * refused.
 */
export function mediaType(contentType) {
  return String(contentType ?? "").split(";")[0].trim().toLowerCase();
}

/*
 * Reads and parses the body with a hard size cap.
 *
 * Requiring application/json also means another site cannot post here from a
 * visitor's browser without a CORS preflight, which is never granted.
 * Content-Length is checked first as a cheap exit but never trusted on its
 * own (it can be absent or wrong); the real byte length is checked too.
 */
export async function readLeadBody(request) {
  if (mediaType(request.headers.get("content-type")) !== "application/json") {
    return invalid(415, "Invalid submission.");
  }

  const declaredLength = Number.parseInt(request.headers.get("content-length") ?? "", 10);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_LEAD_BODY_BYTES) {
    return invalid(413, "Submission too large.");
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    return invalid(400, "Invalid submission.");
  }

  if (Buffer.byteLength(raw, "utf8") > MAX_LEAD_BODY_BYTES) {
    return invalid(413, "Submission too large.");
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return invalid(400, "Invalid submission.");
  }

  // null, arrays, numbers and strings all parse as JSON; only an object is a submission.
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return invalid(400, "Invalid submission.");
  }

  return { ok: true, body };
}

export function isHoneypotFilled(body) {
  return text(body?.[HONEYPOT_FIELD]) !== "";
}

function validName(value) {
  const name = text(value);
  return name.length >= 1 && name.length <= 100 && HAS_LETTER.test(name);
}

function contactChecks(clean) {
  if (!validName(clean.firstName) || !validName(clean.lastName)) {
    return invalid(400, "Please check your name.");
  }
  if (!PHONE_PATTERN.test(text(clean.phone))) return invalid(400, "Please check your phone number.");
  const email = text(clean.email);
  if (!EMAIL_PATTERN.test(email)) return invalid(400, "Please check your email address.");
  if (!text(clean.userType) || !text(clean.unitType)) return invalid(400, "Invalid submission.");
  // The form will not submit without it; under UAE PDPL it is the lawful basis.
  if (clean.consent !== true) return invalid(400, "Please confirm you agree to be contacted.");
  return null;
}

function chatChecks(clean) {
  if (clean.consent !== true) return invalid(400, "Please confirm you agree to be contacted.");
  if (!INTENTS.has(clean.intent)) return invalid(400, "Invalid submission.");
  if (!STAGES.has(clean.search_stage)) return invalid(400, "Invalid submission.");
  if (!UNITS.has(clean.unit_type)) return invalid(400, "Invalid submission.");
  if (!BUDGETS.has(clean.budget_bracket)) return invalid(400, "Invalid submission.");
  if (!LANGUAGES.has(clean.language)) return invalid(400, "Invalid submission.");
  const first = text(clean.first_name);
  const last = text(clean.last_name);
  if (first.length < 2 || last.length < 2 || !validName(first) || !validName(last)) {
    return invalid(400, "Please check your name.");
  }
  if (!PHONE_PATTERN.test(text(clean.phone))) return invalid(400, "Please check your phone number.");
  if (!EMAIL_PATTERN.test(text(clean.email))) return invalid(400, "Please check your email address.");
  if (clean.intent === "broker") {
    const company = text(clean.company);
    if (company.length < 2) return invalid(400, "Please check your company name.");
  }
  return null;
}

function slotChecks(clean) {
  if (!REFERENCE_PATTERN.test(text(clean.reference))) return invalid(400, "Invalid slot booking.");
  if (!text(clean.slotLabel)) return invalid(400, "Invalid slot booking.");
  if (!LANGUAGES.has(clean.language)) return invalid(400, "Invalid slot booking.");
  return null;
}

const CHECKS = { contact: contactChecks, chat: chatChecks, slot: slotChecks };

/*
 * Which form sent a /api/eden-lead body: the contact form marks itself with
 * form_source "contact-form"; anything else is the chat.
 */
export function leadKind(body) {
  return body?.form_source === "contact-form" ? "contact" : "chat";
}

/*
 * Validates a parsed body and returns { ok, body, submissionId } with a
 * cleaned copy: strings trimmed, every key kept (unknown keys are passed
 * through so a new tracking field cannot break submissions), values flat
 * (string, finite number, boolean or null). The honeypot field and the
 * submission id are taken out of the body.
 */
export function validateLeadRequest(kind, body) {
  if (body === null || typeof body !== "object" || Array.isArray(body) || !CHECKS[kind]) {
    return invalid(400, "Invalid submission.");
  }

  const clean = {};
  for (const key of Object.keys(body)) {
    if (key === HONEYPOT_FIELD || key === "submissionId") continue;
    const value = body[key];

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > (FIELD_MAX_LENGTHS[key] ?? DEFAULT_MAX_LENGTH)) {
        return invalid(400, "Invalid submission.");
      }
      clean[key] = trimmed;
    } else if (value === null || typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) {
      clean[key] = value;
    } else {
      return invalid(400, "Invalid submission.");
    }
  }

  let submissionId = null;
  if (body.submissionId !== undefined && body.submissionId !== null) {
    submissionId = text(body.submissionId);
    if (!SUBMISSION_ID_PATTERN.test(submissionId)) return invalid(400, "Invalid submission.");
  }

  const failure = CHECKS[kind](clean);
  if (failure) return failure;

  return { ok: true, body: clean, submissionId };
}

/*
 * A value a spreadsheet would run as a formula (one starting with = + - @,
 * a tab or a carriage return) gets a leading apostrophe, so a lead exported
 * from the panel or Zapier into Excel stays plain text. The one exception is
 * a value that is wholly a phone number in the form's own format
 * ("+971501234567"): it is not a formula, and a quote would corrupt it in
 * the CRM. "+971 50" or "+1+cmd" are not exempt.
 */
const FORMULA_START = /^[=+\-@\t\r]/;

export function neutraliseFormula(value) {
  if (typeof value !== "string" || !FORMULA_START.test(value) || PHONE_PATTERN.test(value)) {
    return value;
  }
  return `'${value}`;
}

export function neutraliseFormulas(body) {
  return Object.fromEntries(Object.entries(body).map(([key, value]) => [key, neutraliseFormula(value)]));
}
