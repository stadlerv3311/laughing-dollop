// Single source for the company name and every nav link.
// Header and Footer both read from here — change a link once, it updates everywhere.
// Before adding a link, check docs/DECISIONS.md → Navigation & clutter.

export const site = {
  name: "ITrucking Solutions",
  description:
    "Dry van truckload shipping and driver jobs with ITrucking Solutions.",
} as const;

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export const aboutLink: NavLink = { label: "About", href: "/about" };
export const newsLink: NavLink = { label: "News", href: "/news" };

// No Home item (owner, 2026-09-24): the logo is the way home, in the header and the phone menu's bar alike.
export const primaryNav: NavLink[] = [
  { label: "Services", href: "/services" },
  aboutLink,
  newsLink,
];

// A plain link since 2026-09-25 (owner: remove the Careers dropdown). It opens the careers page — the three jobs,
// what each one is and why to take it here — whose Apply now buttons open the application on that job.
export const careersLink: NavLink = { label: "Careers", href: "/careers" };

export const fleetMapLink: NavLink = { label: "Fleet map", href: "/fleet-map" };
export const quoteLink: NavLink = { label: "Get a quote", href: "/quote" };
/**
 * View transition name shared by the homepage's Ship with us card and the Quote page, and the transition type
 * the card's Get a quote button sets, so only that navigation grows the card into the page (2026-09-24). CSS:
 * `.quote-open` in app/globals.css. The story band does the same into About (lib/story.ts → STORY_BAND).
 */
export const QUOTE_CARD = "quote-card";
export const QUOTE_OPEN = "quote-open";
// Every driver-application button on the site uses this label — header, hero, phone menu and the apply cards
// (2026-09-24 wording pass; it replaced "Apply To Drive", "Drive with us" and "Apply"). The page it opens is
// still called "Drive for us". Since 2026-09-25 it opens the careers page first (owner: see the jobs before the
// application); only the careers page's own Apply now buttons go straight into the questions.
export const applyLink: NavLink = { label: "Apply now", href: "/careers" };

export type CompanyStat = {
  /** The number the counter fills up to. */
  value: number;
  /** Shown after the number, e.g. "+" or "M+". */
  suffix?: string;
  label: string;
  /**
   * One short line under the label on what the number means for a shipper (owner, 2026-09-28, from the Samsara
   * review: a number should read as a promise, not a brag). Draft copy. No new figures in it.
   */
  meaning?: string;
  /**
   * Which half of the numbers band it sits in: "story" (how long and how far — set large, on the left) or
   * "proof" (the record — set smaller, on the right). See components/home/TrustBar.tsx.
   */
  group: "story" | "proof";
};

// Company numbers for the homepage trust bar. Only confirmed figures — see docs/DECISIONS.md → Trust badges.
// Five since 2026-09-23: the hero's two numbers (years in business, on-time delivery) moved back down here when
// the hero went to one headline and one button. The company was founded in 2008.
export const companyStats: CompanyStat[] = [
  { value: 10, suffix: "+", label: "Years in business", group: "story" },
  { value: 32, suffix: "M+", label: "Miles driven", group: "story" },
  {
    value: 125000,
    suffix: "+",
    label: "Loads completed",
    meaning: "Your lane has almost certainly been run before.",
    group: "proof",
  },
  { value: 48, label: "States we serve", meaning: "Pickup to delivery, anywhere in the lower 48.", group: "proof" },
  { value: 99, suffix: "%", label: "On-time delivery", meaning: "Your dock schedule stays your dock schedule.", group: "proof" },
];

/** A stat's figure as the numbers band shows it once counted up ("125,000+", "99%"). */
function statFigure(label: CompanyStat["label"]) {
  const stat = companyStats.find((s) => s.label === label);
  if (!stat) throw new Error(`No company stat labelled "${label}"`);
  return `${stat.value.toLocaleString("en-US")}${stat.suffix ?? ""}`;
}

