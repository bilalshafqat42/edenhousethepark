"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { CALLOUTS, CHIPS, PLACES, PROJECT, directionsUrl } from "./places";

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
 * map there. Mapbox GL is only downloaded when the section nears the
 * viewport, and not at all without an access token.
 */
export default function LocationExplorer({ children }) {
  const [active, setActive] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const homeRef = useRef(null);
  const selectRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!TOKEN || !container) return undefined;

    let cancelled = false;

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
      } else {
        // No project coordinate yet: open framed on the destinations rather
        // than on wherever the Mapbox style's default view happens to be.
        const lngs = PLACES.map((p) => p.coords[0]);
        const lats = PLACES.map((p) => p.coords[1]);
        options.bounds = [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
        options.fitBoundsOptions = { padding: 70 };
      }

      const map = new mapboxgl.Map(options);
      mapRef.current = map;
      map.addControl(new mapboxgl.AttributionControl({ compact: true }));
      // Top right: the chat button sits in the bottom-right corner.
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      map.on("load", () => {
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
      });
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

  // Highlight the active marker.
  useEffect(() => {
    for (const [id, el] of Object.entries(markersRef.current)) {
      el.classList.toggle("is-active", id === active);
    }
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
    const duration = reducedMotion() ? 0 : 1200;
    if (PROJECT.coords) {
      map.fitBounds([PROJECT.coords, place.coords], { padding: 90, maxZoom: 14, duration });
    } else {
      map.flyTo({ center: place.coords, zoom: 14, duration, essential: false });
    }
  }, [active]);

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

        <div className="chips" role="group" aria-label="Drive times">
          {CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="chip"
              aria-pressed={active === chip.id}
              onClick={() => select(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <ul className="times" data-stagger>
          {CALLOUTS.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                className="times__row"
                aria-pressed={active === place.id}
                onClick={() => select(place.id)}
              >
                <span>{place.name}</span>
                <span className="figure">{place.time}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="btn-row location__actions">
          <button type="button" className="btn btn--line" onClick={resetView}>Reset View</button>
          <a className="btn btn--line" href={directionsUrl()} target="_blank" rel="noopener noreferrer">
            See Directions
          </a>
        </div>
      </div>

      <div className="location__map">
        <div
          ref={containerRef}
          id="map"
          className="map"
          role="region"
          aria-label="Map showing Eden House The Park and nearby destinations"
        />
      </div>
    </div>
  );
}
