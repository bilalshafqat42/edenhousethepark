/*
 * Location: copy, drive-time chips and destination rows on the left, the
 * Mapbox map on the right. Coordinates are decimal degrees.
 *
 * Destination coordinates: Galleria Mall, Jumeirah Beach, Dubai Opera, J1
 * Beach and Palm Jumeirah from Refine (Google Maps); Al Safa Park and Dubai
 * Mall from OpenStreetMap; the rest checked against OpenStreetMap (within
 * 200 m). TO CONFIRM BEFORE LAUNCH: the project's own coordinates, which
 * are not supplied yet. Until they are, the map opens framed on
 * the destinations and draws no project pin, and "See Directions" searches
 * Google Maps for the project name.
 */
const ICONS = ["park", "shopping", "business", "airport", "beach", "landmark"];

export const LOCATION_FIELDS = [
  { key: "eyebrow", label: "Small heading (optional)", type: "TEXT", defaultValue: "" },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "A Rare Address Between Park And Canal" },
  {
    key: "body",
    label: "Text",
    type: "TEXT",
    long: true,
    defaultValue:
      "Beside Al Safa Park and along the Dubai Water Canal, Eden House The Park brings a quieter residential setting to the heart of Dubai, with the city's most established destinations within easy reach.",
  },
  { key: "project-name", label: "Project name on the map pin and in directions", type: "TEXT", defaultValue: "Eden House The Park" },
  {
    key: "project-latitude",
    label: "Project latitude (e.g. 25.18)",
    type: "TEXT",
    helperText: "TO CONFIRM: leave both blank until Refine supplies the surveyed point. Blank: no project pin, and directions search by name.",
    defaultValue: "",
  },
  { key: "project-longitude", label: "Project longitude (e.g. 55.24)", type: "TEXT", defaultValue: "" },
  { key: "chips-aria-label", label: "Drive-time buttons, name read by screen readers", type: "TEXT", defaultValue: "Drive times" },
  {
    key: "chips",
    label: "Drive-time chips",
    type: "LIST",
    itemLabel: "Chip",
    helperText:
      "A chip whose place name matches a destination row below (e.g. DIFC) selects that row's pin; otherwise give it its own coordinates and it gets its own pin.",
    itemFields: [
      { key: "label", label: "Chip text (e.g. 8 Min · Jumeirah Beach)", type: "TEXT" },
      { key: "name", label: "Place name on the map", type: "TEXT" },
      { key: "icon", label: "Map pin icon", type: "TEXT", options: ICONS },
      { key: "side", label: "Pin label side", type: "TEXT", options: ["right", "left"] },
      { key: "latitude", label: "Latitude (blank to use the matching row)", type: "TEXT" },
      { key: "longitude", label: "Longitude (blank to use the matching row)", type: "TEXT" },
    ],
    // None in the current design; the drive times are all in the rows below.
    defaultValue: [],
  },
  {
    key: "destinations",
    label: "Destination rows",
    type: "LIST",
    itemLabel: "Destination",
    helperText: "A row with coordinates gets a pin on the map and can be clicked; a row without them is listed only.",
    itemFields: [
      { key: "name", label: "Place name", type: "TEXT" },
      { key: "time", label: "Drive time (e.g. 3 Min)", type: "TEXT" },
      { key: "icon", label: "Map pin icon", type: "TEXT", options: ICONS },
      { key: "side", label: "Pin label side", type: "TEXT", options: ["right", "left"] },
      { key: "latitude", label: "Latitude", type: "TEXT" },
      { key: "longitude", label: "Longitude", type: "TEXT" },
      {
        key: "in-view",
        label: "Show in the map's opening view",
        type: "TEXT",
        options: ["yes", "no"],
        helperText: "\"no\" for a far-away place (e.g. Palm Jumeirah), so the map opens on the city centre; its row still flies there.",
      },
    ],
    defaultValue: [
      { name: "Al Safa Park", time: "3 Min", icon: "park", side: "right", latitude: "25.185464", longitude: "55.244706" },
      { name: "Galleria Mall", time: "5 Min", icon: "shopping", side: "left", latitude: "25.207267", longitude: "55.254434" },
      { name: "City Walk", time: "8 Min", icon: "shopping", side: "right", latitude: "25.2075", longitude: "55.2622" },
      // From Refine: the J1 (Jumeirah 1) beach, about 100 m from the J1 Beach pin.
      { name: "Jumeirah Beach", time: "8 Min", icon: "beach", side: "left", latitude: "25.228069", longitude: "55.259102" },
      { name: "Burj Khalifa", time: "10 Min", icon: "landmark", side: "left", latitude: "25.1972", longitude: "55.2744" },
      { name: "Dubai Mall", time: "10 Min", icon: "shopping", side: "right", latitude: "25.197044", longitude: "55.278952" },
      { name: "Dubai Opera", time: "10 Min", icon: "landmark", side: "right", latitude: "25.195758", longitude: "55.272244" },
      { name: "J1 Beach", time: "13 Min", icon: "beach", side: "right", latitude: "25.227742", longitude: "55.258133" },
      { name: "DIFC", time: "16 Min", icon: "business", side: "right", latitude: "25.2133", longitude: "55.2818" },
      { name: "Palm Jumeirah", time: "22 Min", icon: "beach", side: "right", latitude: "25.115802", longitude: "55.140550", "in-view": "no" },
    ],
  },
  { key: "reset-label", label: "Reset button label", type: "TEXT", defaultValue: "Reset View" },
  { key: "directions-label", label: "Directions button label", type: "TEXT", defaultValue: "See Directions" },
  {
    key: "map-aria-label",
    label: "Map, description read by screen readers",
    type: "TEXT",
    defaultValue: "Map showing Eden House The Park and nearby destinations",
  },
];
