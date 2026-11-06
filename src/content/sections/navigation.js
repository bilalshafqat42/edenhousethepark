/*
 * The header: menu links (shared by the desktop bar and the phone menu),
 * the call-to-action button, and the labels screen readers hear.
 */
export const NAVIGATION_FIELDS = [
  {
    key: "links",
    label: "Menu links",
    type: "LIST",
    itemLabel: "Link",
    helperText: "Each link jumps to a section of the page, e.g. #about, #location, #amenities, #payment-plan, #contact.",
    itemFields: [
      { key: "label", label: "Label", type: "TEXT" },
      { key: "href", label: "Link (e.g. #about)", type: "LINK" },
    ],
    defaultValue: [
      { label: "About", href: "#about" },
      { label: "Location", href: "#location" },
      { label: "Amenities", href: "#amenities" },
      { label: "Payment Plan", href: "#payment-plan" },
      { label: "Contact", href: "#contact" },
    ],
  },
  { key: "cta-label", label: "Header button label", type: "TEXT", defaultValue: "Request Callback" },
  { key: "cta-href", label: "Header button link", type: "LINK", defaultValue: "#contact" },
  { key: "skip-link-label", label: "Skip link (keyboard users)", type: "TEXT", defaultValue: "Skip to content" },
  {
    key: "logo-aria-label",
    label: "Logo link, read aloud by screen readers",
    type: "TEXT",
    defaultValue: "Return to the Eden House The Park hero section",
  },
  { key: "nav-aria-label", label: "Menu name, read aloud by screen readers", type: "TEXT", defaultValue: "Main" },
  { key: "mobile-menu-aria-label", label: "Phone menu name, read aloud by screen readers", type: "TEXT", defaultValue: "Menu" },
  { key: "menu-open-label", label: "Phone menu button, closed (screen readers)", type: "TEXT", defaultValue: "Open menu" },
  { key: "menu-close-label", label: "Phone menu button, open (screen readers)", type: "TEXT", defaultValue: "Close menu" },
];
