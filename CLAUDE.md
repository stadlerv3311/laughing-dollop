# CLAUDE.md
> Standing rules for Claude Code on this project. Read first, every session.

@AGENTS.md

Project: ITrucking Solutions — marketing & lead-gen website
Stack: Next.js (App Router) + Tailwind CSS + TypeScript

## 1. Doc map
| If you're about to... | Read first |
|---|---|
| Build or edit a page | docs/ARCHITECTURE.md, then docs/NAVIGATION.md |
| Add a form field, nav item, or anything touching scope | docs/DECISIONS.md — check it isn't already ruled out |
| Touch colors, spacing, or visual tone | docs/ARCHITECTURE.md → Brand / design tokens |
| Unsure where something lives | docs/NAVIGATION.md (task → file map + component library) |

## 2. Where new information goes
| Fact type | Goes in |
|---|---|
| A locked scope choice ("this page will/won't do X") | DECISIONS.md |
| Folder structure, stack, brand tokens, data shapes | ARCHITECTURE.md |
| A page/file location pointer | NAVIGATION.md |
| Product purpose / feature list for humans | README.md |
| A one-off implementation note for this specific change | Commit message — not a doc |

## 3. Do not silently expand scope
This is a narrow, deliberately scoped site. DECISIONS.md exists because several choices are easy to "helpfully" undo — no login on Fleet Map, short applications only, Dry Van only, no public pay rates, minimal nav. Before adding anything not covered in DECISIONS.md or ARCHITECTURE.md, stop and flag it rather than building it.

## 4. Task format
```
TASK:
CONTEXT:
CONSTRAINTS:
STEPS:
OUTPUT:
DONE WHEN:
```
Flag missing inputs or ambiguity instead of guessing — especially anything touching DECISIONS.md's open items (form backend, additional trust badges).

## 5. Update discipline
Update DECISIONS.md or ARCHITECTURE.md in the same commit as the code change they describe. Don't defer doc updates to "later."
