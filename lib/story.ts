// DRAFT company history. The About page's story and timeline are the owner's stand-in text (2026-09-28): the right
// length and shape, not the final wording or dates. Only two facts come from the FMCSA SAFER record: the Citrus
// Heights, CA base and the for-hire interstate operating authority. Replace it with the real story (see
// docs/DECISIONS.md → Open). The homepage story card and the About page both read from here.

/**
 * View transition name shared by the homepage story band and the About page's opening, and the
 * transition type the band's "Read our full story" link sets, so only that navigation morphs one into the other
 * (2026-09-24). CSS: `.story-open` in app/globals.css.
 */
export const STORY_BAND = "story-band";
export const STORY_OPEN = "story-open";

export type Milestone = {
  title: string;
  /** The big mark over it in the homepage story band ("1", "70+", "48"). */
  mark: string;
  /**
   * Counts up from this to the mark's number when the story band's route reaches it ("48" from 1: one truck to 48
   * states). Whatever follows the number in the mark, like the "+" of "70+", stays after it while it counts.
   */
  countFrom?: number;
  text: string;
};

/**
 * One stop on the About page's story line (components/about/StoryLine.tsx). A stop with an `image` is a milestone: it
 * gets the picture and opens a chapter, and the stops after it sit under its words. `position` is the picture's
 * `object-position` where the centre crops badly.
 */
export type TimelineEntry = {
  year: string;
  title: string;
  text: string;
  /**
   * `inPlace` is a picture that doesn't open a chapter: it takes the place of the chapter's picture when its stop is
   * reached (owner, 2026-10-06, giving the chapter's second stop a picture of its own).
   */
  image?: { src: string; position?: string; inPlace?: true };
};

type Story = {
  /** The headline on the homepage story band and the About page, one line each (owner, 2026-09-28). */
  headline: string[];
  /**
   * The one word the homepage band turns orange once its line has landed (owner's pick "D", 2026-09-29): the rule the
   * summary under it spells out. Must appear in the last line.
   */
  headlineAccent: string;
  /** The About page's story line. Not shown since 2026-10-06, when the route took the story row's place. */
  origin: string;
  /**
   * The rule the orange word points at, set on its own under the homepage band's headline (owner, 2026-10-02: "the
   * rule is orange but what rule. i can barely see it"). The third part is shortened from "treat drivers the way we’d
   * want to be treated" (owner's OK, same day). The setup line over it ("We started with one truck and a simple
   * rule:") went on 2026-10-05 (owner: cleaner without it).
   */
  rule: string[];
  /**
   * One line under the About page's headline: the rule itself since 2026-10-06 (owner: remove "A dry van carrier out
   * of Citrus Heights, California, with one rule:" from the front of it).
   */
  lede: string;
  /** The story in a few lines (2026-10-01; it was six titled blocks). Not shown since 2026-10-06, like `origin`. */
  opening: string;
  /** The homepage story band's three marks. */
  milestones: Milestone[];
  /** The About page's story line: its stops, in order. */
  timeline: TimelineEntry[];
};

