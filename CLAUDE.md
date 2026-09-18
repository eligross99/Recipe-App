@AGENTS.md

# Recipe Manager + Meal Planner — Project Memory

> This file is loaded automatically at the start of every Claude Code session in
> this repo. It is the project's long-term memory: the brief a fresh session
> needs to be useful immediately. Keep it concise and high-signal — every line
> here is spent from the context window in every session.

## What we're building

A "CRM for your cooking life." Save recipes from anywhere, organize them by the
occasion you'd cook them for, and turn a collection into a scaled, shareable
shopping list.

The problem it solves: people save recipes for a "someday" occasion
(Thanksgiving, date night, summer BBQ) and never rediscover them when that
occasion actually arrives.

## MVP features

1. **Quick capture** — paste a URL (social post, YouTube, any recipe page); the
   app extracts title, ingredients, steps, and servings.
2. **Occasion collections** — tag recipes to occasions and browse by collection.
3. **Shopping list generator** — pick recipes + crowd size + dietary
   restrictions/allergies → one scaled, consolidated shopping list.
4. **Share collections** — a shareable link to a collection (e.g. your
   Thanksgiving repo).

## Tech stack

- **Next.js 16** (App Router, TypeScript) — frontend + API routes in one app.
- **Tailwind CSS v4** — styling.
- **Supabase** — database, auth, and sharing. *(not wired up yet)*
- **Anthropic Claude API** — URL extraction + shopping-list generation. *(not wired up yet)*
- **Vercel** — hosting and auto-deploy on push. *(not set up yet)*

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint

## Conventions

- App Router: routes/pages live in `app/`. Shared UI will go in a `components/`
  folder once we start building screens.
- TypeScript throughout; style with Tailwind utility classes (avoid separate CSS
  files unless truly needed).
- Import alias `@/` points at the project root.
- **Next.js 16 is newer than most training data** — heed `AGENTS.md` and check
  `node_modules/next/dist/docs/` before writing framework code.
- **Design system** ("editorial cookbook" look, in `app/globals.css`): warm
  cream background, near-black warm ink text, deep olive as the structural
  accent (headings/links). Three natural accent tones — terracotta / gold /
  olive — cycle across occasion tags and collection covers via
  `lib/theme.ts`'s `accentFor(seed)`, so the same occasion name always gets
  the same tone everywhere. Fraunces (serif, `font-display`) for headlines,
  recipe titles, and collection-cover initials; Geist (`font-sans`, default)
  for body/UI text. Meta text (servings, counts, form labels) is small,
  uppercase, tracked-out. Use the named Tailwind tokens (`bg-cream`,
  `text-ink`, `text-ink-soft`, `text-olive`, `bg-terracotta`, `bg-gold`,
  `border-border-warm`, etc.) rather than default Tailwind colors
  (amber/zinc/teal) so new screens stay visually consistent. No dark mode
  currently (removed the scaffold default rather than let it clash with the
  warm palette).
- **Recipe photos:** `Recipe.imageUrl` (optional) is a pasted photo link, no
  upload/storage yet. `components/CoverImage.tsx` renders it and falls back
  to a placeholder (leaf icon on recipe cards, a big serif initial on
  occasion covers) when there's no URL or the image fails to load — always
  use it instead of a bare `<img>` so failures degrade gracefully. Plain
  `<img>`, not `next/image`, since photos can come from any domain a person
  pastes a link from.
- **Recipe detail/edit:** `/recipes/[id]` is the read-only detail view (Edit
  + Delete buttons); `/recipes/[id]/edit` reuses `components/RecipeForm.tsx`
  (also used by `/recipes/new`) so add/edit stay in sync — only what happens
  on submit differs, passed in as `onSave`/`submitLabel`/`cancelHref` props.
  `RecipeCard` is a full-card link to the detail page: an absolutely
  positioned `<Link>` sits at z-0 behind the content, and the content
  wrapper is `pointer-events-none` so clicks fall through to it, except the
  Delete button and occasion tags which opt back in with
  `pointer-events-auto` so they keep their own behavior. Reuse this pattern
  for any future "card links somewhere, but has its own interactive bits"
  case rather than reinventing it.
- **Occasions are a first-class list**, not just derived from recipe tags:
  `lib/occasions.ts` (same reactive-store pattern as `lib/recipes.ts`) is
  the master list, so an occasion can exist with zero recipes (e.g. created
  via the "+ New occasion" button on `/occasions`). `components/
  OccasionPicker.tsx` is the tag combobox used by `RecipeForm` — search
  existing occasions or create a new one inline; selecting/creating always
  registers it in the master list. A one-time backfill
  (`backfillFromRecipeTags`) migrates occasion names off existing recipes
  into this list the first time either store is read, so this shipped
  without losing any tags recipes already had.
- **Animation:** `.animate-fade-up` (defined in `globals.css`) on each
  page's own root element for a subtle entrance — apply it to new pages too.
  Interactive elements get `transition` + a hover state (color/shadow/scale)
  and primary buttons get `active:scale-[0.97]` for tactile press feedback;
  keep it subtle, not applied to every small element.

## Current status (2026-09-18)

- Next.js app scaffolded. Working branch: `claude/fervent-hypatia-kuhll5`.
  PR #1 (scaffold + manual capture) merged to `main`; deployed on Vercel with
  auto-deploy on every push to `main`.
- **Built:**
  - Manual recipe capture. `lib/recipes.ts` is a swappable localStorage-backed
    reactive store (add/list/delete, `useSyncExternalStore`).
  - `components/RecipeCard.tsx` — shared card (used by home list + occasion
    pages) with clickable occasion tags.
  - Home list (`app/page.tsx`) and add form (`app/recipes/new/page.tsx`).
  - Occasion collections: `app/occasions/page.tsx` lists distinct occasion
    tags (derived from recipes, with counts); `app/occasions/[name]/page.tsx`
    shows recipes for one occasion. No separate occasion storage — tags
    *are* the collections.
  - Shared header/nav in `app/layout.tsx` (Occasions link + Add recipe).
  - Full visual restyle to the "editorial cookbook" design system (see
    Conventions above), applied to every existing screen: warm cream/olive/
    terracotta palette, Fraunces display font, gallery-grid layouts.
  - Recipe photos: optional `imageUrl` field, live preview on the add form,
    graceful fallback (leaf icon / serif initial) when absent or broken.
    Widened the accent palette to terracotta/gold/olive, cycled per
    occasion via `lib/theme.ts`.
  - Recipe detail view (`/recipes/[id]`) and edit (`/recipes/[id]/edit`),
    a shared `RecipeForm`, an occasion tag combobox (`OccasionPicker`) with
    search-existing-or-create-new, occasions promoted to their own stored
    list (`lib/occasions.ts`) with a "+ New occasion" button on
    `/occasions`, and an animation pass (page fade-ins, hover/press
    feedback) — see Conventions above for how each works.
  - Committed on the working branch, **not yet merged** — pending owner's
    visual sign-off before opening/merging the PR(s).
- **Next up (MVP features 1, 3, 4):** AI URL extraction (needs Anthropic key),
  shopping-list generator, sharing (needs Supabase).
- Accounts: GitHub OK · Vercel OK (deployed) · Supabase (owner checking) ·
  Anthropic Console (todo).

## Working style

This repo doubles as a hands-on Claude Code learning project for its owner, who
is new to coding. Explain changes clearly, take initiative on next steps, and
checkpoint often.
