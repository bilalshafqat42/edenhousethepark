// "Designed Around Everyday Life": the amenities cards, two per row.
const R = "/images/renders";

export const GALLERY_FIELDS = [
  { key: "eyebrow", label: "Small heading", type: "TEXT", defaultValue: "Designed" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "Around Everyday Life" },
  {
    key: "items",
    label: "Cards",
    type: "LIST",
    itemLabel: "Card",
    helperText: "Images are cropped to 596×376 (landscape).",
    itemFields: [
      { key: "title", label: "Title", type: "TEXT" },
      { key: "text", label: "Text", type: "TEXT", multiline: true },
      { key: "image", label: "Image", type: "IMAGE" },
      { key: "alt", label: "Image description (alt text)", type: "TEXT" },
    ],
    defaultValue: [
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
