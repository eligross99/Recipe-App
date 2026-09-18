"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addRecipe } from "@/lib/recipes";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border-warm bg-surface px-3.5 py-2.5 text-sm text-ink shadow-sm outline-none placeholder:text-ink-soft/60 focus:border-teal focus:ring-2 focus:ring-teal/15";
const labelClass =
  "block text-xs font-medium uppercase tracking-wide text-ink-soft";

// Turn a textarea (one item per line) into a clean array.
function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function NewRecipePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [servings, setServings] = useState("4");
  const [sourceUrl, setSourceUrl] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [occasions, setOccasions] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Please give your recipe a title.");
      return;
    }

    addRecipe({
      title: cleanTitle,
      servings: Number(servings) || 1,
      sourceUrl: sourceUrl.trim() || undefined,
      ingredients: splitLines(ingredients),
      steps: splitLines(steps),
      occasions: occasions
        .split(",")
        .map((occasion) => occasion.trim())
        .filter(Boolean),
    });

    router.push("/");
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-medium text-teal">
        Add a recipe
      </h1>
      <p className="mt-1.5 text-sm text-ink-soft">
        Type it in for now — soon you&apos;ll be able to paste a link and let
        AI fill this out for you.
      </p>

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
          <label htmlFor="occasions" className={labelClass}>
            Occasions <span className="normal-case text-ink-soft/70">(comma-separated)</span>
          </label>
          <input
            id="occasions"
            value={occasions}
            onChange={(e) => setOccasions(e.target.value)}
            placeholder="Thanksgiving, fall, dessert"
            className={fieldClass}
          />
        </div>

        {error && <p className="text-sm text-terracotta-deep">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-deep"
          >
            Save recipe
          </button>
          <Link
            href="/"
            className="text-sm font-medium text-ink-soft hover:text-ink"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
