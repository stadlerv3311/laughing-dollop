# ITrucking Solutions — Marketing Website

Public marketing and lead-generation website for ITrucking Solutions, a trucking company. Separate from the internal fleet/driver bonus app.

## What this is
A Next.js (App Router) + Tailwind + TypeScript site serving two audiences: shippers requesting a quote, and drivers/staff applying to join. Light, premium, and easy to use — especially for a driver looking for a job.

## Features
- Homepage hero video shows straight away on load — no wait, no white flash. The only thing that plays is a short logo moment: the header's logo fades in and settles into place over about a second, then the headline lights up right after
- Homepage safety band: what we haul and how we watch it (the services, GPS and dash cameras), with the numbers band between its two halves: 10+ years in business, 125K+ loads, 32M+ miles, 48 states, 99% on-time delivery — numbers fill up as it scrolls into view
- Homepage "Ship with us": a full black screen with one Get a quote button that opens into the site's only quote form (pickup ZIP, delivery ZIP, pickup date, name, phone or email) over a dot map of the lower 48 that lights the two states — built, not connected to a backend yet. Every Get a quote on the site opens it; `/quote` redirects there
- Homepage story band: short company history that links to the full story on the About page (draft copy for now)
- Homepage news block: the three newest posts — *draft posts only, so it is left out of a production build*
- Homepage "Why work with us" and a black Apply now screen: the careers half
- Services page (Dry Van today, extensible for future trailer types) — built; *draft copy, stand-in pictures*
- Fleet Map (roughly where our trucks are, refreshed about hourly, no login) — *real map, sample positions until the Samsara feed exists*
- News (company news and updates) — built; *draft posts only, so a production build shows a "being built" placeholder*
- Careers: a page for the three jobs (driver, dispatcher, tire and shop technician) and one short application for all of them, HR follows up directly — built; *sends to a stub until the backend exists*
- About: the company story down one line, with a picture for each stop — built; *draft copy, stand-in pictures*

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
- **docs/site-map.md** — the original page-by-page plan, kept for reference; no longer the current state

Docs are updated in the same commit as the code they describe — if something here looks stale, that's a bug, flag it.
