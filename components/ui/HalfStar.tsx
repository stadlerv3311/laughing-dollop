/**
 * The dark bands' look, made for the homepage's safety band and the About page's opening (2026-10-01). The safety
 * band went back to white on 2026-10-02, so only the About opening uses it now.
 */

/**
 * Depth like Our story's (owner, 2026-10-01): a lift of light in the top-right corner, where the half star sits, and
 * a fainter one low on the left, so the black isn't one flat sheet. Goes on a `bg-ink` block.
 */
export const inkDepthClass =
  "bg-[radial-gradient(70%_80%_at_100%_0%,color-mix(in_srgb,var(--color-paper)_7%,var(--color-ink))_0%,transparent_65%),radial-gradient(60%_70%_at_0%_100%,color-mix(in_srgb,var(--color-paper)_3%,var(--color-ink))_0%,transparent_70%)]";

/** The star from public/logo-icon.svg, as paths so it can be drawn as an outline. */
const STAR_PATHS = [
  "M129.28 189.726V155.197C129.28 148.717 137.119 145.472 141.702 150.055L168.268 176.608C173.172 181.51 175.928 188.158 175.928 195.091V247.031L136.975 208.244C132.048 203.339 129.28 196.676 129.28 189.726Z",
  "M189.805 129.225H155.262C148.778 129.225 145.532 137.061 150.117 141.642L176.681 168.197C181.585 173.099 188.236 175.852 195.172 175.852H247.134L208.331 136.916C203.423 131.991 196.758 129.225 189.805 129.225Z",
  "M117.854 57.3039V91.8328C117.854 98.3136 110.015 101.558 105.432 96.9756L78.8661 70.4226C73.962 65.5205 71.2063 58.8722 71.2063 51.9396V-0.00107209L110.16 38.7861C115.086 43.6916 117.854 50.3539 117.854 57.3039Z",
  "M57.3288 117.805H91.872C98.3555 117.805 101.602 109.968 97.0169 105.387L70.4529 78.8326C65.5488 73.9306 58.8978 71.1778 51.9623 71.1778H0L38.8033 110.113C43.7108 115.038 50.3759 117.805 57.3288 117.805Z",
  "M57.3288 129.225H91.872C98.3555 129.225 101.602 137.061 97.0169 141.642L70.4529 168.197C65.5488 173.099 58.8978 175.852 51.9623 175.852H0L38.8033 136.916C43.7108 131.991 50.3759 129.225 57.3288 129.225Z",
  "M117.854 189.726V155.197C117.854 148.717 110.015 145.472 105.432 150.055L78.8661 176.608C73.962 181.51 71.2063 188.158 71.2063 195.091V247.031L110.16 208.244C115.086 203.339 117.854 196.676 117.854 189.726Z",
  "M189.805 117.805H155.262C148.778 117.805 145.532 109.968 150.117 105.387L176.681 78.8326C181.585 73.9306 188.236 71.1778 195.172 71.1778H247.134L208.331 110.113C203.423 115.038 196.758 117.805 189.805 117.805Z",
  "M129.28 57.3039V91.8328C129.28 98.3136 137.119 101.558 141.702 96.9756L168.268 70.4226C173.172 65.5205 175.928 58.8722 175.928 51.9396V-0.00107209L136.975 38.7861C132.048 43.6916 129.28 50.3539 129.28 57.3039Z",
];

/**
 * Half the logo's star in an orange outline behind the heading (owner, 2026-10-01): its centre on the band's right
 * edge, so the edge cuts it in half, like Our story's filled star — an outline here, so the two bands don't repeat
 * each other. Turned 45° and twice its first size (owner's "2" of three mock-ups, same day), so the petals sweep
 * diagonally down the whole right side to the foot of the black; at 45% because its lines pass behind the words and
 * readout there. From `lg` only: below that the heading runs the full width and the lines would cross it. Its band
 * needs `relative isolate overflow-hidden`.
 */
export function HalfStar() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 248 248"
      fill="none"
      className="pointer-events-none absolute right-0 top-1/2 -z-10 hidden w-[84rem] translate-x-1/2 -translate-y-1/2 rotate-45 opacity-45 lg:block"
    >
      {STAR_PATHS.map((d) => (
        <path key={d} d={d} stroke="var(--color-brand)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
