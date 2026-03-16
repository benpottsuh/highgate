import { useState } from "react";
import { Link } from "react-router-dom";
import { useSections } from "../../hooks/useSections";
import { supabase } from "../../integrations/supabase/client";

export default function AdminSections() {
  const { sections, loading, error } = useSections();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this section? All cocktails in it will be unlinked.")) return;
    setDeleting(id);
    const { error } = await supabase.from("sections").delete().eq("id", id);
    if (error) alert("Delete failed: " + error.message);
    else window.location.reload();
    setDeleting(null);
  }

  if (loading) return <div className="admin-loading">Loading…</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div className="admin-page-header-row">
          <div>
            <h1>Sections</h1>
            <p>{sections.length} sections</p>
          </div>
          <Link to="/admin/sections/new" className="admin-btn-primary">
            + Add Section
          </Link>
        </div>
      </div>

      <div className="admin-list">
        {sections.map((section) => (
          <div key={section.id} className="admin-list-item">
            <div className="admin-list-item-color" style={{ background: section.accent }} />
            <div className="admin-list-item-info">
              <h3>{section.name}</h3>
              <p>{section.desc}</p>
            </div>
            <div className="admin-list-item-actions">
              <Link to={`/admin/sections/${section.id}`} className="admin-btn-sm">
                Edit
              </Link>
              <button
                className="admin-btn-sm admin-btn-danger"
                onClick={() => handleDelete(section.id)}
                disabled={deleting === section.id}
              >
                {deleting === section.id ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
