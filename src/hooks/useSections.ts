import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import type { Section, SectionId } from "../types";

interface DbSection {
  id: string;
  name: string;
  accent: string;
  bg: string;
  description: string;
  sort_order: number;
}

function mapSection(row: DbSection): Section {
  return {
    id: row.id as SectionId,
    name: row.name,
    accent: row.accent,
    bg: row.bg,
    desc: row.description,
  };
}

export function useSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSections() {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("sections")
        .select("id, name, accent, bg, description, sort_order")
        .order("sort_order");

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      setSections((data as DbSection[]).map(mapSection));
      setLoading(false);
    }

    fetchSections();
  }, []);

  function getSectionById(id: string): Section | undefined {
    return sections.find((s) => s.id === id);
  }

  return { sections, loading, error, getSectionById };
}
