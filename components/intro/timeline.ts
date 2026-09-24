/**
 * Timeline for the homepage's opening logo moment (rebuilt 2026-09-23 — the video intro was removed; the hero
 * now shows straight away and the header's own logo carries the moment). `HomeIntro` animates
 * `useIntroProgress` from 0 to 1 over `duration`; `Header` and `HomeHero` both read it to fade/settle the logo
 * into place and, right after, light up the header nav and the hero headline. Tune the feel here.
 */
export const INTRO = {
  /** How long the logo takes to fade in and settle into the header (s). */
  duration: 1,
  /** How much larger than its resting size the logo starts, settling down to 1. */
  appearScale: 1.06,
  /** Fraction of the way in when the header brightens and the headline starts lighting up — right after the logo settles. */
  litAt: 0.82,
} as const;
