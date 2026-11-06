/*
 * About the developer: H&H logo, heading and brochure button on the left,
 * the text on the right.
 * TODO(content): the H&H logo file is not supplied yet; until it is
 * uploaded the logo is simply left out.
 */
export const ABOUT_FIELDS = [
  {
    key: "logo",
    label: "Developer logo (optional)",
    type: "IMAGE",
    helperText: "SVG preferred, or a transparent PNG. Shown 45px tall.",
    defaultValue: "",
  },
  { key: "eyebrow", label: "Small heading (optional)", type: "TEXT", defaultValue: "" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "H&H — A Legacy Of Design Excellence" },
  { key: "brochure-label", label: "Brochure button label", type: "TEXT", defaultValue: "Download Brochure" },
  {
    key: "paragraphs",
    label: "Paragraphs",
    type: "LIST",
    itemLabel: "Paragraph",
    itemFields: [{ key: "text", label: "Paragraph", type: "TEXT", multiline: true }],
    defaultValue: [
      {
        text: "Established in Dubai in 2007, H&H is a developer and asset manager recognised for its commitment to exceptional craftsmanship, architectural integrity and enduring quality. Its distinguished portfolio includes collaborations with globally renowned names such as Four Seasons, Aman and Rosewood, alongside its own residential hospitality brand, Eden House. Through a carefully curated approach to development, H&H continues to create distinctive addresses that bring together design, quality and a refined way of living.",
      },
    ],
  },
];
