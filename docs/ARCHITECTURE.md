# ARCHITECTURE.md
> Technical structure for the site. Keep this compressed — facts, not narrative. Update after a page/feature is done, not mid-build.

## Stack
- Next.js 16 — App Router, Turbopack
- React 19 + TypeScript
- Tailwind CSS v4 — brand tokens live in `app/globals.css` → `@theme`
- motion (`motion/react`) — UI animation and scroll-linked values
- Lenis — smooth wheel scrolling (turned off for reduced motion)
- three.js + @react-three/fiber + @react-three/drei — homepage 3D truck intro only; lazy-loaded, client-only
- Font: Manrope via `next/font/google` (provisional — see DECISIONS.md → Open)
- Form backend: owned by the backend teammate, not yet decided — see DECISIONS.md

## Folder structure (App Router)
```
app/
  layout.tsx                 → root layout: font, metadata, providers, Header/Footer
  globals.css                → Tailwind import + brand tokens
  icon.svg                   → favicon (star icon)
  page.tsx                   → Homepage (/) — TruckIntro + HomeHero
  services/page.tsx          → Services (/services)
  quote/page.tsx             → Request a Quote (/quote)
  track/page.tsx             → Track a Load (/track)
  careers/
    drivers/page.tsx         → Drive For Us (/careers/drivers)
    staff/page.tsx           → Dispatcher / mechanic / office applications (/careers/staff)
  about/page.tsx             → About (/about)

components/                  → component library, one folder per area, each with an index.ts
  ui/                        → Button, Container, Logo, Reveal, PagePlaceholder
  layout/                    → Header, CareersPanel, MobileMenu, Footer — see DECISIONS.md nav rules before adding items
  home/                      → HomeHero, AudiencePanel
  intro/                     → TruckIntro, TruckScene, Truck, Highway, Atmosphere, timeline, daylight, useSceneProgress, useSvgTexture
  providers/                 → IntroProgressProvider, SmoothScroll

lib/
  site.ts                    → company name + every nav link (single source for Header, menu, Footer)
  cx.ts                      → className join helper

public/
  logo.svg, logo-icon.svg    → web copies of the logo originals in docs/
```
Full component list: NAVIGATION.md → Component library.

Still to come (per the page plan): `ServiceCard`, `TestimonialCard`, `FaqAccordion`, `TrustBadge`, `QualificationForm`, `QuoteForm`, `lib/services.ts`, `lib/forms.ts`.

## Component library conventions
- Import from the folder barrel: `import { Button, Container } from "@/components/ui"`.
- Server Components by default; add `"use client"` only for state, effects, or animation.
- Style with Tailwind utilities and brand token names (`bg-brand`, `text-ink`, `bg-mist`, `bg-paper`, `ease-premium`) — no raw hex in components (the 3D scene is the exception).
- Company name and links come from `lib/site.ts` — never hardcode them.
- Put breakpoint visibility (`hidden lg:block`) on a wrapper, not on `Button` — its `inline-flex` would override `hidden`.
- Small text is `text-ink/70` or darker — lighter tints fail contrast.

## Brand / design tokens
| Token | Tailwind name | Value | Use |
|---|---|---|---|
| Near-black | `ink` | `#252525` | Text, dark UI elements |
| White | `paper` | `#FFFFFF` | Primary background |
| Soft off-white | `mist` | `#F7F0F0` | Alternate section backgrounds — gives rhythm without shadows/borders |
| Orange | `brand` | `#FF3000` | Accent / CTAs only — never a dominant fill. Matches the logo icon exactly |
| Easing | `ease-premium` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default for UI transitions |

Orange contrast rules (`#FF3000` is 3.70:1 on white — below the 4.5:1 WCAG AA minimum for normal text):
- White text on orange buttons must be large/bold (≥ 18.66px bold or ≥ 24px regular) — `Button` primary is 19px bold
- Never use orange for small body text or links — use near-black

