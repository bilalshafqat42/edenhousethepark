/*
 * The row of renders after Amenities: a narrow, a wide and a narrow
 * image, as in the design. 'Width' is the image's width in the 1440px
 * design (316 narrow, 760 wide); the row scales it to the screen.
 */
const R = "/images/renders";

const stripItemFields = [
  { key: "image", label: "Image", type: "IMAGE" },
  { key: "alt", label: "Image description (alt text)", type: "TEXT" },
  { key: "width", label: "Width in the 1440px design (316 narrow, 760 wide)", type: "TEXT", options: ["316", "760"] },
];

export const IMAGE_STRIPS_FIELDS = [
  { key: "interior-label", label: "Name read by screen readers", type: "TEXT", defaultValue: "Interiors and amenities" },
  {
    key: "interior-items",
    label: "Images (after Amenities)",
    type: "LIST",
    itemLabel: "Image",
    itemFields: stripItemFields,
    defaultValue: [
      { image: `${R}/marble-corridor.jpg`, alt: "Corridor with green marble walls", width: "316" },
      { image: `${R}/residents-lounge.jpg`, alt: "Residents' lounge with seating and a long dining table", width: "760" },
      { image: `${R}/gym.jpg`, alt: "Gym with weights and garden views", width: "316" },
    ],
  },
];
