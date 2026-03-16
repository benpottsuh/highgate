import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import type { Technique } from "../types";

interface DbTechnique {
  id: string;
  name: string;
  description: string;
  detail: string;
  points: string[];
}

function mapTechnique(row: DbTechnique): Technique {
  return {
    id: row.id,
    name: row.name,
    desc: row.description,
    detail: row.detail,
    points: row.points,
  };
}

export function useTechniques() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTechniques() {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("techniques")
        .select("id, name, description, detail, points")
        .order("name");

      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }

      setTechniques((data as DbTechnique[]).map(mapTechnique));
      setLoading(false);
    }

    fetchTechniques();
  }, []);

  function getTechniqueById(id: string): Technique | undefined {
    return techniques.find((t) => t.id === id);
  }

  return { techniques, loading, error, getTechniqueById };
}
