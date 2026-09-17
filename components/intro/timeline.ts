/** Play length in seconds: the 5-second video, then the logo turns to face you and glides into the header. */
const DURATION = 6;

/** Seconds on the intro clock → a fraction (0–1) of the play length. */
const at = (seconds: number) => seconds / DURATION;

/**
 * Timeline for the homepage truck intro, which plays by itself when the page loads.
 * Phases are written in seconds (the video's own clock) and stored as fractions of `INTRO.duration`,
 * the value the header reads. Tune the feel here.
 */
export const INTRO = {
  /** Play length in seconds. */
  duration: DURATION,
  /** Skipping (scroll, tap, key or the Skip button): a quick fade to white (s)… */
  skipFade: 0.2,
  /** …then the logo glides into the header while the page shows (s). */
  skipGlide: 0.4,
  /** If the video hasn't started by now (slow network, autoplay turned off), the page shows instead (s). */
  loadTimeout: 3,
  /**
   * The video ends on the trailer's side. A copy of the logo fades in exactly over the painted one and follows it.
   * It comes in as the white does: the painted logo is drawn with a bigger star and smaller letters than ours, so
   * the swap happens under the veil instead of in full view.
   */
  logoSwapStart: at(4.4),
  logoSwapEnd: at(4.7),
  /** The video fades to white around the logo. */
  whitenStart: at(4.5),
  whitenEnd: at(5.05),
  /** The logo peels off the trailer and turns flat to face you. */
  unfoldStart: at(4.7),
  unfoldEnd: at(5.2),
  /** Logo glides into the header's top-left slot. */
  flyStart: at(5.25),
  flyEnd: at(5.9),
  /** The white fades away and the page shows through, while the logo is still gliding. Ends at 1. */
  revealStart: at(5.4),
  /** Header nav goes from dimmed to fully visible as the logo lands. */
  navStart: at(5.5),
} as const;

export function range(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

export function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
