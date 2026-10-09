import type { SafetySystem } from "./site";

// What we haul and how (ARCHITECTURE.md → Data model). Every line is an owner-confirmed fact (2026-10-03): 53-foot
// dry vans; palletized goods, packaged products, retail freight and non-refrigerated food; regional and long-haul
// lanes out of California; not a broker; dedicated lanes on request; drop and hook. Nothing here may go beyond that.
// Dry van only (DECISIONS.md → Freight types): a new trailer type would be a new entry, but don't add Reefer or
// Flatbed now. Draft wording — needs the owner's OK.

export type Service = {
  id: string;
  name: string;
  /** One line, for the homepage's list (the safety band). */
  description: string;
  /** The Services page's words for it. */
  detail: string;
  /**
   * Its picture there, on the stage and on its small card. Every one is a stand-in for now: no alt text, and nothing
   * that says it is ours. `position` keeps the right part in view, since both frames are wide and low.
   */
  image: { src: string; position?: string };
};

export const services: readonly Service[] = [
  {
    id: "dry-van",
    name: "Dry van truckload",
    description: "Your freight on one of our 53-foot dry vans, from your dock to theirs.",
    // "Live load if the dock is open." has not been confirmed (see `servicesPage`).
    detail:
      "Enclosed 53-foot trailers for freight that needs to stay out of the weather: palletized goods, packaged products, retail freight and non-refrigerated food. One truck, one load, pickup to delivery. Live load if the dock is open.",
    // PLACEHOLDER: the yard from above, the homepage's "53-foot dry vans" picture (`servicesGroup` below has its
    // story: source unconfirmed, not our yard, kept out of the public repo).
    image: { src: "/images/dry-van-yard.jpg", position: "50% 45%" },
  },
  {
    // Offered on request, not as a standing product (owner, 2026-10-03). Never any pricing language here.
    id: "dedicated",
    name: "Dedicated lanes",
    description: "A truck kept on a lane you ship often. Ask when you request a quote.",
    // "can have", and the ask at the end: it's on request. The draft promised it ("gets trucks assigned to it") and
    // promised the same drivers ("drivers who already know the dock"), which nobody has confirmed.
    detail:
      "Freight that moves every week can have trucks assigned to it. Same lane, same capacity. You are not looking for a truck again on Monday. Ask when you get a quote.",
    // PLACEHOLDER: a highway interchange from above, the builder's pick (2026-10-08, "use this for dedicated lanes";
    // a truck on a forest road stood here for an hour before it). Where it is from wasn't said and it looks like a
    // stock picture, so it stays out of the public repo, like the yard picture, until someone says it is licensed.
    image: { src: "/images/services-interchange.jpg" },
  },
  {
    id: "drop-and-hook",
    name: "Drop and hook",
    description: "We leave a trailer at your dock to load on your schedule, then hook it and go.",
    // "We pull the loaded van and leave an empty." has not been confirmed (see `servicesPage`).
    detail:
      "Trailers can sit at your dock so your crew loads on your schedule. We pull the loaded van and leave an empty. Useful when the door is tight or the shift does not match a live appointment.",
    // PLACEHOLDER: a row of white trailers standing on their landing gear, the builder's pick (2026-10-08, "use this
    // for drop and hook"; the news page's stock dock doors stood here before it). Where it is from wasn't said, so it
    // stays out of the public repo. Two things to settle before it goes live: every trailer carries its maker's
    // badge, Great Dane's, and a third party's mark needs that company's OK; and the trailers on the right look
    // like refrigerated ones, on a site that is dry van only.
    image: { src: "/images/services-drop-trailers.jpg", position: "50% 70%" },
  },
];

/** A line under "How we run it" on the Services page, with the picture under it if it has one. */
type RunLine = { text: string; picture?: { src: string; position?: string } };

