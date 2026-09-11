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

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  aboutLink,
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

export type CompanyStat = {
  /** The number the counter fills up to. */
  value: number;
  /** Shown after the number, e.g. "+" or "M+". */
  suffix?: string;
  label: string;
};

// Company numbers for the homepage trust bar. Only confirmed figures — see docs/DECISIONS.md → Trust badges.
export const companyStats: CompanyStat[] = [
  { value: 10, suffix: "+", label: "Years in business" },
  { value: 32, suffix: "M+", label: "Miles driven" },
  { value: 125000, suffix: "+", label: "Loads completed" },
  { value: 48, label: "States we serve" },
];

export const footerNav: NavLink[] = [
  { label: "Services", href: "/services" },
  aboutLink,
  { label: "Careers", href: "/careers/drivers" },
  trackLink,
];
