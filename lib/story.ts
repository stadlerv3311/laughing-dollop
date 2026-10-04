// DRAFT company history. The About page's story and timeline are the owner's stand-in text (2026-09-28): the right
// length and shape, not the final wording or dates. Only two facts come from the FMCSA SAFER record: the Citrus
// Heights, CA base and the for-hire interstate operating authority. Replace it with the real story (see
// docs/DECISIONS.md → Open). The homepage story card and the About page both read from here.

/**
 * View transition name shared by the homepage story band and the About page's dark opening, and the
 * transition type the band's "Read our full story" link sets, so only that navigation morphs one into the other
 * (2026-09-24). CSS: `.story-open` in app/globals.css.
 */
export const STORY_BAND = "story-band";
export const STORY_OPEN = "story-open";

export type Milestone = {
  title: string;
  /** The big mark over it in the homepage story band ("1", "70+", "30", "48"). */
  mark: string;
  /** Counts up from this to the mark when the story band's route reaches it ("48" from 1: one truck to 48 states). */
  countFrom?: number;
  text: string;
};

/** One row of the About page's timeline. */
export type TimelineEntry = { year: string; title: string; text: string };

type Story = {
  /** The headline on the homepage story band and the About page, one line each (owner, 2026-09-28). */
  headline: string[];
  /**
   * The one word the homepage band turns orange once its line has landed (owner's pick "D", 2026-09-29): the rule the
   * summary under it spells out. Must appear in the last line.
   */
  headlineAccent: string;
  /** The About page's closing line. */
  origin: string;
  /** Short version for the homepage card: the setup that leads into `rule`, so it ends on a colon. */
  summary: string;
  /**
   * The rule the orange word points at, set on its own under `summary` on the homepage band (owner, 2026-10-02: "the
   * rule is orange but what rule. i can barely see it"). The third part is shortened from "treat drivers the way we’d
   * want to be treated" (owner's OK, same day).
   */
  rule: string[];
  /** One line under the About page's headline. */
  lede: string;
  /** The story in a few lines, beside the About page's opening picture (2026-10-01; it was six titled blocks). */
  opening: string;
  /** The homepage story band's four marks. */
  milestones: Milestone[];
  /** The About page's timeline. */
  timeline: TimelineEntry[];
};

export const story: Story = {
  headline: ["The map got bigger.", "The rule didn’t."],
  headlineAccent: "rule",
  origin: "It started with one truck.",
  summary: "We started with one truck and a simple rule:",
  rule: ["Show up when we say we will.", "Keep the freight safe.", "Treat drivers right."],
  lede: "A dry van carrier out of Citrus Heights, California, with one rule: show up when we say we will, keep the freight safe and treat drivers well.",
  opening:
    "One truck and one driver out of Citrus Heights. Then owner-operators, our own authority, company trucks and an office of our own. The map got bigger; the way we answer the phone didn’t.",
  milestones: [
    { title: "Where it started", mark: "1", text: "One truck and one driver out of California." },
    // "70+" is the About page's fleet figure (owner, 2026-10-02: 55 trucks on the road and about 30 new ones in the
    // yard, so more than 70 — but 70 is the number kept). It replaced "DOT" (own authority) the same day.
    { title: "The fleet", mark: "70+", text: "Late-model trucks on the road." },
    // The owner's figure for the yard, same day. It replaced "In-house" (our own office) the same day — owner: every
    // mark a number.
    { title: "New trucks", mark: "30", text: "Brand-new trucks in the yard, joining the fleet." },
    { title: "Today", mark: "48", countFrom: 1, text: "Dry van freight moving across 48 states." },
  ],
  timeline: [
    { year: "2014", title: "One truck.", text: "ITrucking Solutions opens in Citrus Heights with a single truck and a plan to haul dry van freight the right way." },
    { year: "2016", title: "Owner-operators come on.", text: "The first leased-on drivers join. Growth for the next few years comes from people who bring their own equipment and want a carrier that pays on time." },
    { year: "2018", title: "Own authority, interstate.", text: "We earn for-hire interstate authority and start running beyond California, building the 48-state coverage we operate under now." },
    { year: "2020", title: "First company trucks.", text: "We buy our own equipment and put company drivers in it. Owner-operators stay; the company fleet is added capacity, not a replacement." },
    { year: "2022", title: "The office takes shape.", text: "Dispatch, safety, and accounting move fully in-house, so drivers and customers deal with the same people instead of a patchwork of outside help." },
    { year: "2024", title: "Yard and fleet desk.", text: "A yard operation and a fleet manager come on as the truck and trailer count climbs. Most new equipment is bought new." },
    { year: "2026", title: "About 70 trucks and trailers.", text: "The fleet is late-model and dry van, runs all 48 states, and is serviced in our own shop." },
  ],
};
