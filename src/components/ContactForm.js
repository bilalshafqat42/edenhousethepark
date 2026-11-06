"use client";

import { useRef, useState } from "react";
import InlineText from "@/components/InlineText";
import { toPlainText } from "@/lib/inline-text";
import { newSubmissionId } from "@/lib/submission-id";

const REQUIRED = ["firstName", "lastName", "role", "residence", "phone", "email", "consent"];

function isValid(name, value) {
  if (name === "consent") return value === true;
  const text = String(value ?? "").trim();
  if (name === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  if (name === "phone") return /^[0-9\s]{6,15}$/.test(text);
  return text !== "";
}

const list = (value) => (Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : []);

/*
 * Register Your Interest. Validates on submit only, never on blur, then
 * posts to /api/eden-lead, which stores the enquiry in the admin panel.
 * "Thank you" is shown only when the server confirms the enquiry was
 * accepted; otherwise the form stays as filled in, with a message in the
 * form's existing error style, and can be sent again. A retry of the same
 * details carries the same submission id, so the panel stores it once.
 *
 * Labels and choices come from the panel's Contact Form section.
 */
export default function ContactForm({ content = {} }) {
  const roleOptions = list(content["role-options"]).map((o) => toPlainText(String(o.label ?? "")).trim()).filter(Boolean);
  const residenceOptions = list(content["residence-options"]).map((o) => toPlainText(String(o.label ?? "")).trim()).filter(Boolean);
  const countryCodes = list(content["country-codes"])
    .map((o) => String(o.code ?? "").trim())
    .filter((code) => /^\+[1-9][0-9]{0,3}$/.test(code));
  const codes = countryCodes.length ? countryCodes : ["+971"];

  const [values, setValues] = useState(() => ({
    firstName: "",
    lastName: "",
    role: "",
    residence: "",
    countryCode: codes[0],
    phone: "",
    email: "",
    consent: false,
    website: "",
  }));
  const [focused, setFocused] = useState(null);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | sending | failed | sent
  const formRef = useRef(null);
  // The same id on every retry of the same details, so the panel stores the enquiry once.
  const [submissionId, setSubmissionId] = useState(null);

  const update = (e) => {
    const { name, type, checked, value } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    // Changed details are a new submission, not a retry of the last one.
    setSubmissionId(null);
    if (status === "failed") setStatus("idle");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    const invalid = REQUIRED.filter((name) => !isValid(name, values[name]));
    setErrors(invalid);
    if (invalid.length) {
      setStatus("idle");
      formRef.current.querySelector(`[name="${invalid[0]}"]`)?.focus();
      return;
    }

    const id = submissionId ?? newSubmissionId("ehp-contact");
    setSubmissionId(id);
    setStatus("sending");

    try {
      const response = await fetch("/api/eden-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout?.(20000),
        body: JSON.stringify({
          form_source: "contact-form",
          submissionId: id,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          userType: values.role,
          unitType: values.residence,
          phone: `${values.countryCode}${values.phone.replace(/\s/g, "")}`,
          email: values.email.trim(),
          consent: values.consent,
          website: values.website,
          pageUrl: window.location.href,
          submittedAt: new Date().toISOString(),
        }),
      });
      const result = await response.json().catch(() => null);
      setStatus(response.ok && result?.success === true ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  const fieldClass = (name, extra = "") =>
    [
      "field",
      extra,
      focused === name || values[name] ? "is-active" : "",
      errors.includes(name) ? "has-error" : "",
    ].join(" ");

  const bind = (name) => ({
    id: `f-${name}`,
    name,
    value: values[name],
    onChange: update,
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
    "aria-invalid": errors.includes(name) || undefined,
  });

  if (status === "sent") {
    return (
      <div className="form__done" role="status">
        <h3 className="h3"><InlineText value={content["thank-you-title"]} /></h3>
        <p className="body"><InlineText value={content["thank-you-text"]} /></p>
      </div>
    );
  }

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate aria-busy={status === "sending" || undefined}>
      {/* Honeypot: hidden from people and screen readers; only bots fill it in. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update} />
      </div>
      <div className={fieldClass("firstName")}>
        <label className="label" htmlFor="f-firstName"><InlineText value={content["first-name-label"]} inLink /></label>
        <input type="text" autoComplete="given-name" maxLength={100} {...bind("firstName")} />
      </div>
      <div className={fieldClass("lastName")}>
        <label className="label" htmlFor="f-lastName"><InlineText value={content["last-name-label"]} inLink /></label>
        <input type="text" autoComplete="family-name" maxLength={100} {...bind("lastName")} />
      </div>
      <div className={fieldClass("role")}>
        <label className="label" htmlFor="f-role"><InlineText value={content["role-label"]} inLink /></label>
        <select {...bind("role")}>
          <option value="" disabled hidden></option>
          {roleOptions.map((option, i) => (
            <option key={i}>{option}</option>
          ))}
        </select>
      </div>
      <div className={fieldClass("residence")}>
        <label className="label" htmlFor="f-residence"><InlineText value={content["residence-label"]} inLink /></label>
        <select {...bind("residence")}>
          <option value="" disabled hidden></option>
          {residenceOptions.map((option, i) => (
            <option key={i}>{option}</option>
          ))}
        </select>
      </div>
      <div
        className={fieldClass("phone", "field--phone") + (focused === "countryCode" ? " is-active" : "")}
      >
        <label className="label" htmlFor="f-phone"><InlineText value={content["phone-label"]} inLink /></label>
        <div className="phone">
          <select
            name="countryCode"
            aria-label={toPlainText(content["country-code-label"] ?? "")}
            value={values.countryCode}
            onChange={update}
            onFocus={() => setFocused("countryCode")}
            onBlur={() => setFocused(null)}
          >
            {codes.map((code) => (
              <option key={code}>{code}</option>
            ))}
          </select>
          <input type="tel" autoComplete="tel-national" inputMode="tel" {...bind("phone")} />
        </div>
      </div>
      <div className={fieldClass("email")}>
        <label className="label" htmlFor="f-email"><InlineText value={content["email-label"]} inLink /></label>
        <input type="email" autoComplete="email" maxLength={254} {...bind("email")} />
      </div>

      <label className={"consent fine" + (errors.includes("consent") ? " has-error" : "")}>
        <input
          type="checkbox"
          name="consent"
          checked={values.consent}
          onChange={update}
          required
          aria-invalid={errors.includes("consent") || undefined}
        />
        <span><InlineText value={content["consent-text"]} /></span>
      </label>

      {errors.length > 0 && (
        <p className="form__error" role="alert"><InlineText value={content["missing-fields-message"]} /></p>
      )}
      {errors.length === 0 && status === "failed" && (
        <p className="form__error" role="alert"><InlineText value={content["send-error-message"]} /></p>
      )}

      <div className="form__actions">
        <button type="submit" className="btn btn--fill" disabled={status === "sending"}>
          <InlineText value={content["submit-label"]} inLink />
        </button>
      </div>
    </form>
  );
}
