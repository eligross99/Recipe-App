"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/recipes";
import { accentFor } from "@/lib/theme";
import CoverImage from "@/components/CoverImage";
import { LeafIcon } from "@/components/icons";

export default function OccasionsPage() {
  const recipes = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Occasions aren't stored separately — they're derived from the tags on
  // each recipe. Group recipes per occasion so we can show a count and,
  // when one exists, a cover photo borrowed from a recipe in that occasion.
  const grouped = new Map<string, typeof recipes>();
  for (const recipe of recipes) {
    for (const occasion of recipe.occasions) {
      grouped.set(occasion, [...(grouped.get(occasion) ?? []), recipe]);
    }
  }
  const occasions = [...grouped.entries()]
    .map(([name, matches]) => ({
      name,
      count: matches.length,
      coverUrl: matches.find((r) => r.imageUrl)?.imageUrl,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  if (occasions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-warm bg-surface/60 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive-soft">
          <LeafIcon className="h-7 w-7 text-olive-deep/70" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-medium text-olive">
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
      <h1 className="font-display text-3xl font-medium text-olive">
        Occasions
      </h1>
      <ul className="grid gap-6 sm:grid-cols-2">
        {occasions.map((occasion) => {
          const accent = accentFor(occasion.name);
          return (
            <li key={occasion.name}>
              <Link
                href={`/occasions/${encodeURIComponent(occasion.name)}`}
                className="block overflow-hidden rounded-2xl border border-border-warm bg-surface shadow-sm shadow-black/[.02] transition-colors hover:border-terracotta"
              >
                <CoverImage
                  src={occasion.coverUrl}
                  alt=""
                  className="h-32 w-full object-cover"
                  fallback={
                    <div className={`flex h-32 w-full items-center justify-center ${accent.coverBg}`}>
                      <span className={`font-display text-4xl font-medium ${accent.coverText}`}>
                        {occasion.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  }
                />
                <div className="p-5">
                  <h2 className="font-display text-lg font-medium text-ink">
                    {occasion.name}
                  </h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-soft">
                    {occasion.count} {occasion.count === 1 ? "recipe" : "recipes"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
