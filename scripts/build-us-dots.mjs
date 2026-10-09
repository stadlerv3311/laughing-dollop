// Builds public/images/us-dots.svg — the lower 48 as a field of faint dots, for the map behind Ship with us
// (components/home/ShipRouteMap.tsx) — and public/images/us-dots-mask.svg, the same dots in solid white, which that map
// uses as a mask so its white wave only lights the dots (2026-10-02). It reuses the state shapes in lib/us-states.ts (same 960 × 613 map units), so
// re-run it after rebuilding those. From the repo root:
//   node scripts/build-us-dots.mjs
import { readFileSync, writeFileSync } from "node:fs";

/** Dot spacing and radius, in map units, and the dots' ink strength (the edge's dots add EDGE's to it). */
const STEP = 9;
const RADIUS = 1.7;
const OPACITY = 0.13;

const source = readFileSync(new URL("../lib/us-states.ts", import.meta.url), "utf8");
const width = Number(source.match(/US_MAP_WIDTH = (\d+)/)[1]);
const height = Number(source.match(/US_MAP_HEIGHT = (\d+)/)[1]);
const shapes = [...source.matchAll(/"d": "([^"]+)"/g)].map((match) => match[1]).join("");

// The dots along the country's edge, drawn again over the field so the outline stands out (the builder, 2026-10-08:
// "borders of USA have brighter dots. so the map pops a bit"). A dot is on the edge when a point EDGE[n].reach map
// units from it, in any direction, is outside every state: the border, the coasts and the Great Lakes' shores, never
// a line between two states. The outermost row is the brightest and the row behind it half as much, so the edge
// fades into the field. Each row is one path of zero-length strokes with round caps, which draws the same dot.
const EDGE = [
  { reach: 6.5, opacity: 0.3 },
  { reach: 14, opacity: 0.14 },
];
const polygons = shapes
  .split("M")
  .filter(Boolean)
  .map((ring) => ring.replace(/Z/g, "").split("L").map((point) => point.split(",").map(Number)));
const inside = (x, y) => {
  let hit = false;
  for (const ring of polygons) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
  }
  return hit;
};
const DIRECTIONS = Array.from({ length: 16 }, (_, i) => [Math.cos((i * Math.PI) / 8), Math.sin((i * Math.PI) / 8)]);
const rows = EDGE.map(() => []);
for (let y = STEP / 2; y < height; y += STEP) {
  for (let x = STEP / 2; x < width; x += STEP) {
    if (!inside(x, y)) continue;
    const row = EDGE.findIndex(({ reach }) => DIRECTIONS.some(([dx, dy]) => !inside(x + dx * reach, y + dy * reach)));
    if (row >= 0) rows[row].push(`M${x} ${y}h0`);
  }
}
const edge = rows
  .map((row, i) => `<path d="${row.join("")}" stroke-opacity="${EDGE[i].opacity}"/>`)
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">\
<defs><pattern id="d" width="${STEP}" height="${STEP}" patternUnits="userSpaceOnUse">\
<circle cx="${STEP / 2}" cy="${STEP / 2}" r="${RADIUS}" fill="#252525"/></pattern>\
<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">\
<path fill="#fff" d="${shapes}"/></mask></defs>\
<rect width="${width}" height="${height}" fill="url(#d)" fill-opacity="${OPACITY}" mask="url(#m)"/>\
<g fill="none" stroke="#252525" stroke-width="${RADIUS * 2}" stroke-linecap="round">${edge}</g></svg>
`;

writeFileSync(new URL("../public/images/us-dots.svg", import.meta.url), svg);
console.log(`public/images/us-dots.svg — ${(svg.length / 1024).toFixed(1)} KB, ${rows.map((row) => row.length).join(" + ")} edge dots`);

// The same dots at full strength, white: a CSS mask, so only their alpha matters.
const mask = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">\
<defs><pattern id="d" width="${STEP}" height="${STEP}" patternUnits="userSpaceOnUse">\
<circle cx="${STEP / 2}" cy="${STEP / 2}" r="${RADIUS}" fill="#fff"/></pattern>\
<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">\
<path fill="#fff" d="${shapes}"/></mask></defs>\
<rect width="${width}" height="${height}" fill="url(#d)" mask="url(#m)"/></svg>
`;

writeFileSync(new URL("../public/images/us-dots-mask.svg", import.meta.url), mask);
console.log(`public/images/us-dots-mask.svg — ${(mask.length / 1024).toFixed(1)} KB`);
