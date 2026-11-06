/*
 * Interiors and floor plans: a render on the left half, and on the right a
 * small heading, heading, intro line, one tab per layout, and each layout's
 * heading, description and up to four area rows. Choosing a tab swaps the
 * render; "View Floor Plan Samples" opens that layout's plans full screen.
 * A layout with no floor plan images sends the button to "Button link".
 *
 * A row with no label is not shown. Do not calculate or estimate an area
 * that has not been confirmed (the three-bedroom total area is deliberately
 * absent, and the four-bedroom areas are not supplied yet).
 *
 * Keys are never renamed (saved values are stored by key); new keys only.
 */
const R = "/images/renders";
// TODO(content): placeholder until the real floor plan images are uploaded.
const PLAN_PLACEHOLDER = "/images/floor-plans/placeholder.svg";

const rowFields = [1, 2, 3, 4].flatMap((n) => [
  { key: `row-${n}-label`, label: `Row ${n}: label (e.g. Suite Area)`, type: "TEXT" },
  { key: `row-${n}-value`, label: `Row ${n}: value (e.g. 1,477 – 1,500 SQ.FT.)`, type: "TEXT" },
]);

const planImageFields = [1, 2, 3, 4].map((n) => ({
  key: `plan-${n}-image`,
  label: `Floor plan ${n} (optional)`,
  type: "IMAGE",
}));

const noRows = { "row-1-label": "", "row-1-value": "", "row-2-label": "", "row-2-value": "", "row-3-label": "", "row-3-value": "", "row-4-label": "", "row-4-value": "" };
const placeholderPlans = { "plan-1-image": PLAN_PLACEHOLDER, "plan-2-image": PLAN_PLACEHOLDER, "plan-3-image": "", "plan-4-image": "" };

export const FLOOR_PLANS_FIELDS = [
  {
    key: "image",
    label: "Image (used when a layout has no image of its own)",
    type: "IMAGE",
    helperText: "Portrait, about 720 x 800; it fills the left half of the section.",
    defaultValue: `${R}/bedroom.jpg`,
  },
  { key: "image-alt", label: "Image description (alt text)", type: "TEXT", defaultValue: "Bedroom with an oak-panelled wall and a sculpted rug" },
  { key: "eyebrow", label: "Small heading", type: "TEXT", defaultValue: "Interiors To Elevate Your Living" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "The Comfort Of Space And Privacy" },
  {
    key: "body",
    label: "Intro text",
    type: "TEXT",
    long: true,
    defaultValue: "Generously proportioned two-bedroom residences with private outdoor spaces and a welcoming sense of comfort.",
  },
  { key: "tabs-aria-label", label: "Layout buttons, name read by screen readers", type: "TEXT", defaultValue: "Choose a layout" },
  {
    key: "plans",
    label: "Layouts",
    type: "LIST",
    itemLabel: "Layout",
    helperText: "One tab each. The image shows on the left when the tab is chosen; the floor plans open from the button.",
    itemFields: [
      { key: "tab", label: "Tab label (e.g. 2 Bedroom)", type: "TEXT" },
      { key: "heading", label: "Heading (e.g. Two Bedroom)", type: "TEXT" },
      { key: "image", label: "Image for this layout (optional)", type: "IMAGE" },
      { key: "image-alt", label: "Image description (alt text)", type: "TEXT" },
      ...rowFields,
      { key: "text", label: "Description", type: "TEXT", multiline: true },
      ...planImageFields,
    ],
    defaultValue: [
      {
        tab: "2 Bedroom",
        heading: "Two Bedroom",
        image: `${R}/bedroom.jpg`,
        "image-alt": "Bedroom with an oak-panelled wall and a sculpted rug",
        "row-1-label": "Suite Area",
        "row-1-value": "1,477 – 1,500 SQ.FT.",
        "row-2-label": "Balcony Area",
        "row-2-value": "435 – 461 SQ.FT.",
        "row-3-label": "Total Area",
        "row-3-value": "1,933 – 1,961 SQ.FT.",
        "row-4-label": "",
        "row-4-value": "",
        text: "Two-bedroom apartments with open living and dining space, a private balcony and park views.",
        ...placeholderPlans,
      },
      {
        tab: "3 Bedroom",
        heading: "Three Bedroom",
        // TODO(content): stand-in render until the three-bedroom render is supplied.
        image: `${R}/residents-lounge.jpg`,
        "image-alt": "Lounge with seating and a long dining table",
        "row-1-label": "Suite Area",
        "row-1-value": "1,782 – 1,855 SQ.FT.",
        "row-2-label": "Outdoor Area",
        "row-2-value": "501 – 2,142 SQ.FT.",
        "row-3-label": "",
        "row-3-value": "",
        "row-4-label": "",
        "row-4-value": "",
        text: "Three-bedroom apartments with a maid's room, private outdoor space and skyline, park or canal views, depending on the unit.",
        ...placeholderPlans,
      },
      {
        tab: "4 Bedroom",
        heading: "Four Bedroom",
        // TODO(content): stand-in render, and no areas or description supplied yet.
        image: `${R}/marble-corridor.jpg`,
        "image-alt": "Corridor with green marble walls",
        ...noRows,
        text: "",
        ...placeholderPlans,
      },
    ],
  },
  { key: "cta-label", label: "Button label", type: "TEXT", defaultValue: "View Floor Plan Samples" },
  {
    key: "cta-href",
    label: "Button link (used only for a layout with no floor plan images)",
    type: "LINK",
    defaultValue: "#contact",
  },
];
