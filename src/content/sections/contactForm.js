/*
 * The contact form's wording and choices. What a visitor picks is sent with
 * the lead exactly as written here, so changing an option changes what
 * sales sees on new leads.
 */
export const CONTACT_FORM_FIELDS = [
  { key: "first-name-label", label: "First name field", type: "TEXT", defaultValue: "First Name" },
  { key: "last-name-label", label: "Last name field", type: "TEXT", defaultValue: "Last Name" },
  { key: "role-label", label: "'I'm a' field", type: "TEXT", defaultValue: "I'm a" },
  {
    key: "role-options",
    label: "'I'm a' choices",
    type: "LIST",
    itemLabel: "Choice",
    itemFields: [{ key: "label", label: "Choice", type: "TEXT" }],
    defaultValue: [{ label: "Broker" }, { label: "Buyer" }],
  },
  { key: "residence-label", label: "Residence type field", type: "TEXT", defaultValue: "Residence Type" },
  {
    key: "residence-options",
    label: "Residence type choices",
    type: "LIST",
    itemLabel: "Choice",
    itemFields: [{ key: "label", label: "Choice", type: "TEXT" }],
    defaultValue: [{ label: "2 Bedroom" }, { label: "3 Bedroom" }],
  },
  { key: "phone-label", label: "Mobile phone field", type: "TEXT", defaultValue: "Mobile Phone" },
  { key: "country-code-label", label: "Country code list, name read by screen readers", type: "TEXT", defaultValue: "Country code" },
  {
    key: "country-codes",
    label: "Country codes",
    type: "LIST",
    itemLabel: "Code",
    helperText: "A plus and the calling code, e.g. +971. The first one is preselected.",
    itemFields: [{ key: "code", label: "Code", type: "TEXT" }],
    defaultValue: ["+971", "+966", "+974", "+965", "+973", "+968", "+44", "+1", "+91"].map((code) => ({ code })),
  },
  { key: "email-label", label: "Email field", type: "TEXT", defaultValue: "Email" },
  {
    key: "consent-text",
    label: "Consent text next to the tick box",
    type: "TEXT",
    long: true,
    helperText: "The links to /terms and /privacy are part of the text.",
    defaultValue:
      'By submitting this form, you agree to our <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Policy</a>, and you consent to Refine contacting you about Eden House The Park.',
  },
  { key: "missing-fields-message", label: "Message when fields are missing", type: "TEXT", defaultValue: "Please complete the highlighted fields." },
  {
    key: "send-error-message",
    label: "Message when the request could not be sent",
    type: "TEXT",
    defaultValue: "We could not send your request. Please try again.",
  },
  { key: "submit-label", label: "Button label", type: "TEXT", defaultValue: "Submit A Request" },
  { key: "thank-you-title", label: "Thank-you heading", type: "TEXT", defaultValue: "Thank You" },
  { key: "thank-you-text", label: "Thank-you text", type: "TEXT", defaultValue: "Our team will be in touch shortly." },
];
