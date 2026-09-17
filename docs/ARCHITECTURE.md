# ARCHITECTURE.md
> Technical structure for the site. Keep this compressed — facts, not narrative. Update after a page/feature is done, not mid-build.

## Stack
- Next.js 16 — App Router, Turbopack
- React 19 + TypeScript
- Tailwind CSS v4 — brand tokens live in `app/globals.css` → `@theme`
- motion (`motion/react`) — UI animation and scroll-linked values
- Lenis — smooth wheel scrolling (turned off for reduced motion)
- No 3D library — the homepage intro is a `<video>` plus a CSS `matrix3d` transform (three.js and React Three Fiber were removed on 2026-09-11)
- Font: Manrope via `next/font/google` (provisional — see DECISIONS.md → Open)
- Form backend: owned by the backend teammate, not yet decided — see DECISIONS.md

## Folder structure (App Router)
```
app/
  layout.tsx                 → root layout: font, metadata, providers, Header/Footer
  globals.css                → Tailwind import + brand tokens
  icon.svg                   → favicon (star icon)
  page.tsx                   → Homepage (/) — TruckIntro + HomeHero + TrustBar + StoryTeaser
  services/page.tsx          → Services (/services)
  quote/page.tsx             → Request a Quote (/quote)
  fleet-map/page.tsx         → Fleet Map (/fleet-map) — roughly where our trucks are; formerly Track a Load
  news/page.tsx              → News (/news)
  careers/
    drivers/page.tsx         → Drive For Us (/careers/drivers)
    staff/page.tsx           → Dispatcher / mechanic / office applications (/careers/staff)
  about/page.tsx             → About (/about)

components/                  → component library, one folder per area, each with an index.ts
  ui/                        → Button, Container, CountUp, Field, HeroMedia, Logo, Reveal, PagePlaceholder
  layout/                    → Header, CareersPanel, MobileMenu, Footer — see DECISIONS.md nav rules before adding items
  home/                      → HomeHero, AudiencePanel, TrustBar, StoryTeaser
  about/                     → StoryMilestones (also used by the homepage story card)
  quote/                     → QuoteForm, StateMap
  intro/                     → TruckIntro, timeline, logoTrack (where the logo sits on the trailer), quad (corners → matrix3d)
  providers/                 → IntroProgressProvider, SmoothScroll

lib/
  site.ts                    → company name, every nav link (single source for Header, menu, Footer), homepage numbers
  cx.ts                      → className join helper
  forms.ts                   → QuoteRequest type + submitQuote stub (backend contract goes here)
  us-states.ts               → generated lower-48 state shapes for the quote map — don't edit by hand
  zip.ts                     → ZIP → state lookup (USPS 3-digit prefixes)

scripts/
  build-us-states.mjs        → regenerates lib/us-states.ts from Census shapes (run steps in the file)

public/
  logo.svg, logo-icon.svg    → web copies of the logo originals in docs/
  images/                    → photos; home-hero-desert.jpg is a temporary AI-generated image (B-roll video will replace it)
  videos/                    → homepage intro: home-intro-1080.mp4, home-intro-720.mp4 (phones), home-intro-poster.jpg (first frame)
```
Full component list: NAVIGATION.md → Component library.

Still to come (per the page plan): `ServiceCard`, `TestimonialCard`, `FaqAccordion`, `TrustBadge`, `QualificationForm`, `lib/services.ts`.

## Component library conventions
- Import from the folder barrel: `import { Button, Container } from "@/components/ui"`.
- Server Components by default; add `"use client"` only for state, effects, or animation.
- Style with Tailwind utilities and brand token names (`bg-brand`, `text-ink`, `bg-mist`, `bg-paper`, `ease-premium`) — no raw hex in components. The hero photo/video look (`sunset-grade`, `film-grain` utilities and the `grain` keyframes) lives in `app/globals.css`.
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
| `Logo black.svg` | `logo.svg` | Orange star icon + lowercase "itrucking" wordmark (764×192) | Header, footer, the intro's flying logo |
| `Only logo Solutions.svg` | `logo-icon.svg` (+ `app/icon.svg`) | 8-piece orange star only (248×248) | Favicon |

The `docs/` copies are the source originals. The wordmark reads "itrucking" only — the full name "ITrucking Solutions" appears in page text, titles, and footer.

Design principles: generous whitespace, restrained, not template-looking, not gradient-heavy. Orange used sparingly — CTAs, active states, accents only.

Tone: easy, light, and approachable — especially for a driver looking for a job. This is a simple marketing site, not a heavy portal: plain language, short pages, fast to load, obvious next step on every page.

