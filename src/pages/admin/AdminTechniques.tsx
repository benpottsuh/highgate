import { useState } from "react";
import { Link } from "react-router-dom";
import { useTechniques } from "../../hooks/useTechniques";
import { supabase } from "../../integrations/supabase/client";

export default function AdminTechniques() {
  const { techniques, loading, error } = useTechniques();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this technique?")) return;
    setDeleting(id);
    const { error } = await supabase.from("techniques").delete().eq("id", id);
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
            <h1>Techniques</h1>
            <p>{techniques.length} techniques</p>
          </div>
          <Link to="/admin/techniques/new" className="admin-btn-primary">
            + Add Technique
          </Link>
        </div>
      </div>

      <div className="admin-list">
        {techniques.map((t) => (
          <div key={t.id} className="admin-list-item">
            <div className="admin-list-item-info">
              <h3>{t.name}</h3>
              <p>{t.desc}</p>
            </div>
            <div className="admin-list-item-actions">
              <Link to={`/admin/techniques/${t.id}`} className="admin-btn-sm">
                Edit
              </Link>
              <button
                className="admin-btn-sm admin-btn-danger"
                onClick={() => handleDelete(t.id)}
                disabled={deleting === t.id}
              >
                {deleting === t.id ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
