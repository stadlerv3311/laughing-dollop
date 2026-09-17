# DECISIONS.md
> Locked decisions for this site. These are deliberate scope choices — do not expand, "improve," or add functionality beyond what's written here without flagging it and asking first.
> This document leads the code: if a decision changes, update this file in the same commit as the code that changes.

## Locked

### Freight types
Dry Van only. The Services page is built as a data-driven list (see ARCHITECTURE.md → Data model) so other trailer types can be added as a new entry later — but don't add Reefer/Flatbed copy or "growing fleet" language now.

### Fleet Map (was "Track a Load")
A public map of roughly where our trucks are right now, fed by Samsara and refreshed about once an hour (live updates aren't required). It's part of the company's own site, not a broker portal: no load lookup, no login, no account system — do not add auth to this page. Renamed from "Track a Load" and moved to `/fleet-map` on 2026-09-11. Show approximate positions with no load or driver details — exact positions of loaded or parked trucks are a cargo-theft and driver-privacy risk (how positions are coarsened is the backend teammate's call).

### Get a Quote
A US map next to a short form (requested 2026-09-11). The map shows only the lower 48 states and Washington, D.C. We don't run to Alaska or Hawaii, so they're left off instead of shown greyed out. Hovering a state lifts it and shows its name. The first click sets pickup (dark), the next sets delivery (orange), and a route line draws between them. Clicking a picked state clears it, and Swap and Clear buttons sit under the map. The map only picks the state: each stop also has a City or ZIP field, and typing a ZIP lights up its state. The state dropdowns do everything the map does, so phones and keyboard or screen-reader users can finish without the map. Fields: pickup (state, city/ZIP), delivery (state, city/ZIP), weight, what's being shipped, name, company (optional), email, phone. Every load goes in a dry van, so there's no trailer choice. Until the backend exists, the form checks fields in the browser and calls a stub in `lib/forms.ts`. It doesn't send anything yet.

### Applications (Drive For Us, Dispatcher, Mechanic/Office staff)
All roles use the same short 5–6 question qualification form. HR contacts the applicant directly afterward. No long-form online application, no CDL document upload, no e-signature in this phase.

### Pay transparency
No public per-mile pay rates. The in-app driver bonus tracker is the featured differentiator instead — don't publish rate figures on the Drive For Us page.

### Hero media
**Homepage** (requested 2026-09-10; the 3D scene was replaced by the video on 2026-09-11): a 6-second intro that plays by itself when the page opens. A 5-second video follows our truck down a desert highway and ends on the trailer's side, held on the logo. Our own logo then fades in exactly over the painted one — warped onto its four corners, so it sits on the trailer as the camera sees it — the picture fades to white, the logo turns flat to face you, glides into the header's top-left corner, and the page shows through. Until 2026-09-11 this was a 3D scene (three.js) telling the same story; the owner's produced clip replaced it, which this entry already allowed for, and three.js / React Three Fiber are no longer dependencies. The logo is still always exact: it's our own `logo.svg` laid over the video, not something the video has to get right. Nobody has to wait: scrolling, a tap, a scroll key or the Skip intro button jumps to the end in about half a second, and the header stays clickable the whole time. Skipped for reduced-motion visitors; if the video can't start within 3 seconds (slow network, autoplay turned off), the page just shows. Plays once per visit (requested 2026-09-10): coming back to the homepage later in the same visit goes straight to the content; a reload or a new visit plays it again. The top of the page under the intro is a full-width photo band under the header (a wide 5:2 strip, so the headline still shows on the first screen — shortened 2026-09-11), with a warm sunset color grade and film grain on top (the B-roll video will get the same look); repeat visits and skipped intros show it straight away (requested 2026-09-10). That photo is a temporary AI-generated placeholder (a white 2026 Volvo VNL 860 with our logo on the trailer and cab, on an open desert highway at sunset — swapped in from the bridge shot on 2026-09-17 at the owner's request) — B-roll video will replace it in the same spot.

The intro video is the AI-generated clip the owner supplied (`Video/` folder on their Desktop, kept out of the repo). It ships re-encoded for the web: no audio track, fast-start, 1080p (~3.2 MB) with a 720p copy (~1.6 MB) for phones and the first frame as the poster. Swapping in a different clip means re-measuring where the logo sits on the trailer — see ARCHITECTURE.md → Homepage intro.

**Other pages** (e.g. Drive For Us): the hero must support photo or video — video may be produced and dropped in later, but is not required to launch.

