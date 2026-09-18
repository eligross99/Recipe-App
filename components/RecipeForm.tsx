"use client";

import Link from "next/link";
import { useState } from "react";
import type { NewRecipe, Recipe } from "@/lib/recipes";
import CoverImage from "@/components/CoverImage";
import { LeafIcon } from "@/components/icons";
import OccasionPicker from "@/components/OccasionPicker";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border-warm bg-surface px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-olive focus:ring-2 focus:ring-olive/15";
const labelClass =
  "block text-xs font-medium uppercase tracking-wide text-ink-soft";

// Turn a textarea (one item per line) into a clean array, and back.
function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
function joinLines(values: string[]): string {
  return values.join("\n");
}

type RecipeFormProps = {
  /** Existing recipe to pre-fill, for editing. Omit for a blank/new form. */
  initial?: Recipe;
  onSave: (data: NewRecipe) => void;
  submitLabel: string;
  cancelHref: string;
};

// Shared by /recipes/new and /recipes/[id]/edit, so both stay in sync and
// behave identically — only what happens on submit (and where Cancel goes)
// differs between the two.
export default function RecipeForm({ initial, onSave, submitLabel, cancelHref }: RecipeFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [servings, setServings] = useState(String(initial?.servings ?? 4));
  const [sourceUrl, setSourceUrl] = useState(initial?.sourceUrl ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [ingredients, setIngredients] = useState(joinLines(initial?.ingredients ?? []));
  const [steps, setSteps] = useState(joinLines(initial?.steps ?? []));
  const [occasions, setOccasions] = useState<string[]>(initial?.occasions ?? []);
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Please give your recipe a title.");
      return;
    }

    onSave({
      title: cleanTitle,
      servings: Number(servings) || 1,
      sourceUrl: sourceUrl.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      ingredients: splitLines(ingredients),
      steps: splitLines(steps),
      occasions,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Grandma's apple pie"
          className={`${fieldClass} font-display text-base`}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="servings" className={labelClass}>
            Servings
          </label>
          <input
            id="servings"
            type="number"
            min={1}
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="sourceUrl" className={labelClass}>
            Source URL <span className="normal-case text-ink-soft/70">(optional)</span>
          </label>
          <input
            id="sourceUrl"
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://..."
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className={labelClass}>
          Photo URL <span className="normal-case text-ink-soft/70">(optional — paste a link to a photo)</span>
        </label>
        <div className="mt-1.5 flex items-center gap-4">
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={`${fieldClass} mt-0 flex-1`}
          />
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border-warm">
            <CoverImage
              src={imageUrl.trim() || undefined}
              alt="Preview"
              className="h-full w-full object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-terracotta-soft/40">
                  <LeafIcon className="h-5 w-5 text-terracotta-deep/50" />
                </div>
              }
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="ingredients" className={labelClass}>
          Ingredients <span className="normal-case text-ink-soft/70">(one per line)</span>
        </label>
        <textarea
          id="ingredients"
          rows={5}
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder={"2 cups flour\n1 tsp cinnamon\n6 apples, peeled and sliced"}
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="steps" className={labelClass}>
          Steps <span className="normal-case text-ink-soft/70">(one per line)</span>
        </label>
        <textarea
          id="steps"
          rows={5}
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder={"Preheat oven to 375°F\nMix filling\nBake 45 minutes"}
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Occasions <span className="normal-case text-ink-soft/70">(optional)</span>
        </label>
        <div className="mt-1.5">
          <OccasionPicker selected={occasions} onChange={setOccasions} />
        </div>
      </div>

      {error && <p className="text-sm text-terracotta-deep">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-medium text-white transition hover:bg-terracotta-deep active:scale-[0.97]"
        >
          {submitLabel}
        </button>
        <Link href={cancelHref} className="text-sm font-medium text-ink-soft transition-colors hover:text-ink">
          Cancel
        </Link>
      </div>
    </form>
  );
}
