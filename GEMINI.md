# Highgate Cocktail Academy — Project Intelligence File
# For Google Antigravity IDE (GEMINI.md)
# Owner: Ben Potts | Unfiltered Hospitality LLC
# Last updated: March 2026

---

## Project Overview

Highgate Cocktail Academy is a **read-only reference app** for bartenders at a single venue. It gives staff instant access to cocktail recipes, preparation techniques, and training standards. There is no login, testing, or scoring — it's a pure reference tool.

A separate **Admin CMS** (at `/admin`) lets managers add, edit, and publish cocktails, sections, and techniques directly in the browser.

**Stack:** React 19 + TypeScript + Vite + Supabase (Database + Storage) + Vanilla CSS (`index.css`)

**Styling:** Custom CSS variables in `src/index.css` — no Tailwind utility classes. All UI uses a dark charcoal theme with per-section accent colors.

**Deployment:** Vercel. Production on `main` branch at the Highgate domain (see Vercel dashboard for URL).

**Business model:** Internal tool for a single client venue. No auth, no billing, no multi-tenancy.

---

## Task Complexity Protocol (Always Enforced)

Every task MUST be classified before any code is written:

### Simple Task (1-2 files, UI-only, no DB)
- Proceed directly. Write your understanding, get confirmation, implement.
- Examples: color tweak, copy edit, reordering UI elements, adding a CSS animation.

### Medium Task (3-5 files, frontend logic, hooks, no migrations)
- Run a **discovery pass first**: read all files you plan to touch, list what you found, then propose your plan.
- Wait for confirmation before implementing.
- Examples: new component + hook, restructuring a page, wiring Supabase data to a new UI.

### Complex Task (6+ files, Supabase schema changes, multi-layer)
- **Mandatory read-only discovery task.** Before ANY implementation:
  1. Read every file in the affected surface area.
  2. List each file, what it does, and how it connects to other files.
  3. Flag any conflicts, stale patterns, or surprises.
  4. Propose the minimal implementation plan with exact file list.
  5. **STOP. Do not write code.** Wait for explicit approval.
- After approval, implement in the smallest possible phases (1-3 files per phase).
- Examples: PWA setup, adding auth, new DB table + hooks + UI.

### Classification Prompt
At the start of every task, output this before doing anything else:

```
TASK CLASSIFICATION: [Simple / Medium / Complex]
REASON: [one sentence]
FILES IN SCOPE: [list]
DISCOVERY REQUIRED: [Yes / No]
```

If you're unsure, classify UP (Medium → Complex).

---

## Institutional Knowledge Rules (Always Enforced)

This GEMINI.md is the agent's long-term memory for Highgate. It MUST be kept current.

### End-of-Task Review (ALWAYS — No Exceptions)

At the end of **every completed task**, before suggesting `/commit`, the agent MUST check if GEMINI.md needs an update.

**What to look for:**
- New hooks, components, or data files that should be listed
- New patterns or conventions introduced
- Anti-patterns or bugs discovered
- Changes to how data is structured or fetched
- Corrections to existing documentation that turned out to be wrong

**Output format — always use this:**

```
📝 GEMINI.md REVIEW:
- [Update needed / No update needed]
- [If update needed: Section → What to add or change]
```

### After Every Completed Feature
Output a **Changelog Entry** the user can paste into the Completed Milestones section:

```
CHANGELOG ENTRY:
- [Feature name] ([key files created/modified])
```

---

## Architecture Rules (Always Enforced)

- **Supabase is the only backend.** Never introduce Express, Firebase, or another database layer.
- **Database operations go through custom hooks in `src/hooks/`.** Hooks call Supabase directly using the client from `src/integrations/supabase/client.ts`. There is no separate API layer — do not create one.
- **No auth system.** The bartender-facing app is fully public. The admin area (`/admin`) is unprotected by code — it relies on obscurity for now (future: add password protection when the client requests it).
- **No Tailwind utilities.** All styling uses custom CSS classes defined in `src/index.css`. Never add Tailwind utility classes to components.
- **Supabase Edge Functions** handle any server-side logic that shouldn't run in the browser. Edge Functions live in `supabase/functions/`.
- React Query or `useState`/`useEffect` for data fetching — check existing hooks for the established pattern before introducing React Query if it's not already in use.
- When modifying any table access pattern, check if a Row Level Security (RLS) policy needs to be created or updated.

---

## Code Style Rules (Always Enforced)