// The proof line under Ship with us's quote bar (2026-09-29, Ship with us review point 05): three of the numbers band's
// own figures, read from `companyStats` so the two can't disagree. No new claim. "Dry van only" moved here from the
// band's paragraph.
export const shipProof = [
  { figure: statFigure("Loads completed"), words: "loads completed" },
  { figure: statFigure("On-time delivery"), words: "on time" },
  { figure: statFigure("States we serve"), words: "states, dry van only" },
];

export type Slogan = {
  /** The setup, in full-strength ink. */
  lead: string;
  /** The turn the sentence takes, set in grey on its own line — the two-tone the headline has always used. */
  tail: string;
};

/** One line of the homepage h1: "A {noun} you can {verb}." */
export type HeroLine = { noun: string; verb: string };

export type HeroPair = { lines: readonly [HeroLine, HeroLine] };

// The homepage's h1, over the hero film. Shipper-first since 2026-09-24 (trial). Since 2026-09-29 it rolls through
// these pairs: "A … you can …" stays put and only the noun and verb change (HeroHeadline). The first pair is what
// search engines and screen readers get. When the next pair has the same nouns with the verbs traded, the verbs cross
// between the lines instead of rolling — the owner's see / trust swap. Draft copy. "A load you can see." is the one
// exception to the no-watching-your-load rule, kept by the owner (DECISIONS.md → Wording and type).
//
// Keep the widths even (owner, 2026-09-29): each line's noun is a short word within a few pixels of the others on
// its line (fleet, team, crew; load, plan, lane), so "you can" barely moves when they change. The verbs end the
// line, so they only move the full stop — still keep them short.
export const heroPairs: readonly HeroPair[] = [
  { lines: [{ noun: "fleet", verb: "see" }, { noun: "load", verb: "trust" }] },
  { lines: [{ noun: "fleet", verb: "trust" }, { noun: "load", verb: "see" }] },
  { lines: [{ noun: "team", verb: "reach" }, { noun: "plan", verb: "keep" }] },
  { lines: [{ noun: "crew", verb: "call" }, { noun: "lane", verb: "book" }] },
];

// The line under the h1 (2026-09-24). Draft copy — the facts are the safety band's rows.
export const homeSupport = "GPS and cameras on every truck. Service on record.";

// The line under the h1 (from the owner's "2a" hero reference, 2026-09-18). Draft copy: like the rolling slogans,
// these are promises — answered on the first ring, agreed routes, home on time — and need sign-off before launch.
export const homeLede = "Dispatch that answers on the first ring. Routes you agreed to. Home when we said.";


// Draft copy — the smaller rolling line under the hero (moved out of the h1 on 2026-09-18). All three need
// sign-off before launch: the dispatcher promise, the live bonus and the home-time line are commitments, not
// descriptions (docs/DECISIONS.md → Open). The first one is what screen readers get.
//
// Keep them within a few characters of each other: the line is sized to the tallest one, so a noticeably
// shorter slogan would sit above a blank row.
export const driverSlogans: readonly Slogan[] = [
  // The owner's approved line (the hero's h1 until 2026-09-24).
  { lead: "Where you’re known by your name,", tail: "not your truck number." },
  { lead: "A dispatcher who knows your route,", tail: "and answers the phone." },
  { lead: "Watch your bonus grow live,", tail: "so payday is never a surprise." },
  { lead: "Home time you planned on,", tail: "not home time you hoped for." },
];

/** The three jobs the application covers (2026-09-25). */
export type Job = "driver" | "office" | "shop";

