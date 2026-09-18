import Link from "next/link";
import type { Recipe } from "@/lib/recipes";
import { accentFor } from "@/lib/theme";
import CoverImage from "@/components/CoverImage";
import { LeafIcon } from "@/components/icons";

type RecipeCardProps = {
  recipe: Recipe;
  onDelete?: (id: string) => void;
};

// Shared recipe card — used on the home list and every occasion collection
// page, so they always stay visually identical.
export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  return (
    <li className="overflow-hidden rounded-2xl border border-border-warm bg-surface shadow-sm shadow-black/[.02]">
      <CoverImage
        src={recipe.imageUrl}
        alt={recipe.title}
        className="h-48 w-full object-cover"
        fallback={
          <div className="flex h-48 w-full items-center justify-center bg-terracotta-soft/40">
            <LeafIcon className="h-10 w-10 text-terracotta-deep/50" />
          </div>
        }
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-medium text-ink">
              {recipe.title}
            </h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-soft">
              Serves {recipe.servings} · {recipe.ingredients.length}{" "}
              ingredients · {recipe.steps.length} steps
            </p>
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

        {recipe.occasions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
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

        <details className="mt-4 border-t border-border-warm pt-3">
          <summary className="cursor-pointer text-sm font-medium text-olive transition-colors hover:text-olive-deep">
            View recipe
          </summary>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-sm font-medium text-olive">
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
              <h3 className="font-display text-sm font-medium text-olive">
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
      </div>
    </li>
  );
}
