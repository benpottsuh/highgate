import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import type { Cocktail, SpecItem, BatchRecipe, SectionId, BaseSpirit } from "../types";

interface DbCocktail {
  id: string;
  slug: string;
  name: string;
  section_id: string;
  spirit: string;
  style: string;
  tagline: string;
  flavor: string[];
  photo_url: string | null;
  video_url: string | null;
  overview: string;
  selling_points: string[];
  spec: SpecItem[];
  technique: string;
  glass: string;
  ice: string;
  garnish: string;
  cheat_sheet: string;
  cheat_sheet_spec: SpecItem[] | null;
  batch: BatchRecipe | null;
  prep: string[];
  prep_videos: Array<{ title: string; url: string }> | null;
}

function mapCocktail(row: DbCocktail): Cocktail {
  return {
    slug: row.slug,
    name: row.name,
    section: row.section_id as SectionId,
    spirit: row.spirit as BaseSpirit,
    style: row.style,
    tagline: row.tagline,
    flavor: row.flavor,
    photo: row.photo_url,
    video: row.video_url,
    overview: row.overview,
    selling: row.selling_points,
    spec: row.spec,
    technique: row.technique,
    glass: row.glass,
    ice: row.ice,
    garnish: row.garnish,
    cheatSheet: row.cheat_sheet,
    cheatSheetSpec: row.cheat_sheet_spec,
    batch: row.batch,
    prep: row.prep,
    prepVideos: row.prep_videos,
  };
}

export function useCocktails() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCocktails() {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("cocktails")
        .select(
          "id, slug, name, section_id, spirit, style, tagline, flavor, photo_url, video_url, overview, selling_points, spec, technique, glass, ice, garnish, cheat_sheet, cheat_sheet_spec, batch, prep, prep_videos"
        )
        .order("name");

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      setCocktails((data as DbCocktail[]).map(mapCocktail));
      setLoading(false);
    }

    fetchCocktails();
  }, []);

  function getCocktailBySlug(slug: string): Cocktail | undefined {
    return cocktails.find((c) => c.slug === slug);
  }

  function getCocktailsBySection(sectionId: SectionId): Cocktail[] {
    return cocktails.filter((c) => c.section === sectionId);
  }

  function filterCocktails(filters: {
    search?: string;
    section?: SectionId | null;
    spirit?: BaseSpirit | null;
  }): Cocktail[] {
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

  function getUniqueSpirits(): BaseSpirit[] {
    return [...new Set(cocktails.map((c) => c.spirit))];
  }

  return {
    cocktails,
    loading,
    error,
    getCocktailBySlug,
    getCocktailsBySection,
    filterCocktails,
    getUniqueSpirits,
  };
}