- All React components MUST be functional components using hooks. Never use class components.
- TypeScript strict mode is required. Every component prop must have a defined interface.
- File naming: components use PascalCase (`CocktailCard.tsx`), utilities use camelCase (`formatSlug.ts`).
- Imports: group in this order — (1) React/library imports, (2) component imports, (3) utility/hook imports, (4) type imports. Separate groups with a blank line.
- Prefer `const` over `let`. Never use `var`.
- Use early returns to reduce nesting. Max nesting depth: 3 levels.
- All user-facing strings should be plain English, not abbreviations.
- CSS class naming: use kebab-case. Follow the naming pattern already established in `index.css`.

### No Magic Numbers
- Extract unexplained numbers into named constants: `const MAX_ITEMS = 20`.
- Color values are defined as CSS variables in `index.css` — reference those, never hardcode hex values in components.

### Supabase Query Rules
- Always select specific columns: `.select('id, name, slug')`, not `.select('*')`.
- Always add `.limit()` on list queries unless you genuinely need every row.
- Use `Promise.all()` when making multiple independent Supabase queries.

---

## Agent Behavior Rules (Always Enforced)

### Nicknames & Shorthand

| Nickname | Refers To |
|---|---|
| **Tony** / **tony** | This agent (Google Antigravity / Gemini) |
| **Pedro** / **pedro** | Ben's separate Perplexity instance used for planning |

When Ben says "ask Pedro" or "Pedro suggested X," he's referencing decisions made in his external planning environment. Evaluate critically — if it isn't great, push back.

### Context & Background

I (Ben) am a non-technical founder who builds with AI assistance. I understand React concepts, component architecture, and Supabase basics at a high level, but I don't write code manually. Explain technical decisions clearly when you make them. If something could break existing functionality, flag it explicitly before proceeding.

### Visual & Functional Change Review (Human-in-the-Loop)

Any change that alters **visible UI** or **user-facing behavior** requires human review at two checkpoints:

**1. Before implementing:** Describe the proposed change — what it looks like now → what it will look like after. Wait for explicit approval before writing code. This applies even for Simple-classified tasks.

**2. After implementing:** Present the changes for review (screenshot via browser tool, or before → after description). Do not proceed to the next task until the user confirms.

**What counts as "visible/functional":**
- Layout, color, spacing, typography changes
- New or removed UI elements
- Changed behavior (click targets, navigation, data display)
- Animation or transition changes

**What does NOT require this gate:**
- Refactors with zero visual output change
- Backend-only changes (migrations, hooks with no UI delta)
- Build/config changes

### Before Writing Any Code
- Write 2-3 sentences explaining your understanding of the problem and your planned approach.
- Wait for confirmation on anything ambiguous.
- Never auto-approve plans — always present the plan and wait for review.

### Other Rules
- Never run `git push`, `git rebase`, `git reset --hard`, or `git force push`. Only run `git commit` after the user confirms the diff.
- Never delete files without asking first.
- Never install new npm packages without asking first and explaining why the package is needed.
- Prefer small, focused commits over large multi-feature commits.

---

## Research Protocol (Always Enforced)

When unsure about external API behavior, best practices, or library usage, MUST research before answering. Use the cheapest tool that can answer the question:

| Priority | Tool | When to Use |
|---|---|---|
| 1 | Codebase + training data | Already know the answer with 95%+ confidence |
| 2 | `Context7 MCP` | Library/framework docs lookup (React, Supabase, Vite) |
| 3 | `search_web` (built-in) | Quick fact lookup |
| 4 | `perplexity_ask` | Simple question needing AI synthesis |
| 5 | `perplexity_reason` | Complex analysis or step-by-step logic |

---

## Database: Supabase Schema

### Tables

| Table | Purpose | Key Fields |
|---|---|---|
| `cocktails` | Full cocktail recipes | `id`, `slug`, `name`, `section_id`, `ingredients`, `build_order`, `glassware`, `garnish`, `image_url`, `published` |
| `sections` | Menu sections (e.g., "Classics", "Signatures") | `id`, `name`, `description`, `accent_color`, `image_url` |
| `techniques` | Preparation techniques (e.g., shaking, stirring) | `id`, `slug`, `name`, `description`, `video_url`, `image_url` |

### Supabase Safety Rules

