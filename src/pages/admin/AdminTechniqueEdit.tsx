import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../integrations/supabase/client";
import DynamicList from "../../components/admin/DynamicList";

interface TechniqueForm {
  id: string;
  name: string;
  description: string;
  detail: string;
  points: string[];
}

const EMPTY: TechniqueForm = {
  id: "",
  name: "",
  description: "",
  detail: "",
  points: [""],
};

export default function AdminTechniqueEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [form, setForm] = useState<TechniqueForm>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const { data, error } = await supabase
        .from("techniques")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        alert("Technique not found");
        navigate("/admin/techniques");
        return;
      }
      setForm({
        id: data.id,
        name: data.name,
        description: data.description,
        detail: data.detail,
        points: data.points || [],
      });
      setLoading(false);
    }
    load();
  }, [id, isNew, navigate]);

  function update(field: keyof TechniqueForm, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    setSaving(true);
    const cleanPoints = form.points.filter((p) => p.trim());

    if (isNew) {
      const newId = form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+$/, "");

      const { error } = await supabase.from("techniques").insert({
        id: newId,
        name: form.name,
        description: form.description,
        detail: form.detail,
        points: cleanPoints,
      });

      if (error) {
        alert("Save failed: " + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("techniques")
        .update({
          name: form.name,
          description: form.description,
          detail: form.detail,
          points: cleanPoints,
        })
        .eq("id", form.id);

      if (error) {
        alert("Save failed: " + error.message);
        setSaving(false);
        return;
      }
    }

    navigate("/admin/techniques");
  }

  if (loading) return <div className="admin-loading">Loading…</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isNew ? "New Technique" : `Edit: ${form.name}`}</h1>
      </div>

      <div className="admin-form">
        <label className="admin-field">
          <span>Name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Shaking"
          />
        </label>

        <label className="admin-field">
          <span>Short Description</span>
          <input
            type="text"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Brief one-liner for the list view…"
          />
        </label>

        <label className="admin-field">
          <span>Detailed Description</span>
          <textarea
            value={form.detail}
            onChange={(e) => update("detail", e.target.value)}
            placeholder="Full description shown on the technique detail page…"
            rows={4}
          />
        </label>

        <DynamicList
          label="Key Points"
          items={form.points}
          onChange={(items) => update("points", items)}
          placeholder="e.g. Fill shaker tin 2/3 with ice"
        />

        <div className="admin-form-actions">
          <button
            className="admin-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : isNew ? "Create Technique" : "Save Changes"}
          </button>
          <button
            className="admin-btn-secondary"
            onClick={() => navigate("/admin/techniques")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
