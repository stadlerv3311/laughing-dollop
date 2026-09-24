// Shared type styles (2026-09-24 wording pass), so every section's label and heading match — they had drifted
// into three heading sizes, two weights and an all-caps label on the inner pages. Colour is left to the caller
// (ink on light sections, paper on dark ones). See docs/ARCHITECTURE.md → Typography.

/** The small sentence-case label above a heading ("Ship with us", "Our story"). Never uppercase or tracked out. */
export const labelClass = "text-sm font-semibold";

/** Section heading (h2) on the homepage bands. Put it `mt-4` under a label. */
export const sectionHeadingClass =
  "text-balance text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] sm:text-[2.25rem] lg:text-[clamp(1.75rem,2.5vw,2.25rem)]";
