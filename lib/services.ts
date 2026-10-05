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
    {
      name: "53-foot dry vans",
      // PLACEHOLDER — AI-generated, standing in for a photo of our own truck and trailer. The tractor shows the
      // Volvo badge, so it needs Volvo's OK like the other truck pictures (DECISIONS.md → Open). No caption
      // may call it ours or date it.
      image: {
        src: "/images/ship-truck-side.jpg",
        alt: "A white truck pulling a 53-foot dry van trailer along a desert highway",
        // The cab sits in the left third, so a centred crop of the tall card cut it off.
        position: "25% 50%",
      },
    },
    {
      // Short, so the closed card holds it on two lines.
      name: "Out of California",
      // PLACEHOLDER — AI-generated, as above: a truck on a Sierra Nevada highway.
      image: {
        src: "/images/home-hero-sierra.jpg",
        alt: "A white truck and dry van trailer on a mountain highway through pine forest",
      },
    },
  ],
  open: 0,
};
