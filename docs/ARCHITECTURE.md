# ARCHITECTURE.md
> Technical structure for the site. Keep this compressed — facts, not narrative. Update after a page/feature is done, not mid-build.

## Stack
- Next.js 16 — App Router, Turbopack
- React 19 + TypeScript
- Tailwind CSS v4 — brand tokens live in `app/globals.css` → `@theme`
- motion (`motion/react`) — UI animation and scroll-linked values
- Lenis — smooth wheel scrolling (turned off for reduced motion)
- No 3D library — three.js and React Three Fiber were removed on 2026-09-11; the video intro that replaced them was itself removed on 2026-09-23 (see DECISIONS.md → Hero media)
- Fonts: Geist via `next/font/google` as `font-sans` for body and UI (chosen 2026-09-24 over the provisional Manrope — see DECISIONS.md → Open → Font), and Archivo with its width axis as `--font-archivo` for headlines (2026-10-03), used through the `font-display` utility
- Form backend: owned by the backend teammate, not yet decided — see DECISIONS.md

## Folder structure (App Router)
```
app/
  layout.tsx                 → root layout: font, metadata, providers, Header/Footer
  globals.css                → Tailwind import + brand tokens
  icon.svg                   → favicon (star icon)
  page.tsx                   → Homepage (/) — HomeIntro + HomeHero + SlideOverStack(SafetyBand(between: TrustBar) + ToolsBand, ShipWithUs) + StoryTeaser + SlideOverStack(WhyWorkWithUs, ApplyBand) + NewsBand
  services/page.tsx          → Services (/services)
  quote/page.tsx             → redirects to /#quote (the quote form is in Ship with us since 2026-10-02)
  fleet-map/page.tsx         → Fleet Map (/fleet-map) — roughly where our trucks are; formerly Track a Load
  news/page.tsx              → News (/news) — the newest post big on a black panel (NewsLead), the next six as grey cards (NewsCard), any older behind See more as a list (NewsMore, NewsRow); the "being built" placeholder while there are no posts to show
  careers/
    page.tsx                 → Careers (/careers) — the three jobs and why to take each; where Careers goes
    apply/page.tsx           → The job application with no job set, so it asks "Which job?" (/careers/apply); where Apply now goes
    drivers/page.tsx         → Drive For Us (/careers/drivers)
    staff/page.tsx           → The same application, opened on the office or shop job (/careers/staff)
  about/page.tsx             → About (/about)

components/                  → component library, one folder per area, each with an index.ts
  ui/                        → Button, Columns, Container, CountUp, Field, HalfStar (+ inkDepthClass, the dark bands' look; unused since the About opening went white on 2026-10-06), HeroMedia, LinkHover (RiseLabel + FlyArrow, the arrow links' hover), Logo, Reveal, RotatingSlogan, ScrollFillText, SlideIn, PageOpening (the centred headline and lede that careers, Fleet map, Services and News open with), PagePlaceholder,
                               typography (shared label + section-heading classes)
  layout/                    → Header, MobileMenu, Footer — see DECISIONS.md nav rules before adding items
  home/                      → HomeHero, HeroHeadline, ShipWithUs, QuoteBar, SafetyBand, CardPair, ToolsBand, ShipRouteMap, SlideOverStack, TrustBar, StoryTeaser, StoryHeadline, StoryRoute, WhyWorkWithUs, ApplyBand, NewsBand (the news block over the footer)
  about/                     → SplitCard (the two closing cards on the black band, each cut on a slant, white above and black below, the underlined arrow link under the words on the white; the black wedge is a road whose dashed lane line rolls toward you), StoryLine (the About page's story down one line that bends from side to side around the pictures, one picture frame to a chapter, the next stop's words and picture taking the last one's place in it as the chapter passes the middle of the screen, a chapter's second dot half way down its picture, nothing standing still, every second chapter on a full-width black band, 2026-10-06), StoryChapters (the pinned route it replaced the same day — unused), Timeline (the sideways timeline before that — unused), StoryMilestones (the story band's old dot timeline — unused since the 2c band, 2026-09-25)
  news/                      → NewsLead (the newest post, big, on a black panel), NewsCard (one post as a square grey card; the news page and the homepage's NewsBand both use it), NewsMore (the See more pill that opens the "Earlier" list; client), NewsRow (one post as a line of that list)
  careers/                   → CareersOverview (the careers page), JobApplication (the one application for all three jobs)
  intro/                     → HomeIntro, timeline
  providers/                 → IntroProgressProvider, SmoothScroll

lib/
  site.ts                    → company name, every nav link (single source for Header, menu, Footer), homepage numbers,
                               rolling slogans, the three apply cards, Why work with us (`whyWorkWithUs`),
                               the footer's link groups (`footerGroups`) and the FMCSA record (`company`: legal name,
                               phone, address, USDOT, MC)
  cx.ts                      → className join helper
  forms.ts                   → QuoteRequest type + submitQuote stub (backend contract goes here)
  news.ts                    → NewsPost type + newsPosts (twelve SAMPLE posts, drafts) + visibleNewsPosts (drafts are left out of production) + formatNewsDate
  us-states.ts               → generated lower-48 state shapes for the quote map — don't edit by hand
  zip.ts                     → ZIP → state lookup (USPS 3-digit prefixes) and ZIP → "City, ST" (`cityForZip`, from public/zip)

scripts/
  build-us-states.mjs        → regenerates lib/us-states.ts from Census shapes (run steps in the file)
  build-zip-cities.mjs       → regenerates public/zip/*.json from GeoNames' US postal code list (run steps in the file)

public/
  zip/                       → 0.json … 9.json: every lower-48 ZIP's "City, ST" by first digit, for the quote map's pin labels (GeoNames, CC BY 4.0, credited in the footer; ATTRIBUTION.txt)
  logo.svg, logo-icon.svg    → web copies of the logo originals in docs/
  logo-light.svg             → logo.svg with a white wordmark, for the header over dark bands
  images/                    → photos (AI-generated stand-ins); home-hero-forest.jpg is the hero video's poster; home-hero-desert.jpg is no longer used, nor is about-truck-front.jpg, the About opening's picture until 2026-10-06; dry-van-yard.jpg (the owner's pick: since 2026-10-06 their cleaner copy of the view first sent on 2026-10-05 as dry-van-trailers.jpg, which is no longer used; source not confirmed, not our yard, both kept out of the public repo until it is) and home-hero-sierra.jpg are the safety band's services stills; ship-truck-side.jpg, the earlier 53-foot dry vans still, is no longer used; new-equipment-row.jpg (the blue-sky copy of new-equipment-lot.jpg, which is no longer used since 2026-10-06; it is also the About story's 2026 picture), lease-handshake.jpg (the owner's pick, 2026-10-05: source not confirmed, kept out of the public repo until it is) and our-shop-tires.jpg are Why work with us's New equipment, Lease to own and Our shop stills; lease-truck-road.webp, the earlier Lease to own still, is no longer used; safety-fleet.jpg, the earlier New equipment still, is no longer used
  videos/                    → home-hero-forest.mp4 is the hero's seamless loop (AI-generated, upscaled to 1080p; replayed by hand with a 2 s hold between passes)
```
Full component list: NAVIGATION.md → Component library.

