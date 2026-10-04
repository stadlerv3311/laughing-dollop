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
/**
 * Every Get a quote button goes to the homepage's Ship with us band and opens its form there (owner, 2026-10-02: no
 * separate quote page). On the homepage the band catches the click and glides down; from another page it opens
 * the homepage at the band (components/home/ShipWithUs.tsx). `/quote` redirects here.
 */
export const quoteLink: NavLink = { label: "Get a quote", href: "/#quote" };
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
  /** Set large: one of the band's two main numbers (owner, 2026-10-02). The rest are set smaller around them. */
  main?: boolean;
};

// Company numbers for the homepage trust bar. Only confirmed figures — see docs/DECISIONS.md → Trust badges.
// Five since 2026-09-23: the hero's two numbers (years in business, on-time delivery) moved back down here when
// the hero went to one headline and one button. The company was founded in 2008. In the order they show (owner,
// 2026-10-02): the two main ones as bookends — experience in, reliability out — with the three smaller ones between.
// The one-line "meaning" under each of the smaller three (2026-09-28) was removed the same day. The small labels are
// one word; the two main ones say the whole claim.
export const companyStats: CompanyStat[] = [
  { value: 10, suffix: "+", label: "In business", main: true },
  // Written short like the miles (owner, 2026-10-02): 125K+, not 125,000+.
  { value: 125, suffix: "K+", label: "Loads" },
  { value: 32, suffix: "M+", label: "Miles" },
  { value: 48, label: "States" },
  { value: 99, suffix: "%", label: "On-time delivery", main: true },
];

export type Slogan = {
  /** The setup, in full-strength ink. */
  lead: string;
  /** The turn the sentence takes, set in grey on its own line — the two-tone the headline has always used. */
  tail: string;
};

/** One line of the homepage h1: "A {noun} you can {verb}." */
export type HeroLine = { noun: string; verb: string };

