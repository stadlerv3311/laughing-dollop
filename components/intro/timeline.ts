/**
 * Scroll timeline for the homepage truck intro.
 * Every value is a fraction (0–1) of the pinned intro section's scroll distance.
 * Tune the feel here — the 3D camera, the white fade, the flying logo and the header all read these.
 */
export const INTRO = {
  /** Section height in screen heights. 4 = one pinned screen + 3 screens of scrolling. */
  screens: 4,
  /** Camera swings from above the truck down to the trailer's side. */
  orbitEnd: 0.52,
  /** Slow push-in on the trailer logo. */
  holdEnd: 0.62,
  /** Everything but the logo fades to white. */
  whitenStart: 0.6,
  whitenEnd: 0.76,
  /** Logo glides from the trailer into the header's top-left slot. */
  flyStart: 0.78,
  flyEnd: 0.94,
  /** Header nav drops in as the logo lands. */
  navStart: 0.9,
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
