"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getSnapshot as getRecipesSnapshot } from "@/lib/recipes";
import {
  addOccasion,
  backfillFromRecipeTags,
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/occasions";
import { accentFor } from "@/lib/theme";

type OccasionPickerProps = {
  selected: string[];
  onChange: (next: string[]) => void;
};

// A tag combobox: pick from occasions already used elsewhere, or type a new
// one and create it on the fly. Selecting or creating here registers the
// occasion in the shared list (lib/occasions.ts), so it shows up as a
// choice on every future recipe and on the Occasions page.
export default function OccasionPicker({ selected, onChange }: OccasionPickerProps) {
  // Belt-and-suspenders: this is the one place that needs the occasions
  // list correct even on a page (recipes/new) that never reads the
  // recipes store itself. See lib/occasions.ts for why.
  backfillFromRecipeTags(getRecipesSnapshot().map((recipe) => recipe.occasions));

  const allOccasions = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = (name: string) =>
    selected.some((s) => s.toLowerCase() === name.toLowerCase());

  const cleanQuery = query.trim();
  const filtered = allOccasions.filter(
    (o) => !isSelected(o) && o.toLowerCase().includes(cleanQuery.toLowerCase())
  );
  const exactMatch = allOccasions.some((o) => o.toLowerCase() === cleanQuery.toLowerCase());
  const canCreate = cleanQuery.length > 0 && !exactMatch && !isSelected(cleanQuery);

  function select(name: string) {
    if (!name || isSelected(name)) return;
    onChange([...selected, name]);
    setQuery("");
  }

  function createAndSelect(name: string) {
    select(addOccasion(name));
  }

  function remove(name: string) {
    onChange(selected.filter((s) => s !== name));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (filtered.length > 0) select(filtered[0]);
      else if (canCreate) createAndSelect(cleanQuery);
    } else if (event.key === "Backspace" && query === "" && selected.length > 0) {
      remove(selected[selected.length - 1]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setOpen(true)}
        className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border-warm bg-surface px-2.5 py-2 shadow-sm transition-colors focus-within:border-olive focus-within:ring-2 focus-within:ring-olive/15"
      >
        {selected.map((occasion) => {
          const accent = accentFor(occasion);
          return (
            <span
              key={occasion}
              className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${accent.tagBg} ${accent.tagText}`}
            >
              {occasion}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(occasion);
                }}
                aria-label={`Remove ${occasion}`}
                className="ml-0.5 leading-none opacity-60 transition-opacity hover:opacity-100"
              >
                ×
              </button>
            </span>
          );
        })}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? "Thanksgiving, weeknight dinners…" : "Add another…"}
          className="min-w-32 flex-1 bg-transparent py-0.5 text-sm text-ink outline-none placeholder:text-ink-soft/60"
        />
      </div>

      {open && (filtered.length > 0 || canCreate) && (
        <ul className="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-border-warm bg-surface py-1.5 shadow-md shadow-black/[.06]">
          {filtered.map((occasion) => (
            <li key={occasion}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(occasion);
                }}
                className="block w-full px-3.5 py-2 text-left text-sm text-ink transition-colors hover:bg-cream"
              >
                {occasion}
              </button>
            </li>
          ))}
          {canCreate && (
            <li>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  createAndSelect(cleanQuery);
                }}
                className="block w-full px-3.5 py-2 text-left text-sm font-medium text-terracotta transition-colors hover:bg-terracotta-soft/50"
              >
                + Create &ldquo;{cleanQuery}&rdquo;
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