export type ApplyRoute = {
  /** Which job this card opens the application on. */
  job: Job;
  /**
   * Where the work happens, used as the card's heading: "On the road", "In the office", "In the shop" — all
   * places, so they read as one set and answer the "Where you'd fit." heading above them. Not a pitch.
   */
  role: string;
  /** One line on what the job actually is. */
  body: string;
  /** The application, opened on this job. The homepage card links to this job's section on /careers instead. */
  href: string;
  /** The job's name on the careers page ("Class A driver"). */
  title: string;
  /** The careers page's paragraph on what the work is. */
  summary: string;
  /** Why take this job here — facts already on record only, no pay figures (DECISIONS.md → Pay transparency). */
  reasons: readonly { title: string; body: string }[];
  image: {
    src: string;
    alt: string;
    /**
     * CSS `object-position`, for photos whose subject isn't in the middle. The cards are near-square from
     * `md` up, so a 3:2 photo loses a third of its width there and a centred crop can cut the subject.
     */
    position?: string;
  };
};

// The homepage's three ways in (requested 2026-09-17). Every role goes to the same short form, so these are
// routes into one process, not three different applications (docs/DECISIONS.md → Applications).
//
// Draft copy. The office and shop cards land on `/careers/staff` with their job already picked (`?job=`); the
// application itself lets you switch between all three (components/careers/JobApplication.tsx).
export const applyRoutes: readonly ApplyRoute[] = [
  {
    job: "driver",
    role: "On the road",
    body: "Class A, dry van and the bonus tracker in your app.",
    href: "/careers/drivers",
    title: "Class A driver",
    summary:
      "You haul Class A dry van truckload freight. One kind of freight, one kind of trailer, and dispatch always knows where your truck is.",
    reasons: [
      { title: "Dry van only", body: "No reefer, no flatbed. One kind of trailer, every load." },
      { title: "2025–26 Volvos", body: "New trucks, pulling brand-new trailers." },
      { title: "Your bonus, live", body: "The tracker in your app shows it grow, load by load." },
      { title: "Cameras on the road", body: "Our dash cameras face the road, so there’s footage of what really happened." },
    ],
    image: {
      // The owner's driver portrait (2026-09-17), down from 5376px — the full-size original took ~20s a
      // width to resize in dev. The truck photo it replaced is still `home-hero-desert.jpg`.
      src: "/images/apply-driver.jpg",
      alt: "A driver standing with folded arms in front of his truck",
      // He stands left of centre, so a centred square crop would cut him in half.
      position: "20% 50%",
    },
  },
  {
    job: "office",
    role: "In the office",
    body: "Plan the loads and keep our drivers moving.",
    href: "/careers/staff?job=office",
    title: "Dispatcher",
    summary: "You plan the loads and keep our drivers moving, from the first pickup to the last delivery.",
    reasons: [
      { title: "A fleet you can see", body: "GPS on every truck and trailer, so you’re never guessing where one is." },
      { title: "One kind of freight", body: "Dry van truckload only, so every load plays by the same rules." },
      { title: "New equipment", body: "New 2025–26 Volvos, pulling brand-new trailers." },
    ],
    image: {
      src: "/images/apply-dispatcher.jpg",
      alt: "A dispatcher in a headset working at a desk of route screens",
    },
  },
  {
    job: "shop",
    role: "In the shop",
    body: "Tires, repairs and road service, in our own shop.",
    href: "/careers/staff?job=shop",
    title: "Tire and shop technician",
    summary: "You handle tires, repairs and road service for our own trucks, in our own shop.",
    reasons: [
      { title: "Our own shop", body: "You work on our fleet, not a line of strangers’ trucks." },
      { title: "New equipment", body: "2025–26 Volvos and brand-new trailers." },
      { title: "Maintenance on record", body: "Every repair and inspection is logged, so each truck’s history is on file." },
    ],
    image: {
      // The owner's tire-tech portrait (2026-09-18), replacing an empty shop interior — the row now shows
      // three people instead of two people and a room.
      src: "/images/apply-tire-shop.jpg",
      alt: "A tire technician standing with folded arms in a truck tire shop",
      // Nearly square, so phones' 3:2 crop cuts over a third of the height. Biased up to keep headroom
      // above his cap; centred, it nearly touches the top edge.
      position: "50% 30%",
    },
  },
];

