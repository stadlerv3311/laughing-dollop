# NAVIGATION.md
> Map of the project: task → file, and every component in the library. Look here before searching the repo cold.

## Pages
| Route | File | Status |
|---|---|---|
| `/` | `app/page.tsx` | Forest drone hero (shows straight away — a short header-logo fade-in is all that plays on load), numbers band, safety band, Ship with us band, the dark story band, rolling slogan line and three apply cards built |
| `/services` | `app/services/page.tsx` | Placeholder |
| `/quote` | `app/quote/page.tsx` | State map + quote form built; sends to a stub until the backend exists |
| `/fleet-map` | `app/fleet-map/page.tsx` | Placeholder (Fleet Map — formerly Track a Load) |
| `/news` | `app/news/page.tsx` | Placeholder |
| `/careers` | `app/careers/page.tsx` | The careers page: the three jobs, what each is and why to take it, each with its own Apply now. Where Careers and every other Apply now go |
| `/careers/drivers` | `app/careers/drivers/page.tsx` | The job application, opened on the driver job (the careers page's driver Apply now); sends to a stub until the backend exists |
| `/careers/staff` | `app/careers/staff/page.tsx` | The same application, opened on the office job, or the shop job with `?job=shop` |
| `/about` | `app/about/page.tsx` | Headline left and lede right on a dark band that ends in the facts row, story (six titled blocks, two across), the sideways timeline (`components/about/Timeline.tsx` — pinned and scroll-driven from `lg`, a swipe row below), closing line with both CTAs (draft copy in `lib/story.ts`) |

## Common tasks
| I need to... | Go to |
|---|---|
| Change a nav link or the company name | `lib/site.ts` — Header, mobile menu and Footer all read from it |
| Change brand colors or the animation easing | `app/globals.css` → `@theme` (keep ARCHITECTURE.md in sync) |
| Change the page margins or the column grid | `components/ui/Container.tsx`, `components/ui/Columns.tsx`, `--breakpoint-desktop` / `--width-header-cta` in `app/globals.css` — see ARCHITECTURE.md → Layout grid |
| Change the font | `app/layout.tsx` → `Geist` import (feeds `--font-sans` in `app/globals.css`) |
| Change page titles / SEO description | `app/layout.tsx` → `metadata`, or `metadata` in each page file |
| Tune the homepage opening (when it starts on the truck, how far the header and hero text drop, when the headline lights up) | `components/intro/timeline.ts` |
| Change how the header logo fades/settles in | `components/layout/Header.tsx` → `logoOpacity`, `logoScale` |
| Change how Ship with us slides over the safety band (sheet height, pin, shadow) | `components/home/SlideOverStack.tsx` — `OVER_SHARE`; wired in `app/page.tsx` |
| Change the story band → About opening animation | Names: `lib/story.ts` → `STORY_BAND` / `STORY_OPEN`; the two `<ViewTransition>`s in `components/home/StoryTeaser.tsx` and `app/about/page.tsx`; timing in `app/globals.css` → `.story-open` |
| Change the Ship with us card → Quote page animation | Names: `lib/site.ts` → `QUOTE_CARD` / `QUOTE_OPEN`; the two `<ViewTransition>`s in `components/home/ShipWithUs.tsx` and `app/quote/page.tsx`; timing in `app/globals.css` → `.quote-open` |
| Change the Ship with us band (copy, the quote bar) | `components/home/ShipWithUs.tsx` — a centred closing ask on white in the safety band's type, no photo since 2026-09-24; the bar's fields in `components/home/QuoteBar.tsx`, what the quote page does with them in `app/quote/page.tsx` → `prefill` and `QuoteForm`'s `QuotePrefill` |
| Change the safety band (GPS, dash cams, maintenance, new equipment) | Copy: `lib/site.ts` → `safetySystems` (the four cards), `safetyGroups` (the two blocks of words and which cards pair up), `safetyPitch` (the line beside the heading); layout: `components/home/SafetyBand.tsx`; each card's clip is its `video` in `safetySystems` (or an `image` still — New equipment, `public/images/safety-fleet.jpg`) (placeholders in `public/videos/safety-*-placeholder.mp4`) |
| Change the logo row under the safety band (Samsara, Fleetio, Volvo, Datatruck, OnRamp) | List, line and each logo's display height: `lib/site.ts` → `tools`, `toolsLine`; logo files: `public/logos/*.svg`; layout: `components/home/ToolsBand.tsx` |
| Edit the homepage headline (h1) — its rolling pairs (keep each line's nouns close in width) | `lib/site.ts` → `heroPairs`; timing and animation in `components/home/HeroHeadline.tsx`; placement in `components/home/HomeHero.tsx` |
| Change the hero video, its crop, its scrims or the pause between truck passes (`EMPTY_ROAD_MS`) | `components/home/HomeHero.tsx` (video `public/videos/home-hero-forest.mp4`, poster `public/images/home-hero-forest.jpg`); the h1 is `lib/site.ts` → `homeHeadline` |
| Change the three homepage apply cards (roles, copy, photos, where they link) | `lib/site.ts` → `applyRoutes`; layout in `components/home/ApplyRoutes.tsx`; photos in `public/images/apply-*.jpg` |
| Bring back the full-width homepage photo band, or add the B-roll video | `components/ui/HeroMedia.tsx` is still there but unused since 2026-09-17 — the apply cards took its place in `app/page.tsx` |
| Replace the draft company history (homepage card + About page) | `lib/story.ts` |
| Change the homepage numbers (years, miles, loads, states) | `lib/site.ts` → `companyStats`; layout in `components/home/TrustBar.tsx` |
| Change quote form fields, error messages or the thank-you screen | `components/quote/QuoteForm.tsx` |
| Change the quote map's colors, hover lift, route line or pins | `components/quote/StateMap.tsx` |
| Connect the quote form to the backend | `lib/forms.ts` → `submitQuote` (keep `QuoteRequest` in sync) |
| Change the careers page's jobs, paragraphs or Why here points | `lib/site.ts` → `applyRoutes` (`title`, `summary`, `reasons`); layout in `components/careers/CareersOverview.tsx` |
| Change the job application's questions, answers, copy or thank-you screen | `components/careers/JobApplication.tsx` (questions per job in `stepsFor`; the jobs' names, lines and photos come from `applyRoutes` in `lib/site.ts`, the line on the driver photo from `driverSlogans[0]`) |
| Connect the job application to the backend | `lib/forms.ts` → `submitJobApplication` (keep `JobApplication` in sync) |
| Regenerate or re-project the state shapes | `scripts/build-us-states.mjs` → writes `lib/us-states.ts` |
| Fix a ZIP that lights up the wrong state | `lib/zip.ts` |
| Change the shared input/select look | `components/ui/Field.tsx` → `controlClass` |
| Change header behavior (hide on scroll on phones, dimmed state during the logo moment) | `components/layout/Header.tsx` |
| Change the phone/tablet menu | `components/layout/MobileMenu.tsx` |
| Change the footer | `components/layout/Footer.tsx` |
| Add or change a button style | `components/ui/Button.tsx` |
| Change a button or nav label, or the section label / heading style | Labels: `lib/site.ts` (`quoteLink`, `applyLink`, `careersLink`, `fleetMapLink`); styles: `components/ui/typography.ts`. Rules: DECISIONS.md → Wording and type |
| Fade a block in when it scrolls into view | Wrap it in `<Reveal>` from `components/ui` |
| Slide a photo and its text in from opposite sides, landing together | Make the section a `<SlideGroup>` and wrap each piece in `<SlideItem from="left" \| "right">` (`components/ui/SlideIn.tsx`); used by the safety band |
| Change or reorder the homepage's rolling slogans | `lib/site.ts` → `driverSlogans` — `{ lead, tail }` pairs (ink over grey), the smaller driver line between the story band and the apply cards, led by the owner's line (`components/home/DriverSlogans.tsx`). The first one is what screen readers get; keep every lead and tail a similar length |
| Start a new page | Copy a placeholder in `app/`, then add its link in `lib/site.ts` (check DECISIONS.md nav rules first) |
| Check whether something is in scope | `docs/DECISIONS.md` |
| Find the original logo files | `docs/Logo black.svg` (full logo), `docs/Only logo Solutions.svg` (icon only) |
| Run the site locally | `npm run dev` → http://localhost:3000 |

## How the homepage fits together
```mermaid
flowchart TD
  Layout["app/layout.tsx"] --> Providers["IntroProgressProvider + SmoothScroll"]
  Providers --> Header["layout/Header"]
  Providers --> Page["app/page.tsx"]
  Providers --> Footer["layout/Footer"]
  Header --> MobileMenu["layout/MobileMenu"]
  Page --> HomeIntro["intro/HomeIntro"]
  Page --> HomeHero["home/HomeHero"]
  Page --> WhyDriveForUs["home/WhyDriveForUs"]
  Page --> DriverSlogans["home/DriverSlogans"]
  Page --> SlideOverStack["home/SlideOverStack"]
  SlideOverStack --> SafetyBand["home/SafetyBand"]
  SlideOverStack --> ToolsBand["home/ToolsBand"]
  SlideOverStack --> ShipWithUs["home/ShipWithUs"]
  Page --> TrustBar["home/TrustBar"]
  HomeIntro -. "intro progress" .-> Header
  HomeIntro -. "intro progress" .-> HomeHero
```

## Component library
Import from the folder, e.g. `import { Button, Container } from "@/components/ui"`.

| Folder | Component | What it does | Runs on |
|---|---|---|---|
| `ui/` | `Button` | Pill button; `href` makes it a link. Variants: `primary` (solid black), `outline` (black ring on a light frosted fill). Both share one type size so a pair sized alike matches. Sizes: `md`, `lg` | Server |
| `ui/` | `InteractiveHoverButton` | Pill whose label slides out on hover while an ink dot grows to fill it and brings the label back in white with an arrow; `href` makes it a link; sizes `sm` (fixed 8rem) and `lg` (Button's lg height, width from className); variants `solid` (white, fills ink), `ghostLight` (thin white ring, fills white), and the header's `ghostQuiet` (faint ring over dark bands) / `ghostDark` / `ink`; size `md` is the header's 40px pair. The hero's Get a quote and Apply now, and the header's pair | Server |
| `ui/` | `Container` | Full-width side-margin wrapper — phone/tablet padding below `desktop` (1200px), content caps at 1200px and centers above it | Server |
| `ui/` | `Columns` | The 12-column / 24px-gutter grid that sits inside a `Container` — size children with `col-span-*` | Server |
| `ui/` | `Logo` | Brand logo, `variant="full"` or `"icon"`; fills its wrapper's width | Server |
| `ui/` | `Reveal` | Fades + lifts children in once they scroll into view; `delay` for stagger | Client |
| `ui/` | `SlideGroup`, `SlideItem` | A section that slides its items in from the sides on one shared trigger, so they start and stop together; `distance="100%"` starts an item fully off the screen edge. Clips sideways overflow | Client |
| `ui/` | `HeroMedia` | Full-width photo or looping video band, 500px tall; shown straight with no overlay; `image` now, optional `video` later. **Not currently used** — the homepage apply cards replaced it on 2026-09-17; kept for other pages' heroes | Server |
| `ui/` | `CountUp` | Number that fills up from zero once it scrolls into view; `suffix` for "+" / "M+" | Client |
| `ui/` | `RotatingSlogan` | Rolls through `driverSlogans` like an odometer; `as` picks the tag (the homepage uses the default `p`); pauses on hover/focus and in a background tab; static under reduced motion | Client |
| `ui/` | `ScrollFillText` | A heading's words fill from 25% to full strength as it scrolls up the screen (scroll-linked; finished text for reduced motion). Put it inside the heading; one per screen at most — used on the safety band's h2 | Client |
| `ui/` | `Field`, `controlClass`, `errorId` | Form field label + error message, and the shared input/select look | Server |
| `ui/` | `NextSteps` | "What happens next": three numbered steps on a hairline, under the quote form and on Careers. Copy in `lib/site.ts` → `quoteSteps` / `applySteps` | Server |
| `ui/` | `PagePlaceholder` | Temporary body for pages not built yet | Server |
| `layout/` | `Header` | Fixed, type-only header: logo top-left, plain text links with a thin gliding line under the current page, Get a quote / Apply now as a same-width pair of interactive hover buttons. White with no bar over dark bands; a white bar with ink type fades in over light sections once scrolled. Careers is a plain link; hide-on-scroll on phones | Client |
| `layout/` | `MobileMenu`, `MenuToggle` | Full-screen menu below `lg` and its two-line → X button | Client |
| `layout/` | `Footer` | Logo, footer links, copyright | Server |
| `home/` | `HeroHeadline` | The homepage h1: "A … you can …" fixed, each line's noun and verb in full white rolling through `heroPairs` (verbs cross lines on a swap); sized to its widest pair; pauses on hover / hidden tab; first pair only for reduced motion and screen readers | Client |
| `home/` | `HomeHero` | Full-screen forest drone loop (road on the left fifth): shipper h1 (`HeroHeadline`) lighting up word by word, one supporting line, Get a Quote (solid) and Drive with us (thin white ring), in the header's CTA column from `lg` | Client |
| `home/` | `WhyDriveForUs` | Why drive for us: headline and the four driver reasons (from `applyRoutes`), after the story band | Server |
| `home/` | `DriverSlogans` | The rolling slogans as a smaller line under Ship with us, above the apply cards | Server |
| `home/` | `ApplyRoutes` | The three apply cards (On the road / In the office / In the shop) from `applyRoutes`: from `md` one row where the hovered or focused card opens wide (role, job, line, Apply now over the photo) and the others narrow; stacked and all open on phones. Each card is one link to its job on `/careers` | Client |
| `home/` | `QuoteBar` | Ship with us's Pickup / Delivery / Pickup date bar; Get a quote opens `/quote` with them filled in | Client |
| `home/` | `ShipWithUs` | The shipper half's closing ask: a centred column (label, heading, paragraph, the quote bar) on white in the safety band's type, between the safety band and the story (rebuilt 2026-09-24; was a photo-and-text band until then). Replaced `AudienceSplit` / `AudiencePanel` on 2026-09-18 | Server |
| `home/` | `SafetyBand` | GPS, dash cams, maintenance and new equipment as a zigzag: two pictures stepping down the page, each a pair of sliding cards (hover opens one and plays its clip, paused otherwise) beside a block of words | Client |
| `home/` | `ToolsBand` | One quiet line and the five tool companies' logos, centred, closing the safety band inside the same pinned section | Server |
| `home/` | `SlideOverStack` | Pins the safety band from `lg` while Ship with us slides up over it as a sheet (70% of the band's height), once, on the way down; `useCovered()` tells the band when it's covered so its timer pauses (2026-09-24) | Client (scroll) |
| `home/` | `TrustBar` | Company numbers that fill up on scroll, set under a hairline with no box (`companyStats` in `lib/site.ts`); 2×2 on phones, one row from `lg` | Server |
| `careers/` | `JobApplication` | One application for all three jobs, as a dark split: the picked job's photo on the left half (a band on phones), one question at a time on ink on the right, opening on Which job? (photo tiles); Back from there goes to `/careers`. Tap answers move on, Enter goes on, number keys pick | Client |
| `careers/` | `CareersOverview` | The careers page: a dark opening with jump links, then one alternating photo-and-text section per job (paragraph, Why here list, Apply now into the application on that job) | Server |
| `quote/` | `QuoteForm` | Get a Quote: map + form kept in sync, browser-side checks, thank-you screen | Client |
| `quote/` | `StateMap` | Lower-48 map: hover lift + name tag, click pickup then delivery, route line and pins | Client |
| `intro/` | `HomeIntro` | Renders nothing; on load drives the shared intro progress 0 → 1 off the hero video's clock, which slides the header down with the truck, brings the hero text down after it and lights up the headline | Client |
| `intro/` | `timeline.ts` | `INTRO` video times, drop spans and distances, appear scale and the fraction things light up at | — |
| `providers/` | `IntroProgressProvider`, `useIntroProgress` | Shares intro progress (0–1) between `HomeIntro`, `Header` and `HomeHero` | Client |
| `providers/` | `SmoothScroll` | Lenis smooth scrolling; off for reduced motion | Client |

## Directory map
```
app/          → routes, one folder per page (App Router), globals.css, icon.svg
components/   → the component library (ui, layout, home, about, quote, intro, providers)
lib/          → site config (names + links), story copy, quote types + stub, state shapes, ZIP lookup
scripts/      → one-off generators (state shapes for the quote map)
public/       → logo.svg, logo-icon.svg
docs/         → project docs + original logo files
```
