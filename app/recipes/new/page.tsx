"use client";

import { useRouter } from "next/navigation";
import { addRecipe } from "@/lib/recipes";
import RecipeForm from "@/components/RecipeForm";

export default function NewRecipePage() {
  const router = useRouter();

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-3xl font-medium text-olive">
        Add a recipe
      </h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Type it in for now — soon you&apos;ll be able to paste a link and let
        AI fill this out for you.
      </p>

      <RecipeForm
        submitLabel="Save recipe"
        cancelHref="/"
        onSave={(data) => {
          const recipe = addRecipe(data);
          router.push(`/recipes/${recipe.id}`);
        }}
      />
    </div>
  );
}
