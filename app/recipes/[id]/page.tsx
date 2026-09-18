"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { deleteRecipe, getRecipe, getServerSnapshot, getSnapshot, subscribe } from "@/lib/recipes";
import { accentFor } from "@/lib/theme";
import CoverImage from "@/components/CoverImage";
import { LeafIcon } from "@/components/icons";

export default function RecipeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const recipe = getRecipe(params.id);

  if (!recipe) {
    return (
      <div className="animate-fade-up rounded-2xl border border-dashed border-border-warm bg-surface/60 p-12 text-center">
        <p className="text-ink-soft">This recipe couldn&apos;t be found.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-medium text-terracotta transition-colors hover:text-terracotta-deep"
        >
          ← Back to your recipes
        </Link>
      </div>
    );
  }

  function handleDelete() {
    if (!recipe) return;
    deleteRecipe(recipe.id);
    router.push("/");
  }

  return (
    <div className="animate-fade-up">
      <Link
        href="/"
        className="text-xs font-medium uppercase tracking-wide text-terracotta transition-colors hover:text-terracotta-deep"
      >
        ← All recipes
      </Link>

      <div className="mt-3 overflow-hidden rounded-2xl border border-border-warm bg-surface shadow-sm shadow-black/[.02]">
        <CoverImage
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-72 w-full object-cover"
          fallback={
            <div className="flex h-72 w-full items-center justify-center bg-terracotta-soft/40">
              <LeafIcon className="h-14 w-14 text-terracotta-deep/50" />
            </div>
          }
        />

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-medium text-ink">
                {recipe.title}
              </h1>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-ink-soft">
                Serves {recipe.servings} · {recipe.ingredients.length} ingredients
                · {recipe.steps.length} steps
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="rounded-full bg-olive px-5 py-2 text-sm font-medium text-white transition hover:bg-olive-deep active:scale-[0.97]"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="rounded-full border border-border-warm px-5 py-2 text-sm font-medium text-ink-soft transition hover:border-terracotta hover:text-terracotta active:scale-[0.97]"
              >
                Delete
              </button>
            </div>
          </div>

          {recipe.occasions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {recipe.occasions.map((occasion) => {
                const accent = accentFor(occasion);
                return (
                  <Link
                    key={occasion}
                    href={`/occasions/${encodeURIComponent(occasion)}`}
                    className={`rounded-full px-3 py-0.5 text-xs font-medium transition-colors ${accent.tagBg} ${accent.tagText} ${accent.tagHover}`}
                  >
                    {occasion}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-display text-lg font-medium text-olive">
                Ingredients
              </h2>
              {recipe.ingredients.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-ink">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-ink-soft">None listed.</p>
              )}
            </div>
            <div>
              <h2 className="font-display text-lg font-medium text-olive">
                Steps
              </h2>
              {recipe.steps.length > 0 ? (
                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-ink">
                  {recipe.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="mt-2 text-sm text-ink-soft">None listed.</p>
              )}
            </div>
          </div>

          {recipe.sourceUrl && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-xs font-medium uppercase tracking-wide text-terracotta underline decoration-terracotta-soft underline-offset-2"
            >
              Original source ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
