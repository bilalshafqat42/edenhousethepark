/*
 * Project Overview, under the hero: heading, text, five key figures and two
 * buttons. The slug stays "intro" (it was the intro statement before the
 * redesign); nothing had been saved under it, so its fields could change.
 * The brochure button's link comes from the Brochure section.
 */
export const INTRO_FIELDS = [
  { key: "eyebrow", label: "Small heading", type: "TEXT", defaultValue: "Project Overview" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "Life Along The Canal" },
  {
    key: "body",
    label: "Text",
    type: "TEXT",
    long: true,
    defaultValue: "Direct access to the 6.4 km canal promenade, with waterfront views and walkable surroundings.",
  },
  {
    key: "stats",
    label: "Key figures",
    type: "LIST",
    itemLabel: "Figure",
    helperText: "Five fit one row. 'Count up to' makes the figure count up from 0 as it scrolls in; leave it blank for figures that are not a plain number.",
    itemFields: [
      { key: "figure", label: "Figure (e.g. 459, Q3 2027)", type: "TEXT" },
      { key: "count", label: "Count up to (a whole number, or blank)", type: "TEXT" },
      { key: "label", label: "Label", type: "TEXT" },
    ],
    defaultValue: [
      { figure: "459", count: "459", label: "Residences" },
      { figure: "2, 3, 4", count: "", label: "Bedroom Homes" },
      { figure: "6.4 km", count: "", label: "Canal Promenade" },
      { figure: "Eden House", count: "", label: "Hospitality" },
      { figure: "Q3 2027", count: "", label: "Handover" },
    ],
  },
  { key: "brochure-label", label: "First button label (opens the brochure)", type: "TEXT", defaultValue: "Download Brochure" },
  { key: "request-label", label: "Second button label", type: "TEXT", defaultValue: "Submit Request" },
  { key: "request-href", label: "Second button link", type: "LINK", defaultValue: "#contact" },
];
