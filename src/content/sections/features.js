// The Project Features band: figure, label and text for each key figure.
export const FEATURES_FIELDS = [
  { key: "eyebrow", label: "Small heading", type: "TEXT", defaultValue: "Project Features" },
  {
    key: "items",
    label: "Figures",
    type: "LIST",
    itemLabel: "Figure",
    helperText: "Five fit one row. 'Count up to' makes the figure count up from 0 as it scrolls in; leave it blank for figures that are not a plain number.",
    itemFields: [
      { key: "figure", label: "Figure (e.g. 459, Q3 2027)", type: "TEXT" },
      { key: "count", label: "Count up to (a whole number, or blank)", type: "TEXT" },
      { key: "label", label: "Label", type: "TEXT" },
      { key: "text", label: "Text", type: "TEXT", multiline: true },
    ],
    defaultValue: [
      { figure: "459", count: "459", label: "Residences", text: "7 low-rise buildings with a car-free park at the centre" },
      { figure: "2 & 3", count: "", label: "Bedroom Homes", text: "Two-bedroom apartments, plus three-bedroom layouts with a maid's room" },
      { figure: "6.4 km", count: "", label: "Canal Promenade", text: "Direct access from the community to the canal promenade" },
      { figure: "Eden House", count: "", label: "Hospitality", text: "Concierge, resident and guest valet, and an Eden House app with digital key access" },
      { figure: "Q3 2027", count: "", label: "Handover", text: "70% of the price is due on handover" },
    ],
  },
  { key: "cta-label", label: "Button label", type: "TEXT", defaultValue: "Submit Request" },
  { key: "cta-href", label: "Button link", type: "LINK", defaultValue: "#contact" },
];
