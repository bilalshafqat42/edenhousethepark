/*
 * "An Expression Of Understated Luxury": heading, text and a draggable
 * carousel of interior renders, built like "A Considered Sense Of Place".
 * The second slide opens in the centre; a slide shows a caption only when
 * it has a title.
 * TODO(content): the design's interior renders (living and dining room,
 * green marble wall) are not supplied yet; stand-ins are used until they are.
 */
const R = "/images/renders";

export const INTERIORS_FIELDS = [
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "An Expression Of Understated Luxury" },
  {
    key: "body",
    label: "Text",
    type: "TEXT",
    long: true,
    defaultValue:
      "A refined approach to architecture and interiors, bringing together natural warmth, contemporary elegance and an enduring sense of home.",
  },
  {
    key: "slides",
    label: "Slides",
    type: "LIST",
    itemLabel: "Slide",
    helperText: "Three or more work best. The caption shows only when the slide has a title.",
    itemFields: [
      { key: "image", label: "Image", type: "IMAGE" },
      { key: "alt", label: "Image description (alt text)", type: "TEXT" },
      { key: "title", label: "Caption title (optional)", type: "TEXT" },
      { key: "text", label: "Caption text (optional)", type: "TEXT", multiline: true },
      { key: "position", label: "Image focus (optional, e.g. 22% 50%)", type: "TEXT" },
    ],
    defaultValue: [
      { image: `${R}/marble-corridor.jpg`, alt: "Corridor with green marble walls", title: "", text: "", position: "" },
      {
        image: `${R}/residents-lounge.jpg`,
        alt: "Lounge with a long dining table, oak panelling and soft seating",
        title: "Interiors By H&H",
        text: "Open-grained oak, Crema d'Orcia stone and bronze-accented wardrobes create an elegant residential palette.",
        position: "",
      },
      { image: `${R}/bedroom.jpg`, alt: "Bedroom with an oak-panelled wall and a sculpted rug", title: "", text: "", position: "" },
    ],
  },
];