1. **Read-first, write-never (by default).** Use `execute_sql` for SELECT queries freely via MCP. Never run INSERT, UPDATE, DELETE, DROP via MCP without explicit user approval — those go through migration files or the Admin UI.
2. **Migrations go through files.** Write migration SQL to `supabase/migrations/` for a version-controlled record.
3. **All new tables MUST have RLS enabled.** No exceptions.
4. Every RLS policy must be explained in a comment above it.
5. **Wrap `auth.uid()` in a subselect in RLS policies** to prevent per-row evaluation:
   ```sql
   -- ✅ FAST — evaluated once
   USING (user_id = (SELECT auth.uid()));
   ```

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx              # Main bartender-facing layout (header + bottom nav)
│   ├── AdminLayout.tsx         # Admin CMS layout
│   ├── BottomNav.tsx           # Bottom nav for bartender-facing app
│   ├── CocktailCard.tsx        # Cocktail card used on listing pages
│   ├── admin/                  # Admin-specific components
│   └── icons/                  # SVG icon components
├── pages/               # Route-level page components
│   ├── Home.tsx                # Landing page — section tiles + featured
│   ├── Cocktails.tsx           # Full cocktail listing
│   ├── CocktailDetail.tsx      # Single cocktail — recipe, build order, cheat sheet
│   ├── SectionOverview.tsx     # Section-filtered cocktail listing
│   ├── Techniques.tsx          # Techniques listing
│   ├── TechniqueDetail.tsx     # Single technique — video + description
│   ├── Favorites.tsx           # Saved favorites (client-side)
│   └── admin/                  # Admin CMS pages (Dashboard, CRUD editors)
├── hooks/               # Custom React hooks (all DB operations go here)
│   ├── useCocktails.ts         # Cocktail CRUD + Supabase queries
│   ├── useSections.ts          # Section CRUD + Supabase queries
│   └── useTechniques.ts        # Technique CRUD + Supabase queries
├── data/                # Local seed/fallback data
│   ├── cocktails.ts            # Cocktail seed data
│   ├── sections.ts             # Section seed data (includes accent colors)
│   ├── techniques.ts           # Technique seed data
│   └── index.ts                # Re-exports
├── integrations/
│   └── supabase/
│       └── client.ts    # Supabase client initialization (single instance)
├── types/               # TypeScript interfaces
├── assets/              # Static assets (images, fonts)
├── index.css            # ALL styling — CSS variables, global styles, component classes
└── App.tsx              # Route definitions
```

### Route Map

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | Section tiles + featured cocktails |
| `/cocktails` | `Cocktails` | Full cocktail listing |
| `/cocktails/:slug` | `CocktailDetail` | Recipe, build order, cheat sheet, garnish |
| `/sections/:id` | `SectionOverview` | Filtered view by section |
| `/techniques` | `Techniques` | Techniques listing |
| `/techniques/:id` | `TechniqueDetail` | Video + description for a single technique |
| `/favorites` | `Favorites` | Client-side saved cocktails |
| `/admin` | `AdminDashboard` | Admin CMS entry point |
| `/admin/cocktails` | `AdminCocktails` | Cocktail list with edit/delete |
| `/admin/cocktails/:slug` | `AdminCocktailEdit` | Edit a single cocktail |
| `/admin/sections` | `AdminSections` | Section list |
| `/admin/sections/:id` | `AdminSectionEdit` | Edit a single section |
| `/admin/techniques` | `AdminTechniques` | Techniques list |
| `/admin/techniques/:id` | `AdminTechniqueEdit` | Edit a single technique |

---

## Design Rules (Always Enforced)

### Visual Identity
- **Always dark.** Dark charcoal theme is the ONLY theme. All new UI uses dark backgrounds. CSS variable: `--color-bg` (charcoal, ~`#1a1a1a`).
- **Per-section accent colors** are defined in `src/data/sections.ts` and applied via CSS variables. New sections must include an accent color.
- **Typography:** Jost (display/headings), Libre Baskerville (body/detail), Oswald (labels/caps). Use the established CSS variables — do not introduce new fonts without asking.
- **Mobile-first.** Design for thumb-zone navigation on phones. Most bartenders will use this on iOS/Android.

### CSS Rules
- **All styling goes in `index.css`.** Do not use inline `style={{}}` props except for dynamic values (e.g., a dynamic `color` or `background` from data). Even then, prefer CSS custom properties passed via `style={{ '--accent': color }}`.
- **Never use Tailwind utility classes.** This project uses custom CSS classes defined in `index.css`.
- Class names use kebab-case: `.cocktail-card`, `.technique-hero`, `.bottom-nav`.

### Video Embedding Rules
- Vimeo videos: render as `<iframe>` with `src="https://player.vimeo.com/video/[ID]"`, `allowFullScreen`, no border, correct aspect ratio wrapper.
- Native videos (Supabase Storage URL): render as `<video>` tag with `controls`, `playsInline`, `preload="metadata"`.
- Check the `video_url` field: if it contains `vimeo.com`, use iframe; otherwise use `<video>` tag.
- See `TechniqueDetail.tsx` for the reference implementation.

### Anti-Generic-AI Rules
- No purple gradients, no light-mode cards, no Inter/Roboto fallback fonts.
- No cookie-cutter card layouts — reference existing cards (`CocktailCard.tsx`) before building new ones.
- Match existing components exactly: same padding scale, same border colors, same text sizes.

