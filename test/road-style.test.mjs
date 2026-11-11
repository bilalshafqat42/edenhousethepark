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

test("ground and bridge roads share one filter and one tone, so roads run unbroken", () => {
  const map = fakeMap(["road-simple", "bridge-simple"]);
  applyRoadStyle(map);
  const filters = map.calls.filter((c) => c[0] === "filter").map((c) => c[2][2]);
  assert.equal(filters.length, 2);
  assert.deepEqual(filters[0], filters[1]);
  const colours = map.calls.filter((c) => c[0] === "paint" && c[2] === "line-color").map((c) => c[3]);
  assert.equal(new Set(colours).size, 1);
  assert.ok(map.calls.some((c) => c[1] === "bridge-simple" && c[2] === "visibility" && c[3] === "visible"));
});

test("the network follows Mapbox's zoom steps (streets only when zoomed in)", () => {
  const f = JSON.stringify(roadFilter("road-simple"));
  assert.ok(f.includes('"step"') && f.includes('"street"') && f.includes('"motorway"'));
});

test("tunnels are hidden, and layers missing from the style are skipped", () => {
  const map = fakeMap(["tunnel-simple", "tunnel-path", "road-simple"]);
  applyRoadStyle(map);
  assert.ok(map.calls.some((c) => c[1] === "tunnel-simple" && c[3] === "none"));
  assert.ok(map.calls.some((c) => c[1] === "tunnel-path" && c[3] === "none"));
  assert.ok(!map.calls.some((c) => c[1] === "bridge-simple"));
});
