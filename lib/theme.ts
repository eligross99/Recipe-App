// Cycles occasion tags/covers through three natural accent tones
// (terracotta / gold / olive) instead of repeating one color everywhere.
// The same occasion name always maps to the same tone, so "Thanksgiving"
// looks the same on every tag and every card it appears on.

export type AccentTheme = {
  tagBg: string;
  tagText: string;
  tagHover: string;
  coverBg: string;
  coverText: string;
};

const THEMES: AccentTheme[] = [
  {
    tagBg: "bg-terracotta-soft",
    tagText: "text-terracotta-deep",
    tagHover: "hover:bg-terracotta hover:text-white",
    coverBg: "bg-terracotta-soft",
    coverText: "text-terracotta-deep",
  },
  {
    tagBg: "bg-gold-soft",
    tagText: "text-gold-deep",
    tagHover: "hover:bg-gold hover:text-white",
    coverBg: "bg-gold-soft",
    coverText: "text-gold-deep",
  },
  {
    tagBg: "bg-olive-soft",
    tagText: "text-olive-deep",
    tagHover: "hover:bg-olive hover:text-white",
    coverBg: "bg-olive-soft",
    coverText: "text-olive-deep",
  },
];

export function accentFor(seed: string): AccentTheme {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return THEMES[hash % THEMES.length];
}
