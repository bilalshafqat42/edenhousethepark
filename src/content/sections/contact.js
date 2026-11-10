/*
 * Register Your Interest: a full-width render with a heading, text and an
 * "Enquire Now" button that opens the enquiry form in a pop-up. The contact
 * details are listed in the footer's Contact column.
 */
export const CONTACT_FIELDS = [
  {
    key: "image",
    label: "Background image",
    type: "IMAGE",
    helperText: "Wide landscape render; it is darkened so the white text reads on it.",
    defaultValue: "/images/renders/hero-aerial-canal.jpg",
  },
  { key: "eyebrow", label: "Small heading", type: "TEXT", defaultValue: "Reach Out To Us" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "Register Your Interest" },
  {
    key: "intro",
    label: "Text",
    type: "TEXT",
    long: true,
    defaultValue:
      "Explore an exclusive collection of residences, discover the available floor plans and connect with our sales team to find a home that feels distinctly yours.",
  },
  { key: "button-label", label: "Button label (opens the enquiry form)", type: "TEXT", defaultValue: "Enquire Now" },
  { key: "form-title", label: "Enquiry pop-up heading", type: "TEXT", defaultValue: "Register Your Interest" },
  {
    key: "details",
    label: "Contact details",
    type: "LIST",
    itemLabel: "Detail",
    helperText: "Link: tel:+97144230167 for a phone number, mailto:name@refinedubai.com for an email.",
    itemFields: [
      { key: "label", label: "Label (e.g. Telephone; read out by screen readers)", type: "TEXT" },
      { key: "value", label: "Shown as (e.g. +971 4 423 0167)", type: "TEXT" },
      { key: "href", label: "Link (tel: or mailto:)", type: "LINK" },
    ],
    defaultValue: [
      { label: "Telephone", value: "+971 4 423 0167", href: "tel:+97144230167" },
      { label: "UAE Toll Free", value: "800 Refine (800 733463)", href: "tel:800733463" },
      { label: "Email", value: "ehtp@refinedubai.com", href: "mailto:ehtp@refinedubai.com" },
    ],
  },
];
