"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { getRecipe, getServerSnapshot, getSnapshot, subscribe, updateRecipe } from "@/lib/recipes";
import RecipeForm from "@/components/RecipeForm";

export default function EditRecipePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // Subscribing to the store (rather than calling getRecipe once) means
  // this page re-renders correctly if the recipe changes elsewhere.
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

  return (
    <div className="animate-fade-up">
      <Link
        href={`/recipes/${recipe.id}`}
        className="text-xs font-medium uppercase tracking-wide text-terracotta transition-colors hover:text-terracotta-deep"
      >
        ← Cancel edit
      </Link>
      <h1 className="mt-2 font-display text-3xl font-medium text-olive">
        Edit recipe
      </h1>

      <RecipeForm
        initial={recipe}
        submitLabel="Save changes"
        cancelHref={`/recipes/${recipe.id}`}
        onSave={(data) => {
          updateRecipe(recipe.id, data);
          router.push(`/recipes/${recipe.id}`);
        }}
      />
    </div>
  );
}
