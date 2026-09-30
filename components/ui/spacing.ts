// Shared section spacing (2026-09-29, spacing audit point 02), so the homepage's bands step down at one pace — they had
// drifted into four paddings (72, 80, 96 and 128px at desktop). Three steps, phone → sm → lg:
//   section  64 → 80 → 96px   most bands
//   chapter  80 → 112 → 128px the dark story band and the band that opens the driver half
//   joined   no top space     a band that closes the one above it (the logo row, the apply cards under the slogan)
// See docs/ARCHITECTURE.md → Section spacing.

/** A band's top and bottom space. */
export const sectionY = "py-16 sm:py-20 lg:py-24";
/** Only the top space: the band below carries the gap. */
export const sectionTop = "pt-16 sm:pt-20 lg:pt-24";
/** Only the bottom space: a joined band, sitting straight under the one above. */
export const sectionBottom = "pb-16 sm:pb-20 lg:pb-24";

/** A chapter opener's top and bottom space. */
export const chapterY = "py-20 sm:py-28 lg:py-32";
/** Only the chapter's top space. */
export const chapterTop = "pt-20 sm:pt-28 lg:pt-32";
