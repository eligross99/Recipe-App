// The master list of known occasions (e.g. "Thanksgiving", "weeknight
// dinners"). Recipes reference occasions by name (Recipe.occasions:
// string[]), but this list is stored separately so an occasion can exist
// before any recipe is tagged with it — e.g. from the "+ New occasion"
// button on the Occasions page. Same reactive-localStorage-store pattern
// as lib/recipes.ts.

const STORAGE_KEY = "occasions";
const EMPTY: string[] = [];

let cache: string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();
let boundToStorageEvents = false;

function sortAlpha(names: string[]): string[] {
  return [...names].sort((a, b) => a.localeCompare(b));
}

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function save(names: string[]): void {
  cache = sortAlpha(names);
  loaded = true;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    } catch {
      // Storage may be unavailable. Ignore for now.
    }
  }
  emit();
}

export function subscribe(listener: () => void): () => void {
  if (!boundToStorageEvents && typeof window !== "undefined") {
    boundToStorageEvents = true;
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) {
        cache = sortAlpha(loadFromStorage());
        loaded = true;
        emit();
      }
    });
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): string[] {
  if (!loaded) {
    cache = sortAlpha(loadFromStorage());
    loaded = true;
  }
  return cache;
}

export function getServerSnapshot(): string[] {
  return EMPTY;
}

/**
 * Register an occasion if it's new (case-insensitive match against what's
 * already known). Returns the canonical stored name — the existing casing
 * if it was already known, so "thanksgiving" typed against an existing
 * "Thanksgiving" doesn't create a near-duplicate.
 */
export function addOccasion(name: string): string {
  const clean = name.trim();
  if (!clean) return clean;
  const existing = getSnapshot().find((o) => o.toLowerCase() === clean.toLowerCase());
  if (existing) return existing;
  save([...getSnapshot(), clean]);
  return clean;
}

/** Register several occasion names at once (used when a recipe is saved). */
export function addOccasions(names: string[]): void {
  const current = getSnapshot();
  const toAdd: string[] = [];
  for (const raw of names) {
    const clean = raw.trim();
    if (!clean) continue;
    const known =
      current.some((o) => o.toLowerCase() === clean.toLowerCase()) ||
      toAdd.some((o) => o.toLowerCase() === clean.toLowerCase());
    if (!known) toAdd.push(clean);
  }
  if (toAdd.length > 0) save([...current, ...toAdd]);
}

// ---- One-time migration ----
//
// This store didn't always exist — recipes saved before it shipped only
// have their occasion tags on the recipe itself, never registered here.
// Called from lib/recipes.ts (whenever recipes are read) and from
// OccasionPicker (so it's also correct on /recipes/new, which never reads
// the recipes store). Idempotent and cheap, safe to call from both places.
let backfilled = false;

export function backfillFromRecipeTags(recipeOccasionLists: string[][]): void {
  if (backfilled) return;
  backfilled = true;
  const names = new Set<string>();
  for (const list of recipeOccasionLists) {
    for (const name of list) names.add(name);
  }
  if (names.size > 0) addOccasions([...names]);
}
