import Link from "next/link";
import type { Recipe } from "@/lib/recipes";

type RecipeCardProps = {
  recipe: Recipe;
  onDelete?: (id: string) => void;
};

// Shared recipe card — used on the home list and every occasion collection
// page, so they always stay visually identical.
export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  return (
    <li className="rounded-2xl border border-border-warm bg-surface p-5 shadow-sm shadow-black/[.02]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-medium text-ink">
            {recipe.title}
          </h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-soft">
            Serves {recipe.servings} · {recipe.ingredients.length} ingredients
            · {recipe.steps.length} steps
          </p>
          {recipe.occasions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {recipe.occasions.map((occasion) => (
                <Link
                  key={occasion}
                  href={`/occasions/${encodeURIComponent(occasion)}`}
                  className="rounded-full border border-terracotta-soft bg-terracotta-soft px-3 py-0.5 text-xs font-medium text-terracotta-deep transition-colors hover:bg-terracotta hover:text-white"
                >
                  {occasion}
                </Link>
              ))}
            </div>
          )}
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(recipe.id)}
            className="shrink-0 text-xs font-medium uppercase tracking-wide text-ink-soft transition-colors hover:text-terracotta"
            aria-label={`Delete ${recipe.title}`}
          >
            Delete
          </button>
        )}
      </div>

      <details className="mt-4 border-t border-border-warm pt-3">
        <summary className="cursor-pointer text-sm font-medium text-teal transition-colors hover:text-teal-deep">
          View recipe
        </summary>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-sm font-medium text-teal">
              Ingredients
            </h3>
            {recipe.ingredients.length > 0 ? (
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-ink">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-sm text-ink-soft">None listed.</p>
            )}
          </div>
          <div>
            <h3 className="font-display text-sm font-medium text-teal">
              Steps
            </h3>
            {recipe.steps.length > 0 ? (
              <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-sm text-ink">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="mt-1.5 text-sm text-ink-soft">None listed.</p>
            )}
          </div>
        </div>
        {recipe.sourceUrl && (
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs font-medium uppercase tracking-wide text-terracotta underline decoration-terracotta-soft underline-offset-2"
          >
            Original source ↗
          </a>
        )}
      </details>
    </li>
  );
}