export type SafetySystem = {
  name: string;
  body: string;
  /**
   * What replaces the band's photo while this row is hovered, focused or tapped: a muted clip, or — for a row
   * with no footage — a still (`image`) plus its alt text. Give one or the other.
   */
  video?: string;
  /**
   * Show only part of the clip (owner, 2026-09-28: the GPS clip on its map, without the app's side panel and map
   * buttons). Fractions of the frame; the card always stays inside this box whatever its shape, centred on it.
   * `aspect` is the clip's width / height.
   */
  crop?: { x: number; y: number; w: number; h: number; aspect: number };
  image?: { src: string; alt: string };
  /**
   * What the system records, shown under the pair's words while the pair is hovered and this card is open (owner,
   * 2026-09-28): a label, one figure with its unit, and a short list. Sample values, marked "Example" on the page —
   * never a real unit, position or event.
   */
  readout?: { label: string; figure: string; unit?: string; rows: readonly { label: string; value: string }[] };
};

// The homepage's safety band (requested 2026-09-18). Behind it: Samsara for GPS on trucks and trailers, basic
// telematics and dash cams; Fleetio for maintenance history. The copy lists what we have, not whose it is —
// the owner chose not to name the vendors for now (2026-09-18).
//
// Draft copy. Two rules to keep while editing (docs/DECISIONS.md → Safety band):
// - GPS lines say *we* track the equipment, never that a shipper can watch their load. The public Fleet Map
//   is approximate on purpose, because exact positions are a cargo-theft and driver-privacy risk.
// - Cameras are framed as recording the road, not as watching the driver — the page above is recruiting.
export const safetySystems: readonly SafetySystem[] = [
  {
    name: "GPS on every truck and trailer",
    body: "Its own tracker on every truck and every trailer, even one dropped at a yard.",
    // PLACEHOLDER — Samsara's own marketing clip, with their demo data. Must not go live (DECISIONS.md → Safety band).
    video: "/videos/safety-gps-placeholder.mp4",
    // The map only (46–92% across, 10–98% down, centred on the truck): clear of the vehicle panel on the left and
    // the map buttons on both edges. 2286 × 1714.
    crop: { x: 0.46, y: 0.1, w: 0.46, h: 0.88, aspect: 2286 / 1714 },
    readout: {
      label: "Speed",
      figure: "62",
      unit: "mph",
      rows: [
        { label: "Unit", value: "Truck 0417" },
        { label: "Location", value: "I-65 N, Bowling Green, KY" },
        { label: "From", value: "Nashville, TN" },
      ],
    },
  },
  {
    name: "Dash cameras",
    body: "Pointed at the road ahead, not at the driver.",
    // PLACEHOLDER — Pexels stock (5382495, real dash cam footage on a US interstate), until the owner sends our own.
    video: "/videos/safety-dashcam-placeholder.mp4",
    readout: {
      label: "Harsh brake",
      figure: "2:14",
      unit: "PM",
      rows: [
        { label: "Camera", value: "Road-facing" },
        { label: "Clip", value: "20 s saved" },
        { label: "Earlier", value: "Over speed, 71 in a 65" },
      ],
    },
  },
  {
    name: "Maintenance on record",
    body: "Every repair and inspection, logged.",
    // PLACEHOLDER — Pexels stock (6685045, Gustavo Fring), until the owner sends our own shop footage.
    video: "/videos/safety-maintenance-placeholder.mp4",
    // The work, not the man (owner, 2026-09-28): the wheel he's checking and the clipboard in his hands, 40–76%
    // across — clear of the headlight on the left, most of his back on the right. 1280 × 720.
    crop: { x: 0.4, y: 0.05, w: 0.36, h: 0.9, aspect: 1280 / 720 },
    readout: {
      label: "Since last service",
      figure: "14",
      unit: "days",
      rows: [
        { label: "Unit", value: "Truck 0417" },
        { label: "Checked", value: "Tires, brakes" },
        { label: "Next inspection", value: "In 6 weeks" },
      ],
    },
  },
  {
    name: "New equipment",
    body: "2025–26 Volvo trucks, pulling brand-new trailers.",
    // PLACEHOLDER — AI-generated line-up standing in for a photo of our own yard; the fleet itself is real (owner,
    // 2026-09-24). Tractors only, no trailers — swap for a real shot with trailers when one exists.
    image: {
      src: "/images/safety-fleet.jpg",
      alt: "A row of new white Volvo trucks parked side by side on an open lot",
    },
    readout: {
      label: "Model year",
      figure: "2026",
      rows: [
        { label: "Trucks", value: "Volvo" },
        { label: "Trailers", value: "Brand-new, 2025" },
        { label: "Service history", value: "On file" },
      ],
    },
  },
];

