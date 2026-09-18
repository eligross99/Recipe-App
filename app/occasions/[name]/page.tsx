"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/recipes";
import RecipeCard from "@/components/RecipeCard";

export default function OccasionPage() {
  const params = useParams<{ name: string }>();
  const occasion = decodeURIComponent(params.name);

  const recipes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const matches = recipes.filter((recipe) => recipe.occasions.includes(occasion));

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/occasions"
          className="text-xs font-medium uppercase tracking-wide text-terracotta hover:text-terracotta-deep"
        >
          ← All occasions
        </Link>
        <div className="mt-2 flex items-baseline justify-between">
          <h1 className="font-display text-3xl font-medium text-olive">
            {occasion}
          </h1>
          <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            {matches.length} {matches.length === 1 ? "recipe" : "recipes"}
          </span>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-warm bg-surface/60 p-12 text-center">
          <p className="text-ink-soft">
            No recipes tagged &ldquo;{occasion}&rdquo; (yet).
          </p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {matches.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      )}
    </div>
  );
}