// The homepage's h1, over the hero film. Shipper-first since 2026-09-24 (trial). One fixed pair since 2026-10-02
// (owner: "remove changing", so every visitor sees the same hero); from 2026-09-29 it rolled through four pairs —
// fleet/see + load/trust, the see / trust swap, team/reach + plan/keep, crew/call + lane/book. Draft copy. "A load you
// can see." is the one exception to the no-watching-your-load rule, kept by the owner (DECISIONS.md → Wording and type).
export const heroLines: readonly [HeroLine, HeroLine] = [
  { noun: "fleet", verb: "trust" },
  { noun: "load", verb: "see" },
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
   * places, so they read as one set (the homepage's "Where you'd fit." band they were named for became Why work
   * with us on 2026-09-30). Not a pitch.
   */
  role: string;
  /** One line on what the job actually is. */
  body: string;
  /** The application, opened on this job. The homepage's Apply now goes to this job's section on /careers instead. */
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

/** One job's side of Why work with us: its five reasons and the words beside the Apply now button. */
export type WorkSeat = {
  job: Job;
  /** The people in this job, for "Why ___ stay." above the reasons. */
  who: string;
  reasons: readonly { title: string; body: string }[];
};

// Why work with us, the homepage's careers section (owner, 2026-09-30) — it took over from Why drive for us, the
// rolling slogans and the apply cards. The driver reasons are the owner's own copy (2026-09-29), and the heading is a
// line from the owner's story (the shortened story itself sat beside the heading until 2026-10-01).
// Draft copy: the office and shop reasons were written from facts already on the site (the
// careers reasons above and the owner's copy) and need the owner's OK. The company shop the shop ones speak of is real
// (owner, 2026-10-03).
export const whyWorkWithUs = {
  label: "Why work with us",
  heading: ["The person who can fix it", "still answers."],
  seats: [
    {
      job: "driver",
      who: "drivers",
      reasons: [
        {
          title: "Dispatchers in the United States",
          body: "Your dispatcher is here, not overseas. Same time zone, same roads, and someone who picks up when a shipper changes the appointment. You are not waiting on a callback from another country.",
        },
        {
          title: "A yard in Sacramento",
          body: "The yard is in Sacramento, California. Drop a trailer, grab a truck, and deal with people who are on the lot.",
        },
        {
          title: "New trucks and trailers",
          body: "The fleet is late-model, bought new, dry van trucks and trailers. Less time waiting on a shop that is not yours.",
        },
        {
          title: "Pay that shows up, with a bonus on top",
          body: "Settlements are straightforward, and the bonus pays for the work that usually gets taken for granted: clean inspections, on-time deliveries, fuel where it should be.",
        },
        {
          title: "You set the length of the trip",
          body: "Tell us how long you want to be out. Some drivers turn in a week. Some stay out longer. We build the board around that.",
        },
      ],
    },
    {
      job: "office",
      who: "dispatchers",
      reasons: [
        {
          title: "Dispatch stays in the United States",
          body: "The desk is here, not overseas. You work the same hours as the drivers and shippers on the other end of the phone.",
        },
        { title: "A fleet you can see", body: "GPS on every truck and trailer, so you are never guessing where one is." },
        { title: "One kind of freight", body: "Dry van truckload only, so every load plays by the same rules." },
        {
          title: "New trucks and trailers",
          body: "Late-model, bought new. Fewer breakdowns to plan around, and fewer calls you did not see coming.",
        },
        {
          title: "You know the drivers",
          body: "We know who is in which truck. You work with the same drivers, by name, not a list of truck numbers.",
        },
      ],
    },
    {
      job: "shop",
      who: "technicians",
      reasons: [
        { title: "Our own fleet", body: "You work on our trucks, not a line of strangers’ trucks." },
        {
          title: "New trucks and trailers",
          body: "Late-model, bought new, dry van only. You learn one fleet well instead of every make that rolls in.",
        },
        {
          title: "Maintenance on record",
          body: "Every repair and inspection is logged, so each truck’s history is on file.",
        },
        {
          title: "Trucks you can find",
          body: "GPS on every truck and trailer, so a road call starts with where the truck is, not a guess.",
        },
        {
          title: "The people who run it answer",
          body: "If a part is held up or a truck has to come off the road, you can reach the people who run the company, not a ticket system.",
        },
      ],
    },
  ] satisfies readonly WorkSeat[],
};

export type SafetySystem = {
  /** The card's only words since 2026-10-02 (owner): the line under the name was removed. */
  name: string;
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
   * 2026-09-28): a label, one figure with its unit, and a short list. Sample values — never a real unit, position or
   * event. They were marked "Example" on the page until 2026-10-01 (owner removed the marker).
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
    name: "GPS on trucks and trailers",
    // PLACEHOLDER — Samsara's own marketing clip, with their demo data. Must not go live (DECISIONS.md → Safety band).
    video: "/videos/safety-gps-placeholder.mp4",
    // The map only (46–92% across, 10–98% down, centred on the truck): clear of the vehicle panel on the left and
    // the map buttons on both edges. 2286 × 1714.
    crop: { x: 0.46, y: 0.1, w: 0.46, h: 0.88, aspect: 2286 / 1714 },
    // No sample readout since 2026-10-02 (owner: remove the examples beside the road pair).
  },
  {
    name: "Dash cameras",
    // PLACEHOLDER — Pexels stock (5382495, real dash cam footage on a US interstate), until the owner sends our own.
    video: "/videos/safety-dashcam-placeholder.mp4",
  },
  {
    name: "Maintenance on record",
    // PLACEHOLDER — Pexels stock (6685045, Gustavo Fring), until the owner sends our own shop footage.
    video: "/videos/safety-maintenance-placeholder.mp4",
    // The work, not the man (owner, 2026-09-28): the wheel he's checking and the clipboard in his hands, 40–76%
    // across — clear of the headlight on the left, most of his back on the right. 1280 × 720.
    crop: { x: 0.4, y: 0.05, w: 0.36, h: 0.9, aspect: 1280 / 720 },
    // No sample readout since 2026-10-02 (owner: the shop pair gets words only, like the road pair).
  },
  {
    name: "New equipment",
    // PLACEHOLDER — AI-generated line-up standing in for a photo of our own yard; the fleet itself is real (owner,
    // 2026-09-24). Tractors only, no trailers — swap for a real shot with trailers when one exists.
    image: {
      src: "/images/safety-fleet.jpg",
      alt: "A row of new white Volvo trucks parked side by side on an open lot",
    },
    // No sample readout since 2026-10-02 (owner: the shop pair gets words only, like the road pair).
  },
];

