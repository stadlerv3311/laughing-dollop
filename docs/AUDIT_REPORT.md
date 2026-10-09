# AUDIT_REPORT.md
> The cleanup audit of 2026-10-09: what was found, what was fixed and removed (with the commits), and what is still open. Branch `audit/cleanup-2026-10-09`. A record of one pass, not a living document.

## Before and after
| Check | Before | After |
|---|---|---|
| `npm install` | OK | OK |
| `npx tsc --noEmit` | 0 errors | 0 errors |
| `npm run lint` | **2 errors** (`react-hooks/set-state-in-effect`, `components/home/QuoteBar.tsx`) | 0 errors |
| Tests | none exist (no test script) | none exist |
| `npm run build` | OK, 13 routes | OK, the same 13 routes |
| `npm audit` | 9 vulnerabilities (8 high, 1 critical) | unchanged, see Still open |

No new errors or warnings. The dev server answers 200 on every page, 307 on `/quote` (to `/#quote`) and 404 on an unknown address, before and after.

## Commits
| Commit | What |
|---|---|
| `0fa9487` | The work that was uncommitted when the audit started, as one baseline commit |
| `3f43822` | `.gitignore` lists the pictures held back from the public repo |
| `ffcb054` | Bug fixes: the application's double tap, the quote form's date, the footer's year; lint passes |
| `3df17f1` | Dead code removed |
| `029e3ab` | Parked components moved to `components/unused/` |
| `43da605` | Component docs made to match the components |
| `612861b` | General docs brought up to date |

## What was found and fixed

### Bugs
- **A double tap on an answer in the job application skipped a question or emptied the panel** (`components/careers/JobApplication.tsx`, `pickAndGo`). Each tap set its own "one step on" going. Two taps on "Yes" for the CDL question gave "7 / 6" over an empty panel; on "Which job?" they skipped the CDL question, so a driver's application could be sent without it. Reproduced on `/careers/drivers`, fixed, and checked again: two taps now land on "6 / 6", the years question.
- **The quote form's earliest pickup date was the day of the build** (`components/home/QuoteBar.tsx`). The homepage is built ahead of time and the built HTML held `min="2026-10-09"`. The day is read in the browser now; the built HTML has no `min`. The check on sending already refused past dates.
- **The footer's copyright year was fixed at build time** (`components/layout/Footer.tsx`). The build's year is still in the HTML, and the browser's own takes over once the page is running (`components/layout/CopyrightYear.tsx`).
- **Lint.** The two errors were the quote card letting go of the sizes it holds while it opens and closes. That has to happen in an effect, so each has a disable comment that says why. The code is unchanged.

### Navigation
Nothing was broken. Every link's target exists and gets the parameters it expects.

| From | Action | To | Status |
|---|---|---|---|
| Header, phone menu, footer | Services, Careers, About, Fleet map, News | `/services`, `/careers`, `/about`, `/fleet-map`, `/news` | OK |
| Header and footer logo | click | `/` | OK |
| Every Get a quote (header, hero, footer, phone menu, safety band, About card, Services card) | link | `/#quote` | OK |
| `/quote` | redirect | `/#quote` | OK |
| Every Apply now outside the careers page | link | `/careers/apply` | OK |
| Careers page, per job | Apply now | `/careers/drivers`, `/careers/staff?job=office`, `/careers/staff?job=shop` | OK |
| Application, first question | Back | `/careers` | OK |
| Homepage story band | Read our full story | `/about` | OK |
| Homepage news block | All news | `/news` | OK |
| Safety band | Fleet map | `/fleet-map` | OK |
| `/quote` | nothing links to it | | Orphan on purpose: it catches old links |
| `/careers/staff` without `?job` | nothing links to it | | Works, opens the office job |
| `/careers#driver`, `#office`, `#shop` | nothing links to them | | Dead end, see Still open |

Not checked by eye: the quote form opening by itself on arrival at `/#quote`. The browser pane used for the audit was hidden, which holds back the animation frame that step waits on. The page does land on the band, and the code path reads correct.

