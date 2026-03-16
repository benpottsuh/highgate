import { cocktails } from "./cocktails";
import { sections } from "./sections";
import { techniques } from "./techniques";
import type { Cocktail, SectionId, BaseSpirit } from "../types";

// ── Re-export raw data ──
export { cocktails, sections, techniques };

// ── Section lookup map (for O(1) access by id) ──
export const SECTIONS: Record<string, (typeof sections)[number]> = Object.fromEntries(
  sections.map((s) => [s.id, s])
);

// ── Cocktail lookups ──

export function getCocktailBySlug(slug: string): Cocktail | undefined {
  return cocktails.find((c) => c.slug === slug);
}

export function getCocktailsBySection(sectionId: SectionId): Cocktail[] {
  return cocktails.filter((c) => c.section === sectionId);
}

export interface CocktailFilters {
  search?: string;
  section?: SectionId | null;
  spirit?: BaseSpirit | null;
}

export function filterCocktails(filters: CocktailFilters): Cocktail[] {
  return cocktails.filter((c) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.name.toLowerCase().includes(q)) return false;
    }
    if (filters.section && c.section !== filters.section) return false;
    if (filters.spirit && c.spirit !== filters.spirit) return false;
    return true;
  });
}

// ── Section lookups ──

export function getSectionById(id: string) {
  return sections.find((s) => s.id === id);
}

// ── Technique lookups ──

export function getTechniqueById(id: string) {
  return techniques.find((t) => t.id === id);
}

// ── Unique values for filter chips ──

export function getUniqueSpirits(): BaseSpirit[] {
  return [...new Set(cocktails.map((c) => c.spirit))];
}