Design references (what we take from each — style and structure only, never their content):
| Site | Take |
|---|---|
| apple.com | Fluid motion; animations that complement each other rather than compete |
| lucidmotors.com | Header behavior: transparent over the hero, panel that drops from under the bar, hides/returns on scroll (phones only) |
| sendsierra.com/drivers-enrollment | Big motion hero on the driver page |
| dotlogics.com | Overall feel: premium but light and easy |

## Homepage intro (plays on load, video)
- `TruckIntro` lays a full-screen stage over the top of the page (fixed, `z-40`, under the header) and plays it by itself in 6 seconds (`INTRO.duration`): a 5-second video, then the logo's handoff to the header. The page itself (`children` — the `HeroMedia` photo band — and the content below) is always rendered underneath; at the end the stage fades away and unmounts.
- The video is a plain `<video>` (muted, `playsInline`, `preload="auto"`, first frame as `poster`) covering the stage. Two `<source>`s: phones (`max-width: 767px`) get `home-intro-720.mp4`, everyone else `home-intro-1080.mp4`. It's started by hand with `play()` rather than `autoPlay`, because React leaves `muted` out of the server HTML and browsers only autoplay muted video.
- One `requestAnimationFrame` loop drives everything. The clock itself is `advanceClock` in `components/intro/clock.ts` — a pure function, so it can be exercised without a browser. While the video plays the clock follows its `currentTime`, smoothed between frames and never more than `MAX_LEAD` ahead, so the logo stays locked to the picture. The loop writes intro progress 0 → 1 and moves the logo, the white overlay, the stage fade and the Skip button's progress line.
- **Once the video is on its last frame the clock runs on real time — it never waits for the `ended` event.** That event can arrive late or not at all; while it was the only way past the video's length, the clock stayed pinned at `currentTime + MAX_LEAD` (≈5.14 s of a 6 s intro) and the intro hung on a white screen with the logo mid-flight until the visitor clicked (found and fixed 2026-09-11). For the same reason, "has the picture moved?" ignores the media clock wobbling by a fraction of a millisecond — that wobble used to reset the stall check forever.
- If the picture stops moving mid-video for longer than `STALL_GRACE` — buffering, a backgrounded tab, a phone saving power — the clock carries on by itself and nudges a paused video back into playing, so the intro can never sit frozen on screen waiting for a video that isn't coming.
- Phases (seconds on that clock, all in `components/intro/timeline.ts`, stored as fractions of the play length):
  - 0–5.04 the video: the truck on a desert highway, ending on the trailer's side, held on the logo
  - 4.4–4.7 our `logo.svg` fades in exactly over the painted one (under the white, since the painted logo has a bigger star and smaller letters)
  - 4.5–5.05 the picture fades to white around the logo
  - 4.7–5.2 the logo peels off the trailer and turns flat to face you
  - 5.25–5.9 logo glides into the header's logo slot (`[data-intro-logo-target]`)
  - 5.4–1 the white fades away and the page shows through
  - 5.5 header nav goes from dimmed to fully visible
- Sitting the logo on the trailer: `logoTrack.ts` holds the corners of the painted logo in video px, measured from the frames for the last second and blended between them; `quad.ts` turns any four corners into a CSS `matrix3d` (Heckbert's square-to-quad), so the flat SVG takes on the trailer's perspective. Video px → screen px accounts for `object-cover`. Unfolding and flying are the same four corners interpolated toward a flat rectangle and then the header's slot — no separate transform stack. **A different video means re-measuring `TRACK`.**
- While it plays the page doesn't scroll. A wheel or touch scroll, any tap or click (header included), a scroll key, Escape or the Skip intro button jumps to the end: the picture fades to white (`INTRO.skipFade`, 0.2 s), then the logo glides in while the page shows (`INTRO.skipGlide`, 0.4 s). Wheel and touch events are caught in the capture phase on `window`, so Lenis never sees them. Skipping before the video has started just shows the page.
- The header sits above the stage, so its links and buttons work during the intro.
- `IntroProgressProvider` shares progress with `Header`: 0 on `/` until the logo lands, 1 on every other page.
- Plays once per visit: a module-level flag in `TruckIntro` marks it played, so later client-side visits to `/` skip it. A reload resets the flag. (Works because pages unmount on navigation — if `cacheComponents` is ever turned on, Next keeps pages alive and this needs revisiting.)
- Skipped entirely (page shown straight away, header visible immediately) for `prefers-reduced-motion` and repeat views in the same visit. If the video hasn't started within `INTRO.loadTimeout` (3 s) — slow network, autoplay turned off — the page shows instead.

## Header behavior
- Fixed. Transparent at the top, frosted white once scrolled. Stays in view while scrolling from `sm` (640px) up. On phones it hides on scroll down and drops back on scroll up (not during the intro or while a menu is open).
- During the homepage intro: nav and buttons sit at 60% opacity over the scene; hovering or tabbing into the header brings them to full with a frosted bar. The logo stays hidden until the intro lands it.
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