// The Services page's own words (2026-10-08). The builder brought a draft of the whole page put together by another
// assistant ("what do you think about this text for services page"), then: "modify the text to fit to this company
// but keep as much as possible", and "use that text on the page". What changed from that draft, and why, is in
// DECISIONS.md → Services page. Facts the builder settled the same day: only two owner-operators, both on trucks
// leased from the company, so "on trucks we own" and "You book the load with us" hold; and one dispatch team from
// booking to delivery. Still to confirm: "Live load if the dock is open." and "We pull the loaded van and leave an
// empty." (the builder quoted the second without an answer). Never any pricing language.
export const servicesPage = {
  headline: ["Freight we move,", "on trucks we own."],
  lede: "ITrucking Solutions is a for-hire interstate carrier. We haul dry van truckload on our own late-model trucks and trailers. You book the load with us. We pick it up and we deliver. No broker in the middle.",
  run: {
    title: "How we run it",
    // Three of the facts as big numbers, the way the homepage sets its own, and the rest a line each. 70+ is the
    // About page's fleet figure (lib/story.ts); the shop is our own and already running (owner, 2026-10-03), where
    // the draft had it "being built". The last three lines are the facts of the homepage's road pair, in its own
    // words (lib/site.ts → `safetyGroups`), without its promises to the shipper (the builder, 2026-10-08, of that
    // block: "some information that can work"). Two lines since later that day (the builder, on a screenshot of six:
    // the lanes line and "Every mile on record" crossed out, "cause they repeat", and the other four boxed in pairs,
    // "lets combine another cause those are basicaly the same").
    numbers: [
      { value: 53, suffix: "", label: "Foot dry vans" },
      { value: 70, suffix: "+", label: "Late-model trucks" },
      { value: 1, suffix: "", label: "Dispatch team, booking to delivery" },
    ],
    // Each line can have a picture under it. The yard and shop's: a mechanic tilting the hood of a truck in a shop
    // (the builder, 2026-10-08: "use this for shop and mantenance shop"). It took the place of a warehouse wall with orange dock
    // doors, put there an hour before ("add this pictures to yard in sacramento"; `services-dock-doors.jpg`, still
    // on disk, unused). PLACEHOLDER: it looks AI-made, the truck has a Volvo's shape (Volvo's OK needed, as for the
    // site's other truck pictures), and it is not our shop or our mechanic. So no alt text, no caption, and it must
    // not go live as ours. Kept out of the public repo. The dark frame around the sent file is cut off.
    lines: [
      {
        text: "A yard in Sacramento and our own maintenance shop",
        picture: { src: "/images/services-shop.jpg", position: "50% 55%" },
      },
      // From inside a truck cab looking down a highway, a dash camera with a screen under the mirror (the builder,
      // 2026-10-08: "use this for dash cam and gps"; the free libraries had no such picture). PLACEHOLDER: it looks
      // AI-made (the sticker on the visor is gibberish), the trucks in it are European cab-overs and the camera's
      // screen reads km/h, and it is not our truck or our camera. So no alt text, no caption, and it must not go
      // live as ours. Kept out of the public repo.
      {
        text: "GPS on every truck and trailer, dash cameras on every windshield",
        picture: { src: "/images/services-dash-cam.jpg" },
      },
    ] as readonly RunLine[],
  },
  close: {
    // The homepage band's own question, word for word. A sentence stood under it ("Tell us about it. If we can take
    // it, we will say so. If we cannot, we will say that too.") until the builder crossed it out on a screenshot,
    // 2026-10-08.
    title: "Have a load to move?",
  },
} as const;

// The safety band's first pair (owner picked idea A of the services report, 2026-10-05): what we do, straight under
// the band's heading, before the numbers and the road pair. Same shape as the safety pairs (lib/site.ts →
// `SafetyGroup`), with its own cards.
export const servicesGroup: {
  title: string;
  body: string;
  cards: readonly [SafetySystem, SafetySystem];
  open: 0 | 1;
} = {
  title: "Dry van freight, dock to dock.",
  body: "Palletized goods, packaged products, retail freight and food that doesn’t need a reefer, in 53-foot dry vans. Regional and long-haul lanes out of California, on our own trucks: we’re a carrier, not a broker.",
  cards: [
    // Out of California on the left and open, the trailers on the right (owner, 2026-10-05: "swap places").
    {
      // Short, so the closed card holds it on two lines.
      name: "Out of California",
      // PLACEHOLDER — AI-generated, as above: a truck on a Sierra Nevada highway.
      image: {
        src: "/images/home-hero-sierra.jpg",
        alt: "A white truck and dry van trailer on a mountain highway through pine forest",
      },
    },
    {
      name: "53-foot dry vans",
      // PLACEHOLDER — the owner's pick (2026-10-05, "use this for 53 foot dry van trailers"): rows of trailers in a
      // yard, from above. Its source isn't confirmed and it isn't our yard, so no caption may call it ours or date
      // it, and it stays out of the public repo until the owner says where it's from. It replaced the AI truck on
      // a desert highway (ship-truck-side.jpg). Since 2026-10-06 it's the owner's cleaner copy of the same view
      // (smooth roofs; sent with "use this for 53 ft vans", the dark frame around it cut off): dry-van-yard.jpg.
      // dry-van-trailers.jpg, the first copy, is no longer used.
      image: {
        src: "/images/dry-van-yard.jpg",
        alt: "Rows of white dry van trailers parked in a yard, seen from above",
        // The card is taller than the picture, so it shows a slice of its width, a narrow one while it's closed.
        // This one sits between the blue shipping containers at either end of the upper row, so the card shows
        // dry vans only, open or closed, and the closed card has trailers in both rows.
        position: "45% 50%",
      },
    },
  ],
  open: 0,
};
