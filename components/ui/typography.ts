// Shared type styles (2026-09-24 wording pass), so every section's label and heading match — they had drifted
// into three heading sizes, two weights and an all-caps label on the inner pages. Colour is left to the caller
// (ink on light sections, paper on dark ones). See docs/ARCHITECTURE.md → Typography.

/** The small sentence-case label above a heading ("Ship with us", "Our story"). Never uppercase or tracked out. */
export const labelClass = "text-sm font-semibold";

/**
 * Section heading (h2) on the homepage bands. Put it `mt-4` under a label. 40px since 2026-09-29 (was 36): the
 * homepage's heading sizes step 28 (sub-heading) → 40 (section) → 56 (chapter), about ×1.4 each, so a band's heading
 * clearly outranks the sub-headings under it. From `lg`, where these sit in columns, it eases from 36px up to 40px.
 */
export const sectionHeadingClass =
  "text-balance text-[1.75rem] font-medium leading-[1.15] tracking-[-0.03em] sm:text-[2.5rem] lg:text-[clamp(2.25rem,3vw,2.5rem)]";
