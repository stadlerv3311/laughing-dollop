// Builds public/images/us-dots.svg — the lower 48 as a field of faint dots, for the map behind Ship with us
// (components/home/ShipRouteMap.tsx). It reuses the state shapes in lib/us-states.ts (same 960 × 613 map units), so
// re-run it after rebuilding those. From the repo root:
//   node scripts/build-us-dots.mjs
import { readFileSync, writeFileSync } from "node:fs";

/** Dot spacing and radius, in map units, and the dots' ink strength. */
const STEP = 9;
const RADIUS = 1.7;
const OPACITY = 0.13;

const source = readFileSync(new URL("../lib/us-states.ts", import.meta.url), "utf8");
const width = Number(source.match(/US_MAP_WIDTH = (\d+)/)[1]);
const height = Number(source.match(/US_MAP_HEIGHT = (\d+)/)[1]);
const shapes = [...source.matchAll(/"d": "([^"]+)"/g)].map((match) => match[1]).join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">\
<defs><pattern id="d" width="${STEP}" height="${STEP}" patternUnits="userSpaceOnUse">\
<circle cx="${STEP / 2}" cy="${STEP / 2}" r="${RADIUS}" fill="#252525"/></pattern>\
<mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">\
<path fill="#fff" d="${shapes}"/></mask></defs>\
<rect width="${width}" height="${height}" fill="url(#d)" fill-opacity="${OPACITY}" mask="url(#m)"/></svg>
`;

writeFileSync(new URL("../public/images/us-dots.svg", import.meta.url), svg);
console.log(`public/images/us-dots.svg — ${(svg.length / 1024).toFixed(1)} KB`);