### Logo
| Source file (`docs/`) | Web copy (`public/`) | What it is | Use |
|---|---|---|---|
| `Logo black.svg` | `logo.svg` | Orange star icon + lowercase "itrucking" wordmark (764×192) | Header, footer, trailer side in the intro |
| `Only logo Solutions.svg` | `logo-icon.svg` (+ `app/icon.svg`) | 8-piece orange star only (248×248) | Favicon, loader, trailer roof in the intro |

The `docs/` copies are the source originals. The wordmark reads "itrucking" only — the full name "ITrucking Solutions" appears in page text, titles, and footer.

Design principles: generous whitespace, restrained, not template-looking, not gradient-heavy. Orange used sparingly — CTAs, active states, accents only.

Tone: easy, light, and approachable — especially for a driver looking for a job. This is a simple marketing site, not a heavy portal: plain language, short pages, fast to load, obvious next step on every page.

Design references (what we take from each — style and structure only, never their content):
| Site | Take |
|---|---|
| apple.com | Fluid motion; animations that complement each other rather than compete |
| lucidmotors.com | Header behavior: transparent over the hero, panel that drops from under the bar, hides/returns on scroll |
| sendsierra.com/drivers-enrollment | Big motion hero on the driver page |
| dotlogics.com | Overall feel: premium but light and easy |

## Homepage intro (scroll-driven 3D)
- `TruckIntro` pins a full-screen stage for 4.5 screen-heights of scroll (`INTRO.screens`); the page content overlaps its last 30% so it slides in as the logo lands.
- Phases (fractions of that scroll, all in `components/intro/timeline.ts`):
  - 0–0.40 camera drops from a high aerial ahead of the truck to its grille, then flies around to the trailer's side — one smooth curve through the three shots
  - 0.40–0.48 slow push-in; the camera stops on the trailer logo
  - 0.43–0.49 a flat DOM copy of the logo fades in exactly over the 3D one, which then switches off
  - 0.50–0.84 the truck drives off down the road into the sunset; the camera drops into the lane behind it while the logo stays on screen
  - 0.10–0.74 the light warms from morning to sunset (colors in `daylight.ts`)
  - 0.70–0.83 the sunset fades to white
  - 0.83–0.94 logo glides into the header's logo slot (`[data-intro-logo-target]`)
  - 0.90–1 header nav drops in
- Scene is procedural — no 3D model, image or video files: black tractor + white 53' dry van with `logo.svg` on the side and the star on the roof, a desert highway, and a shader sky dome with the sun and a distant mesa skyline. The road texture, guardrail posts and light poles slide past; during the drive-off they slow down while the truck pulls ahead.
- Each frame, `TruckScene` sends `TruckIntro` two screen rects: where the trailer logo is now, and where it sits when the camera stops on it (the spot the DOM logo holds while the truck drives away). `TruckIntro` moves the DOM logo, white overlay and scroll cue.
- 3D parts read progress through `useSceneProgress` (lightly damped so fast scrolls glide); DOM overlays use raw progress so they stay in lockstep with the header.
- `IntroProgressProvider` shares progress with `Header`: 0 on `/` until the logo lands, 1 on every other page.
- Skipped entirely (no pinned section, header visible immediately) for `prefers-reduced-motion` and browsers without WebGL.
- three.js loads via `next/dynamic` with `ssr: false`, so other pages never download it. Rendering pauses when the intro is off screen.

## Header behavior
- Fixed. Transparent at the top, frosted white once scrolled. Hides on scroll down, drops back on scroll up (disabled during the intro and while a menu is open).
- Careers opens a two-link panel that drops from under the bar (hover or click); Escape or clicking outside closes it.
- Below `lg`: menu button opens a full-screen menu that drops from the top.

## Data model

### Services (`lib/services.ts` — not created yet)
Array of freight-type entries. Today contains exactly one entry (Dry Van). Adding a future trailer type (Reefer, Flatbed) should be a new array entry, not a page rebuild.
```
{ id, name, description }
```

### Quote form (`/quote`)
Fields: origin, destination, weight, freight type, contact info.

### Qualification form (Drive For Us + staff roles)
5–6 short questions only. Submits into an HR contact flow, not a document/e-signature pipeline. See DECISIONS.md → Applications.

## Pages reference
See NAVIGATION.md for the full task → file index.
