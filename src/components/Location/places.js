import { toPlainText } from "@/lib/inline-text";
import { lngLat, slugify } from "@/lib/safe-url";

/*
 * Everything the location map shows, built from the panel's Location & Map
 * section (src/content/sections/location.js). Coordinates come out as
 * [longitude, latitude], the order Mapbox expects.
 *
 * TO CONFIRM BEFORE LAUNCH: the destination coordinates are approximate
 * public landmark positions, not surveyed points, and the project
 * coordinate is blank until Refine supplies it. Until then the map opens
 * framed on the destinations and no project pin is drawn.
 *
 * A place's id is its name made into a slug ("Al Safa Park" ->
 * "al-safa-park"), so a chip named like a destination row ("DIFC") selects
 * that row's pin.
 */
const ICONS = new Set(["park", "shopping", "business", "airport", "beach", "landmark"]);
const list = (value) => (Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : []);
const icon = (value) => (ICONS.has(value) ? value : undefined);
const side = (value) => (value === "left" ? "left" : undefined);

export function buildPlaces(content = {}) {
  const project = {
    name: toPlainText(content["project-name"] ?? "") || "Eden House The Park",
    coords: lngLat(content["project-longitude"], content["project-latitude"]),
  };

  const callouts = list(content.destinations)
    .map((row) => ({
      id: slugify(toPlainText(row.name ?? "")),
      name: row.name ?? "",
      label: toPlainText(row.name ?? ""),
      time: row.time ?? "",
      icon: icon(row.icon),
      side: side(row.side),
      coords: lngLat(row.longitude, row.latitude),
    }))
    .filter((row) => row.id);

  const chips = list(content.chips)
    .map((chip) => {
      const label = toPlainText(chip.name ?? "");
      return {
        id: slugify(label || toPlainText(chip.label ?? "")),
        text: chip.label ?? "",
        label,
        icon: icon(chip.icon),
        side: side(chip.side),
        coords: lngLat(chip.longitude, chip.latitude),
      };
    })
    .filter((chip) => chip.id);

  // Map pins: every destination with coordinates, then every chip with its own.
  const seen = new Set();
  const places = [...callouts, ...chips]
    .filter((place) => place.coords && !seen.has(place.id) && seen.add(place.id))
    .map(({ id, label, icon: placeIcon, side: placeSide, coords }) => ({
      id,
      name: label,
      icon: placeIcon,
      side: placeSide,
      coords,
    }));

  return { project, callouts, chips, places };
}

// Google Maps directions to the project; a search by name until its coordinate is set.
export function directionsUrl(project) {
  const destination = project.coords ? `${project.coords[1]},${project.coords[0]}` : `${project.name}, Dubai`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
