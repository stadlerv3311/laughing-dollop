// Single source for the company name and every nav link.
// Header and Footer both read from here — change a link once, it updates everywhere.
// Before adding a link, check docs/DECISIONS.md → Navigation & clutter.

export const site = {
  name: "ITrucking Solutions",
  description:
    "Dry van truckload shipping and driver careers with ITrucking Solutions.",
} as const;

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export const aboutLink: NavLink = { label: "About", href: "/about" };
export const newsLink: NavLink = { label: "News", href: "/news" };

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  aboutLink,
  newsLink,
];

export const careersNav: NavLink[] = [
  {
    label: "Drive For Us",
    href: "/careers/drivers",
    description: "CDL driver jobs. Short application, HR calls you back.",
  },
  {
    label: "Dispatch, Shop & Office",
    href: "/careers/staff",
    description: "Dispatcher, mechanic, and office roles.",
  },
];

export const fleetMapLink: NavLink = { label: "Fleet Map", href: "/fleet-map" };
export const quoteLink: NavLink = { label: "Get a Quote", href: "/quote" };
export const applyLink: NavLink = { label: "Apply To Drive", href: "/careers/drivers" };

export type CompanyStat = {
  /** The number the counter fills up to. */
  value: number;
  /** Shown after the number, e.g. "+" or "M+". */
  suffix?: string;
  label: string;
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
  { value: 125000, suffix: "+", label: "Loads completed", group: "proof" },
  { value: 48, label: "States we serve", group: "proof" },
  { value: 99, suffix: "%", label: "On-time delivery", group: "proof" },
];

export type Slogan = {
  /** The setup, in full-strength ink. */
  lead: string;
  /** The turn the sentence takes, set in grey on its own line — the two-tone the headline has always used. */
  tail: string;
};

// The homepage's h1, fixed over the hero photo (2026-09-18). The owner's approved line.
export const homeHeadline: Slogan = { lead: "Where you're known by your name,", tail: "not your truck number." };

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
  { lead: "A dispatcher who knows your route,", tail: "and answers the phone." },
  { lead: "Watch your bonus grow live,", tail: "so payday is never a surprise." },
  { lead: "Home time you planned on,", tail: "not home time you hoped for." },
];

export type ApplyRoute = {
  /** The role, used as the card's heading. Keep it a plain job title, not a pitch. */
  role: string;
  /** One line on what the job actually is. */
  body: string;
  href: string;
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
// Draft copy. Dispatcher and Tire shop both land on `/careers/staff`, which doesn't yet separate the two —
// see docs/DECISIONS.md → Open.
export const applyRoutes: readonly ApplyRoute[] = [
  {
    role: "Driver",
    body: "Class A, dry van, and the bonus tracker in your app.",
    href: "/careers/drivers",
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
    role: "Dispatcher",
    body: "Plan the loads and keep our drivers moving.",
    href: "/careers/staff",
    image: {
      src: "/images/apply-dispatcher.jpg",
      alt: "A dispatcher in a headset working at a desk of route screens",
    },
  },
  {
    role: "Tire shop",
    body: "Mount, balance and road service, in our own shop.",
    href: "/careers/staff",
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
  image?: { src: string; alt: string };
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
    body: "Every tractor and trailer has its own tracker, so one dropped at a yard is never out of sight.",
    // PLACEHOLDER — Samsara's own marketing clip, with their demo data. Must not go live (DECISIONS.md → Safety band).
    video: "/videos/safety-gps-placeholder.mp4",
  },
  {
    name: "Dash cameras",
    body: "Our cameras face the road, so when something happens there’s footage of what really did.",
    // PLACEHOLDER — Pexels stock (5382495, real dash cam footage on a US interstate), until the owner sends our own.
    video: "/videos/safety-dashcam-placeholder.mp4",
  },
  {
    name: "Maintenance on record",
    body: "Every repair and inspection is logged, so each truck’s full service history is on file.",
    // PLACEHOLDER — Pexels stock (6685045, Gustavo Fring), until the owner sends our own shop footage.
    video: "/videos/safety-maintenance-placeholder.mp4",
  },
  {
    name: "New equipment",
    body: "Nearly the whole fleet is 2025–26 Volvo trucks, pulling brand-new trailers.",
    // PLACEHOLDER — AI-generated line-up standing in for a photo of our own yard; the fleet itself is real (owner,
    // 2026-09-24). Tractors only, no trailers — swap for a real shot with trailers when one exists.
    image: {
      src: "/images/safety-fleet.jpg",
      alt: "A row of new white Volvo trucks parked side by side on an open lot",
    },
  },
];

export const footerNav: NavLink[] = [
  { label: "Services", href: "/services" },
  aboutLink,
  newsLink,
  { label: "Careers", href: "/careers/drivers" },
  fleetMapLink,
];
