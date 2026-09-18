// The recipe data model + storage layer.
//
// This is the ONE file we swap when Supabase arrives: the UI only ever calls
// these functions, so replacing the localStorage guts with database calls
// leaves every screen working unchanged. Design the seam now, swap the engine
// later.
//
// It's written as a small reactive store so screens can read it with React's
// `useSyncExternalStore` — the supported way to read a browser store like
// localStorage without triggering render warnings.

import { addOccasions, backfillFromRecipeTags } from "@/lib/occasions";

export type Recipe = {
  id: string;
  title: string;
  servings: number;
  sourceUrl?: string;
  imageUrl?: string;
  ingredients: string[];
  steps: string[];
  occasions: string[];
  createdAt: number;
};

// What the "add recipe" form provides — id and timestamp are filled in here.
export type NewRecipe = Omit<Recipe, "id" | "createdAt">;

const STORAGE_KEY = "recipes";
const EMPTY: Recipe[] = [];

let cache: Recipe[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function sortNewestFirst(recipes: Recipe[]): Recipe[] {
  return [...recipes].sort((a, b) => b.createdAt - a.createdAt);
}

function loadFromStorage(): Recipe[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Recipe[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function save(recipes: Recipe[]): void {
  cache = sortNewestFirst(recipes);
  loaded = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // Storage may be unavailable (private mode, quota). Ignore for now.
    }
  }
  emit();
}

// ---- Reactive store API (consumed by useSyncExternalStore) ----

let boundToStorageEvents = false;

/** Register a listener; returns an unsubscribe function. */
export function subscribe(listener: () => void): () => void {
  // Keep other browser tabs in sync via the native `storage` event.
  if (!boundToStorageEvents && typeof window !== "undefined") {
    boundToStorageEvents = true;
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) {
        cache = sortNewestFirst(loadFromStorage());
        loaded = true;
        emit();
      }
    });
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Current recipes. Returns a stable reference until the data changes. */
export function getSnapshot(): Recipe[] {
  if (!loaded) {
    cache = sortNewestFirst(loadFromStorage());
    loaded = true;
    // First read of this store — make sure any occasion tags already on
    // these recipes are registered in the occasions master list too (see
    // lib/occasions.ts for why this migration is needed).
    backfillFromRecipeTags(cache.map((recipe) => recipe.occasions));
  }
  return cache;
}

/** The server has no localStorage, so it always starts empty. */
export function getServerSnapshot(): Recipe[] {
  return EMPTY;
}

/** A single recipe by id, or undefined if it doesn't exist (e.g. deleted,
 * or a stale link). */
export function getRecipe(id: string): Recipe | undefined {
  return getSnapshot().find((recipe) => recipe.id === id);
}

// ---- Mutations ----

/** Save a new recipe and return the stored record. */
export function addRecipe(input: NewRecipe): Recipe {
  const recipe: Recipe = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  save([...getSnapshot(), recipe]);
  addOccasions(recipe.occasions);
  return recipe;
}

/** Replace an existing recipe's fields (keeping its id and createdAt).
 * Returns the updated record, or undefined if the id doesn't exist. */
export function updateRecipe(id: string, input: NewRecipe): Recipe | undefined {
  const current = getSnapshot();
  const index = current.findIndex((recipe) => recipe.id === id);
  if (index === -1) return undefined;

  const updated: Recipe = { ...current[index], ...input };
  const next = [...current];
  next[index] = updated;
  save(next);
  addOccasions(updated.occasions);
  return updated;
}

/** Remove a recipe by id. */
export function deleteRecipe(id: string): void {
  save(getSnapshot().filter((recipe) => recipe.id !== id));
}
