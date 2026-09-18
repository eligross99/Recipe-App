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
    <div className="space-y-4">
      <div>
        <Link
          href="/occasions"
          className="text-sm font-medium text-amber-700 hover:underline"
        >
          ← All occasions
        </Link>
        <div className="mt-1 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-amber-900">{occasion}</h1>
          <span className="text-sm text-zinc-500">
            {matches.length} {matches.length === 1 ? "recipe" : "recipes"}
          </span>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-amber-300 bg-white/60 p-10 text-center">
          <p className="text-zinc-600">
            No recipes tagged &ldquo;{occasion}&rdquo; (yet).
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {matches.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </ul>
      )}
    </div>
  );
}
