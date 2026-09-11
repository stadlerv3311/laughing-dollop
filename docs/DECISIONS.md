# DECISIONS.md
> Locked decisions for this site. These are deliberate scope choices — do not expand, "improve," or add functionality beyond what's written here without flagging it and asking first.
> This document leads the code: if a decision changes, update this file in the same commit as the code that changes.

## Locked

### Freight types
Dry Van only. The Services page is built as a data-driven list (see ARCHITECTURE.md → Data model) so other trailer types can be added as a new entry later — but don't add Reefer/Flatbed copy or "growing fleet" language now.

### Track a Load
Simple Samsara-fed map view. A secondary utility, not a broker portal. No login, no account system — do not add auth to this page.

### Applications (Drive For Us, Dispatcher, Mechanic/Office staff)
All roles use the same short 5–6 question qualification form. HR contacts the applicant directly afterward. No long-form online application, no CDL document upload, no e-signature in this phase.

### Pay transparency
No public per-mile pay rates. The in-app driver bonus tracker is the featured differentiator instead — don't publish rate figures on the Drive For Us page.

### Hero media
**Homepage** (requested 2026-09-10, camera path revised the same day): a scroll-driven 3D truck intro. A truck with the logo drives down a desert highway. As you scroll, the camera starts high and ahead of the truck, drops in front of the grille, flies around to the trailer's side and stops on the logo. The truck then drives off into the sunset while the logo stays on screen, the sunset fades to white, the logo glides into the header's top-left corner, and the page content appears. The light goes from morning to sunset along the way. Built in code (three.js), not a video file — the logo is always exact and the camera follows the scroll in both directions. Skipped for reduced-motion visitors and browsers without WebGL. An AI-generated video (Runway) was tested and is on hold; a produced video could still replace the 3D scene later on the same scroll timeline.

**Other pages** (e.g. Drive For Us): the hero must support photo or video — video may be produced and dropped in later, but is not required to launch.

### Trust badges
DOT/MC numbers are confirmed and should be shown now. Other certifications (TSA/TWIC/hazmat, etc.) are not yet available — don't invent or imply certifications that aren't confirmed.

### Navigation & clutter
Minimal, confident nav — closer to Sierra Expediting's restraint than a dense multi-menu site. No mega-menus, no duplicate link lists, no multiple phone numbers in the header. If a new page or CTA is requested, check it fits the existing header/footer structure before adding a nav item.

Header behavior (Lucid-inspired): hides on scroll down, returns on scroll up. "Careers" opens a small panel with two links that drops from under the bar — a dropdown, not a mega-menu. Careers links: Drive For Us → `/careers/drivers`, Dispatch, Shop & Office → `/careers/staff`.

### Stack
Next.js (App Router) + Tailwind CSS + TypeScript. Next.js chosen for consistency with the company's existing fleet dashboard project, and for SEO (server-rendered/static pages matter for a site trying to be found by shippers and drivers) and room to grow (Route Handlers can serve the form backend later without a separate service). App Router chosen over Pages Router as the actively developed path.

Everything is built as React components organized as a small library (see NAVIGATION.md → Component library). Animation: motion + Lenis smooth scrolling. 3D: three.js via React Three Fiber, homepage intro only.

### Team split
This repo's owner builds the **frontend only**: pages, components, layout, styling, client-side form validation, and the map UI. Another team member owns the **backend**: form submission handling, the Samsara integration, load lookup, and any API keys or data storage. Frontend code talks to the backend through a small agreed contract (endpoint + request/response shape); until that exists, use typed stubs in `lib/` rather than building backend logic here.

### Brand orange
The site's orange is `#FF3000`, matching the logo icon exactly. The earlier palette value `#FA5F1A` is retired — don't reintroduce it. See ARCHITECTURE.md → Brand / design tokens for contrast rules.

## Open — not yet decided

- **Form backend**: how Quote / Track / Careers form submissions get handled (email, Supabase, Next.js Route Handler to a CRM, other) is undecided.
- **Additional trust badges**: beyond DOT/MC, TBD.
- **Font**: Manrope is a provisional pick (free, close to the premium-but-light feel of the design references). Swap if a brand font exists — one line in `app/layout.tsx`.
- **Homepage copy**: the headline and the two panel texts are drafts.
- **Seasons in the intro**: discussed (winter → spring → summer → autumn, ending at sunset) but not built. Decide 3D seasons vs. an AI video before adding.
- **Careers dropdown wording**: "Dispatch, Shop & Office" is a provisional label.
- **Footer extras**: Privacy Policy, Terms of Service and Driver FAQ pages, plus contact info and socials, aren't defined yet — so they're not in the footer.
