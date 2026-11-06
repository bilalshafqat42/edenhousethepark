// The footer. Its Contact column lists the details from the Contact section.
export const FOOTER_FIELDS = [
  {
    key: "address",
    label: "Address",
    type: "TEXT",
    defaultValue: "Office 4701, Floor 47, Ubora Tower, Marasi Drive, Business Bay, Dubai",
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
    helperText: "Partner logos are not supplied yet; the names stand in for them.",
    itemFields: [
      { key: "label", label: "Role (e.g. Development By)", type: "TEXT" },
      { key: "name", label: "Name", type: "TEXT" },
    ],
    defaultValue: [
      { label: "Development By", name: "H&H" },
      { label: "Owned By", name: "Global Partners" },
      { label: "Sales Partner", name: "Refine" },
    ],
  },
  { key: "copyright", label: "Copyright line", type: "TEXT", defaultValue: "©2026. Refine Project Management. All rights reserved" },
  { key: "manage-cookies-label", label: "Manage Cookies link", type: "TEXT", defaultValue: "Manage Cookies" },
  { key: "privacy-label", label: "Privacy Policy link", type: "TEXT", defaultValue: "Privacy Policy" },
  { key: "terms-label", label: "Terms link", type: "TEXT", defaultValue: "Terms & Conditions" },
];
