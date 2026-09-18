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

export default function Home() {
  // Read recipes from our reactive localStorage store. React re-renders this
  // component automatically whenever the store changes (add / delete / another
  // tab), and the server render starts empty (no localStorage on the server).
  const recipes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (recipes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-white/60 p-10 text-center">
        <h1 className="text-xl font-semibold text-amber-900">No recipes yet</h1>
        <p className="mt-2 text-zinc-600">
          Save your first recipe and start building your collections.
        </p>
        <Link
          href="/recipes/new"
          className="mt-6 inline-block rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
        >
          + Add your first recipe
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-amber-900">Your recipes</h1>
        <span className="text-sm text-zinc-500">{recipes.length} saved</span>
      </div>

      <ul className="space-y-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onDelete={deleteRecipe} />
        ))}
      </ul>
    </div>
  );
}
