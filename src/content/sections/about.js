// About The Developer.
export const ABOUT_FIELDS = [
  { key: "eyebrow", label: "Small heading", type: "TEXT", defaultValue: "A Park-Led" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "About The Developer" },
  { key: "brochure-label", label: "Brochure button label", type: "TEXT", defaultValue: "Download Brochure" },
  {
    key: "paragraphs",
    label: "Paragraphs",
    type: "LIST",
    itemLabel: "Paragraph",
    itemFields: [{ key: "text", label: "Paragraph", type: "TEXT", multiline: true }],
    defaultValue: [
      {
        text: "Eden House The Park is a community of 459 homes in seven low-rise buildings on the Dubai Water Canal, with two- and three-bedroom apartments on sale. The architecture is by dxb lab, the interiors by H&H and the landscape by WAHO, and a car-free park sits at the centre, so the paths between the buildings are for walking, not driving.",
      },
      {
        text: "Eden House is the homegrown residential hospitality brand H&H founded in 2021, independent from hotel operators. H&H has developed in Dubai since 2007, and The Park brings Eden House to a community of seven low-rise buildings, finished in pale terrazzo and curved oak, with views of the canal, the gardens and the skyline.",
      },
    ],
  },
];
