# ITrucking Solutions Website — Site Map & Reference

## Brand

- **Logo**: icon mark (compass/pinwheel, 8-piece radial shape) + full black wordmark lockup
- **Colors**
  - `#252525` — near-black (text, dark UI elements)
  - `#FFFFFF` — white (primary background)
  - `#F7F0F0` — soft warm off-white (alternate section backgrounds — gives rhythm without shadows/borders)
  - `#FF3000` — orange (accent / CTAs only — not large fills); matches the logo icon exactly
- **Design principles**
  - Light, generous whitespace, restrained — not template-looking, not gradient-heavy
  - Orange used sparingly (CTAs, active states, accents) — never as a dominant fill
  - No mega-menus, no duplicate link lists, no multiple phone numbers crowding the header (avoid USKO-style clutter)
  - Minimal, confident nav (closer to Sierra Expediting's restraint than USKO's density)

## Global Navigation

**Header**: Logo · Home · Services · About · News · Careers ▾ (Drive For Us / Dispatch, Shop & Office) · Fleet Map (small, secondary) · Get a Quote · **Apply To Drive** (primary, locked CTA)
- Stays in view while scrolling (on phones it hides on scroll down and returns on scroll up); Careers panel drops from under the bar (Lucid-inspired)

**Footer**: Quick links (Services, About, News, Careers, Fleet Map) · Privacy Policy · Terms of Service · Driver FAQ · Socials / contact info
- Built so far: quick links + copyright. Legal pages, Driver FAQ and contact info are still to be defined.

## Pages

### 🏠 Homepage — `/`
- Intro (plays by itself, 6 seconds): a 5-second video of our truck on a desert highway → the shot ends on the trailer's side, held on the logo → our own logo fades in exactly over the painted one → the screen whitens as the logo turns to face you → it glides to the header's top-left corner as the page shows through. Scrolling, a tap, a scroll key or "Skip intro" jumps to the end; the header stays clickable throughout
- Headline (built, draft copy): "Freight that moves. A team that drives it." — the first thing on the page, directly under the nav
- Photo band (built, AI placeholder): a full-width 500px-tall photo of our truck on a desert highway, shown straight, below the headline — the intro plays over the top of the page and fades away to reveal it; repeat views show it straight away. B-roll video will replace the photo
- Audience split (built): flush light/dark halves — "Ship with us" / "Drive for us"
- Trust bar (built): 10+ years in business · 32M+ miles driven · 125,000+ loads completed · 48 states — numbers fill up on scroll. DOT/MC # and fleet size to add once the numbers are supplied
- Story band (built, draft copy): short company history + milestones on a full-bleed dark band; the whole band links to `/about` for the full story
- Services preview (Dry Van)
- "Why Drive With Us" teaser → links to `/careers/drivers`
- Testimonials / driver spotlight
- Quote CTA band

### 📦 Services — `/services`
- Dry Van & Truckload (FTL) — only offering shown
- Built as a data-driven list under the hood, so adding Reefer/Flatbed later is one entry, not a rebuild
- Copy shows Dry Van only — no "growing fleet" teaser language

### 📝 Get a Quote — `/quote`
- US map of the lower 48 (built): hover lifts a state, click pickup then delivery, a route line draws between them; Alaska and Hawaii left off
- Form next to it (built): pickup and delivery (state + city or ZIP — typing a ZIP lights up the map), weight, what's being shipped, name, company, email, phone
- Not connected to a backend yet

### 🗺️ Fleet Map — `/fleet-map` (formerly Track a Load)
- Public map of roughly where our trucks are, fed by Samsara and refreshed about hourly — part of our own site, not a broker portal; no load lookup, no login
- Approximate positions only, no load or driver details
- Linked from both main nav (small/utility styling) and footer

### 📰 News — `/news`
- Company news and updates — placeholder until the content source is decided

### 👥 Careers — `/careers`

**Drive For Us — `/careers/drivers`** (structure inspired by Sierra Expediting, trimmed to fit our scope)
1. Hero — built video/photo-agnostic (photo now, video can drop in later once produced)
2. Perks, benefits, equipment specs
3. Feature callout: real-time bonus tracking in the driver app (used in place of publishing per-mile pay rates)
4. 3 short benefit cards (not a long list)
5. Optional: short owner/leadership quote for warmth
6. Short qualification form — **5–6 questions only**, HR follows up directly (no online CDL doc upload / e-signature in this phase)
7. Trust badges: DOT/MC for now (room to add more later)
8. FAQ accordion at the bottom

**Non-Driving — `/careers/staff`**
- Dispatcher application — same short-form-then-HR-contact pattern
- Mechanic / office staff application — same pattern

### ℹ️ About — `/about`
- Story, team, fleet capabilities
- Safety record & compliance (DOT/MC numbers)

## Key Decisions Log

| Topic | Decision |
|---|---|
| Freight types | Dry Van only; services list built extensibly for future trailer types |
| Fleet Map (was Track a Load) | Roughly where our trucks are, refreshed about hourly; not a broker portal, no load lookup, no login |
| News | Added to the nav 2026-09-11; placeholder until the content source is decided |
| Get a Quote | Lower-48 state map + short form; map picks states, City/ZIP gives the exact place; no Alaska/Hawaii |
| Applications (all roles) | Uniform short form (5–6 Qs) → HR contacts applicant directly; no long online applications yet |
| Pay transparency | No public per-mile rates for now; lead with in-app bonus tracking as the differentiator |
| Hero media | Video planned but not required to start; component supports either |
| Trust badges | DOT/MC confirmed; other certifications (TSA/TWIC/hazmat/etc.) TBD |
| Stack | Next.js + Tailwind (consistent with existing fleet dashboard project) |
