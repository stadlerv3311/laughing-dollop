# NAVIGATION.md
> Map of the project: task → file, and every component in the library. Look here before searching the repo cold.

## Pages
| Route | File | Status |
|---|---|---|
| `/` | `app/page.tsx` | Scroll intro, "Ship With Us / Drive For Us" panels and numbers band built |
| `/services` | `app/services/page.tsx` | Placeholder |
| `/quote` | `app/quote/page.tsx` | State map + quote form built; sends to a stub until the backend exists |
| `/fleet-map` | `app/fleet-map/page.tsx` | Placeholder (Fleet Map — formerly Track a Load) |
| `/news` | `app/news/page.tsx` | Placeholder |
| `/careers/drivers` | `app/careers/drivers/page.tsx` | Placeholder |
| `/careers/staff` | `app/careers/staff/page.tsx` | Placeholder |
| `/about` | `app/about/page.tsx` | Story section built (draft copy); team, fleet and safety still to come |

## Common tasks
| I need to... | Go to |
|---|---|
| Change a nav link or the company name | `lib/site.ts` — Header, mobile menu and Footer all read from it |
| Change brand colors or the animation easing | `app/globals.css` → `@theme` (keep ARCHITECTURE.md in sync) |
| Change the font | `app/layout.tsx` → `Manrope` import |
| Change page titles / SEO description | `app/layout.tsx` → `metadata`, or `metadata` in each page file |
| Tune intro timing (length, when the drive-off, white fade and logo glide happen) | `components/intro/timeline.ts` |
| Change how far the truck drives off | `components/intro/timeline.ts` → `DRIVE_DISTANCE` |
| Tune the intro camera path | `components/intro/TruckScene.tsx` → `AERIAL`, `FRONT`, `DRIVE_CAMERA` shots and `Director` |
| Change the morning / sunset colors and light | `components/intro/daylight.ts` |
| Change the sky, sun or mesa skyline | `components/intro/Atmosphere.tsx` |
| Change the truck's look or logo placement | `components/intro/Truck.tsx` |
| Change the road, guardrail, light poles | `components/intro/Highway.tsx` |
| Change how the logo flies into the header | `components/intro/TruckIntro.tsx` → `handleFrame` |
| Edit the homepage headline and panels | `components/home/HomeHero.tsx` |
| Replace the homepage top photo or add the B-roll video | `app/page.tsx` → `HeroMedia` (`image` / `video`); files in `public/images/` |
| Replace the draft company history (homepage card + About page) | `lib/story.ts` |
| Change the homepage numbers (years, miles, loads, states) | `lib/site.ts` → `companyStats`; layout in `components/home/TrustBar.tsx` |
| Change quote form fields, error messages or the thank-you screen | `components/quote/QuoteForm.tsx` |
| Change the quote map's colors, hover lift, route line or pins | `components/quote/StateMap.tsx` |
| Connect the quote form to the backend | `lib/forms.ts` → `submitQuote` (keep `QuoteRequest` in sync) |
| Regenerate or re-project the state shapes | `scripts/build-us-states.mjs` → writes `lib/us-states.ts` |
| Fix a ZIP that lights up the wrong state | `lib/zip.ts` |
| Change the shared input/select look | `components/ui/Field.tsx` → `controlClass` |
| Change header behavior (hide on scroll on phones, dimmed state during the intro, Careers drop panel) | `components/layout/Header.tsx`, `components/layout/CareersPanel.tsx` |
| Change the phone/tablet menu | `components/layout/MobileMenu.tsx` |
| Change the footer | `components/layout/Footer.tsx` |
| Add or change a button style | `components/ui/Button.tsx` |
| Fade a block in when it scrolls into view | Wrap it in `<Reveal>` from `components/ui` |
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
  Header --> CareersPanel["layout/CareersPanel"]
  Header --> MobileMenu["layout/MobileMenu"]
  Page --> TruckIntro["intro/TruckIntro"]
  Page --> HomeHero["home/HomeHero"]
  Page --> TrustBar["home/TrustBar"]
  TruckIntro --> TruckScene["intro/TruckScene (3D canvas)"]
  TruckScene --> Atmosphere["intro/Atmosphere"]
  TruckScene --> Truck["intro/Truck"]
  TruckScene --> Highway["intro/Highway"]
  HomeHero --> AudiencePanel["home/AudiencePanel"]
  TruckIntro -. "intro progress" .-> Header
