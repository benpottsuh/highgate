import { useState } from "react";
import { Link } from "react-router-dom";
import { useCocktails } from "../../hooks/useCocktails";
import { useSections } from "../../hooks/useSections";
import { supabase } from "../../integrations/supabase/client";
import type { SectionId } from "../../types";

export default function AdminCocktails() {
  const { cocktails, filterCocktails, loading: cocLoading } = useCocktails();
  const { sections, loading: secLoading } = useSections();
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState<SectionId | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this cocktail? This cannot be undone.")) return;
    setDeleting(slug);
    const { error } = await supabase.from("cocktails").delete().eq("slug", slug);
    if (error) alert("Delete failed: " + error.message);
    else window.location.reload();
    setDeleting(null);
  }

  if (cocLoading || secLoading) return <div className="admin-loading">Loading…</div>;

  const filtered = filterCocktails({ search, section: sectionFilter });

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1>Cocktails</h1>
            <p>{cocktails.length} cocktails</p>
          </div>
          <Link to="/admin/cocktails/new" className="admin-btn-primary">
            + Add Cocktail
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <input
          className="admin-search"
          type="text"
          placeholder="Search cocktails…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="admin-filter-chips">
          <button
            className={`admin-chip ${!sectionFilter ? "active" : ""}`}
            onClick={() => setSectionFilter(null)}
          >
            All
          </button>
          {sections.map((s) => (
            <button
              key={s.id}
              className={`admin-chip ${sectionFilter === s.id ? "active" : ""}`}
              onClick={() => setSectionFilter(sectionFilter === s.id ? null : s.id)}
            >
              {s.name.replace(" Cocktails", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-list">
        {filtered.length === 0 && (
          <div className="admin-loading">No cocktails match your filters.</div>
        )}
        {filtered.map((c) => (
          <div key={c.slug} className="admin-list-item">
            <div className="admin-list-item-info">
              <h3>{c.name}</h3>
              <p>
                {c.spirit} · {c.style} · {sections.find((s) => s.id === c.section)?.name || c.section}
              </p>
            </div>
            <div className="admin-list-item-actions">
              <Link to={`/admin/cocktails/${c.slug}`} className="admin-btn-sm">
                Edit
              </Link>
              <button
                className="admin-btn-sm admin-btn-danger"
                onClick={() => handleDelete(c.slug)}
                disabled={deleting === c.slug}
              >
                {deleting === c.slug ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
