// Builds public/zip/0.json … 9.json: every lower-48 (and D.C.) ZIP and its city, one file for each first digit, so
// the quote form can put the city on the map as a ZIP is typed (lib/zip.ts → cityForZip).
//
// Source: the GeoNames postal code list for the US, https://download.geonames.org/export/zip/US.zip (CC BY 4.0: the
// site has to credit GeoNames, which the footer does). Unzip it and pass the path to US.txt:
//
//   node scripts/build-zip-cities.mjs path/to/US.txt
//
// The list is a snapshot; run this again with a fresh download about once a year. US.txt itself isn't kept in the repo.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = process.argv[2];
if (!source) throw new Error("Pass the path to GeoNames' US.txt");
const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "zip");

// Alaska, Hawaii and the military codes are left out: we don't run there, and the form says so before a city is needed.
const SKIP = new Set(["AK", "HI", "AA", "AE", "AP", ""]);

/** One object for each first digit: the other four digits → "City, ST". */
const files = Array.from({ length: 10 }, () => ({}));
let kept = 0;
for (const line of readFileSync(source, "utf8").split("\n")) {
  const [country, zip, place, , state] = line.split("\t");
  if (country !== "US" || !/^\d{5}$/.test(zip ?? "") || !place || SKIP.has(state ?? "")) continue;
  const file = files[Number(zip[0])];
  // The list has a few ZIPs twice; the first row wins.
  if (file[zip.slice(1)]) continue;
  file[zip.slice(1)] = `${place}, ${state}`;
  kept++;
}

mkdirSync(out, { recursive: true });
files.forEach((file, digit) => {
  const sorted = Object.fromEntries(Object.entries(file).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(out, `${digit}.json`), JSON.stringify(sorted));
});
console.log(`${kept} ZIPs in ${files.length} files → ${out}`);
