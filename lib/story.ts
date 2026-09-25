// DRAFT company history — placeholder copy written 2026-09-10 so the layout could be built.
// Only two facts come from the FMCSA SAFER record: the Citrus Heights, CA base and the for-hire
// interstate operating authority. Everything else is made up. Replace it with the real story
// (see docs/DECISIONS.md → Open). The homepage story card and the About page both read from here.

/**
 * View transition name shared by the homepage story band and the About page's dark opening, and the
 * transition type the band's "Read our full story" link sets, so only that navigation morphs one into the other
 * (2026-09-24). CSS: `.story-open` in app/globals.css.
 */
export const STORY_BAND = "story-band";
export const STORY_OPEN = "story-open";

export type Milestone = {
  title: string;
  text: string;
  /**
   * The About page's timeline year. Only real dates (2008, the founding year, is on record — DECISIONS.md); the
   * timeline shows once at least two milestones have one.
   */
  year?: string;
};

/** One cell of the About page's facts row: a small label over a short value. */
export type StoryFact = { label: string; value: string };

type Story = {
  headline: string;
  /** Short version for the homepage card. */
  summary: string;
  /** One line under the About page's headline. */
  lede: string;
  /** Full version for the About page. */
  paragraphs: string[];
  milestones: Milestone[];
  /** The About page's facts row. Only facts already on record (FMCSA SAFER, the approved 48 states). */
  facts: StoryFact[];
  /** The About page's closing line. */
  closing: string;
};

export const story: Story = {
  headline: "It started with one truck.",
  summary:
    "We started in Citrus Heights, California, with one truck and a simple rule: show up when we say we will, keep the freight safe and treat drivers the way we’d want to be treated. The map got bigger. The rule didn’t.",
  lede: "A dry van carrier out of Citrus Heights, California, with one rule: show up when we say we will, keep the freight safe and treat drivers well.",
  paragraphs: [
    "ITrucking Solutions started in Citrus Heights, California, with one truck and a driver who knew the job from behind the wheel. The idea was simple: show up when we say we will, keep the freight safe and treat the people doing the driving the way we’d want to be treated.",
    "Shippers noticed. One load turned into a weekly lane, and weekly lanes turned into long-term partners. We earned our own operating authority as a for-hire interstate carrier and built a team of drivers and dispatchers who still pick up the phone.",
    "Today we haul dry van freight across 48 states. The map is a lot bigger than it was on day one, but the rule hasn’t changed.",
  ],
  milestones: [
    { title: "Where it started", text: "One truck and one driver out of Citrus Heights, California.", year: "2008" },
    { title: "Our own authority", text: "Registered with the U.S. DOT as a for-hire interstate carrier." },
    { title: "Today", text: "Dry van freight moving across 48 states." },
  ],
  facts: [
    { label: "Based in", value: "Citrus Heights, California" },
    { label: "Authority", value: "For-hire interstate carrier" },
    { label: "Freight", value: "Dry van truckload" },
    { label: "Coverage", value: "All 48 states" },
  ],
  closing: "The map got bigger. The rule didn’t.",
};
