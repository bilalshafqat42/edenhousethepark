/*
 * "A Considered Sense Of Place": heading, text and a draggable carousel of
 * renders. The second slide opens in the centre. A slide shows a caption
 * only when it has a title.
 */
const R = "/images/renders";

export const PLACE_FIELDS = [
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "A Considered Sense Of Place" },
  {
    key: "body",
    label: "Text",
    type: "TEXT",
    long: true,
    defaultValue: "A residential setting defined by understated elegance, a connection to nature and a sense of belonging.",
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
      { image: `${R}/hero-aerial-canal.jpg`, alt: "Aerial view of the buildings along the Dubai Water Canal", title: "", text: "", position: "22% 50%" },
      {
        image: `${R}/canal-skyline.jpg`,
        alt: "Canal promenade beside the buildings, with the city skyline behind",
        title: "Life Along The Canal",
        text: "Direct access to the 6.4 km canal promenade, with waterfront views and walkable surroundings.",
        position: "",
      },
      { image: `${R}/garden-path.jpg`, alt: "Garden path between the buildings", title: "Rooted In The Greenery", text: "", position: "" },
    ],
  },
];
