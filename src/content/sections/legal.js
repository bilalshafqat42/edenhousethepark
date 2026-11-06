/*
 * Privacy Policy and Terms & Conditions. The default body is a neutral
 * holding notice, not legal text: replace it with copy reviewed by Refine's
 * legal counsel (covering the contact form, the chat, cookies and UAE PDPL
 * rights) before launch.
 */
const NOTICE =
  '<p>This page is being updated. For any questions, contact us at <a href="mailto:ehtp@refinedubai.com">ehtp@refinedubai.com</a>.</p>';

const legalFields = (title, description) => [
  { key: "title", label: "Title", type: "TEXT", defaultValue: title },
  { key: "meta-description", label: "Page description (search engines)", type: "TEXT", defaultValue: description },
  { key: "body", label: "Body", type: "RICHTEXT", helperText: "Must be reviewed by Refine's legal counsel before launch.", defaultValue: NOTICE },
];

export const PRIVACY_FIELDS = legalFields("Privacy Policy", "Privacy Policy for Eden House The Park.");
export const TERMS_FIELDS = legalFields("Terms & Conditions", "Terms and conditions for Eden House The Park.");
