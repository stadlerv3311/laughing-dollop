# ARCHITECTURE.md
> Technical structure for the site. Keep this compressed — facts, not narrative. Update after a page/feature is done, not mid-build.

## Stack
- Next.js 16 — App Router, Turbopack
- React 19 + TypeScript
- Tailwind CSS v4 — brand tokens live in `app/globals.css` → `@theme`
- motion (`motion/react`) — UI animation and scroll-linked values
- Lenis — smooth wheel scrolling (turned off for reduced motion)
- No 3D library — three.js and React Three Fiber were removed on 2026-09-11; the video intro that replaced them was itself removed on 2026-09-23 (see DECISIONS.md → Hero media)
- Font: Manrope via `next/font/google` (provisional — see DECISIONS.md → Open). Display: Archivo (variable, `wdth` axis) as `font-display`, used only for the homepage hero's big word
- Form backend: owned by the backend teammate, not yet decided — see DECISIONS.md

## Folder structure (App Router)
```
app/
  layout.tsx                 → root layout: font, metadata, providers, Header/Footer
  globals.css                → Tailwind import + brand tokens
  icon.svg                   → favicon (star icon)
  page.tsx                   → Homepage (/) — HomeIntro + HomeHero + TrustBar + SafetyBand + ShipWithUs + StoryTeaser + DriverSlogans + ApplyRoutes
  services/page.tsx          → Services (/services)
  quote/page.tsx             → Request a Quote (/quote)
  fleet-map/page.tsx         → Fleet Map (/fleet-map) — roughly where our trucks are; formerly Track a Load
  news/page.tsx              → News (/news)
  careers/
    drivers/page.tsx         → Drive For Us (/careers/drivers)
    staff/page.tsx           → Dispatcher / mechanic / office applications (/careers/staff)
  about/page.tsx             → About (/about)

components/                  → component library, one folder per area, each with an index.ts
  ui/                        → Button, Columns, Container, CountUp, Field, HeroMedia, Logo, Reveal, RotatingSlogan, SlideIn, PagePlaceholder
  layout/                    → Header, CareersPanel, MobileMenu, Footer — see DECISIONS.md nav rules before adding items
  home/                      → HomeHero, DriverSlogans, ApplyRoutes, ShipWithUs, SafetyBand, TrustBar, StoryTeaser
  about/                     → StoryMilestones (also used by the homepage story card)
  quote/                     → QuoteForm, StateMap
  intro/                     → HomeIntro, timeline
  providers/                 → IntroProgressProvider, SmoothScroll

lib/
  site.ts                    → company name, every nav link (single source for Header, menu, Footer), homepage numbers,
                               rolling slogans, the three apply cards
  cx.ts                      → className join helper
  forms.ts                   → QuoteRequest type + submitQuote stub (backend contract goes here)
  us-states.ts               → generated lower-48 state shapes for the quote map — don't edit by hand
  zip.ts                     → ZIP → state lookup (USPS 3-digit prefixes)

scripts/
  build-us-states.mjs        → regenerates lib/us-states.ts from Census shapes (run steps in the file)

public/
  logo.svg, logo-icon.svg    → web copies of the logo originals in docs/
  logo-light.svg             → logo.svg with a white wordmark, for the header over dark bands
  images/                    → photos (AI-generated stand-ins); home-hero-forest.jpg is the hero video's poster; home-hero-desert.jpg and home-hero-sierra.jpg are no longer used; safety-fleet.jpg is the safety band's New equipment still
  videos/                    → home-hero-forest.mp4 is the hero's seamless loop (AI-generated)
```
Full component list: NAVIGATION.md → Component library.

Still to come (per the page plan): `ServiceCard`, `TestimonialCard`, `FaqAccordion`, `TrustBadge`, `QualificationForm`, `lib/services.ts`.