### Docs
- **README.md**: the feature list called Services, Careers and News placeholders, gave the numbers band three numbers and described panels and a clickable quote map that no longer exist. Rewritten to what is built.
- **NAVIGATION.md**: the component table gained the missing rows (`StoryTeaser`, `StoryLine`, `SplitCard`, `FleetMap`, `HalfStar`, `CopyrightYear`) and a Props table for every component. Corrected: `Logo`'s third variant, `Pair` as what `CardPair.tsx` exports, where `LinkHover` and `InteractiveHoverButton` are used, the careers page's white opening, `homeHeadline` (it is `heroLines`), the directory map (it named a `quote` folder that doesn't exist), and the rows that pointed at `controlClass` and `SlideGroup` as if they were in use.
- **ARCHITECTURE.md**: the folder lists gained `services.ts`, `story.ts`, `build-us-dots.mjs`, `logos/` and three `ui` components; the layout grid note no longer says the hero's column is sized off `--width-header-cta`; "Still to come" drops the two components built under other names.
- **DECISIONS.md**: one pointer to a heading that doesn't exist ("Quote page") now names the one that does ("Quote form").
- **site-map.md**: a note at the top says it is the original plan and where it has been overtaken.
- No `.md` file has a markdown link, an anchor link or an image, so there were none to break. The setup steps in README match the scripts in `package.json`.

## What was removed
All of it was referenced by nothing, and all of it is in git history.
- `components/about/StoryChapters.tsx`, `Timeline.tsx`, `StoryMilestones.tsx` (484 lines), replaced by `StoryLine` and `StoryRoute`.
- `app/globals.css`: the `hero-settle` and `hero-rise` animations and the `scroll-cue` keyframes.
- `data-intro-logo-target` on the header's logo, `id="content"` on the hero, the `INTRO` re-export in `components/intro/index.ts`.
- Eight pictures in `public/images/` (about 2.9 MB): `home-hero-desert.jpg`, `home-hero-placeholder.jpg`, `about-truck-front.jpg`, `ship-truck-side.jpg`, `new-equipment-lot.jpg`, `lease-truck-road.webp`, `safety-fleet.jpg`, `safety-truck-front.jpg`.
- `news-page-snapshot.html` in the project's root: a static mock-up of an earlier news page, never in git, so this one is gone for good (the builder: "if its mock up you can delete that").

## What was moved, not removed
Six components no page uses, kept on purpose, now in `components/unused/` (the builder: "can we create a separate folder for unused components ?"): `Columns`, `HalfStar` (with `inkDepthClass`), `HeroMedia`, `RotatingSlogan`, `ScrollFillText`, `SlideIn`. Nothing imports from that folder; its `index.ts` and ARCHITECTURE.md → Component library conventions say how to bring one back.

## Still open
- **`next` has a critical advisory** (versions 16.0.0 to 16.3.7; the project is on 16.3.4), and `npm audit` lists eight high ones in development tooling. Fixing the first means upgrading `next`, which the audit's rules left out. Worth doing as its own task before launch.
- **Stand-in media shows in a production build.** The news posts and the fleet positions are kept out of production; the pictures and clips marked "must not go live" are not (Samsara's GPS clip, Volvo's images in the application, the Services and About pictures). They are also not in the repo, so a deploy from git would show broken pictures in their place. A launch blocker, listed in DECISIONS.md → Open.
- **No 404 page of the site's own**: an unknown address gets the framework's default. The builder is choosing one.
- **A scroll lock that may outlast the homepage** (`components/home/ShipWithUs.tsx`, `useLandingPause`): the timer that gives the scroll back after the landing pause isn't cleared when the page is left, so the next page could hold still for up to 2.4 seconds. Read from the code, not reproduced, so not changed.
- **ARCHITECTURE.md → Section spacing** says not to hand-pick a band's padding, and most bands now do, each with the builder's reason beside it. The rule or the bands: not settled here.
- **No tests, no formatter.** There was nothing to re-run or to format with, and the audit added neither. File names and imports were already consistent.
- **The `submitQuote`, `submitJobApplication` and `getFleetSnapshot` stubs** and their `console.info` lines were left alone: they are the backend teammate's contract.

## Needs a decision
Unused but not certainly dead, so left in place:
1. `Field` and `controlClass` (`components/ui/Field.tsx`): no form uses them. They stay in `ui/` because `errorId`, in the same file, is in use.
2. The `Readout` block in `components/home/SafetyBand.tsx` and `readout` in `lib/site.ts`: no system has a readout since 2026-10-02.
3. `useCovered` and its context in `components/home/SlideOverStack.tsx`: nothing reads it.
4. `homeLede` in `lib/site.ts`; `origin` and `opening` in `lib/story.ts`; the commented-out 2024 stop there.
5. `sectionY`, `chapterY` and `chapterTop` in `components/ui/spacing.ts`: documented, unused.
6. The section ids on the careers page (`#driver`, `#office`, `#shop`): the jump links that used them went on 2026-10-01. Harmless as addresses to link to.
7. Three pictures no page uses and that are not in git, so deleting them is final: `apply-driver-road.jpg`, `dry-van-trailers.jpg`, `services-dock-doors.jpg` in `public/images/`.
8. Repeated code, reported and not touched (merging it would be a refactor): the rising heading in `WhyWorkWithUs.tsx` and `StoryHeadline`; the launch pill in `QuoteBar.tsx` and `ApplyBand.tsx`; the media-query helper in `SlideOverStack`, `NewsCards` and `PictureStage`; the error line in `JobApplication.tsx` and `Field.tsx`.
