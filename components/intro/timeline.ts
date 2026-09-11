/**
 * Scroll timeline for the homepage truck intro.
 * Every value is a fraction (0–1) of the pinned intro section's scroll distance.
 * Tune the feel here — the 3D camera, the light, the flying logo and the header all read these.
 */
export const INTRO = {
  /** Section height in screen heights. 4.5 = one pinned screen + 3.5 screens of scrolling. */
  screens: 4.5,
  /** Camera drops from a high aerial ahead of the truck to its grille, then flies around to the trailer's side. */
  sideEnd: 0.4,
  /** Slow push-in; the camera stops on the trailer logo. */
  holdEnd: 0.48,
  /** A flat copy of the logo fades in over the trailer's logo and takes its place. */
  logoSwapStart: 0.43,
  logoSwapEnd: 0.49,
  /** The truck pulls away down the road into the sunset while the logo stays on screen. */
  driveStart: 0.5,
  driveEnd: 0.84,
  /** Morning light warms into sunset. */
  sunsetStart: 0.1,
  sunsetEnd: 0.74,
  /** The sunset fades to white around the logo. */
  whitenStart: 0.7,
  whitenEnd: 0.83,
  /** Logo glides into the header's top-left slot. */
  flyStart: 0.83,
  flyEnd: 0.94,
  /** Header nav drops in as the logo lands. */
  navStart: 0.9,
} as const;

/** How far (m) the truck pulls ahead of the camera by the end of the drive-off. */
const DRIVE_DISTANCE = 230;

export function range(value: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

export function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeInCubic(t: number) {
  return t * t * t;
}

/** The truck's lead over the camera (m) at a given progress — it eases away like it's picking up speed. */
export function driveDistance(progress: number) {
  return DRIVE_DISTANCE * easeInCubic(range(progress, INTRO.driveStart, INTRO.driveEnd));
}
