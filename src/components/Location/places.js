/*
 * Everything the location map shows, in one place. Coordinates are
 * [longitude, latitude], the order Mapbox expects.
 *
 * TO CONFIRM BEFORE LAUNCH: the destination coordinates below are
 * approximate public landmark positions, not surveyed points. Check each
 * by dropping a pin in Mapbox Studio or Google Maps and paste the result
 * here. The project coordinate is left empty until Refine supplies it:
 * until then the map opens on the style's own default view (set it in
 * Mapbox Studio) and no project pin is drawn.
 */
export const PROJECT = {
  name: "Eden House The Park",
  coords: null, // e.g. [55.2xxx, 25.1xxx]
};

// The callout rows, in the design's order.
export const CALLOUTS = [
  { id: "al-safa-park", name: "Al Safa Park", time: "3 Min", coords: [55.2398, 25.1878] },
  { id: "city-walk", name: "City Walk", time: "8 Min", coords: [55.2622, 25.2075] },
  { id: "dubai-mall", name: "Dubai Mall", time: "10 Min", coords: [55.2796, 25.1985] },
  { id: "difc", name: "DIFC", time: "16 Min", coords: [55.2818, 25.2133] },
  { id: "dxb", name: "DXB", time: "18 Min", coords: [55.3644, 25.2528] },
];

// The drive-time chips. DIFC and DXB point at the same places as above.
export const CHIPS = [
  { id: "jumeirah-beach", label: "8 Min · Jumeirah Beach", name: "Jumeirah Beach", coords: [55.2531, 25.2122] },
  { id: "burj-khalifa", label: "10 Min · Burj Khalifa", name: "Burj Khalifa", coords: [55.2744, 25.1972] },
  { id: "difc", label: "16 Min · DIFC" },
  { id: "dxb", label: "18 Min · DXB" },
];

export const PLACES = [
  ...CALLOUTS,
  ...CHIPS.filter((chip) => chip.coords).map(({ id, name, coords }) => ({ id, name, coords })),
];

// Google Maps directions to the project. Falls back to a search by name
// until the project coordinate is set.
export function directionsUrl() {
  const destination = PROJECT.coords
    ? `${PROJECT.coords[1]},${PROJECT.coords[0]}`
    : `${PROJECT.name}, Dubai`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
