/*
 * A calm, minimal road layer for the location map, applied over the Mapbox
 * Studio style once it loads.
 *
 * Why in code: in Dubai most of Sheikh Zayed Road, Al Khail Road, every
 * flyover and every canal crossing is a "bridge" in Mapbox's data, so a
 * Studio filter on the road layer alone leaves the motorways in pieces;
 * the slip roads (motorway_link) tangle at each interchange; and the
 * tunnel layers draw stray blue segments. Here the same road classes are
 * drawn on the ground, bridge and tunnel layers alike, so the lines run
 * unbroken:
 *
 * - motorway and trunk: the main lines, sage, clearly visible;
 * - primary: thinner and fainter, for context;
 * - no slip roads, streets, paths or tunnel paths.
 *
 * Everything else (land, water, labels) still comes from the Studio style.
 * A layer the style does not have is skipped, so a Studio change cannot
 * break the map.
 */

const SAGE = "137, 145, 120";
const CLASSES = ["motorway", "trunk", "primary"];

// Ground, bridge and tunnel versions of the same road layer
const STRUCTURES = {
  "road-simple": ["match", ["get", "structure"], ["none", "ford"], true, false],
  "bridge-simple": ["==", ["get", "structure"], "bridge"],
  "tunnel-simple": ["==", ["get", "structure"], "tunnel"],
};

// Path, steps and pedestrian tunnels: hidden (they were the blue strokes)
const HIDDEN = ["tunnel-path-trail", "tunnel-path-cycleway-piste", "tunnel-path", "tunnel-steps", "tunnel-pedestrian", "bridge-case-simple"];

const byClass = (main, primary) => ["match", ["get", "class"], ["motorway", "trunk"], main, primary];

export const ROAD_WIDTH = [
  "interpolate", ["exponential", 1.5], ["zoom"],
  // Wide enough that a dual carriageway reads as one line at city zoom
  9, byClass(1, 0.4),
  11, byClass(2.2, 0.9),
  13, byClass(3.4, 1.6),
  16, byClass(7, 3.5),
];

export function roadFilter(layerId) {
  return [
    "all",
    STRUCTURES[layerId],
    ["match", ["get", "class"], CLASSES, true, false],
    ["==", ["geometry-type"], "LineString"],
  ];
}

export function roadColour(layerId) {
  // Tunnels a little lighter, so a road running underground still reads
  // as the same road without competing with the surface lines
  const [main, primary] = layerId === "tunnel-simple" ? [0.4, 0.22] : [0.8, 0.4];
  return byClass(`rgba(${SAGE}, ${main})`, `rgba(${SAGE}, ${primary})`);
}

export function applyRoadStyle(map) {
  for (const id of HIDDEN) {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", "none");
  }
  for (const id of Object.keys(STRUCTURES)) {
    if (!map.getLayer(id)) continue;
    map.setFilter(id, roadFilter(id));
    map.setPaintProperty(id, "line-color", roadColour(id));
    map.setPaintProperty(id, "line-width", ROAD_WIDTH);
    map.setLayoutProperty(id, "line-cap", "round");
    map.setLayoutProperty(id, "line-join", "round");
    map.setLayoutProperty(id, "visibility", "visible");
    map.setLayerZoomRange(id, 0, 24);
  }
}
