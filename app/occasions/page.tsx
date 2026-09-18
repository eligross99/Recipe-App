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
      <div className="rounded-2xl border border-dashed border-border-warm bg-surface/60 p-12 text-center">
        <h1 className="font-display text-2xl font-medium text-teal">
          No occasions yet
        </h1>
        <p className="mt-2 text-ink-soft">
          Tag a recipe with an occasion — like &ldquo;Thanksgiving&rdquo; or
          &ldquo;weeknight dinner&rdquo; — and it&apos;ll show up here as a
          collection.
        </p>
        <Link
          href="/recipes/new"
          className="mt-6 inline-block rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-deep"
        >
          + Add a recipe
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl font-medium text-teal">
        Occasions
      </h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {occasions.map(([occasion, count]) => (
          <li key={occasion}>
            <Link
              href={`/occasions/${encodeURIComponent(occasion)}`}
              className="block rounded-2xl border border-border-warm bg-surface p-5 shadow-sm shadow-black/[.02] transition-colors hover:border-terracotta"
            >
              <h2 className="font-display text-lg font-medium text-ink">
                {occasion}
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-soft">
                {count} {count === 1 ? "recipe" : "recipes"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
