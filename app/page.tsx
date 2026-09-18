"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  deleteRecipe,
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";
import { LeafIcon } from "@/components/icons";

export default function Home() {
  // Read recipes from our reactive localStorage store. React re-renders this
  // component automatically whenever the store changes (add / delete / another
  // tab), and the server render starts empty (no localStorage on the server).
  const recipes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (recipes.length === 0) {
    return (
      <div className="animate-fade-up rounded-2xl border border-dashed border-border-warm bg-surface/60 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-soft/60">
          <LeafIcon className="h-7 w-7 text-terracotta-deep/70" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-medium text-olive">
          No recipes yet
        </h1>
        <p className="mt-2 text-ink-soft">
          Save your first recipe and start building your collections.
        </p>
        <Link
          href="/recipes/new"
          className="mt-6 inline-block rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition hover:bg-terracotta-deep active:scale-[0.97]"
        >
          + Add your first recipe
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl font-medium text-olive">
          Your recipes
        </h1>
        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          {recipes.length} saved
        </span>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onDelete={deleteRecipe} />
        ))}
      </ul>
    </div>
  );
}
