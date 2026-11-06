import { test } from "node:test";
import assert from "node:assert/strict";

import {
  MAX_LEAD_BODY_BYTES,
  isHoneypotFilled,
  leadKind,
  mediaType,
  neutraliseFormula,
  neutraliseFormulas,
  readLeadBody,
  validateLeadRequest,
} from "@/lib/validation/leadRequest";

/*
 * The server-side lead checks must never reject a real submission. Each
 * payload mirrors exactly what one form posts (ContactForm.js and Chat.js).
 * Example data only: no real person.
 */
const CONTACT = {
  form_source: "contact-form",
  submissionId: "ehp-contact-0b1c2d3e-4f50-4a6b-8c7d-9e0f1a2b3c4d",
  firstName: "Aisha",
  lastName: "Example",
  userType: "Buyer",
  unitType: "2 Bedroom",
  phone: "+971500000000",
  email: "aisha@example.invalid",
  consent: true,
  website: "",
  pageUrl: "https://edenhousethepark.example.invalid/?utm_source=google",
  submittedAt: "2026-11-06T08:00:00.000Z",
};

const CHAT = {
  project: "Eden House The Park",
  source: "Eden House The Park Website Chatbot",
  language: "en",
  intent: "broker",
  search_stage: "actively_looking",
  unit_type: "2br",
  budget_bracket: "2m_3m",
  company: "Example Realty",
  first_name: "Omar",
  last_name: "Example",
  phone: "+971511111111",
  email: "omar@example.invalid",
  consent: true,
  submissionId: "ehp-chat-1",
  pageUrl: "https://edenhousethepark.example.invalid/",
  submittedAt: "2026-11-06T08:00:00.000Z",
};

const SLOT = {
  reference: "EHP-LX3K9Q-7F2A9C",
  project: "Eden House The Park",
  slotLabel: "10:00 – 12:00 Tomorrow",
  firstName: "Omar",
  lastName: "Example",
  phone: "+971511111111",
  email: "omar@example.invalid",
  language: "en",
  submissionId: "ehp-slot-1",
};

