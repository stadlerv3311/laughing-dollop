/**
 * One truck on the Fleet map: a rough position and nothing else. No driver, load, speed or heading — exact positions
 * of loaded or parked trucks are a cargo-theft and driver-privacy risk (DECISIONS.md → Fleet Map). `id` is only a key
 * for the list; it must not be a truck number or anything that names the unit.
 */
export type FleetPosition = { id: string; lat: number; lng: number };

/** What the Fleet map shows — the shape to agree with the backend teammate, who feeds it from Samsara about hourly. */
export type FleetSnapshot = {
  /** When the positions were read, ISO 8601. */
  updatedAt: string;
  trucks: FleetPosition[];
};

export type FleetResult = { ok: true; snapshot: FleetSnapshot } | { ok: false; message: string };

type Stop = [lat: number, lng: number];

// SAMPLE DATA — made-up positions strung along a few interstates so the map can be built and looked at. Not our
// trucks. Goes when the backend teammate's endpoint exists.
const SAMPLE_CORRIDORS: { count: number; stops: Stop[] }[] = [
  {
    // I-5
    count: 14,
    stops: [[32.72, -117.16], [34.05, -118.24], [35.37, -119.02], [37.96, -121.29], [38.58, -121.49], [40.59, -122.39], [42.33, -122.87], [45.52, -122.68], [47.61, -122.33]],
  },
  {
    // I-80
    count: 14,
    stops: [[38.58, -121.49], [39.53, -119.81], [40.76, -111.89], [41.14, -104.82], [41.26, -95.93], [41.59, -93.62], [41.88, -87.63], [41.5, -81.69], [40.86, -74.2]],
  },
  {
    // I-40
    count: 10,
    stops: [[34.9, -117.02], [35.2, -111.65], [35.08, -106.65], [35.22, -101.83], [35.47, -97.52], [34.75, -92.29], [35.15, -90.05], [36.16, -86.78]],
  },
  {
    // I-10
    count: 10,
    stops: [[34.05, -118.24], [33.45, -112.07], [32.22, -110.97], [31.76, -106.49], [29.42, -98.49], [29.76, -95.37], [29.95, -90.07], [30.33, -81.66]],
  },
  {
    // I-70
    count: 7,
    stops: [[39.74, -104.99], [39.1, -94.58], [38.63, -90.2], [39.77, -86.16], [39.96, -83.0]],
  },
];

function sampleTrucks(): FleetPosition[] {
  return SAMPLE_CORRIDORS.flatMap(({ count, stops }, c) =>
    Array.from({ length: count }, (_, i) => {
      // Spread unevenly along the road so the dots don't sit at equal steps.
      const along = ((i + 0.5 + 0.35 * Math.sin(i * 2.4 + c)) / count) * (stops.length - 1);
      const from = Math.min(Math.floor(along), stops.length - 2);
      const t = along - from;
      const [lat0, lng0] = stops[from];
      const [lat1, lng1] = stops[from + 1];
      return {
        id: `sample-${c}-${i}`,
        lat: Number((lat0 + (lat1 - lat0) * t).toFixed(2)),
        lng: Number((lng0 + (lng1 - lng0) * t).toFixed(2)),
      };
    }),
  );
}

/**
 * Stub until the backend teammate's Samsara endpoint exists (DECISIONS.md → Team split). In development it returns
 * the sample positions above, stamped with the top of the current hour, so the map can be built and checked. In
 * production it fails with a clear message rather than showing made-up trucks as ours.
 */
export async function getFleetSnapshot(): Promise<FleetResult> {
  if (process.env.NODE_ENV !== "production") {
    const updatedAt = new Date();
    updatedAt.setMinutes(0, 0, 0);
    return { ok: true, snapshot: { updatedAt: updatedAt.toISOString(), trucks: sampleTrucks() } };
  }
  return { ok: false, message: "The fleet map isn’t switched on yet. Please check back soon." };
}
