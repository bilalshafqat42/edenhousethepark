// The footer. Its Contact column lists the details from the Contact section.
export const FOOTER_FIELDS = [
  {
    key: "address",
    label: "Address (optional; not shown in the current design)",
    type: "TEXT",
    defaultValue: "",
  },
  {
    key: "permit-text",
    label: "Trakheesi permit",
    type: "TEXT",
    helperText: "TO CONFIRM: replace [number] with the Trakheesi permit number before launch.",
    defaultValue: "Trakheesi permit no. [number]",
  },
  { key: "qr-text", label: "Madmoun QR text", type: "TEXT", defaultValue: "Madmoun QR" },
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