## Component library conventions
- Import from the folder barrel: `import { Button, Container } from "@/components/ui"`.
- Server Components by default; add `"use client"` only for state, effects, or animation.
- Style with Tailwind utilities and brand token names (`bg-brand`, `text-ink`, `bg-mist`, `bg-paper`, `ease-premium`) — no raw hex in components. The hero photo is shown straight: the `sunset-grade` and `film-grain` utilities and the `grain` keyframes were removed from `app/globals.css` on 2026-09-17.
- Company name and links come from `lib/site.ts` — never hardcode them.
- Put breakpoint visibility (`hidden lg:block`) on a wrapper, not on `Button` — its `inline-flex` would override `hidden`.
- Small text is `text-ink/70` or darker — lighter tints fail contrast.

## Brand / design tokens
| Token | Tailwind name | Value | Use |
|---|---|---|---|
| Near-black | `ink` | `#252525` | Text, dark UI elements |
| White | `paper` | `#FFFFFF` | Primary background |
| Soft off-white | `mist` | `#F7F0F0` | Alternate section backgrounds — gives rhythm without shadows/borders |
| Orange | `brand` | `#FF3000` | Accent only — the logo, active marks, small dots and bars; never a button fill (buttons went black 2026-09-19) or a dominant fill. Matches the logo icon exactly |
| Easing | `ease-premium` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default for UI transitions |

Orange contrast rules (`#FF3000` is 3.70:1 on white — below the 4.5:1 WCAG AA minimum for normal text):
- If orange ever carries white text again, it must be large/bold (≥ 18.66px bold or ≥ 24px regular). No button does today
- Never use orange for small body text or links — use near-black

### Layout grid (2026-09-23)
A Figma-style margin/column grid for desktop, replacing the old fixed `max-w-7xl` + 32px padding: content caps
at 1200px and centers from `desktop` (1200px wide) up, so the margin is whatever's left of the viewport —
exactly 0 at 1200px wide, 360px either side at 1920px, and keeps growing on wider screens rather than the
content growing past 1200px — with 12 columns / 24px gutters inside that content width.
- `Container` (`components/ui/Container.tsx`) sets the margin: ordinary phone/tablet padding (`px-5 sm:px-8`)
  below the `desktop` breakpoint (1200px, `--breakpoint-desktop` in `app/globals.css`), `max-w-[75rem] mx-auto`
  (1200px, centered) from `desktop` up. Used by every section, header included — the header's nav pill + logo +
  CTA pair fit comfortably inside 1200px at every width from 1024 up (it was already tuned to fit in less).
- `Columns` (`components/ui/Columns.tsx`) is the 12-column grid itself (8 / 4 columns at `sm` / phone) — put it
  inside a `Container` and size children with Tailwind's `col-span-*`. Not yet adopted by any section; it's the
  primitive for the next pass of "does this text/button sit on the grid" work.
- `--width-header-cta` (`app/globals.css`) is the single source for the CTA button width Header and HomeHero
  both need — Header's two buttons are this width from `xl`; HomeHero's headline block matches their combined
  width (`calc(2 × var + 0.75rem gap)`) so its right edge lines up with Apply To Drive. Since both sit in the
  same 1200px-capped, centered `Container`, that's the only number they still need to share — the margin itself
  is identical by construction, not by matching two containers' padding.

### Logo
| Source file (`docs/`) | Web copy (`public/`) | What it is | Use |
|---|---|---|---|
| `Logo black.svg` | `logo.svg` | Orange star icon + lowercase "itrucking" wordmark (764×192) | Header, footer |
| `Only logo Solutions.svg` | `logo-icon.svg` (+ `app/icon.svg`) | 8-piece orange star only (248×248) | Favicon |

The `docs/` copies are the source originals. The wordmark reads "itrucking" only — the full name "ITrucking Solutions" appears in page text, titles, and footer.

Design principles: generous whitespace, restrained, not template-looking, not gradient-heavy. Orange used sparingly — accents only. Buttons are black (solid) or outlined in black.

Tone: easy, light, and approachable — especially for a driver looking for a job. This is a simple marketing site, not a heavy portal: plain language, short pages, fast to load, obvious next step on every page.

Design references (what we take from each — style and structure only, never their content):
| Site | Take |
|---|---|
| apple.com | Fluid motion; animations that complement each other rather than compete |
| lucidmotors.com | Header behavior: transparent over the hero, panel that drops from under the bar, hides/returns on scroll (phones only) |
| sendsierra.com/drivers-enrollment | Big motion hero on the driver page |
| dotlogics.com | Overall feel: premium but light and easy |