export const story: Story = {
  headline: ["The map got bigger.", "The rule didn’t."],
  headlineAccent: "rule",
  origin: "It started with one truck.",
  rule: ["Show up when we say we will.", "Keep the freight safe.", "Treat drivers right."],
  lede: "Show up when we say we will, keep the freight safe and treat drivers well.",
  opening:
    "One truck and one driver out of Citrus Heights. Then owner-operators, our own authority, company trucks and an office of our own. The map got bigger; the way we answer the phone didn’t.",
  milestones: [
    { title: "Where it started", mark: "1", text: "One truck and one driver out of California." },
    // "70+" is the About page's fleet figure (owner, 2026-10-02: 55 trucks on the road and about 30 new ones in the
    // yard, so more than 70 — but 70 is the number kept). It replaced "DOT" (own authority) the same day.
    // It counts up from 1 like "48" since 2026-10-07 (owner: "70 doesnt have the animation"): one truck to 70+.
    { title: "The fleet", mark: "70+", countFrom: 1, text: "Late-model trucks on the road." },
    // "30" (New trucks: brand-new trucks in the yard) went on 2026-10-05 (owner: back to three, it was cleaner); the
    // 30 are already inside the 70+.
    { title: "Today", mark: "48", countFrom: 1, text: "Dry van freight moving across 48 states." },
  ],
  // Pictures on the milestones only at first (owner, 2026-10-06: "not every one needs a photo. let's keep pictures for
  // only the important milestones"); later that day the owner sent one for each of the other stops too (below). Two
  // stops to a picture frame (owner, same day: "we need even out the number of facts per picture. and even out the
  // time on every picture"), which is the owner's own scheme: three frames, two dots beside each.
  // That takes six stops and the draft had seven, so ONE IS LEFT OUT, and which one is OUR pick: 2024, "Yard and fleet
  // desk", kept below as a comment. To bring it back, another stop has to come out. Which stops open a chapter is
  // ours too (2014, 2018 and 2022, every other one): the owner hasn't named them.
  // PLACEHOLDER pictures, every one (owner, same day: "you can just add place holders to the pictures. i need to see
  // what we have and then i will change the picture"): stand-ins borrowed from other parts of the site. They sit
  // beside years, which reads as "a photo from that year", so NONE may go live: the rule is no AI or stock picture
  // next to a date (DECISIONS.md → Open). They carry no alt text or caption for the same reason.
  // (The notes below name the stops by the years they had on 2026-10-06. The last two swapped places the day after,
  // so "2022's" picture, the dock doors, is now beside 2026 and "2026's", the row of Volvos, beside 2022.)
  // 2022's is the one picture the owner picked (2026-10-06, sent with "use this for office take shapes"): a row of
  // orange dock doors, about-dock-doors.jpg; safety-fleet.jpg stood there before. Where it comes from wasn't said (it
  // isn't our building), so it's a stand-in like the rest and is NOT in the public repo until the owner says it's
  // licensed or AI-made.
  // 2014's as well (same day, "use this for one truck"): a driver climbing into a white cab at sunrise,
  // about-one-truck.jpg, upright, so the frame shows its lower part, where the driver is (`position`);
  // about-truck-front.jpg stood there before. Source not given either, so it's held back the same way.
  // 2016's too (same day, "use this for owner-operators"): two drivers walking between a Freightliner and a Volvo,
  // about-owner-operators.jpg, `inPlace` like 2026's. Both makers' badges are plain in it, so beyond its source it
  // needs their OK before it could go live; held back the same way.
  // 2026's is the owner's pick too (same day, a picture of the row of new Volvos sent with "find and use this picture
  // for about 70 new trucks and trailers"): new-equipment-lot.jpg, which stood beside 2018 until then. It doesn't open
  // a chapter (`inPlace`), so the story keeps three chapters of two stops. It follows the homepage's New equipment
  // card to the blue-sky copy, new-equipment-row.jpg (owner, later that day, for the card; here it's OUR call, so
  // the same lot isn't on the site under two skies).
  // 2018's is the owner's pick as well (same day, "use for first contract lanes"): trucks crossing a bridge, seen from
  // straight above, about-contract-lanes.jpg; safety-fleet.jpg stood there for a few hours as our pick. The trucks in
  // it are yellow with coloured boxes, not ours, and its source wasn't given, so it's held back the same way.
  // 2020's too (same day, "use this for first company trucks in about screen"): two men walking past a row of white
  // trucks, one with a clipboard, about-company-trucks.jpg, `inPlace`. It looks like a stock photo of real people
  // and its source wasn't given, so it's held back the same way. With it every stop has a picture of its own.
  timeline: [
    { year: "2014", title: "One truck.", text: "ITrucking Solutions opens in Citrus Heights with a single truck and a plan to haul dry van freight the right way.", image: { src: "/images/about-one-truck.jpg", position: "50% 85%" } },
    { year: "2016", title: "Owner-operators come on.", text: "The first leased-on drivers join. Growth for the next few years comes from people who bring their own equipment and want a carrier that pays on time.", image: { src: "/images/about-owner-operators.jpg", inPlace: true } },
    // 2018's words are the owner's (2026-10-06, sent as written with "use this for about page"); only the full stops
    // are ours. "Own authority, interstate." stood here before, so the story no longer says when the authority came.
    { year: "2018", title: "First contract lanes.", text: "A few shippers stopped tendering one load at a time and gave the company weekly freight. Those lanes ran past California, which is what turned a local truck into an interstate carrier in practice.", image: { src: "/images/about-contract-lanes.jpg" } },
    { year: "2020", title: "First company trucks.", text: "We buy our own equipment and put company drivers in it. Owner-operators stay; the company fleet is added capacity, not a replacement.", image: { src: "/images/about-company-trucks.jpg", position: "60% 50%", inPlace: true } },
    // The last two swapped places on 2026-10-07 (owner, on screenshots of both: "lets switch places for the ofice takes
    // shape with About 70 trucks. And chage it name for Fleet of 70+ trucks and trailers"): the fleet opens the last
    // chapter with its picture and the office closes the story, its picture going in place. The title is the owner's
    // (the full stop is ours); it was "About 70 trucks and trailers.". THE YEARS STAYED WHERE THEY WERE, so the line
    // still runs forward: that puts 2022 on the fleet and 2026 on the office, which is OUR doing and nobody's
    // fact. The owner has to say which year each one is.
    // The fleet's picture is the owner's pick (same day, "use this for fleet of 70+"): a yard seen from straight above,
    // white trucks and trailers parked on the slant with one orange cab among them, about-fleet.jpg. The row of new
    // Volvos (new-equipment-row.jpg) stood here until then and is still the homepage's New equipment card. Its source
    // wasn't given and it isn't our yard, so it's a stand-in like the rest: no caption, and NOT in the public repo
    // until the owner says it's licensed or AI-made.
    { year: "2022", title: "Fleet of 70+ trucks and trailers.", text: "The fleet is late-model and dry van, runs all 48 states, and is serviced in our own shop.", image: { src: "/images/about-fleet.jpg" } },
    // { year: "2024", title: "Yard and fleet desk.", text: "A yard operation and a fleet manager come on as the truck and trailer count climbs. Most new equipment is bought new." },
    { year: "2026", title: "The office takes shape.", text: "Dispatch, safety, and accounting move fully in-house, so drivers and customers deal with the same people instead of a patchwork of outside help.", image: { src: "/images/about-dock-doors.jpg", inPlace: true } },
  ],
};
