"use client";

import { useState } from "react";

const CHIPS = [
  "8 Min · Jumeirah Beach",
  "10 Min · Burj Khalifa",
  "16 Min · DIFC",
  "18 Min · DXB",
];

// Selection state only for now. Once Mapbox is mounted in #map,
// the active chip will fly the map to that destination.
export default function LocationChips() {
  const [active, setActive] = useState(null);

  return (
    <div className="chips" role="group" aria-label="Drive times">
      {CHIPS.map((chip) => (
        <button
          key={chip}
          type="button"
          className="chip"
          aria-pressed={active === chip}
          onClick={() => setActive(active === chip ? null : chip)}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
