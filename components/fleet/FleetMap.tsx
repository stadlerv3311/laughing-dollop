"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { FleetSnapshot } from "@/lib/fleet";

// OpenFreeMap's light grey street map: free, no account or key (owner, 2026-10-06). Swap the URL to change the look.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
// As close as a visitor can get: about a metro area across. Nobody should be able to zoom to the lot a truck is
// parked in (DECISIONS.md → Fleet Map); the backend still coarsens the positions themselves.
const MAX_ZOOM = 8;
// The lower 48 with some room around them.
const BOUNDS: [[number, number], [number, number]] = [[-140, 15], [-55, 56]];
const SOURCE = "trucks";

const subscribeNever = () => () => {};

/** The Fleet map itself: a real street map with our trucks as dots, bunched into counted circles when zoomed out. */
export function FleetMap({ snapshot }: { snapshot: FleetSnapshot }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  // The time is written in the visitor's own time zone, so it waits for the browser.
  const inBrowser = useSyncExternalStore(subscribeNever, () => true, () => false);
  const { trucks, updatedAt } = snapshot;

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let map: MapLibreMap | undefined;
    let cancelled = false;

    // Loaded here, not at the top of the file, so the map library only downloads on this page, in the browser.
    import("maplibre-gl")
      .then(({ Map, NavigationControl, LngLatBounds, setWorkerUrl }) => {
        if (cancelled) return;
        // The library looks for its worker file next to itself, which a bundled copy doesn't have; hand it the
        // bundler's own copy of the file instead.
        setWorkerUrl(new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href);
        const css = getComputedStyle(document.documentElement);
        const ink = css.getPropertyValue("--color-ink").trim();
        const paper = css.getPropertyValue("--color-paper").trim();
        const brand = css.getPropertyValue("--color-brand").trim();
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const fleet = new LngLatBounds();
        trucks.forEach((truck) => fleet.extend([truck.lng, truck.lat]));

        map = new Map({
          container: box,
          style: STYLE_URL,
          bounds: fleet.isEmpty() ? BOUNDS : fleet,
          fitBoundsOptions: { padding: 56, maxZoom: 5 },
          maxBounds: BOUNDS,
          maxZoom: MAX_ZOOM,
          // The page keeps scrolling over the map: zooming takes Ctrl or ⌘ with the wheel, or two fingers on a phone.
          cooperativeGestures: true,
          dragRotate: false,
          pitchWithRotate: false,
          attributionControl: { compact: true },
        });
        map.touchZoomRotate.disableRotation();
        map.addControl(new NavigationControl({ showCompass: false }), "top-right");
        map.on("error", (event) => {
          // A tile that fails to load is not worth losing the map over; only give up if the map never drew.
          if (!map?.loaded()) console.warn("[fleet map]", event.error);
        });

        map.on("load", () => {
          if (!map) return;
          map.addSource(SOURCE, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: trucks.map((truck) => ({
                type: "Feature",
                properties: {},
                geometry: { type: "Point", coordinates: [truck.lng, truck.lat] },
              })),
            },
            cluster: true,
            clusterRadius: 44,
            clusterMaxZoom: MAX_ZOOM - 2,
          });
          map.addLayer({
            id: "clusters",
            type: "circle",
            source: SOURCE,
            filter: ["has", "point_count"],
            paint: {
              "circle-color": ink,
              "circle-radius": ["step", ["get", "point_count"], 16, 5, 20, 15, 26],
              "circle-stroke-color": paper,
              "circle-stroke-width": 2,
            },
          });
          map.addLayer({
            id: "cluster-counts",
            type: "symbol",
            source: SOURCE,
            filter: ["has", "point_count"],
            layout: {
              "text-field": ["get", "point_count_abbreviated"],
              "text-font": ["Noto Sans Bold"],
              "text-size": 13,
              "text-allow-overlap": true,
            },
            paint: { "text-color": paper },
          });
          map.addLayer({
            id: "trucks",
            type: "circle",
            source: SOURCE,
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": brand,
              "circle-radius": 7,
              "circle-stroke-color": paper,
              "circle-stroke-width": 2.5,
            },
          });

          // A counted circle opens into its trucks.
          map.on("click", "clusters", async (event) => {
            const feature = event.features?.[0];
            const source = map?.getSource(SOURCE);
            if (!map || !feature || feature.geometry.type !== "Point" || !source || !("getClusterExpansionZoom" in source)) return;
            const zoom = await (source as { getClusterExpansionZoom(id: number): Promise<number> }).getClusterExpansionZoom(
              feature.properties.cluster_id,
            );
            map.easeTo({ center: feature.geometry.coordinates as [number, number], zoom, animate: !still });
          });
          map.on("mouseenter", "clusters", () => map && (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", "clusters", () => map && (map.getCanvas().style.cursor = ""));
        });
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [trucks]);

  const count = `${trucks.length} ${trucks.length === 1 ? "truck" : "trucks"} on the road`;

  return (
    <figure>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-sm text-ink/70">
        <span className="flex items-center gap-2 font-semibold text-ink">
          <span aria-hidden className="size-2 rounded-full bg-brand" />
          {count}
        </span>
        {inBrowser && (
          <span>
            Updated{" "}
            <time dateTime={updatedAt}>
              {new Date(updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", timeZoneName: "short" })}
            </time>
          </span>
        )}
      </figcaption>
      <div className="relative mt-4 h-[70svh] min-h-[26rem] overflow-hidden rounded-3xl bg-mist">
        {failed ? (
          <p className="absolute inset-0 grid place-items-center px-6 text-center text-ink/70">
            The map couldn’t load in this browser.
          </p>
        ) : (
          <div
            ref={boxRef}
            role="region"
            aria-label={`Map of the United States. ${count}, shown at rough positions.`}
            // Sized, not `absolute inset-0`: the map library sets this box to `position: relative`, which collapsed it.
            className="size-full font-sans"
          />
        )}
      </div>
    </figure>
  );
}
