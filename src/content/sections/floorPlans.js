/*
 * Floor Plans: a render on the left; on the right, one tab per layout, each
 * with up to four area rows. A row with no label is not shown. Do not
 * calculate or estimate an area that has not been confirmed (the
 * three-bedroom total area is deliberately absent).
 */
const rowFields = [1, 2, 3, 4].flatMap((n) => [
  { key: `row-${n}-label`, label: `Row ${n}: label (e.g. Suite Area)`, type: "TEXT" },
  { key: `row-${n}-value`, label: `Row ${n}: value (e.g. 1,477 – 1,500 SQ.FT.)`, type: "TEXT" },
]);

export const FLOOR_PLANS_FIELDS = [
  { key: "image", label: "Image", type: "IMAGE", helperText: "Portrait or square; it fills the left half of the section.", defaultValue: "/images/renders/bedroom.jpg" },
  { key: "image-alt", label: "Image description (alt text)", type: "TEXT", defaultValue: "Bedroom with an oak-panelled wall and a sculpted rug" },
  { key: "eyebrow", label: "Small heading", type: "TEXT", defaultValue: "Floor Plans" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "Two And Three-Bedroom Layouts" },
  { key: "tabs-aria-label", label: "Layout buttons, name read by screen readers", type: "TEXT", defaultValue: "Choose a layout" },
  {
    key: "plans",
    label: "Layouts",
    type: "LIST",
    itemLabel: "Layout",
    itemFields: [
      { key: "tab", label: "Tab label (e.g. 2 Bedroom)", type: "TEXT" },
      { key: "heading", label: "Heading (e.g. Two Bedroom)", type: "TEXT" },
      ...rowFields,
      { key: "text", label: "Description", type: "TEXT", multiline: true },
    ],
    defaultValue: [
      {
        tab: "2 Bedroom",
        heading: "Two Bedroom",
        "row-1-label": "Suite Area",
        "row-1-value": "1,477 – 1,500 SQ.FT.",
        "row-2-label": "Balcony Area",
        "row-2-value": "435 – 461 SQ.FT.",
        "row-3-label": "Total Area",
        "row-3-value": "1,933 – 1,961 SQ.FT.",
        "row-4-label": "",
        "row-4-value": "",
        text: "Two-bedroom apartments with open living and dining space, a private balcony and park views.",
      },
      {
        tab: "3 Bedroom",
        heading: "Three Bedroom",
        "row-1-label": "Suite Area",
        "row-1-value": "1,782 – 1,855 SQ.FT.",
        "row-2-label": "Outdoor Area",
        "row-2-value": "501 – 2,142 SQ.FT.",
        "row-3-label": "",
        "row-3-value": "",
        "row-4-label": "",
        "row-4-value": "",
        text: "Three-bedroom apartments with a maid's room, private outdoor space and skyline, park or canal views, depending on the unit.",
      },
    ],
  },
  { key: "cta-label", label: "Button label", type: "TEXT", defaultValue: "View Floor Plan Samples" },
  { key: "cta-href", label: "Button link", type: "LINK", defaultValue: "#contact" },
];
