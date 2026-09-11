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

**Header**: Logo · Home · Services · About · Careers ▾ (Drive For Us / Dispatch, Shop & Office) · Track a Load (small, secondary) · Get a Quote · **Apply To Drive** (primary, locked CTA)
- Hides on scroll down, returns on scroll up; Careers panel drops from under the bar (Lucid-inspired)

**Footer**: Quick links (Services, About, Careers, Track a Load) · Privacy Policy · Terms of Service · Driver FAQ · Socials / contact info
- Built so far: quick links + copyright. Legal pages, Driver FAQ and contact info are still to be defined.

## Pages

### 🏠 Homepage — `/`
- Scroll intro: 3D truck with the logo on a highway → camera swings from above to the trailer's side → screen whitens → logo glides to the header's top-left corner
- Hero: dual CTA panels — "Ship With Us" / "Drive For Us"
- Trust bar: DOT/MC #, years in business, fleet size
- Services preview (Dry Van)
- "Why Drive With Us" teaser → links to `/careers/drivers`
- Testimonials / driver spotlight
- Quote CTA band

### 📦 Services — `/services`
- Dry Van & Truckload (FTL) — only offering shown
- Built as a data-driven list under the hood, so adding Reefer/Flatbed later is one entry, not a rebuild
- Copy shows Dry Van only — no "growing fleet" teaser language

### 📝 Request a Quote — `/quote`
- Fields: origin, destination, weight, freight type, contact info

### 🗺️ Track a Load — `/track`
- Simple Samsara-fed map view — secondary utility, not a broker portal, no login
- Linked from both main nav (small/utility styling) and footer

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
| Track a Load | Simple map view, not a broker portal; no login required |
| Applications (all roles) | Uniform short form (5–6 Qs) → HR contacts applicant directly; no long online applications yet |
| Pay transparency | No public per-mile rates for now; lead with in-app bonus tracking as the differentiator |
| Hero media | Video planned but not required to start; component supports either |
| Trust badges | DOT/MC confirmed; other certifications (TSA/TWIC/hazmat/etc.) TBD |
| Stack | Next.js + Tailwind (consistent with existing fleet dashboard project) |