## Homepage opening (logo moment, plays on load)
- The video intro was removed 2026-09-23 (see DECISIONS.md → Hero media). The hero (`HomeHero`, its own looping video) is always rendered and shows straight away — no wait, no white flash.
- The only thing that still plays on load is `HomeIntro` (`components/intro/HomeIntro.tsx`): it renders nothing itself, it just animates the shared `useIntroProgress` value from 0 to 1 over `INTRO.duration` (1 s, the `ease-premium` curve).
- `Header` reads that progress to fade (`logoOpacity`, first half of the second) and settle (`logoScale`, `INTRO.appearScale` 1.06 → 1, the whole second) its own logo directly in place — there's no separate flying copy, the header's logo is the one animating — and to bring the nav/CTAs from 60% opacity to full once progress passes `INTRO.litAt`.
- `HomeHero` reads the same progress to light up the h1's words, one by one, once it passes `INTRO.litAt` too — right after the logo settles.
- `IntroProgressProvider` shares progress with both: 0 on `/` until the logo lands, 1 on every other page (so their logo/headline just render settled/lit everywhere else).
- Plays once per visit: a module-level flag in `HomeIntro` marks it played, so later client-side visits to `/` show the logo already settled. A reload resets the flag.
- Skipped (the logo just appears settled, no animation) for `prefers-reduced-motion` visitors.

## Header behavior
- Fixed. Transparent at the top, frosted white once scrolled. Stays in view while scrolling from `sm` (640px) up. On phones it hides on scroll down and drops back on scroll up (not during the homepage logo moment or while a menu is open).
- During the homepage logo moment: nav and buttons sit at 60% opacity over the scene; hovering or tabbing into the header brings them to full with a frosted bar. The logo fades and settles into place — see Homepage opening above.
- Careers opens a two-link panel that drops from under the bar (hover or click); Escape or clicking outside closes it.
- Below `lg`: menu button opens a full-screen menu that drops from the top.

## Data model

### Services (`lib/services.ts` — not created yet)
Array of freight-type entries. Today contains exactly one entry (Dry Van). Adding a future trailer type (Reefer, Flatbed) should be a new array entry, not a page rebuild.
```
{ id, name, description }
```

### Quote form (`/quote`)
Fields: pickup and delivery (state + city or ZIP each), weight, what's being shipped, contact info. Shape sent to the backend (`lib/forms.ts`):
```
QuoteRequest { pickup: { state, place }, delivery: { state, place }, weightLbs, freight, contact: { name, company?, email, phone } }
```
`state` is a two-letter code from `lib/us-states.ts`. `submitQuote` is a stub until the backend teammate's endpoint exists: it succeeds in development and fails with a message in production.

## Get a Quote map
- `StateMap` draws the lower 48 + D.C. as SVG paths from `lib/us-states.ts` (Census shapes via us-atlas, Albers projection, generated by `scripts/build-us-states.mjs`; about 67 KB, no map service or API key).
- Hover lifts a copy of the state on top with a shadow and shows a name tag; touch skips hover. Clicks set pickup → delivery; a route curve draws between the two pin spots (`cx`, `cy`: centroid of each state's largest piece).
- `QuoteForm` owns the state: map clicks, the state dropdowns and ZIPs typed into City or ZIP (`lib/zip.ts`) all update the same pickup/delivery values. A ZIP from a different state is cleared when the state changes.
- The SVG is `aria-hidden`; the dropdowns are the accessible way to pick states. Errors show after the first submit (an Alaska/Hawaii ZIP is flagged right away), and the first invalid field gets focus.
- Map sits right of the form and stays in view (sticky) from `lg`; below that it's above the form (`order-first lg:order-none` — the map is second in the DOM so it falls right at `lg` without reordering the form). It sits straight on the page background — no card — so its `stroke-paper` borders read as gaps between the states.

### Qualification form (Drive For Us + staff roles)
5–6 short questions only. Submits into an HR contact flow, not a document/e-signature pipeline. See DECISIONS.md → Applications.

## Pages reference
See NAVIGATION.md for the full task → file index.
