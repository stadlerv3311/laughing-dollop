/**
 * The intro clock: how far into the intro we are (s), moved on once per frame.
 * While the video plays, the clock follows the video's own time, so the logo stays locked to the picture.
 * Once the picture has run out — or stops moving — it carries on by itself, so the intro always finishes.
 * Kept out of the component so it can be exercised without a browser.
 */

/**
 * How far (s) the clock may run past the video's last reported time: enough to move smoothly between frames,
 * not enough to run ahead of the picture.
 */
export const MAX_LEAD = 0.1;

/** How long (s) the picture may sit still before the clock stops waiting for it and carries on by itself. */
export const STALL_GRACE = 0.3;

/** How close to the video's length counts as the last frame (s) — a frame at 24fps lasts 0.042. */
const LAST_FRAME = 0.05;

/** How far the video's time must move to count as the picture moving (s): the media clock wobbles below this. */
const MOVED = 0.001;

export type Clock = {
  /** Seconds into the intro. */
  seconds: number;
  /** The video time the last frame was drawn at. */
  shown: number;
  /** How long the picture has sat still (s). */
  stalled: number;
  /** Whether a stopped video should be asked to carry on this frame. */
  nudge: boolean;
};

/** What the clock knows about the video this frame. `length` may be NaN before the video reports it. */
export type Picture = {
  time: number;
  length: number;
  ended: boolean;
  paused: boolean;
};

/** A new clock, before the video has drawn anything. */
export function startClock(): Clock {
  return { seconds: 0, shown: -1, stalled: 0, nudge: false };
}

/** The clock `dt` seconds later. */
export function advanceClock({ seconds, shown, stalled }: Clock, picture: Picture, dt: number): Clock {
  // There's no picture left to follow, so run on real time. Waiting for `ended` is not safe: it can arrive late,
  // or never, and the clock would then stay pinned just past the video's length and the intro would never finish.
  if (picture.ended || picture.time >= picture.length - LAST_FRAME) {
    return { seconds: seconds + dt, shown: picture.time, stalled: 0, nudge: false };
  }
  if (Math.abs(picture.time - shown) > MOVED) {
    return {
      seconds: Math.min(Math.max(seconds + dt, picture.time), picture.time + MAX_LEAD),
      shown: picture.time,
      stalled: 0,
      nudge: false,
    };
  }
  const waited = stalled + dt;
  if (waited > STALL_GRACE) {
    return { seconds: seconds + dt, shown, stalled: waited, nudge: picture.paused };
  }
  return { seconds, shown, stalled: waited, nudge: false };
}
