// The footer. Its Contact column lists the details from the Contact section.
export const FOOTER_FIELDS = [
  {
    key: "address",
    label: "Address (optional; shown under the logo when filled in)",
    type: "TEXT",
    defaultValue: "",
  },
  /*
   * Trakheesi permit (replaces the old "permit-text" and "qr-text" fields,
   * whose defaults were placeholders). The permit line shows only once a
   * number is filled in, and the QR code only once an image is uploaded.
   */
  { key: "permit-label", label: "Trakheesi permit: text before the number", type: "TEXT", defaultValue: "Trakheesi permit no." },
  {
    key: "permit-number",
    label: "Trakheesi permit number",
    type: "TEXT",
    helperText: "TO CONFIRM before launch. Blank: the permit line is hidden.",
    defaultValue: "",
  },
  {
    key: "permit-qr",
    label: "Permit QR code (Madmoun)",
    type: "IMAGE",
    helperText: "The QR code issued with the permit, as a square PNG or SVG. Blank: no QR code is shown.",
    defaultValue: "",
  },
  { key: "permit-qr-alt", label: "Permit QR code description (alt text)", type: "TEXT", defaultValue: "Madmoun QR code for the Trakheesi permit" },
  { key: "explore-heading", label: "Explore column heading", type: "TEXT", defaultValue: "Explore" },
  {
    key: "explore-links",
    label: "Explore links",
    type: "LIST",
    itemLabel: "Link",
    itemFields: [
      { key: "label", label: "Label", type: "TEXT" },
      { key: "href", label: "Link (e.g. #floor-plans)", type: "LINK" },
    ],
    defaultValue: [
      { label: "About", href: "#about" },
      { label: "Location", href: "#location" },
      { label: "Amenities", href: "#amenities" },
      { label: "Floor Plans", href: "#floor-plans" },
      { label: "Payment Plan", href: "#payment-plan" },
    ],
  },
  { key: "contact-heading", label: "Contact column heading", type: "TEXT", defaultValue: "Contact" },
  {
    key: "partners",
    label: "Partners",
    type: "LIST",
    itemLabel: "Partner",
    helperText: "Upload each partner's logo; until one is uploaded, its name shows instead.",
    itemFields: [
      { key: "label", label: "Role (e.g. Development By)", type: "TEXT" },
      { key: "name", label: "Name (also the logo's alt text)", type: "TEXT" },
      { key: "logo", label: "Logo (optional, dark on transparent)", type: "IMAGE" },
    ],
    defaultValue: [
      { label: "Development By", name: "H&H", logo: "" },
      { label: "Owned By", name: "Global Partners", logo: "" },
      { label: "Sales Partner", name: "Refine", logo: "" },
    ],
  },
  { key: "copyright", label: "Copyright line", type: "TEXT", defaultValue: "©2026. Refine Project Management. All rights reserved" },
  { key: "manage-cookies-label", label: "Manage Cookies link", type: "TEXT", defaultValue: "Manage Cookies" },
  { key: "privacy-label", label: "Privacy Policy link", type: "TEXT", defaultValue: "Privacy Policy" },
  {
    key: "privacy-href",
    label: "Privacy Policy link address",
    type: "LINK",
    helperText: "Refine's company privacy policy by default. Use /privacy for this site's own Privacy page instead.",
    defaultValue: "https://refinedubai.com/privacy-policy/",
  },
  { key: "terms-label", label: "Terms link", type: "TEXT", defaultValue: "Terms & Conditions" },
];
