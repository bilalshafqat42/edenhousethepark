import { test } from "node:test";
import assert from "node:assert/strict";

import { applyRoadStyle, roadFilter } from "@/components/Location/road-style";

// A stand-in map that records calls, with only some layers present
function fakeMap(layers) {
  const calls = [];
  return {
    calls,
    getLayer: (id) => (layers.includes(id) ? { id } : undefined),
    setFilter: (id, f) => calls.push(["filter", id, f]),
    setPaintProperty: (id, k, v) => calls.push(["paint", id, k, v]),
    setLayoutProperty: (id, k, v) => calls.push(["layout", id, k, v]),
    setLayerZoomRange: (id, a, b) => calls.push(["zoom", id, a, b]),
  };
}

test("bridges are shown with the same road classes, so motorways run unbroken", () => {
  const map = fakeMap(["road-simple", "bridge-simple", "tunnel-simple"]);
  applyRoadStyle(map);
  assert.ok(map.calls.some((c) => c[0] === "layout" && c[1] === "bridge-simple" && c[2] === "visibility" && c[3] === "visible"));
  for (const id of ["road-simple", "bridge-simple", "tunnel-simple"]) {
    const f = map.calls.find((c) => c[0] === "filter" && c[1] === id)[2];
    assert.deepEqual(f[2], ["match", ["get", "class"], ["motorway", "trunk", "primary"], true, false]);
  }
});

test("slip roads are not drawn", () => {
  assert.ok(!JSON.stringify(roadFilter("road-simple")).includes("motorway_link"));
});

test("tunnel paths are hidden, and layers missing from the style are skipped", () => {
  const map = fakeMap(["tunnel-path", "road-simple"]);
  applyRoadStyle(map);
  assert.ok(map.calls.some((c) => c[1] === "tunnel-path" && c[3] === "none"));
  assert.ok(!map.calls.some((c) => c[1] === "bridge-simple"));
});