### Company story on the homepage
No full About section on the homepage (decided 2026-09-10). A single short story card sits after the numbers band — headline, 2–3 sentences, and three milestones from `md` up (hidden on phones to keep the card short) — and the whole card links to `/about` for the full story. Copy lives in `lib/story.ts` and is a draft for now (see Open).

### Trust badges
DOT/MC numbers are confirmed and should be shown now — the actual numbers still need to be supplied. Other certifications (TSA/TWIC/hazmat, etc.) are not yet available — don't invent or imply certifications that aren't confirmed.

Homepage numbers band (figures given by the owner 2026-09-10): 10+ years in business, 32M+ miles driven, 125,000+ loads completed, 48 states. (Miles was first "about 1M a year"; replaced with the 32M+ total the same day.) The numbers fill up from zero when the band scrolls into view. Add a figure only once it's confirmed.

### Navigation & clutter
Minimal, confident nav — closer to Sierra Expediting's restraint than a dense multi-menu site. No mega-menus, no duplicate link lists, no multiple phone numbers in the header. If a new page or CTA is requested, check it fits the existing header/footer structure before adding a nav item.

Header behavior (Lucid-inspired): stays in view while you scroll, so Apply To Drive and Get a Quote are always one click away (changed 2026-09-10 — it used to hide on scroll down on every screen). On phones (under 640px), where the bar only shows the logo and menu button, it still hides on scroll down and returns on scroll up. During the homepage intro the nav pill and buttons stay visible but dimmed over the scene and come to full on hover (requested 2026-09-10); the logo appears only once it lands from the intro. Look (requested 2026-09-16): no full-width bar — the logo sits alone in the top-left corner, the nav links sit in a centered frosted-glass pill, and Get a Quote and Apply To Drive are their own pills on the right, outside the nav pill; on phones the menu button is a round glass pill. The glass firms up a little once you scroll. "Careers" opens a small glass panel with two links that drops from under the nav pill — a dropdown, not a mega-menu. Careers links: Drive For Us → `/careers/drivers`, Dispatch, Shop & Office → `/careers/staff`. Nav order (News added 2026-09-11): Home · Services · About · News · Careers ▾ · Fleet Map.

### Stack
Next.js (App Router) + Tailwind CSS + TypeScript. Next.js chosen for consistency with the company's existing fleet dashboard project, and for SEO (server-rendered/static pages matter for a site trying to be found by shippers and drivers) and room to grow (Route Handlers can serve the form backend later without a separate service). App Router chosen over Pages Router as the actively developed path.

Everything is built as React components organized as a small library (see NAVIGATION.md → Component library). Animation: motion + Lenis smooth scrolling. 3D: three.js via React Three Fiber, homepage intro only.

### Team split
This repo's owner builds the **frontend only**: pages, components, layout, styling, client-side form validation, and the map UI. Another team member owns the **backend**: form submission handling, the Samsara integration (truck positions for the Fleet Map), and any API keys or data storage. Frontend code talks to the backend through a small agreed contract (endpoint + request/response shape); until that exists, use typed stubs in `lib/` rather than building backend logic here.

### Brand orange
The site's orange is `#FF3000`, matching the logo icon exactly. The earlier palette value `#FA5F1A` is retired — don't reintroduce it. See ARCHITECTURE.md → Brand / design tokens for contrast rules.

## Open — not yet decided

- **Form backend**: how Quote / Careers form submissions get handled (email, Supabase, Next.js Route Handler to a CRM, other) is undecided.
- **Additional trust badges**: beyond DOT/MC, TBD.
- **News content**: who writes posts and where they live (files in the repo or a CMS) isn't decided, so `/news` is a placeholder for now.
- **Font**: Manrope is a provisional pick (free, close to the premium-but-light feel of the design references). Swap if a brand font exists — one line in `app/layout.tsx`.
- **Homepage copy**: the headline and the two panel texts are drafts.
- **Company history**: the story on the homepage card and the About page (`lib/story.ts`) is made-up placeholder copy, approved as a stand-in on 2026-09-10. Only the Citrus Heights, CA base and the for-hire interstate authority come from the FMCSA SAFER record. Replace it once the real history is written.
- **Seasons in the intro**: discussed (winter → spring → summer → autumn, ending at sunset) but not built. Now that the intro is a video, this is a footage question, not a code one.
- **Careers dropdown wording**: "Dispatch, Shop & Office" is a provisional label.
- **Footer extras**: Privacy Policy, Terms of Service and Driver FAQ pages, plus contact info and socials, aren't defined yet — so they're not in the footer.
