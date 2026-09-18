"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  deleteRecipe,
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/recipes";

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
          <li
            key={recipe.id}
            className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold text-zinc-900">{recipe.title}</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Serves {recipe.servings} · {recipe.ingredients.length}{" "}
                  ingredients · {recipe.steps.length} steps
                </p>
                {recipe.occasions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {recipe.occasions.map((occasion) => (
                      <span
                        key={occasion}
                        className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
                      >
                        {occasion}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteRecipe(recipe.id)}
                className="shrink-0 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${recipe.title}`}
              >
                Delete
              </button>
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-amber-700">
                View recipe
              </summary>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Ingredients
                  </h3>
                  {recipe.ingredients.length > 0 ? (
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-zinc-700">
                      {recipe.ingredients.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm text-zinc-400">None listed.</p>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Steps
                  </h3>
                  {recipe.steps.length > 0 ? (
                    <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-sm text-zinc-700">
                      {recipe.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-1 text-sm text-zinc-400">None listed.</p>
                  )}
                </div>
              </div>
              {recipe.sourceUrl && (
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-medium text-amber-700 underline"
                >
                  Original source ↗
                </a>
              )}
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
