"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addRecipe } from "@/lib/recipes";

const fieldClass =
  "mt-1 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200";
const labelClass = "block text-sm font-medium text-zinc-700";

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
      <h1 className="text-2xl font-bold text-amber-900">Add a recipe</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Type it in for now — soon you&apos;ll be able to paste a link and let AI
        fill this out for you.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Grandma's apple pie"
            className={fieldClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
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
              Source URL <span className="text-zinc-400">(optional)</span>
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
            Ingredients <span className="text-zinc-400">(one per line)</span>
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
            Steps <span className="text-zinc-400">(one per line)</span>
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
            Occasions <span className="text-zinc-400">(comma-separated)</span>
          </label>
          <input
            id="occasions"
            value={occasions}
            onChange={(e) => setOccasions(e.target.value)}
            placeholder="Thanksgiving, fall, dessert"
            className={fieldClass}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
          >
            Save recipe
          </button>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
