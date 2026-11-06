import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import { persistLead } from "@/lib/lead-sink";
import { __resetRateLimits } from "@/lib/rate-limit";

/*
 * Forwarding to the panel's /api/leads/intake: the envelope, the auth
 * header, the visitor-IP header, the retry rule and the local rate limit.
 * fetch is replaced; nothing leaves the machine.
 */
const realFetch = globalThis.fetch;
const ENV_KEYS = ["LEAD_API_URL", "LEAD_INTAKE_TOKEN", "CONTENT_API_URL", "CONTENT_API_TOKEN", "SITE_KEY", "CF_ORIGIN_SECRET"];
const savedEnv = {};
let calls;

function respondWith(...responses) {
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    const next = responses.length > 1 ? responses.shift() : responses[0];
    if (next instanceof Error) throw next;
    return next();
  };
}

const ok = () => new Response(JSON.stringify({ saved: true, id: "lead_1" }), { status: 200 });
const status = (code) => () => new Response("{}", { status: code });
const headers = (ip = "203.0.113.7") => new Headers({ "cf-connecting-ip": ip });

beforeEach(() => {
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
  process.env.CONTENT_API_URL = "https://panel.example.invalid/";
  process.env.CONTENT_API_TOKEN = "test-site-key";
  process.env.SITE_KEY = "edenhousethepark-staging";
  __resetRateLimits();
});

afterEach(() => {
  globalThis.fetch = realFetch;
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});

test("posts { site, source, submissionId, body } with the site key and the visitor's IP", async () => {
  respondWith(ok);
  const result = await persistLead("contact", { firstName: "Aisha" }, headers(), "ehp-contact-1");
  assert.equal(result.saved, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://panel.example.invalid/api/leads/intake");
  assert.equal(calls[0].init.headers.authorization, "Bearer test-site-key");
  assert.equal(calls[0].init.headers["x-oceara-client-ip"], "203.0.113.7");
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    site: "edenhousethepark-staging",
    source: "contact",
    submissionId: "ehp-contact-1",
    body: { firstName: "Aisha" },
  });
});

test("LEAD_API_URL and LEAD_INTAKE_TOKEN win over the content values when set", async () => {
  process.env.LEAD_API_URL = "https://leads.example.invalid";
  process.env.LEAD_INTAKE_TOKEN = "lead-key";
  respondWith(ok);
  await persistLead("chat", { first_name: "Omar" }, headers(), null);
  assert.equal(calls[0].url, "https://leads.example.invalid/api/leads/intake");
  assert.equal(calls[0].init.headers.authorization, "Bearer lead-key");
});

test("a panel 5xx or network error is retried once with the same submission id", async () => {
  respondWith(status(503), ok);
  assert.equal((await persistLead("contact", {}, headers(), "id-1")).saved, true);
  assert.equal(calls.length, 2);
  assert.equal(JSON.parse(calls[1].init.body).submissionId, "id-1");

  respondWith(new Error("socket hang up"), ok);
  assert.equal((await persistLead("contact", {}, headers("203.0.113.8"), "id-2")).saved, true);
  assert.equal(calls.length, 2);
});

test("no retry without a submission id, and none on a 4xx", async () => {
  respondWith(status(503));
  assert.equal((await persistLead("contact", {}, headers(), null)).saved, false);
  assert.equal(calls.length, 1);

  respondWith(status(401));
  assert.equal((await persistLead("contact", {}, headers("203.0.113.9"), "id-3")).saved, false);
  assert.equal(calls.length, 1);
});

test("saved only when the panel says saved: true", async () => {
  respondWith(() => new Response(JSON.stringify({ saved: false }), { status: 200 }));
  assert.equal((await persistLead("contact", {}, headers(), "id-4")).saved, false);
});

test("not configured: nothing is sent and the caller is told", async () => {
  delete process.env.CONTENT_API_URL;
  respondWith(ok);
  const result = await persistLead("contact", {}, headers(), "id-5");
  assert.equal(result.noSinkConfigured, true);
  assert.equal(calls.length, 0);
});

test("the local rate limit stops a flood before it reaches the panel", async () => {
  respondWith(ok);
  for (let i = 0; i < 8; i++) {
    assert.equal((await persistLead("contact", {}, headers("198.51.100.1"), `id-${i}`)).rateLimited, false);
  }
  const blocked = await persistLead("contact", {}, headers("198.51.100.1"), "id-9");
  assert.equal(blocked.rateLimited, true);
  assert.ok(blocked.retryAfterSeconds > 0);
  assert.equal(calls.length, 8);
  // Slots have their own budget, and other visitors are unaffected.
  assert.equal((await persistLead("slot", {}, headers("198.51.100.1"), "slot-1")).rateLimited, false);
  assert.equal((await persistLead("contact", {}, headers("198.51.100.2"), "id-10")).rateLimited, false);
});

test("a spoofed X-Forwarded-For does not dodge the limit", async () => {
  respondWith(ok);
  for (let i = 0; i < 9; i++) {
    const spoofed = new Headers({ "x-forwarded-for": `10.0.0.${i}, 172.70.1.1` });
    const result = await persistLead("contact", {}, spoofed, `id-x${i}`);
    if (i < 8) assert.equal(result.rateLimited, false);
    else assert.equal(result.rateLimited, true);
  }
});
