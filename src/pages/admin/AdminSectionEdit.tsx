import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../integrations/supabase/client";

interface SectionForm {
  id: string;
  name: string;
  description: string;
  accent: string;
  bg: string;
  sort_order: number;
}

const EMPTY: SectionForm = {
  id: "",
  name: "",
  description: "",
  accent: "#d4a853",
  bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
  sort_order: 0,
};

export default function AdminSectionEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [form, setForm] = useState<SectionForm>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        alert("Section not found");
        navigate("/admin/sections");
        return;
      }
      setForm({
        id: data.id,
        name: data.name,
        description: data.description,
        accent: data.accent,
        bg: data.bg,
        sort_order: data.sort_order,
      });
      setLoading(false);
    }
    load();
  }, [id, isNew, navigate]);

  function update(field: keyof SectionForm, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    setSaving(true);

    if (isNew) {
      const newId = form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+$/, "");

      const { error } = await supabase.from("sections").insert({
        id: newId,
        name: form.name,
        description: form.description,
        accent: form.accent,
        bg: form.bg,
        sort_order: form.sort_order,
      });

      if (error) {
        alert("Save failed: " + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("sections")
        .update({
          name: form.name,
          description: form.description,
          accent: form.accent,
          bg: form.bg,
          sort_order: form.sort_order,
        })
        .eq("id", form.id);

      if (error) {
        alert("Save failed: " + error.message);
        setSaving(false);
        return;
      }
    }

    navigate("/admin/sections");
  }

  if (loading) return <div className="admin-loading">Loading…</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isNew ? "New Section" : `Edit: ${form.name}`}</h1>
      </div>

      <div className="admin-form">
        <label className="admin-field">
          <span>Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Signature Cocktails"
          />
        </label>

        <label className="admin-field">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Brief description of this section…"
            rows={3}
          />
        </label>

        <label className="admin-field">
          <span>Accent Color</span>
          <div className="admin-color-row">
            <input
              type="color"
              value={form.accent}
              onChange={(e) => update("accent", e.target.value)}
            />
            <input
              type="text"
              value={form.accent}
              onChange={(e) => update("accent", e.target.value)}
              className="admin-color-text"
            />
          </div>
        </label>

        <label className="admin-field">
          <span>Background CSS</span>
          <input
            type="text"
            value={form.bg}
            onChange={(e) => update("bg", e.target.value)}
            placeholder="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          />
        </label>

        <label className="admin-field">
          <span>Sort Order</span>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)}
          />
        </label>

        {/* Live preview */}
        <div className="admin-field">
          <span>Preview</span>
          <div
            className="admin-section-preview"
            style={{ background: form.bg }}
          >
            <h3 style={{ color: "#fff", fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: 18 }}>
              {form.name || "Section Name"}
            </h3>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
              {form.description || "Section description"}
            </span>
          </div>
        </div>

        <div className="admin-form-actions">
          <button
            className="admin-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : isNew ? "Create Section" : "Save Changes"}
          </button>
          <button
            className="admin-btn-secondary"
            onClick={() => navigate("/admin/sections")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