---

## Workflow Handoff Rules (Always Enforced)

Proactively suggest the right action at the right time:

| Trigger | What to Say |
|---|---|
| After completing any code changes | "Ready to commit? You can type `/commit`." |
| After editing `.ts` or `.tsx` files (before committing) | "Want to run a type check first? Type `/typecheck`." |
| Before deployment or after large changes | "Let me run a build to make sure everything compiles — type `/build`." |

### Commit Flow

When the user confirms a commit (e.g., "do it", "yes", "go ahead"), **proceed immediately** — stage, commit, and push using the suggested message. Do not ask for a second confirmation.

### Conversation Closing Protocol

After a successful commit, end the conversation with:

```
🏁 THIS CONVO IS OVER — ONLY REOPEN IF NEEDED
```

The user will manually rename the conversation to `DONE: [subject]`.

### Conversation Lifecycle

**Suggest a new conversation when:**
- The committed feature is complete and the next task is unrelated
- The conversation has 15+ back-and-forth exchanges
- The user is switching to a different feature area

**Continue the same conversation when:**
- The user is iterating on the same uncommitted feature
- The follow-up is tightly coupled to what was just committed

---

## Pre-Commit Checklist (Always Enforced)

Before suggesting `/commit`, run through this checklist IN ORDER:

| # | Check | Command | Blocks Commit? |
|---|---|---|---|
| 1 | Build | `npm run build` | Yes — any error |
| 2 | Types | `npx tsc --noEmit` | Yes — any error |
| 3 | Security scan | Grep for `console.log`, hardcoded keys, `.env` values | Yes — any secret or debug code |
| 4 | Diff review | List all changed files. Flag anything outside task scope. | Yes — unexpected scope |

---

## Development Roadmap

### Completed Milestones
- Initial project scaffolding (React 19 + Vite + TypeScript + Vanilla CSS)
- Dark charcoal theme + per-section accent colors
- Jost / Libre Baskerville / Oswald typography (Google Fonts)
- Cocktail listing + detail pages with recipe, build order, cheat sheet card
- Section overview pages with filtered cocktail listing
- Techniques listing + detail pages
- Admin CMS for cocktails, sections, and techniques (full CRUD)
- Supabase integration for all data (cocktails, sections, techniques tables)
- Vercel deployment + custom domain setup
- Vimeo iframe embed support in TechniqueDetail (vs. native video for Supabase-hosted videos)
- Cheat Sheet card moved above recipe on CocktailDetail page

### Upcoming Features

**PWA (Progressive Web App)**
- Goal: Let bartenders "Add to Home Screen" — app feels native on iOS/Android, no browser chrome.
- Work needed: Add `vite-plugin-pwa`, create `manifest.json`, configure service worker.
- Estimated effort: Small (~2-3 hours). No DB changes needed.
- Why: Bartenders use this on their phones while working. Native feel = better adoption.

**Authentication / Password Protection for Admin**
- Goal: Protect the `/admin` route so only managers can access the CMS.
- Current state: Admin is publicly accessible at `/admin` (relies on obscurity).
- Options: (1) Supabase Auth with a single shared password, (2) simple env-var PIN gate.
- Defer until client requests it.

**Favorites / Bookmarking**
- Goal: Let bartenders save cocktails to a favorites list.
- Current state: `/favorites` route exists but is a placeholder — no persistence.
- Work needed: Decide on storage (localStorage vs. Supabase). Implement save/unsave on CocktailDetail.

**Search**
- Goal: Full-text search across cocktail names, ingredients, and sections.
- Work needed: Search bar in nav, filter/search hook, results page or inline filtering.

**Offline Support**
- Goal: App works without internet (useful in basement bars with no signal).
- Dependency: PWA must be set up first. Then configure Workbox to cache Supabase reads.

---

## What NOT to Do

- Do not use `any` type. If the type is truly unknown, use `unknown` and narrow it.
- Do not use inline styles for static values — put them in `index.css`.
- Do not use Tailwind utility classes — this project uses custom CSS.
- Do not store secrets or API keys in frontend code or commit `.env` files.
- Do not use `console.log` in committed code — remove before commit.
- Do not auto-approve plans — always present the plan and wait for review.
- Do not create a `src/lib/api/` directory — database operations go through hooks in `src/hooks/`.
- Do not create additional Supabase client instances — use `src/integrations/supabase/client.ts` exclusively.
- Do not write RLS policies with bare `auth.uid()` — always wrap in a subselect: `(SELECT auth.uid())`.
- Do not add new fonts without asking — Jost, Libre Baskerville, and Oswald are the established type stack.
- Do not use `<div onClick>` for interactive elements — use `<button>` or `<a>`.
