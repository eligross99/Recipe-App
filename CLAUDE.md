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

## Current status (2026-09-17)

- Next.js app scaffolded. Working branch: `claude/fervent-hypatia-kuhll5`.
- No product features built yet. Next up: recipe data model + capture UI.
- Accounts: GitHub OK · Supabase (owner checking) · Anthropic Console (todo) ·
  Vercel (todo).

## Working style

This repo doubles as a hands-on Claude Code learning project for its owner, who
is new to coding. Explain changes clearly, take initiative on next steps, and
checkpoint often.
