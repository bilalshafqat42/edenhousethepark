/*
 * Amenities: a centred heading and intro, then a draggable row of cards
 * (image, title, text) running off the right edge of the page.
 * TODO(content): the first two cards use stand-in renders (no lounge or
 * pool render supplied yet), and the third card's title is cut off in the
 * design, so it keeps "The Park At The Centre" until confirmed.
 */
const R = "/images/renders";

export const GALLERY_FIELDS = [
  { key: "eyebrow", label: "Small heading (optional)", type: "TEXT", defaultValue: "" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "A Life Exceptionally Well Catered For" },
  {
    key: "body",
    label: "Intro text",
    type: "TEXT",
    long: true,
    defaultValue:
      "From bespoke in-residence services to private wellness facilities and landscaped retreats, every aspect of life is supported by the signature care of Eden House.",
  },
  {
    key: "items",
    label: "Cards",
    type: "LIST",
    itemLabel: "Card",
    helperText: "Images are cropped to 596×376 (landscape). Three show at once on a laptop; the rest are dragged into view.",
    itemFields: [
      { key: "title", label: "Title", type: "TEXT" },
      { key: "text", label: "Text", type: "TEXT", multiline: true },
      { key: "image", label: "Image", type: "IMAGE" },
      { key: "alt", label: "Image description (alt text)", type: "TEXT" },
    ],
    defaultValue: [
      {
        title: "Personalised In-Residence Services",
        text: "Private chefs, butlers, housekeeping and tailored home care, arranged around your individual needs.",
        image: `${R}/residents-lounge.jpg`,
        alt: "Residents' lounge with seating and a long dining table",
      },
      {
        title: "Five Pools Across The Community",
        text: "Three adult swimming pools and two children's pools, complemented by indoor pool lounges and jacuzzis.",
        image: `${R}/garden-path.jpg`,
        alt: "Landscaped garden path between the buildings",
      },
      {
        title: "The Park At The Centre",
        text: "A car-free park sits at the centre of the community, with playgrounds and gardens between the buildings.",
        image: `${R}/park-pavilion.jpg`,
        alt: "Landscaped park with a pavilion beneath a footbridge",
      },
      {
        title: "Wellness Close To Home",
        text: "Gyms, movement studios, saunas and steam rooms, and 5 pools, 2 of them for children.",
        image: `${R}/gym.jpg`,
        alt: "Gym with weights and garden views",
      },
      {
        title: "Looked After On Site",
        text: "An Eden House team on site, with 24-hour security and 24-hour maintenance across the community.",
        image: `${R}/arrival-court.jpg`,
        alt: "Landscaped arrival court between the buildings at dusk",
      },
      {
        title: "Life On The Canal",
        text: "The 6.4 km canal promenade is there for a morning walk or an evening run along the water.",
        image: `${R}/aerial-canal.jpg`,
        alt: "Aerial view of the buildings along the Dubai Water Canal",
      },
    ],
  },
];
