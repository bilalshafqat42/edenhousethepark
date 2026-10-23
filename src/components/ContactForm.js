"use client";

import { useRef, useState } from "react";

const EMPTY = {
  firstName: "",
  lastName: "",
  role: "",
  residence: "",
  countryCode: "+971",
  phone: "",
  email: "",
  consent: false,
};

const REQUIRED = ["firstName", "lastName", "role", "residence", "phone", "email", "consent"];

function isValid(name, value) {
  if (name === "consent") return value === true;
  if (name === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  if (name === "phone") return /^[0-9\s]{6,15}$/.test(value.trim());
  return value.trim() !== "";
}

// Validates on submit only, never on blur. Nothing is sent anywhere yet.
export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [focused, setFocused] = useState(null);
  const [errors, setErrors] = useState([]);
  const [sent, setSent] = useState(false);
  const formRef = useRef(null);

  const update = (e) => {
    const { name, type, checked, value } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const invalid = REQUIRED.filter((name) => !isValid(name, values[name]));
    setErrors(invalid);
    if (invalid.length) {
      formRef.current.querySelector(`[name="${invalid[0]}"]`)?.focus();
      return;
    }
    setSent(true);
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

  if (sent) {
    return (
      <div className="form__done" role="status">
        <h3 className="h3">Thank You</h3>
        <p className="body">Our team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
      <div className={fieldClass("firstName")}>
        <label className="label" htmlFor="f-firstName">First Name</label>
        <input type="text" autoComplete="given-name" {...bind("firstName")} />
      </div>
      <div className={fieldClass("lastName")}>
        <label className="label" htmlFor="f-lastName">Last Name</label>
        <input type="text" autoComplete="family-name" {...bind("lastName")} />
      </div>
      <div className={fieldClass("role")}>
        <label className="label" htmlFor="f-role">{"I'm a"}</label>
        <select {...bind("role")}>
          <option value="" disabled hidden></option>
          <option>Broker</option>
          <option>Buyer</option>
        </select>
      </div>
      <div className={fieldClass("residence")}>
        <label className="label" htmlFor="f-residence">Residence Type</label>
        <select {...bind("residence")}>
          <option value="" disabled hidden></option>
          <option>2 Bedroom</option>
          <option>3 Bedroom</option>
        </select>
      </div>
      <div
        className={fieldClass("phone", "field--phone") + (focused === "countryCode" ? " is-active" : "")}
      >
        <label className="label" htmlFor="f-phone">Mobile Phone</label>
        <div className="phone">
          <select
            name="countryCode"
            aria-label="Country code"
            value={values.countryCode}
            onChange={update}
            onFocus={() => setFocused("countryCode")}
            onBlur={() => setFocused(null)}
          >
            <option>+971</option>
            <option>+966</option>
            <option>+974</option>
            <option>+965</option>
            <option>+973</option>
            <option>+968</option>
            <option>+44</option>
            <option>+1</option>
            <option>+91</option>
          </select>
          <input type="tel" autoComplete="tel-national" inputMode="tel" {...bind("phone")} />
        </div>
      </div>
      <div className={fieldClass("email")}>
        <label className="label" htmlFor="f-email">Email</label>
        <input type="email" autoComplete="email" {...bind("email")} />
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
        <span>By submitting this form, you agree to our Terms of Use and Privacy Policy, and you consent to Refine contacting you about Eden House The Park.</span>
      </label>

      {errors.length > 0 && (
        <p className="form__error" role="alert">Please complete the highlighted fields.</p>
      )}

      <div className="form__actions">
        <button type="submit" className="btn btn--fill">Submit A Request</button>
      </div>
    </form>
  );
}
