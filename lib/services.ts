import type { SafetySystem } from "./site";

// What we haul and how (ARCHITECTURE.md → Data model). Every line is an owner-confirmed fact (2026-10-03): 53-foot
// dry vans; palletized goods, packaged products, retail freight and non-refrigerated food; regional and long-haul
// lanes out of California; not a broker; dedicated lanes on request; drop and hook. Nothing here may go beyond that.
// Dry van only (DECISIONS.md → Freight types): a new trailer type would be a new entry, but don't add Reefer or
// Flatbed now. Draft wording — needs the owner's OK.

export type Service = {
  id: string;
  name: string;
  description: string;
};

export const services: readonly Service[] = [
  {
    id: "dry-van",
    name: "Dry van truckload",
    description: "Your freight on one of our 53-foot dry vans, from your dock to theirs.",
  },
  {
    // Offered on request, not as a standing product (owner, 2026-10-03). Never any pricing language here.
    id: "dedicated",
    name: "Dedicated lanes",
    description: "A truck kept on a lane you ship often. Ask when you request a quote.",
  },
  {
    id: "drop-and-hook",
    name: "Drop and hook",
    description: "We leave a trailer at your dock to load on your schedule, then hook it and go.",
  },
];

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
      // a desert highway (ship-truck-side.jpg).
      image: {
        src: "/images/dry-van-trailers.jpg",
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
