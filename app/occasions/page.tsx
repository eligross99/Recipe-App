"use client";

import Link from "next/link";
import { useState } from "react";
import { useSyncExternalStore } from "react";
import {
  getServerSnapshot as getRecipesServerSnapshot,
  getSnapshot as getRecipesSnapshot,
  subscribe as subscribeRecipes,
} from "@/lib/recipes";
import {
  addOccasion,
  getServerSnapshot as getOccasionsServerSnapshot,
  getSnapshot as getOccasionsSnapshot,
  subscribe as subscribeOccasions,
} from "@/lib/occasions";
import { accentFor } from "@/lib/theme";
import CoverImage from "@/components/CoverImage";
import { LeafIcon } from "@/components/icons";

export default function OccasionsPage() {
  // Reading the recipes store first ensures its one-time backfill (see
  // lib/recipes.ts / lib/occasions.ts) has already run before we read the
  // occasions list below, in the same render pass.
  const recipes = useSyncExternalStore(subscribeRecipes, getRecipesSnapshot, getRecipesServerSnapshot);
  const occasionNames = useSyncExternalStore(subscribeOccasions, getOccasionsSnapshot, getOccasionsServerSnapshot);

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const occasions = occasionNames
    .map((name) => {
      const matches = recipes.filter((recipe) => recipe.occasions.includes(name));
      return { name, count: matches.length, coverUrl: matches.find((r) => r.imageUrl)?.imageUrl };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    const clean = newName.trim();
    if (!clean) return;
    addOccasion(clean);
    setNewName("");
    setAdding(false);
  }

  const newOccasionForm = adding && (
    <form
      onSubmit={handleCreate}
      className="flex items-center gap-3 rounded-2xl border border-border-warm bg-surface p-4 shadow-sm"
    >
      <input
        autoFocus
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="e.g. Sunday brunch"
        className="flex-1 rounded-lg border border-border-warm bg-cream px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-olive focus:ring-2 focus:ring-olive/15"
      />
      <button
        type="submit"
        className="rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-white transition hover:bg-terracotta-deep active:scale-[0.97]"
      >
        Create
      </button>
      <button
        type="button"
        onClick={() => {
          setAdding(false);
          setNewName("");
        }}
        className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        Cancel
      </button>
    </form>
  );

  if (occasions.length === 0 && !adding) {
    return (
      <div className="animate-fade-up rounded-2xl border border-dashed border-border-warm bg-surface/60 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive-soft">
          <LeafIcon className="h-7 w-7 text-olive-deep/70" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-medium text-olive">
          No occasions yet
        </h1>
        <p className="mt-2 text-ink-soft">
          Tag a recipe with an occasion, or create one now — like
          &ldquo;Thanksgiving&rdquo; or &ldquo;weeknight dinner&rdquo;.
        </p>
        <button
          onClick={() => setAdding(true)}
          className="mt-6 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-white transition hover:bg-terracotta-deep active:scale-[0.97]"
        >
          + New occasion
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-medium text-olive">
          Occasions
        </h1>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="rounded-full border border-border-warm px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-terracotta hover:text-terracotta active:scale-[0.97]"
          >
            + New occasion
          </button>
        )}
      </div>

      {newOccasionForm}

      <ul className="grid gap-6 sm:grid-cols-2">
        {occasions.map((occasion) => {
          const accent = accentFor(occasion.name);
          return (
            <li key={occasion.name}>
              <Link
                href={`/occasions/${encodeURIComponent(occasion.name)}`}
                className="group block overflow-hidden rounded-2xl border border-border-warm bg-surface shadow-sm shadow-black/[.02] transition-shadow duration-200 hover:shadow-lg hover:shadow-black/[.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/50"
              >
                <div className="overflow-hidden">
                  <CoverImage
                    src={occasion.coverUrl}
                    alt=""
                    className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fallback={
                      <div className={`flex h-32 w-full items-center justify-center ${accent.coverBg}`}>
                        <span className={`font-display text-4xl font-medium ${accent.coverText}`}>
                          {occasion.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    }
                  />
                </div>
                <div className="p-5">
                  <h2 className="font-display text-lg font-medium text-ink transition-colors group-hover:text-terracotta-deep">
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