const request = (body, headers = {}) =>
  new Request("http://localhost/api/eden-lead", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

test("the real contact form, chat and slot payloads are accepted", () => {
  for (const [kind, body] of [["contact", CONTACT], ["chat", CHAT], ["slot", SLOT]]) {
    const result = validateLeadRequest(kind, body);
    assert.equal(result.ok, true, `${kind}: ${result.message}`);
    assert.equal(result.body.website, undefined, "the honeypot is never forwarded");
    assert.equal(result.body.submissionId, undefined, "the submission id travels in the envelope");
    assert.equal(result.submissionId, body.submissionId);
  }
});

test("the contact form is told apart from the chat by form_source", () => {
  assert.equal(leadKind(CONTACT), "contact");
  assert.equal(leadKind(CHAT), "chat");
  assert.equal(leadKind({ ...CHAT, form_source: "something-else" }), "chat");
});

test("Content-Type must be exactly application/json once parameters are removed", async () => {
  assert.equal(mediaType("Application/JSON; charset=utf-8"), "application/json");
  assert.equal((await readLeadBody(request(CONTACT))).ok, true);
  assert.equal((await readLeadBody(request(CONTACT, { "content-type": "application/json; charset=UTF-8" }))).ok, true);
  for (const type of [
    "text/plain",
    "text/plain; x=application/json",
    "application/json-patch+json",
    "application/jsonp",
    "multipart/form-data; boundary=application/json",
    "",
  ]) {
    const result = await readLeadBody(request(CONTACT, { "content-type": type }));
    assert.equal(result.status, 415, `"${type}" must be refused`);
  }
});

test("a body over 16 KB is refused, whatever Content-Length claims", async () => {
  const big = { ...CONTACT, pageUrl: "x".repeat(MAX_LEAD_BODY_BYTES) };
  assert.equal((await readLeadBody(request(big))).status, 413);
  assert.equal((await readLeadBody(request(big, { "content-length": "10" }))).status, 413);
  assert.equal((await readLeadBody(request(CONTACT, { "content-length": String(MAX_LEAD_BODY_BYTES + 1) }))).status, 413);
  // Multi-byte characters count as bytes, not characters.
  const arabic = { ...CONTACT, pageUrl: "ع".repeat(MAX_LEAD_BODY_BYTES / 2) };
  assert.equal((await readLeadBody(request(arabic))).status, 413);
});

test("non-object JSON and broken JSON are refused", async () => {
  for (const raw of ["null", "[]", "42", '"x"', "{bad"]) {
    assert.equal((await readLeadBody(request(raw))).ok, false, raw);
  }
});

test("field limits, patterns and consent are enforced", () => {
  const bad = [
    ["contact", { ...CONTACT, firstName: "x".repeat(101) }],
    ["contact", { ...CONTACT, email: "not-an-email" }],
    ["contact", { ...CONTACT, phone: "0501234567" }],
    ["contact", { ...CONTACT, phone: "+97150 123" }],
    ["contact", { ...CONTACT, consent: false }],
    ["contact", { ...CONTACT, consent: "true" }],
    ["contact", { ...CONTACT, userType: "" }],
    ["contact", { ...CONTACT, firstName: "123" }],
    ["contact", { ...CONTACT, extra: { nested: true } }],
    ["contact", { ...CONTACT, submissionId: "has spaces" }],
    ["contact", { ...CONTACT, submissionId: "x".repeat(129) }],
    ["chat", { ...CHAT, consent: undefined }],
    ["chat", { ...CHAT, intent: "admin" }],
    ["chat", { ...CHAT, company: "" }],
    ["slot", { ...SLOT, reference: "EHP-bad" }],
    ["slot", { ...SLOT, slotLabel: "x".repeat(81) }],
  ];
  for (const [kind, body] of bad) {
    assert.equal(validateLeadRequest(kind, body).ok, false, `${kind} ${JSON.stringify(body).slice(0, 80)}`);
  }
});

test("trim guards never throw on null, numbers or missing values", () => {
  assert.equal(validateLeadRequest("contact", { ...CONTACT, firstName: null }).ok, false);
  assert.equal(validateLeadRequest("contact", { ...CONTACT, lastName: 42 }).ok, false);
  assert.equal(validateLeadRequest("slot", { ...SLOT, slotLabel: undefined }).ok, false);
  assert.equal(validateLeadRequest("chat", {}).ok, false);
  assert.equal(validateLeadRequest("contact", null).ok, false);
  assert.equal(validateLeadRequest("unknown", CONTACT).ok, false);
});

test("the honeypot is spotted only when filled", () => {
  assert.equal(isHoneypotFilled(CONTACT), false);
  assert.equal(isHoneypotFilled({ ...CONTACT, website: "https://spam.example" }), true);
  assert.equal(isHoneypotFilled({ ...CONTACT, website: "   " }), false);
  assert.equal(isHoneypotFilled(null), false);
});

test("formula guard: = + - @ tab and CR get an apostrophe, a whole phone number does not", () => {
  for (const value of ["=SUM(A1)", "+cmd|' /C calc'!A0", "-2+3", "@SUM(1)", "\t=1", "\r=1", "+971 50 123", "+971500000000=1", "+1+1", "+12"]) {
    assert.equal(neutraliseFormula(value), `'${value}`, value);
  }
  for (const value of ["+971500000000", "+447700900123", "Aisha", "", "2 Bedroom", "a=b"]) {
    assert.equal(neutraliseFormula(value), value, value);
  }
  assert.deepEqual(neutraliseFormulas({ a: "=1", b: true, c: 3, phone: "+971500000000" }), {
    a: "'=1",
    b: true,
    c: 3,
    phone: "+971500000000",
  });
});