```

## Component library
Import from the folder, e.g. `import { Button, Container } from "@/components/ui"`.

| Folder | Component | What it does | Runs on |
|---|---|---|---|
| `ui/` | `Button` | Pill button; `href` makes it a link. Variants: `primary` (orange), `dark`, `outline`. Sizes: `md`, `lg` | Server |
| `ui/` | `Container` | Centered max-width wrapper with side padding | Server |
| `ui/` | `Logo` | Brand logo, `variant="full"` or `"icon"`; fills its wrapper's width | Server |
| `ui/` | `Reveal` | Fades + lifts children in once they scroll into view; `delay` for stagger | Client |
| `ui/` | `HeroMedia` | Full-width photo or looping video band under the header (5:2 from `sm`, headline still visible below it), with a sunset color grade and film grain on top; `image` now, optional `video` later | Server |
| `ui/` | `CountUp` | Number that fills up from zero once it scrolls into view; `suffix` for "+" / "M+" | Client |
| `ui/` | `Field`, `controlClass`, `errorId` | Form field label + error message, and the shared input/select look | Server |
| `ui/` | `PagePlaceholder` | Temporary body for pages not built yet | Server |
| `layout/` | `Header` | Fixed header: logo, nav, Careers drop panel, CTAs, hide-on-scroll on phones | Client |
| `layout/` | `CareersPanel` | Panel that drops from under the header with the two Careers links | Client |
| `layout/` | `MobileMenu`, `MenuToggle` | Full-screen menu below `lg` and its two-line → X button | Client |
| `layout/` | `Footer` | Logo, footer links, copyright | Server |
| `home/` | `HomeHero` | Headline + the two audience panels after the intro | Server |
| `home/` | `AudiencePanel` | One "Ship With Us" / "Drive For Us" card | Server |
| `home/` | `TrustBar` | Rounded band of company numbers that fill up on scroll (`companyStats` in `lib/site.ts`); 2×2 on phones, one row from `lg` | Server |
| `quote/` | `QuoteForm` | Get a Quote: map + form kept in sync, browser-side checks, thank-you screen | Client |
| `quote/` | `StateMap` | Lower-48 map: hover lift + name tag, click pickup then delivery, route line and pins | Client |
| `intro/` | `TruckIntro` | Pinned scroll stage: flying logo, white fade, scroll cue, loader | Client |
| `intro/` | `TruckScene` | WebGL canvas and the camera `Director` (lazy-loaded) | Client |
| `intro/` | `Truck` | Procedural tractor + dry van with logo decals, spinning wheels; drives off at the end | Client |
| `intro/` | `Highway` | Endless road texture, guardrail posts, light poles, ground | Client |
| `intro/` | `Atmosphere` | Sky dome with sun and mesa skyline; sun, ambient light and fog for the time of day | Client |
| `intro/` | `daylight.ts` | Morning and sunset palettes, blended by scroll | — |
| `intro/` | `useSceneProgress` | Damped scroll progress shared by the 3D parts | Client |
| `intro/` | `timeline.ts` | `INTRO` scroll phases, drive-off distance + easing helpers | — |
| `intro/` | `useSvgTexture` | Turns an SVG into a sharp 3D texture | Client |
| `providers/` | `IntroProgressProvider`, `useIntroProgress` | Shares intro progress (0–1) between intro and header | Client |
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
