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

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
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

export const trackLink: NavLink = { label: "Track a Load", href: "/track" };
export const quoteLink: NavLink = { label: "Get a Quote", href: "/quote" };
export const applyLink: NavLink = { label: "Apply To Drive", href: "/careers/drivers" };

export const footerNav: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers/drivers" },
  trackLink,
];
