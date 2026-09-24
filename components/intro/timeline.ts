/**
 * Timeline for the homepage's opening moment. Rebuilt 2026-09-23, when the video intro was removed: the hero shows
 * straight away and the header's own logo carries the moment. Re-keyed 2026-09-24 to the hero loop's truck: the
 * owner asked for the header and the hero's words and buttons to come down the screen with the truck on first open,
 * then stop in place while the truck drives on.
 *
 * `HomeIntro` sets `useIntroProgress` from 0 to 1 as the hero video plays from `truckIn` to `landed`. It reads the
 * video's own clock, not a timer, so a slow start doesn't put the truck and the words out of step. `Header` and
 * `HomeHero` both read the progress:
 * - the header slides down with the truck's cab and its logo fades and settles;
 * - the hero's text block drifts down after the truck and lands;
 * - the headline lights up word by word.
 * Tune the feel here.
 */
export const INTRO = {
  /** Video time (s) when the truck's cab crosses the top of the frame: progress 0. */
  truckIn: 0.85,
  /** Video time (s) when the hero's text block has landed: progress 1. */
  landed: 3.4,
  /** How long to wait for the video to start before running the moment on a timer instead (ms). */
  videoTimeout: 1500,
  /** The timer's length (s), used when the video can't play (autoplay blocked or low-power mode). */
  fallbackDuration: 1.6,
  /** Progress span in which the header slides down from above the screen, keeping pace with the cab. */
  headerDrop: [0, 0.25],
  /** Progress span in which the hero's text block comes down and stops; it starts `blockDrop` above its place. */
  blockIn: [0.2, 1],
  blockDrop: "-20vh",
  /** How much larger than its resting size the logo starts, settling down to 1. */
  appearScale: 1.06,
  /** Fraction of the way in when the header brightens and the headline starts lighting up — as the block lands. */
  litAt: 0.82,
} as const;
