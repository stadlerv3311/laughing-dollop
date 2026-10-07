import type { StateCode } from "./us-states";

/**
 * First three ZIP digits → state, from the USPS prefix ranges (military, territory and IRS-only prefixes left out).
 * Good enough to light up the map as someone types — the backend should still check the address.
 */
const PREFIXES: Array<[from: number, to: number, code: StateCode | "AK" | "HI"]> = [
  [10, 27, "MA"], [28, 29, "RI"], [30, 38, "NH"], [39, 49, "ME"], [50, 54, "VT"], [55, 55, "MA"],
  [56, 59, "VT"], [60, 69, "CT"], [70, 89, "NJ"], [100, 149, "NY"], [150, 196, "PA"], [197, 199, "DE"],
  [200, 200, "DC"], [201, 201, "VA"], [202, 205, "DC"], [206, 219, "MD"], [220, 246, "VA"], [247, 268, "WV"],
  [270, 289, "NC"], [290, 299, "SC"], [300, 319, "GA"], [320, 339, "FL"], [341, 349, "FL"], [350, 369, "AL"],
  [370, 385, "TN"], [386, 397, "MS"], [398, 399, "GA"], [400, 427, "KY"], [430, 459, "OH"], [460, 479, "IN"],
  [480, 499, "MI"], [500, 528, "IA"], [530, 549, "WI"], [550, 567, "MN"], [570, 577, "SD"], [580, 588, "ND"],
  [590, 599, "MT"], [600, 629, "IL"], [630, 658, "MO"], [660, 679, "KS"], [680, 693, "NE"], [700, 714, "LA"],
  [716, 729, "AR"], [730, 732, "OK"], [733, 733, "TX"], [734, 749, "OK"], [750, 799, "TX"], [800, 816, "CO"],
  [820, 831, "WY"], [832, 838, "ID"], [840, 847, "UT"], [850, 865, "AZ"], [870, 884, "NM"], [885, 885, "TX"],
  [889, 898, "NV"], [900, 961, "CA"], [967, 968, "HI"], [970, 979, "OR"], [980, 994, "WA"], [995, 999, "AK"],
];

/** Each first digit's file of cities (public/zip, built by scripts/build-zip-cities.mjs), fetched once. */
const cityFiles = new Map<string, Promise<Record<string, string>>>();

/**
 * "City, ST" for a 5-digit ZIP in the lower 48 (owner, 2026-10-06: "when we type zip code. we literally know the city
 * too. can we show on the map city and state"), or null when the ZIP isn't in the list or the list can't be had, in
 * which case the state's name does. The list is GeoNames' (CC BY 4.0, credited in the footer), ten files on our own
 * site, one for each first digit, so nothing typed leaves the site. Called with a ZIP that's still being typed, it
 * fetches the file its first digit needs and returns null, so the city is ready by the fifth digit.
 */
export async function cityForZip(text: string): Promise<string | null> {
  const digits = text.trim().match(/^\d{1,5}/)?.[0];
  if (!digits) return null;
  let file = cityFiles.get(digits[0]);
  if (!file) {
    file = fetch(`/zip/${digits[0]}.json`).then((response) => {
      if (!response.ok) throw new Error(`ZIP cities: ${response.status}`);
      return response.json() as Promise<Record<string, string>>;
    });
    cityFiles.set(digits[0], file);
  }
  try {
    const cities = await file;
    return digits.length === 5 ? (cities[digits.slice(1)] ?? null) : null;
  } catch {
    // Try again the next time a ZIP is typed.
    cityFiles.delete(digits[0]);
    return null;
  }
}

/**
 * The state a 5-digit ZIP belongs to. `"outside"` means Alaska or Hawaii (we don't run there);
 * `null` means the text isn't a ZIP we recognize — e.g. a city name.
 */
export function stateForZip(text: string): StateCode | "outside" | null {
  const zip = text.trim().match(/^(\d{5})(?:-\d{4})?$/)?.[1];
  if (!zip) return null;

  const prefix = Number(zip.slice(0, 3));
  const match = PREFIXES.find(([from, to]) => prefix >= from && prefix <= to);
  if (!match) return null;
  return match[2] === "AK" || match[2] === "HI" ? "outside" : match[2];
}
