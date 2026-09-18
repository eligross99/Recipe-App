"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/recipes";

export default function OccasionsPage() {
  const recipes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Occasions aren't stored separately — they're derived from the tags on
  // each recipe. Count recipes per occasion, sorted most-used first.
  const counts = new Map<string, number>();
  for (const recipe of recipes) {
    for (const occasion of recipe.occasions) {
      counts.set(occasion, (counts.get(occasion) ?? 0) + 1);
    }
  }
  const occasions = [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );

  if (occasions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-white/60 p-10 text-center">
        <h1 className="text-xl font-semibold text-amber-900">
          No occasions yet
        </h1>
        <p className="mt-2 text-zinc-600">
          Tag a recipe with an occasion — like &ldquo;Thanksgiving&rdquo; or
          &ldquo;weeknight dinner&rdquo; — and it&apos;ll show up here as a
          collection.
        </p>
        <Link
          href="/recipes/new"
          className="mt-6 inline-block rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
        >
          + Add a recipe
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-amber-900">Occasions</h1>
      <ul className="grid gap-3 sm:grid-cols-2">
        {occasions.map(([occasion, count]) => (
          <li key={occasion}>
            <Link
              href={`/occasions/${encodeURIComponent(occasion)}`}
              className="block rounded-xl border border-amber-200 bg-white p-4 shadow-sm transition-colors hover:border-amber-400"
            >
              <h2 className="font-semibold text-zinc-900">{occasion}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {count} {count === 1 ? "recipe" : "recipes"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
