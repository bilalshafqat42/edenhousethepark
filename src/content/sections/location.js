/*
 * Location: copy, drive-time chips and destination rows on the left, the
 * Mapbox map on the right. Coordinates are decimal degrees.
 *
 * TO CONFIRM BEFORE LAUNCH: the destination coordinates are approximate
 * public landmark positions, not surveyed points, and the project's own
 * coordinates are not supplied yet. Until they are, the map opens framed on
 * the destinations and draws no project pin, and "See Directions" searches
 * Google Maps for the project name.
 */
const ICONS = ["park", "shopping", "business", "airport", "beach", "landmark"];

export const LOCATION_FIELDS = [
  { key: "eyebrow", label: "Small heading", type: "TEXT", defaultValue: "Central Dubai," },
  { key: "heading", label: "Heading", type: "TEXT", defaultValue: "Ten Minutes From Burj Khalifa" },
  {
    key: "body",
    label: "Text",
    type: "TEXT",
    long: true,
    defaultValue:
      "Eden House The Park sits on the Dubai Water Canal beside Al Safa Park, with Burj Khalifa, DIFC and Jumeirah Beach a short drive away and the 6.4 km canal promenade outside.",
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
    defaultValue: [
      { label: "8 Min · Jumeirah Beach", name: "Jumeirah Beach", icon: "beach", side: "left", latitude: "25.2122", longitude: "55.2531" },
      { label: "10 Min · Burj Khalifa", name: "Burj Khalifa", icon: "landmark", side: "left", latitude: "25.1972", longitude: "55.2744" },
      { label: "16 Min · DIFC", name: "DIFC", icon: "", side: "", latitude: "", longitude: "" },
      { label: "18 Min · DXB", name: "DXB", icon: "", side: "", latitude: "", longitude: "" },
    ],
  },
  {
    key: "destinations",
    label: "Destination rows",
    type: "LIST",
    itemLabel: "Destination",
    itemFields: [
      { key: "name", label: "Place name", type: "TEXT" },
      { key: "time", label: "Drive time (e.g. 3 Min)", type: "TEXT" },
      { key: "icon", label: "Map pin icon", type: "TEXT", options: ICONS },
      { key: "side", label: "Pin label side", type: "TEXT", options: ["right", "left"] },
      { key: "latitude", label: "Latitude", type: "TEXT" },
      { key: "longitude", label: "Longitude", type: "TEXT" },
    ],
    defaultValue: [
      { name: "Al Safa Park", time: "3 Min", icon: "park", side: "right", latitude: "25.1878", longitude: "55.2398" },
      { name: "City Walk", time: "8 Min", icon: "shopping", side: "right", latitude: "25.2075", longitude: "55.2622" },
      { name: "Dubai Mall", time: "10 Min", icon: "shopping", side: "right", latitude: "25.1985", longitude: "55.2796" },
      { name: "DIFC", time: "16 Min", icon: "business", side: "right", latitude: "25.2133", longitude: "55.2818" },
      { name: "DXB", time: "18 Min", icon: "airport", side: "right", latitude: "25.2528", longitude: "55.3644" },
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
