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
  cream background, near-black warm ink text, deep teal as the structural
  accent (headings/links), terracotta as the one deliberate CTA/accent color.
  Fraunces (serif, `font-display`) for headlines and recipe titles; Geist
  (`font-sans`, default) for body/UI text. Meta text (servings, counts, form
  labels) is small, uppercase, tracked-out. Use the named Tailwind tokens
  (`bg-cream`, `text-ink`, `text-ink-soft`, `text-teal`, `bg-terracotta`,
  `border-border-warm`, etc.) rather than default Tailwind colors (amber/zinc)
  so new screens stay visually consistent. No dark mode currently (removed
  the scaffold default rather than let it clash with the warm palette).

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
    Conventions above), applied to every existing screen. Committed on the
    working branch, **not yet merged** — pending owner's visual sign-off
    before opening/merging the PR.
- **Next up (MVP features 1, 3, 4):** AI URL extraction (needs Anthropic key),
  shopping-list generator, sharing (needs Supabase).
- Accounts: GitHub OK · Vercel OK (deployed) · Supabase (owner checking) ·
  Anthropic Console (todo).

## Working style

This repo doubles as a hands-on Claude Code learning project for its owner, who
is new to coding. Explain changes clearly, take initiative on next steps, and
checkpoint often.
