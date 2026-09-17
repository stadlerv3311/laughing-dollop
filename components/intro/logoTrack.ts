import type { Quad } from "./quad";

/** Frame size of the intro video (`public/videos/home-intro-*.mp4`), in px. */
export const VIDEO = { width: 1920, height: 1080 } as const;

/**
 * Where the logo painted on the trailer sits in the video's last second, in video px. Corners of the whole logo box
 * (star to the end of the "g"): top-left, top-right, bottom-right, bottom-left. Measured from the frames by
 * matching the star's tips and the "g" against `logo.svg`. Re-measure if the video changes.
 */
const TRACK: ReadonlyArray<{ time: number; corners: readonly number[] }> = [
  { time: 4.2, corners: [925, 315, 1091, 347, 1091, 475, 925, 452] },
  { time: 4.3, corners: [950, 322, 1105, 352, 1105, 475, 950, 454] },
  { time: 4.4, corners: [964, 321, 1113, 353, 1113, 475, 964, 456] },
  { time: 4.5, corners: [974, 324, 1119, 355, 1119, 475, 974, 453] },
  { time: 4.6, corners: [982, 329, 1124, 355, 1124, 473, 982, 455] },
  { time: 4.7, corners: [986, 329, 1126, 355, 1126, 473, 986, 453] },
  { time: 4.8, corners: [992, 326, 1129, 356, 1129, 472, 992, 453] },
  { time: 4.9, corners: [994, 330, 1130, 356, 1130, 472, 994, 452] },
  { time: 5.0, corners: [996, 331, 1131, 356, 1131, 471, 996, 451] },
];

const toQuad = (c: readonly number[]): Quad => [
  { x: c[0], y: c[1] },
  { x: c[2], y: c[3] },
  { x: c[4], y: c[5] },
  { x: c[6], y: c[7] },
];

/** The painted logo's corners at a time in the video (s), blended between measured frames; holds at either end. */
export function logoInVideo(seconds: number): Quad {
  const last = TRACK.length - 1;
  if (seconds <= TRACK[0].time) return toQuad(TRACK[0].corners);
  if (seconds >= TRACK[last].time) return toQuad(TRACK[last].corners);
  const next = TRACK.findIndex((frame) => frame.time > seconds);
  const from = TRACK[next - 1];
  const to = TRACK[next];
  const t = (seconds - from.time) / (to.time - from.time);
  return toQuad(from.corners.map((value, i) => value + (to.corners[i] - value) * t));
}
