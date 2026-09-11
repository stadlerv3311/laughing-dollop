# ITrucking Solutions — Marketing Website

Public marketing and lead-generation website for ITrucking Solutions, a trucking company. Separate from the internal fleet/driver bonus app.

## What this is
A Next.js (App Router) + Tailwind + TypeScript site serving two audiences: shippers requesting a quote, and drivers/staff applying to join. Light, premium, and easy to use — especially for a driver looking for a job.

## Features
- Homepage scroll intro: a 3D truck with our logo drives down a desert highway, the camera flies from an aerial around to the trailer's side, the truck drives off into the sunset, and the logo glides into the header
- Homepage top photo that takes the intro's place once it has played (temporary AI placeholder — B-roll video later)
- Homepage "Ship With Us" / "Drive For Us" panels
- Homepage numbers band: 10+ years in business, 32M+ miles driven, 125,000+ loads completed, 48 states — numbers fill up as it scrolls into view
- Homepage story card: short company history that links to the full story on the About page (draft copy for now)
- Services page (Dry Van today, extensible for future trailer types) — *placeholder*
- Request a Quote form — *placeholder*
- Track a Load (simple map view, no login) — *placeholder*
- Careers: Drive For Us + staff (dispatcher/mechanic/office) applications — short form, HR follows up directly — *placeholder*
- About (story, team, safety/compliance) — story section built with draft copy; team and safety still *placeholder*

## Setup
```bash
npm install
npm run dev
```
Then open http://localhost:3000.

Other scripts: `npm run build` (production build), `npm run lint`.

## Docs for this repo
- **CLAUDE.md** — rules for AI agents working on this repo
- **docs/ARCHITECTURE.md** — stack, folder structure, brand tokens, intro + header behavior, data model
- **docs/DECISIONS.md** — locked scope decisions and open items — check before adding anything new
- **docs/NAVIGATION.md** — map of the project: task → file, and the full component library
- **docs/site-map.md** — page-by-page plan

Docs are updated in the same commit as the code they describe — if something here looks stale, that's a bug, flag it.
