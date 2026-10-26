"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { CALLOUTS, CHIPS, PLACES, PROJECT, directionsUrl } from "./places";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const STYLE_URL = process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL || "mapbox://styles/mapbox/light-v11";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function markerElement(name, kind) {
  const el = document.createElement("div");
  el.className = `map-marker map-marker--${kind}`;
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = `<span class="map-marker__dot"></span><span class="map-marker__label"></span>`;
  el.querySelector(".map-marker__label").textContent = name;
  return el;
}

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
          new mapboxgl.Marker({ element: markerElement(PROJECT.name, "project") }).setLngLat(PROJECT.coords).addTo(map);
        }
        for (const place of PLACES) {
          const el = markerElement(place.name, "place");
          markersRef.current[place.id] = el;
          new mapboxgl.Marker({ element: el }).setLngLat(place.coords).addTo(map);
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
