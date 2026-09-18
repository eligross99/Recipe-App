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
// page. The whole card links to the recipe's detail page; the Delete button
// and occasion tags are "islands" that opt back into their own click
// behavior (see the pointer-events comment below) rather than triggering
// that navigation.
export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  return (
    <li className="group relative overflow-hidden rounded-2xl border border-border-warm bg-surface shadow-sm shadow-black/[.02] transition-shadow duration-200 hover:shadow-lg hover:shadow-black/[.08]">
      {/* Full-card click target, underneath everything else (z-0). */}
      <Link
        href={`/recipes/${recipe.id}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/50"
        aria-label={`View ${recipe.title}`}
      />

      <div className="overflow-hidden">
        <CoverImage
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          fallback={
            <div className="flex h-48 w-full items-center justify-center bg-terracotta-soft/40">
              <LeafIcon className="h-10 w-10 text-terracotta-deep/50" />
            </div>
          }
        />
      </div>

      {/*
        pointer-events-none here makes clicks on this whole block (title,
        meta text, blank padding) pass straight through to the overlay Link
        above. The Delete button and tag links opt back in with
        pointer-events-auto so they keep their own click behavior instead.
      */}
      <div className="relative z-10 p-5 pointer-events-none">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-medium text-ink transition-colors group-hover:text-terracotta-deep">
              {recipe.title}
            </h2>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-soft">
              Serves {recipe.servings} · {recipe.ingredients.length} ingredients
              · {recipe.steps.length} steps
            </p>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(recipe.id)}
              className="pointer-events-auto shrink-0 text-xs font-medium uppercase tracking-wide text-ink-soft transition-colors hover:text-terracotta"
              aria-label={`Delete ${recipe.title}`}
            >
              Delete
            </button>
          )}
        </div>

        {recipe.occasions.length > 0 && (
          <div className="pointer-events-auto mt-3 flex flex-wrap gap-1.5">
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
      </div>
    </li>
  );
}
