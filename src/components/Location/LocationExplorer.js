"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import InlineText from "@/components/InlineText";
import { toPlainText } from "@/lib/inline-text";
import { buildPlaces, directionsUrl } from "./places";
import { applyRoadStyle } from "./road-style";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const STYLE_URL = process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL || "mapbox://styles/mapbox/light-v11";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Line icons for the map pins, drawn on a 24px grid.
const MarkerIcons = {
  park: '<path d="M12 3l5 7h-3l4 6H6l4-6H7z"/><path d="M12 16v5"/>',
  shopping: '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  business: '<path d="M7 21V4h10v17"/><path d="M4 21h16"/><path d="M10 8h1M13 8h1M10 12h1M13 12h1M10 16h1M13 16h1"/>',
  airport: '<path d="M21 15l-8-4V5a1 1 0 0 0-2 0v6l-8 4v2l8-2v4l-2 1.5V22l3-1 3 1v-1.5L13 19v-4l8 2z"/>',
  beach: '<path d="M3 15c2 0 2-2 4.5-2s2.5 2 4.5 2 2-2 4.5-2 2.5 2 4.5 2"/><path d="M3 19c2 0 2-2 4.5-2s2.5 2 4.5 2 2-2 4.5-2 2.5 2 4.5 2"/><circle cx="12" cy="7" r="3"/>',
  landmark: '<path d="M12 2v3"/><path d="M10.5 5h3l1 16h-5z"/><path d="M8 21h8"/>',
  project: '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
};

// A square brand pin with an icon, and the place's name beside it.
function markerElement({ name, icon = "project", side = "right" }, kind) {
  // `name` is plain text and is set with textContent below, never as HTML.
  const el = document.createElement("div");
  el.className = `map-marker map-marker--${kind} map-marker--${side}`;
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = `<span class="map-marker__pin"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${MarkerIcons[icon]}</svg></span><span class="map-marker__label"></span>`;
  el.querySelector(".map-marker__label").textContent = name;
  return el;
}

// Anchor on the pin's centre, whichever side the label is on.
const PIN_HALF = 12;
const markerOptions = (element, side) =>
  side === "left"
    ? { element, anchor: "right", offset: [PIN_HALF, 0] }
    : { element, anchor: "left", offset: [-PIN_HALF, 0] };

/*
 * The left column's controls and the right column's Mapbox map share one
 * selection: clicking a chip or a callout row highlights it and moves the
 * map there. Mapbox GL (and its stylesheet's script) is only downloaded
 * when the section comes within a screen of the viewport, and not at all
 * without an access token.
 *
 * The places, labels and project coordinate come from the panel's Location
 * & Map section (`content`), shaped by buildPlaces in ./places.js.
 */
