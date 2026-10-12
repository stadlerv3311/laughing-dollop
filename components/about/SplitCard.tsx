import Link from "next/link";
import { FlyArrow, RiseLabel } from "@/components/ui";
import { cx } from "@/lib/cx";

type SplitCardProps = {
  title: string;
  text: string;
  link: { label: string; href: string };
  /** The mirror image: white in the upper right, the words set to the right, the link in the lower left. */
  flip?: boolean;
};

/**
 * A closing card on the About page's black band, cut on a slant: white above the cut, black below it (owner,
 * 2026-10-07, two red diagonals drawn over the cards with "white" over each and "black" under: "lets try something
 * like this", "we need reference to main page style", the homepage's white and black bands). The two cards mirror
 * each other, so the black wedges meet in the middle and the white sits on the outside.
 *
 * The cut runs from the card's outer bottom corner up to a point on its inner edge, `--cut` of the way down. It was
 * corner to corner at first; the owner drew it lower the same day ("lets move that a bit lower the text is
 * readible"), 36% down on their screen, so the words stay on the white. Narrower cards wrap their words onto more
 * lines, so `--cut` is lower there: 76% on phones, 68% from `sm`, 56% from `md`, 36% from `xl`, where the card is
 * wide. The space under the link (the face's bottom padding) is what gives the wedge its height. At each of those
 * widths the words and the link clear the cut (measured from 320px up); measure again if the copy or the type sizes
 * change.
 *
 * The two stand side by side at every width since 2026-10-09 (the builder, of the pair on a phone: "i need those card
 * in horizontal"); below `lg` they were one over the other until then. Half a phone wide, a card has the question a
 * size down (20px), the link at 16px and no paragraph.
 *
 * The words are drawn twice, once in white on the black card and once in ink on a white sheet clipped to the part
 * above the cut and laid over it, so anything that does cross the cut changes colour exactly on it. The sheet is
 * hidden from screen readers and lets the pointer through.
 *
 * The black wedge is a road seen from the driver's seat (owner, same day, dashed red lines drawn in the two wedges:
 * "can we add the dotted animation to this 2 cards. so it looks like you drive in in perspective"). The two cuts are
 * its edges and meet at the vanishing point, in the gap between the cards at `--cut`. Each card paints one dashed
 * lane line, which meets the bottom edge `--lane` of the way in from the outer corner; the dashes roll toward the
 * viewer, growing as they come (`roadLine`, `road-drive` in globals.css). A dashed centre line ran just inside each
 * card's inner edge at first; the owner crossed the pair out ("remove lines in tge middle"). `--vp-gap` is half the
 * gap between the cards, 5px on phones and 8px from `sm`.
 *
 * No small label over the heading (owner, same day, of "Shippers" and "Careers": "Header is telling what they are
 * doing"). The action is the site's underlined arrow link (owner, same day, on a picture of Get a quote ↗: "also use
 * this style for the button"), on the white under the words at the card's outer side; it was in the black corner
 * until the owner drew it out of the road ("and move get a quote and apply now"). It is the card's one link, and its
 * hit area is stretched over the whole card, so hovering anywhere on the card plays the link's hover on both
 * drawings at once (`group` on the card).
 */
/**
 * One line painted on the road: a strip 3000px long, dashed 40px on and 80px off, hinged on the card's bottom edge and
 * laid back flat (rotateX) so it runs away to the vanishing point. `road-drive` slides it one dash and one gap toward
 * the viewer, over and over. The far end fades out. Reduced motion leaves the lines painted and still.
 */
const roadLine =
  "absolute top-full h-[3000px] origin-top [transform:rotateX(-90deg)] animate-road-drive bg-[repeating-linear-gradient(to_bottom,currentColor_0_40px,transparent_40px_120px)] [mask-image:linear-gradient(to_bottom,black_1200px,transparent_2800px)] motion-reduce:animate-none";

export function SplitCard({ title, text, link, flip = false }: SplitCardProps) {
  const face = (real: boolean, muted: string) => {
    const action = (
      <>
        <RiseLabel>{link.label}</RiseLabel>
        <FlyArrow className="size-3.5" />
      </>
    );
    const actionClass = "inline-flex items-center gap-1.5 text-base font-medium sm:text-xl";
    return (
      <div className={cx("flex h-full flex-col p-4 pb-24 sm:p-6 sm:pb-24 lg:p-10 lg:pb-[6.75rem]", flip && "items-end text-right")}>
        <h3 className="font-display text-[1.25rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[1.75rem] lg:text-4xl">
          {title}
        </h3>
        {/* Not on phones: half a phone wide, the card has room for the question and the link (the news cards drop
            their summaries there the same way). */}
        <p className={cx("mt-4 max-w-[24rem] leading-relaxed text-pretty max-sm:hidden", muted)}>{text}</p>
        {/* On the white, under the words, at the card's outer side where the white runs deepest. */}
        <div className="mt-5 sm:mt-8">
          {real ? (
            <Link href={link.href} className={cx(actionClass, "outline-none after:absolute after:inset-0")}>
              {action}
            </Link>
          ) : (
            <span className={actionClass}>{action}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="group relative isolate text-paper [--cut:76%] [--lane:28%] [--vp-gap:0.3125rem] sm:[--cut:68%] sm:[--vp-gap:0.5rem] md:[--cut:56%] xl:[--cut:36%] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.25)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-brand">
      {/* The road: one lane line, running from the point where the two cuts meet. */}
      <div
        aria-hidden
        className={cx(
          "pointer-events-none absolute inset-0 -z-10 overflow-hidden [perspective:200px] [perspective-origin:calc(100%+var(--vp-gap))_var(--cut)]",
          flip && "-scale-x-100",
        )}
      >
        <span className={cx(roadLine, "left-[var(--lane)] w-2.5")} />
      </div>
      {face(true, "text-paper/70")}
      <div
        aria-hidden
        className={cx(
          "pointer-events-none absolute inset-0 bg-paper text-ink",
          flip
            ? "[clip-path:polygon(0_0,100%_0,100%_100%,0_var(--cut))]"
            : "[clip-path:polygon(0_0,100%_0,100%_var(--cut),0_100%)]",
        )}
      >
        {face(false, "text-ink/70")}
      </div>
    </div>
  );
}