// The safety band's zigzag (owner, 2026-09-28): two pairs of the cards above, each beside a short block of words.
// Draft copy, built only from the systems' own facts. `systems` are indexes into `safetySystems`; `open` is which of
// the pair starts wide (the first pair on its left card, the second on its right, so the two step down the page).
export const safetyPitch = { lead: "Plenty of carriers ask you to take their word for it.", strong: "We’d rather show you." };

export type SafetyGroup = {
  title: string;
  body: string;
  systems: readonly [number, number];
  open: 0 | 1;
};

export const safetyGroups: readonly SafetyGroup[] = [
  {
    title: "Your load is never out of sight.",
    body: "We know where each truck and trailer is at any hour, and if something happens on the road, there’s footage of what really did.",
    systems: [0, 1],
    open: 0,
  },
  {
    title: "Equipment you don’t have to worry about.",
    body: "New trucks, new trailers, and each truck’s full service history on file.",
    systems: [2, 3],
    open: 1,
  },
];

// The tools we run on (owner, 2026-09-29): the logo row at the foot of the safety band. All five are in use today.
// Each logo is the company's own, from its website, in its own colours and unaltered. `height` is set per logo (px)
// so they read the same size — wide marks shorter. Showing them still needs each company's OK (docs/DECISIONS.md).
export const toolsLine = "The tools we run on, every day";

export const tools = [
  { name: "Samsara", src: "/logos/samsara.svg", width: 596, height: 97, display: 22 },
  { name: "Fleetio", src: "/logos/fleetio.svg", width: 220, height: 53, display: 30 },
  { name: "Volvo", src: "/logos/volvo.svg", width: 226, height: 19, display: 13 },
  { name: "Datatruck", src: "/logos/datatruck.svg", width: 166, height: 24, display: 22 },
  { name: "OnRamp", src: "/logos/onramp.svg", width: 324, height: 59, display: 20 },
] as const;

export const footerNav: NavLink[] = [
  { label: "Services", href: "/services" },
  aboutLink,
  newsLink,
  careersLink,
  fleetMapLink,
];

// What happens after each form (2026-09-28): components/ui/NextSteps.tsx. Draft copy, and only what the site already
// promises — the quote form's "we'll get back to you by phone or email", GPS on truck and trailer, the application's
// "HR will call you back". Timings go in once the owner confirms them.
export const quoteSteps = [
  { title: "Tell us about the load", body: "Where it’s going, where it’s coming from and a few details. No account needed." },
  { title: "We come back with a price", body: "By phone or email, whichever you gave us." },
  { title: "Tracked to delivery", body: "GPS on the truck and the trailer, the whole way to your dock." },
] as const;

export const applySteps = [
  { title: "Pick your job", body: "On the road, in the office or in the shop." },
  { title: "Answer a few questions", body: "No résumé, no uploads. About two minutes for drivers, a minute for the rest." },
  { title: "HR calls you back", body: "On the number you gave us. There’s nothing else to do." },
] as const;
