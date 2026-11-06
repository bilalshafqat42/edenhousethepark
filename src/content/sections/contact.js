/*
 * Register Your Interest: heading, intro and contact details. The same
 * details are listed in the footer's Contact column.
 */
export const CONTACT_FIELDS = [
  { key: "eyebrow", label: "Small heading", type: "TEXT", defaultValue: "Reach Out" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "Register Your Interest" },
  {
    key: "intro",
    label: "Text",
    type: "TEXT",
    long: true,
    defaultValue:
      "Our team can take you through the two- and three-bedroom homes, the floor plans and the payment plan, and arrange a visit to the sales gallery at Eden House The Canal.",
  },
  {
    key: "details",
    label: "Contact details",
    type: "LIST",
    itemLabel: "Detail",
    helperText: "Link: tel:+97144230167 for a phone number, mailto:name@refinedubai.com for an email.",
    itemFields: [
      { key: "label", label: "Label (e.g. Telephone)", type: "TEXT" },
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