// The safety band's zigzag (owner, 2026-09-28): two pairs of the cards above, each beside a short block of words.
// Draft copy, built only from the systems' own facts. `systems` are indexes into `safetySystems`; `open` is which of
// the pair starts wide (the first pair on its left card, the second on its right, so the two step down the page).
// The safety band's heading and line under it are the owner's (2026-10-02), replacing "We know truck and trailer
// location and last service." and "Plenty of carriers ask you to take their word for it. We’d rather show you."
// The line is "Nothing to hide." since later that day (owner); it was "Don’t take our word for it — see the data."
export const safetyPitch = "Nothing to hide.";

export type SafetyGroup = {
  title: string;
  body: string;
  systems: readonly [number, number];
  open: 0 | 1;
};

export const safetyGroups: readonly SafetyGroup[] = [
  {
    title: "Your load is never out of sight.",
    // The owner's wording (2026-10-02).
    body: "GPS on every truck and trailer. Dash cameras on every windshield. You always know where your freight is — and every mile is on record. No calling dispatch. No guessing.",
    systems: [0, 1],
    open: 0,
  },
  {
    title: "Equipment you don’t have to worry about.",
    // The owner's wording (2026-10-02).
    // (Earlier the same day: "New trucks and trailers, serviced on schedule — with every record on file. Your freight
    // never waits on a repair.")
    body: "We monitor every truck’s health between services and fix small issues before they become breakdowns. The newest equipment on the road means your freight moves without surprises.",
    systems: [2, 3],
    open: 1,
  },
];

// The tools we run on (owner, 2026-09-29): the logo row at the foot of the safety band. All five are in use today.
// Each logo is the company's own, from its website, in its own colours and unaltered. `height` is set per logo (px)
// so they read the same size — wide marks shorter. Showing them still needs each company's OK (docs/DECISIONS.md).
export const tools = [
  { name: "Samsara", src: "/logos/samsara.svg", width: 596, height: 97, display: 22 },
  { name: "Fleetio", src: "/logos/fleetio.svg", width: 220, height: 53, display: 30 },
  { name: "Volvo", src: "/logos/volvo.svg", width: 226, height: 19, display: 13 },
  { name: "Datatruck", src: "/logos/datatruck.svg", width: 166, height: 24, display: 22 },
  { name: "OnRamp", src: "/logos/onramp.svg", width: 324, height: 59, display: 20 },
] as const;

// The footer's two groups of links ("F2b", owner, 2026-10-01). Get a quote and Apply now are its buttons, so they're
// not repeated in the lists.
export const footerGroups: { label: string; links: NavLink[] }[] = [
  { label: "Shipping", links: [primaryNav[0], fleetMapLink] },
  { label: "Company", links: [aboutLink, newsLink, careersLink] },
];

// The company as registered with the FMCSA — from the SAFER carrier snapshot for USDOT 3141514, which the owner
// pointed to (2026-10-01). Shown in the footer. The phone is the number on record; the owner has to confirm it's the
// one shippers and drivers should call. No email yet.
export const company = {
  legalName: "ITrucking Solutions Inc.",
  phone: { label: "(916) 836-8136", href: "tel:+19168368136" },
  address: ["6245 Virk Lane", "Citrus Heights, CA 95621"],
  usdot: "3141514",
  mc: "MC-99508",
} as const;