export default function LocationExplorer({ content, children }) {
  const { project: PROJECT, callouts: CALLOUTS, chips: CHIPS, places: PLACES } = useMemo(
    () => buildPlaces(content),
    [content],
  );
  // The map is built once; it reads the places from here rather than
  // re-running its effect if the props object changes identity.
  const placesRef = useRef({ PROJECT, PLACES });
  const [active, setActive] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const homeRef = useRef(null);
  const selectRef = useRef(null);
  const layoutRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!TOKEN || !container) return undefined;

    let cancelled = false;
    const { PROJECT, PLACES } = placesRef.current;

    /*
     * Places close together (Dubai Opera beside Burj Khalifa) would draw on
     * top of each other. Taking the selected place first, then the list
     * order: a marker whose pin lands on one already placed folds away
     * entirely; one whose label would overlap keeps its pin and hides its
     * name. Both come back on hover, when selected, or once zoomed in far
     * enough to fit. Re-run whenever the map settles.
     */
    const layoutLabels = () => {
      const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
      const ids = Object.keys(markersRef.current);
      for (const id of ids) markersRef.current[id].classList.remove("is-label-hidden", "is-folded");
      const ordered = [...ids].sort((x, y) =>
        Number(markersRef.current[y].classList.contains("is-active")) - Number(markersRef.current[x].classList.contains("is-active")));
      const taken = [];
      for (const id of ordered) {
        const el = markersRef.current[id];
        const pin = el.querySelector(".map-marker__pin").getBoundingClientRect();
        const label = el.querySelector(".map-marker__label").getBoundingClientRect();
        if (taken.some((r) => overlaps(pin, r))) { el.classList.add("is-folded"); continue; }
        taken.push(pin);
        if (taken.slice(0, -1).some((r) => overlaps(label, r))) el.classList.add("is-label-hidden");
        else taken.push(label);
      }
    };
    layoutRef.current = layoutLabels;

    const init = async () => {
      const { default: mapboxgl } = await import("mapbox-gl");
      if (cancelled) return;

      const options = {
        container,
        style: STYLE_URL,
        accessToken: TOKEN,
        // Scrolling past the map scrolls the page; ctrl/cmd or two
        // fingers zoom the map.
        cooperativeGestures: true,
        attributionControl: false,
      };
      if (PROJECT.coords) {
        Object.assign(options, { center: PROJECT.coords, zoom: 12.5 });
      } else if (PLACES.length > 0) {
        // No project coordinate yet: open framed on the destinations rather
        // than on wherever the Mapbox style's default view happens to be.
        // A far-away place set to "no" for the opening view is left out.
        const framed = PLACES.filter((p) => p.inView);
        const inFrame = framed.length > 0 ? framed : PLACES;
        const lngs = inFrame.map((p) => p.coords[0]);
        const lats = inFrame.map((p) => p.coords[1]);
        options.bounds = [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
        options.fitBoundsOptions = { padding: 140 }; // wider city context, as designed
      }

      const map = new mapboxgl.Map(options);
      mapRef.current = map;
      map.addControl(new mapboxgl.AttributionControl({ compact: true }));

      map.on("load", () => {
        applyRoadStyle(map);
        homeRef.current = { center: map.getCenter(), zoom: map.getZoom(), bearing: map.getBearing(), pitch: map.getPitch() };

        if (PROJECT.coords) {
          const el = markerElement({ name: PROJECT.name }, "project");
          new mapboxgl.Marker(markerOptions(el, "right")).setLngLat(PROJECT.coords).addTo(map);
        }
        for (const place of PLACES) {
          const el = markerElement(place, "place");
          // Clicking a callout on the map selects it, like the rows do.
          el.addEventListener("click", () => selectRef.current?.(place.id));
          markersRef.current[place.id] = el;
          new mapboxgl.Marker(markerOptions(el, place.side)).setLngLat(place.coords).addTo(map);
        }
        setMapReady(true);
        layoutLabels();
      });
      // Labels are re-checked whenever the map settles at a new view.
      map.on("moveend", layoutLabels);
    };

    // Load when the section is within a screen of the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          init();
        }
      },
      { rootMargin: "100% 0px" },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // Highlight the active marker, and re-check which labels fit.
  useEffect(() => {
    for (const [id, el] of Object.entries(markersRef.current)) {
      el.classList.toggle("is-active", id === active);
    }
    layoutRef.current?.();
  }, [active, mapReady]);

  const select = useCallback((id) => {
    const next = active === id ? null : id;
    setActive(next);
    const map = mapRef.current;
    if (!map || !homeRef.current) return;

    if (!next) {
      map.easeTo({ ...homeRef.current, duration: reducedMotion() ? 0 : 900 });
      return;
    }
    const place = PLACES.find((p) => p.id === next);
    if (!place) return;
    const duration = reducedMotion() ? 0 : 1200;
    if (PROJECT.coords) {
      map.fitBounds([PROJECT.coords, place.coords], { padding: 90, maxZoom: 14, duration });
    } else {
      map.flyTo({ center: place.coords, zoom: 14, duration, essential: false });
    }
  }, [active, PLACES, PROJECT]);

  useEffect(() => {
    selectRef.current = select;
  }, [select]);

  const resetView = useCallback(() => {
    setActive(null);
    const map = mapRef.current;
    if (map && homeRef.current) map.easeTo({ ...homeRef.current, duration: reducedMotion() ? 0 : 900 });
  }, []);

  return (
    <div className="location__split">
      <div className="location__text">
        {children}

        {CHIPS.length > 0 && (
          <div className="chips" role="group" aria-label={toPlainText(content?.["chips-aria-label"] ?? "")}>
            {CHIPS.map((chip, i) => (
              <button
                key={`${chip.id}-${i}`}
                type="button"
                className="chip"
                aria-pressed={active === chip.id}
                onClick={() => select(chip.id)}
              >
                <InlineText value={chip.text} inLink />
              </button>
            ))}
          </div>
        )}

        {/* A destination with a map pin is a button that shows it on the map;
            one without coordinates is listed only. */}
        <ul className="times" data-stagger>
          {CALLOUTS.map((place, i) => (
            <li key={`${place.id}-${i}`}>
              {place.coords ? (
                <button
                  type="button"
                  className="times__row"
                  aria-pressed={active === place.id}
                  onClick={() => select(place.id)}
                >
                  <span><InlineText value={place.name} inLink /></span>
                  <span className="figure"><InlineText value={place.time} inLink /></span>
                </button>
              ) : (
                <div className="times__row">
                  <span><InlineText value={place.name} /></span>
                  <span className="figure"><InlineText value={place.time} /></span>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="btn-row location__actions">
          <button type="button" className="btn btn--line" onClick={resetView}>
            <InlineText value={content?.["reset-label"]} inLink />
          </button>
          <a className="btn btn--line" href={directionsUrl(PROJECT)} target="_blank" rel="noopener noreferrer">
            <InlineText value={content?.["directions-label"]} inLink />
          </a>
        </div>
      </div>

      <div className="location__map">
        <div
          ref={containerRef}
          id="map"
          className="map"
          role="region"
          aria-label={toPlainText(content?.["map-aria-label"] ?? "")}
        />
      </div>
    </div>
  );
}
