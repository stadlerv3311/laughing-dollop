type ArrowPhotoClipProps = {
  /** Unique per instance — referenced by the photo's own `clip-path: url(#id)`. */
  id: string;
  /** Which way the point faces: `"right"` for Ship with us (photo left, text right), `"left"` for Safety
   * band (photo right, text left) — a mirror of the same shape, not a second one. */
  point: "left" | "right";
};

const RIGHT_POINT_PATH =
  "M0,0 L0.6763,0 Q0.72,0 0.7492,0.0521 L0.9791,0.4628 Q1,0.5 0.9791,0.5372 L0.7492,0.9479 Q0.72,1 0.6763,1 L0,1 Z";
const LEFT_POINT_PATH =
  "M1,0 L0.3237,0 Q0.28,0 0.2508,0.0521 L0.0209,0.4628 Q0,0.5 0.0209,0.5372 L0.2508,0.9479 Q0.28,1 0.3237,1 L1,1 Z";

/**
 * The rounded-arrow clip-path shared by Ship with us and Safety band's photos (2026-09-23, replacing a sharp
 * 10%-deep polygon notch — reference: a Mobbin fleet-management site the owner shared). A deep point reaches
 * toward the section's text; every corner is softened except the one flush with the true screen edge, which
 * stays sharp — rounding it would just leave a gap at the edge of the browser window.
 *
 * Plain CSS `clip-path: polygon()` can't curve, so this is an SVG `clipPath` with `objectBoundingBox` units
 * (0–1, like `polygon()`'s percentages) so it scales with the photo at any width — it renders nothing itself.
 * The three rounded vertices (both notch shoulders + the tip) are cut back along each adjacent edge and
 * rejoined with a quadratic curve using the original sharp vertex as the control point.
 */
export function ArrowPhotoClip({ id, point }: ArrowPhotoClipProps) {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={point === "right" ? RIGHT_POINT_PATH : LEFT_POINT_PATH} />
        </clipPath>
      </defs>
    </svg>
  );
}
