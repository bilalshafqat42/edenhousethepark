// Payment Plan: the 30/70 split, the instalment schedule and the fine print.
export const PAYMENT_FIELDS = [
  { key: "eyebrow", label: "Small heading", type: "TEXT", defaultValue: "Payment Plan" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "Favourable Payment Plan For A Distinctive Home" },
  { key: "summary", label: "Summary line (optional)", type: "TEXT", defaultValue: "" },
  { key: "before-percent", label: "Before handover: percentage (number only)", type: "TEXT", defaultValue: "30" },
  { key: "before-label", label: "Before handover: label", type: "TEXT", defaultValue: "Before Handover" },
  { key: "handover-percent", label: "On handover: percentage (number only)", type: "TEXT", defaultValue: "70" },
  { key: "handover-label", label: "On handover: label", type: "TEXT", defaultValue: "On Handover" },
  {
    key: "schedule",
    label: "Instalments",
    type: "LIST",
    itemLabel: "Instalment",
    helperText: "Five fit one row.",
    itemFields: [
      { key: "figure", label: "Figure (e.g. 10%)", type: "TEXT" },
      { key: "label", label: "When (e.g. On booking)", type: "TEXT" },
    ],
    defaultValue: [
      { figure: "10%", label: "On booking" },
      { figure: "10%", label: "One month later" },
      { figure: "5%", label: "February 2027" },
      { figure: "5%", label: "July 2027" },
      { figure: "70%", label: "On handover" },
    ],
  },
  {
    key: "fine-print",
    label: "Fine print",
    type: "TEXT",
    long: true,
    defaultValue: "A clearly structured payment schedule, offering greater financial flexibility as your future home takes shape.",
  },
  { key: "brochure-label", label: "Brochure button label", type: "TEXT", defaultValue: "Download Brochure" },
  { key: "cta-label", label: "Second button label", type: "TEXT", defaultValue: "Submit Request" },
  { key: "cta-href", label: "Second button link", type: "LINK", defaultValue: "#contact" },
];
