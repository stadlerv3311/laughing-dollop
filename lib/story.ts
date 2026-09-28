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
  /** The big mark over it in the homepage story band ("1", "DOT", "48"). */
  mark: string;
  /** Set in brand orange in the story band; the last one stays white, as where the story has got to. */
  accent?: boolean;
  text: string;
};

/** One row of the About page's timeline. */
export type TimelineEntry = { year: string; title: string; text: string };

/** One cell of the About page's facts row: a small label over a short value. */
export type StoryFact = { label: string; value: string };

type Story = {
  /** The headline on the homepage story band and the About page, one line each (owner, 2026-09-28). */
  headline: string[];
  /** The About page's closing line. */
  origin: string;
  /** Short version for the homepage card. */
  summary: string;
  /** One line under the About page's headline. */
  lede: string;
  /** Full version for the About page. */
  paragraphs: string[];
  /** The homepage story band's three marks. */
  milestones: Milestone[];
  /** The About page's timeline. */
  timeline: TimelineEntry[];
  /** The About page's facts row. Only facts already on record (FMCSA SAFER, the approved 48 states). */
  facts: StoryFact[];
};

export const story: Story = {
  headline: ["The map got bigger.", "The rule didn’t."],
  origin: "It started with one truck.",
  summary:
    "We started in Citrus Heights, California, with one truck and a simple rule: show up when we say we will, keep the freight safe and treat drivers the way we’d want to be treated.",
  lede: "A dry van carrier out of Citrus Heights, California, with one rule: show up when we say we will, keep the freight safe and treat drivers well.",
  paragraphs: [
    "ITrucking Solutions started in 2014 in Citrus Heights, California, with one truck and a driver who knew the job from behind the wheel. There was no office, no dispatch desk, and no plan beyond the next load. The idea was simple: show up when we say we will, keep the freight safe, and treat the people doing the driving the way we would want to be treated.",
    "The early years were built with owner-operators. Drivers who already had their own trucks wanted a carrier that answered the phone, paid on schedule, and stayed out of their way. We were small enough to know every driver by name and, slowly, large enough to hold a lane. One load turned into a weekly run. Weekly runs turned into shippers who stopped shopping the load around. That model carried us through the first several years and built the customer base we still run today.",
    "As the freight held, we earned our own for-hire interstate authority and started running past California. Dry van truckload was the work we knew, so we stayed with it. Coverage grew one state at a time, from customers who needed the truck somewhere new. By the late 2010s we were a 48-state carrier on paper, and still a small group trying not to outgrow the way we answered the phone.",
    "The next step was company equipment. We began buying trucks for company drivers, not to replace the owner-operators, but to add capacity we could plan and equipment we could maintain. The first company trucks were a bet. If the freight stayed, they would pay for themselves. If it did not, we would be stuck with iron. The freight stayed. Most of what is on the road now came out of that shift, and nearly all of it was bought new.",
    "The office had to catch up. Dispatch moved in-house so the board was covered by people who knew the lanes. Safety took on compliance, onboarding, and driver files. Accounting took settlements, billing, and pay, which mattered as much to a driver as the rate on the load. A fleet manager came on to track the equipment, and a yard crew took over the lot so trucks were not sitting while someone looked for a key. A company shop is in the works, so maintenance does not wait on an outside vendor.",
    "Today we run 70 late-model trucks and trailers, hauling dry van truckload across all 48 states. Around that fleet sit dispatch, safety, accounting, fleet, and the yard, with the shop being built. We are still the company that started with a single truck in Citrus Heights. The map is bigger than it was. The rule has not changed.",
  ],
  milestones: [
    { title: "Where it started", mark: "1", accent: true, text: "One truck and one driver out of Citrus Heights, California." },
    { title: "Our own authority", mark: "DOT", accent: true, text: "Registered with the U.S. DOT as a for-hire interstate carrier." },
    { title: "Today", mark: "48", text: "Dry van freight moving across 48 states." },
  ],
  timeline: [
    { year: "2014", title: "One truck.", text: "ITrucking Solutions opens in Citrus Heights with a single truck and a plan to haul dry van freight the right way." },
    { year: "2016", title: "Owner-operators come on.", text: "The first leased-on drivers join. Growth for the next few years comes from people who bring their own equipment and want a carrier that pays on time." },
    { year: "2018", title: "Own authority, interstate.", text: "We earn for-hire interstate authority and start running beyond California, building the 48-state coverage we operate under now." },
    { year: "2020", title: "First company trucks.", text: "We buy our own equipment and put company drivers in it. Owner-operators stay; the company fleet is added capacity, not a replacement." },
    { year: "2022", title: "The office takes shape.", text: "Dispatch, safety, and accounting move fully in-house, so drivers and customers deal with the same people instead of a patchwork of outside help." },
    { year: "2024", title: "Yard and fleet desk.", text: "A yard operation and a fleet manager come on as the truck and trailer count climbs. Most new equipment is bought new." },
    { year: "2026", title: "About 70 trucks and trailers.", text: "The fleet is late-model, dry van, and running all 48 states. The shop is in the works." },
  ],
  facts: [
    { label: "Based in", value: "Citrus Heights, California" },
    { label: "Authority", value: "For-hire interstate carrier" },
    { label: "Freight", value: "Dry van truckload" },
    { label: "Coverage", value: "All 48 states" },
  ],
};