Still to come (per the page plan): `ServiceCard`, `TestimonialCard`, `FaqAccordion`, `TrustBadge`, `QualificationForm`.

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
| Light grey | `cloud` | `#EBEBEB` | Ship with us's big Get a quote button and quote form on the black band (2026-10-02) — white there glared |
| Orange | `brand` | `#FF3000` | Accent only — the logo, active marks, small dots and bars; never a button fill (buttons went black 2026-09-19) or a dominant fill. Matches the logo icon exactly |
| Easing | `ease-premium` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default for UI transitions |

Orange contrast rules (`#FF3000` is 3.70:1 on white — below the 4.5:1 WCAG AA minimum for normal text):
- If orange ever carries white text again, it must be large/bold (≥ 18.66px bold or ≥ 24px regular). No button does today
- Never use orange for small body text or links — use near-black

### Typography (2026-09-24)
- Two faces since 2026-10-03 (owner's pick "4" of ten type pairings). **Headlines: Archivo at 115% width** (`font-display`, a utility in `app/globals.css`: the family plus `font-variation-settings: "wdth" 115`), always with `font-semibold` and `tracking-[-0.03em]`. It's on all type 22px and up: the hero h1, chapter, section and page headings, the sub-headings beside pictures, card titles, the numbers band, the story marks, the About timeline years, the footer's and mobile menu's big links, Apply now. **Everything else is Geist**: labels, body, buttons, forms (including the application's typed answers), nav. One exception: the homepage story band's heading is Geist semibold at `tracking-[-0.045em]` (owner, 2026-10-05; `StoryHeadline`'s `sans`). Archivo set wide runs about 15% wider than Geist, so check one-line and no-wrap headlines when sizing them up.
- Three shared classes in `components/ui/typography.ts`: `labelClass` (the small sentence-case label above a heading — 14px semibold, never uppercase or tracked), `chapterHeadingClass` (the big moments after the hero — the safety band since 2026-09-30, Ship with us, Our story, Why work with us — 40 / 48 / 56px, since 2026-09-29) and `sectionHeadingClass` (the About timeline h2, "Why ___ stay." over the homepage's job cards since 2026-10-05, and the safety band's until 2026-09-30 — semibold Archivo since 2026-10-03, 28px on phones, 40px from `sm`, easing 36 → 40px from `lg`; the heading scale is 28 / 40 / 56px — DECISIONS.md → Wording and type). Colour is set by the caller: `text-ink/70` on light, `text-paper/70` on dark. Label → heading gap is `mt-4`.
- Page h1s (inner pages) are `font-display text-5xl sm:text-6xl font-semibold tracking-[-0.03em]`; the homepage hero h1 has its own scale, with its fixed words at `text-paper/60` (large text, so it clears the contrast floor for its size).
- Header nav links are all one size (15px); inactive links `text-ink/70`, the contrast floor.
- Copy rules (case, "and", apostrophes, commas) are in DECISIONS.md → Wording and type.
- **Line wrapping site-wide (2026-10-01, owner).** `app/globals.css` sets `text-wrap: pretty` on running text (p, li, dt, dd, blockquote, figcaption, label, legend) so a paragraph doesn't end on one lonely word, and `text-wrap: balance` on h1–h6 so headings split into even lines. It's in the base layer, so a component's own `text-pretty` / `text-balance` / `whitespace-nowrap` still wins; the many per-element `text-pretty` classes are now redundant but harmless. Browsers without support (older Firefox) wrap normally.
- **Greys (2026-09-29, spacing audit point 04; there were six).** Small text that isn't ink — labels, body, meta, captions — is `text-ink/70` on white (5.7:1) and `text-paper/70` on the dark bands, and `text-paper/80` over photos, which are busier. `/60` is only for the grey half of large type (the rolling slogan's tail, the hero's fixed words), where the contrast floor is 3:1. `text-ink/40` is left in one place, the About timeline's stops that aren't lit yet (`components/about/Timeline.tsx`); the 01–05 over Why work with us's reasons, the decorative use it was kept for, went to `text-ink/70` on 2026-10-05. Don't add another step. Form placeholders are the one leftover (`ink/40`, QuoteBar and Field).

### Section spacing (2026-09-29)
- Three steps for the space around homepage bands, as shared classes in `components/ui/spacing.ts` (phone → `sm` → `lg`): **section** 64 → 80 → 96px (`sectionY`, `sectionTop`, `sectionBottom`) for most bands; **chapter** 80 → 112 → 128px (`chapterY`, `chapterTop`) for Why work with us (the story band had it too, top only, until 2026-10-02 — see the exceptions below), which is the careers half and ends the page; **joined**, no top space, for a band that closes the one above it (the logo row under the safety band).
- Where two white bands meet, only one of them carries the step, so the gap is one step, not two: the numbers band has no space of its own since it moved inside the safety band (2026-10-02). Why work with us, the last white band (the black Apply band follows it since 2026-10-05), runs on one step from top to foot since 2026-10-05 (owner: the gaps have to match): 64px on phones and 70px from `sm`, measured to the letters. Its top is the one exception since 2026-10-06 (owner: "we need to separate this block from about us block. increase distance to 120 or what is the distance between the blocks?"): the distance between blocks, 85 / 102 / 120px from the story band's last line to the heading's ink (72 / 88 / 105px of padding), the same as Our story's headline under Ship with us; for a day before that the top padding (51 / 56 / 55px at phone / `sm` / `lg`) put the heading's ink only the inner step under the story band's last line, and the first shop row's margin (57 / 61 / 59px) puts the pictures that far under the heading's baseline. Earlier the same day the top matched "Tracked trucks." under the hero instead (75 / 92 / 108.5px, giving 88 / 106 / 123px), and the foot was the chapter step. The paddings are tuned to the type, so re-measure if a heading's size or face changes.
- One tuned exception: from `lg`, where Ship with us slides up over the safety band, the logo row keeps 70px under it (owner, 2026-10-02; 40 before) (ToolsBand.tsx). Ship with us itself is the full screen since 2026-10-02, its heading and button centred in it (ShipWithUs.tsx); it was 130px above / 200px below the ask before. Our story's top space is tuned so its headline sits as far under Ship with us as the safety band's "Tracked trucks." sits under the hero, measured to the ink: 63 / 79 / 94px (phone / `sm` / `lg`), which gives 85 / 102 / 120px to the ink at 375 / 800 / 1440 (owner, 2026-10-05; Geist's capitals sit a hair lower than Archivo's, hence 1–2px under the section step). It was 70px from `sm` (64 on phones) from 2026-10-02, and the chapter's 128px before that (StoryTeaser.tsx).
- Inside the safety band: the numbers band sits between the services pair and the road pair, 64px (phones) / 70px (from `sm`) from each, and the band ends 64 / 70px under the road pair, so the logo row is as far below it (owner, 2026-10-02; the band used the section foot before). From 2026-10-03 to 2026-10-05 the numbers closed the band; the shop pair, which stepped down there before, is now in Why work with us — two pairs since 2026-10-05, 64 / 70px apart — under its heading, and the same 64 / 70px over the careers sentence ("Why ___ stay."), measured to the top of its letters (owner, 2026-10-05: "it has to match other parts"; it was 64 → 80 → 112px to the box, 120px to the letters on a laptop, which made the homepage 8,418px tall at 1440 × 900 against 8,388 after this one change, and 8,206 with all of the section's and the footer's gaps on the step). The sentence sits the same 64 / 70px over the job cards, measured from its baseline (owner, same day: "fix this gap too"; 40px to the box and 50px to the baseline before), so the underline under the rolling word is 58px over the cards. The section ends the same 64 / 70px under the last line of the reasons (to its baseline; the chapter foot left 136px there on a laptop), which is what the logo row leaves over Ship with us. The footer uses the step too: 64 / 70px from its top edge to the labels' letters and from its buttons to the hairline (64 → 80 → 112px and 56 → 64 → 80px before). All owner, 2026-10-05. Until 2026-10-02 the band's top half was ink and the space between the pictures was split either side of the colour change; it's all white now (DECISIONS.md → Safety band).
- Don't hand-pick a new padding for a homepage band; use one of the three steps.

### Layout grid (2026-09-23)
A Figma-style margin/column grid for desktop, replacing the old fixed `max-w-7xl` + 32px padding: content caps
at 1200px and centers from `desktop` (1200px wide) up, so the margin is whatever's left of the viewport —
exactly 0 at 1200px wide, 360px either side at 1920px, and keeps growing on wider screens rather than the
content growing past 1200px — with 12 columns / 24px gutters inside that content width.
- `Container` (`components/ui/Container.tsx`) sets the margin: ordinary phone/tablet padding (`px-5 sm:px-8`)
  below the `desktop` breakpoint (1200px, `--breakpoint-desktop` in `app/globals.css`), `max-w-[75rem] mx-auto`
  (1200px, centered) from `desktop` up. Used by every section, header included — the header's nav links + logo +
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

## Homepage opening (in step with the hero's truck, plays on load)
- The video intro was removed 2026-09-23 (see DECISIONS.md → Hero media). The hero (`HomeHero`, its own looping video) is always rendered and shows straight away — no wait, no white flash.
- What plays on load is `HomeIntro` (`components/intro/HomeIntro.tsx`). It renders nothing itself: it sets the shared `useIntroProgress` value from 0 to 1 by following the hero video's `currentTime` from `INTRO.truckIn` (0.85 s, the truck's cab crossing the top of the frame) to `INTRO.landed` (3.4 s), found through `[data-hero-video]`. If the video hasn't started within `INTRO.videoTimeout` (1.5 s), or pauses before the text has landed (scrolled off screen), it animates the rest over what's left of `INTRO.fallbackDuration` instead (2026-09-24; before that it was a flat one-second animation).
- `Header` reads that progress to:
  - slide the whole bar down from above the screen over `INTRO.headerDrop` (`dropY`, on an inner wrapper, so it doesn't fight the header's own hide-on-scroll `y`);
  - fade in (`logoOpacity`) and settle (`logoScale`, `INTRO.appearScale` 1.06 → 1) its own logo in place — there's no separate flying copy;
  - bring the nav and CTAs from 60% opacity to full once progress passes `INTRO.litAt`.
- `HomeHero` reads the same progress to bring its text block down from `INTRO.blockDrop` (−20vh) and fade it in over `INTRO.blockIn`, and to light up the h1's words one by one once progress passes `INTRO.headlineAt` (1.5s into the video; the header brightens later, at `INTRO.litAt`).
- `IntroProgressProvider` shares progress with both: 0 on `/` until the text lands, 1 on every other page (so everything just renders in place everywhere else).
- Plays once per visit: a module-level flag in `HomeIntro` marks it played, and it's also skipped when the visit started on another page (progress is already 1). A reload resets the flag.
- Skipped (everything just appears in place, no animation) for `prefers-reduced-motion` visitors.

## Header behavior
- Fixed. Transparent at the top, frosted white once scrolled. Stays in view while scrolling from `sm` (640px) up. On phones it hides on scroll down and drops back on scroll up (not during the homepage logo moment or while a menu is open).
- During the homepage logo moment: nav and buttons sit at 60% opacity over the scene; hovering or tabbing into the header brings them to full with a frosted bar. The logo fades and settles into place — see Homepage opening above.
- Careers is a plain link to `/careers` (the dropdown panel was removed 2026-09-25).
- Below `lg`: menu button opens a full-screen menu that drops from the top.

## Data model

### Services (`lib/services.ts`)
Array of service entries, all dry van (since 2026-10-05): dry van truckload, dedicated lanes, drop and hook — owner-confirmed facts only. Adding a future trailer type (Reefer, Flatbed) should be a new array entry, not a page rebuild. Shown in the homepage safety band's words column; `/services` will read the same list. `servicesGroup` holds that column's heading and paragraph and the band's two service stills (`PairCard`s for `CardPair`).
```
{ id, name, description }
```

### Quote form (Ship with us on the homepage)
The site's one quote form since 2026-10-02 (`components/home/QuoteBar.tsx`): every Get a quote link goes to `/#quote` and opens it (`components/home/ShipWithUs.tsx` → `useQuoteLinks`); `/quote` redirects there. Fields (ZIP-only since 2026-10-01): pickup ZIP, delivery ZIP, pickup date, name, and one "Phone or email" field, sent as `phone` or `email` by what was typed. Shape sent to the backend (`lib/forms.ts`):
```
QuoteRequest { pickup: { zip, state }, delivery: { zip, state }, pickupDate, contact: { name, phone?, email? } }
```
`state` is the two-letter code the ZIP belongs to (`lib/zip.ts`, from the first three digits — the backend should still check it). The city shown on the map and in the receipt (`cityForZip`, GeoNames' list in `public/zip`) is a label only and isn't part of the request. `submitQuote` is a stub until the backend teammate's endpoint exists: it succeeds in development and fails with a message in production.

### News (`lib/news.ts`)
```
NewsPost { date (YYYY-MM-DD), title, summary, draft? }
```
The homepage block shows the three newest and `/news` lists them all. A `draft` post shows while developing and is left out of a production build; the twelve in the file are samples, so the block is off the live site, and `/news` stays its placeholder there, until a real post replaces them.

### Qualification form (Drive For Us + staff roles)
5–6 short questions only. Submits into an HR contact flow, not a document/e-signature pipeline. See DECISIONS.md → Applications.

## Pages reference
See NAVIGATION.md for the full task → file index.
