import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../integrations/supabase/client";
import { useSections } from "../../hooks/useSections";
import DynamicList from "../../components/admin/DynamicList";
import SpecEditor from "../../components/admin/SpecEditor";
import type { SectionId, BaseSpirit } from "../../types";

const SPIRITS: BaseSpirit[] = ["Vodka", "Gin", "Tequila", "Rum", "Whiskey", "NA"];

interface SpecItem {
  amount: string;
  ingredient: string;
}

interface CocktailForm {
  slug: string;
  name: string;
  section_id: SectionId;
  spirit: BaseSpirit;
  style: string;
  tagline: string;
  flavor: string[];
  photo_url: string | null;
  overview: string;
  selling_points: string[];
  spec: SpecItem[];
  technique: string;
  glass: string;
  ice: string;
  garnish: string;
  cheat_sheet: string;
  has_batch: boolean;
  batch_yield: string;
  batch_items: string[];
  prep: string[];
}

const EMPTY: CocktailForm = {
  slug: "",
  name: "",
  section_id: "signature",
  spirit: "Vodka",
  style: "",
  tagline: "",
  flavor: [""],
  photo_url: null,
  overview: "",
  selling_points: [""],
  spec: [{ amount: "", ingredient: "" }],
  technique: "",
  glass: "",
  ice: "",
  garnish: "",
  cheat_sheet: "",
  has_batch: false,
  batch_yield: "",
  batch_items: [""],
  prep: [""],
};

export default function AdminCocktailEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = slug === "new";
  const { sections, loading: secLoading } = useSections();

  const [form, setForm] = useState<CocktailForm>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    async function load() {
      const { data, error } = await supabase
        .from("cocktails")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        alert("Cocktail not found");
        navigate("/admin/cocktails");
        return;
      }

      const batch = data.batch as { yield: string; items: string[] } | null;

      setForm({
        slug: data.slug,
        name: data.name,
        section_id: data.section_id as SectionId,
        spirit: data.spirit as BaseSpirit,
        style: data.style,
        tagline: data.tagline,
        flavor: data.flavor || [],
        photo_url: data.photo_url,
        overview: data.overview,
        selling_points: data.selling_points || [],
        spec: (data.spec as SpecItem[]) || [],
        technique: data.technique,
        glass: data.glass,
        ice: data.ice,
        garnish: data.garnish,
        cheat_sheet: data.cheat_sheet,
        has_batch: !!batch,
        batch_yield: batch?.yield || "",
        batch_items: batch?.items || [],
        prep: data.prep || [],
      });
      setLoading(false);
    }
    load();
  }, [slug, isNew, navigate]);

  function update<K extends keyof CocktailForm>(field: K, value: CocktailForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function autoSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+$/, "")
      .replace(/^-+/, "");
  }

  async function handleSave() {
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    setSaving(true);

    const cleanFlavor = form.flavor.filter((f) => f.trim());
    const cleanSelling = form.selling_points.filter((s) => s.trim());
    const cleanSpec = form.spec.filter((s) => s.amount.trim() || s.ingredient.trim());
    const cleanPrep = form.prep.filter((p) => p.trim());
    const batch = form.has_batch
      ? {
          yield: form.batch_yield,
          items: form.batch_items.filter((b) => b.trim()),
        }
      : null;

    const record = {
      slug: isNew ? autoSlug(form.name) : form.slug,
      name: form.name,
      section_id: form.section_id,
      spirit: form.spirit,
      style: form.style,
      tagline: form.tagline,
      flavor: cleanFlavor,
      photo_url: form.photo_url,
      overview: form.overview,
      selling_points: cleanSelling,
      spec: cleanSpec,
      technique: form.technique,
      glass: form.glass,
      ice: form.ice,
      garnish: form.garnish,
      cheat_sheet: form.cheat_sheet,
      batch,
      prep: cleanPrep,
    };

    if (isNew) {
      const { error } = await supabase.from("cocktails").insert(record);
      if (error) {
        alert("Save failed: " + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("cocktails")
        .update(record)
        .eq("slug", form.slug);

      if (error) {
        alert("Save failed: " + error.message);
        setSaving(false);
        return;
      }
    }

    navigate("/admin/cocktails");
  }

  if (loading || secLoading) return <div className="admin-loading">Loading…</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isNew ? "New Cocktail" : `Edit: ${form.name}`}</h1>
        {!isNew && (
          <a
            href={`/cocktails/${form.slug}`}
            target="_blank"
            rel="noreferrer"
            className="admin-preview-link"
          >
            Preview on live site →
          </a>
        )}
      </div>

      <div className="admin-form">
        {/* ── Identity ── */}
        <div className="admin-form-section">
          <h2>Identity</h2>

          <label className="admin-field">
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. The Applegate"
            />
          </label>

          <div className="admin-field-row">
            <label className="admin-field">
              <span>Section</span>
              <select
                value={form.section_id}
                onChange={(e) => update("section_id", e.target.value as SectionId)}
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-field">
              <span>Spirit</span>
              <select
                value={form.spirit}
                onChange={(e) => update("spirit", e.target.value as BaseSpirit)}
              >
                {SPIRITS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-field-row">
            <label className="admin-field">
              <span>Style</span>
              <input
                type="text"
                value={form.style}
                onChange={(e) => update("style", e.target.value)}
                placeholder="e.g. Sour, Highball, Spritz"
              />
            </label>
          </div>

          <label className="admin-field">
            <span>Tagline</span>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="A warm orchard whiskey sour with depth and polish"
            />
          </label>
        </div>

        {/* ── Flavor & Selling ── */}
        <div className="admin-form-section">
          <h2>Flavor & Selling</h2>

          <label className="admin-field">
            <span>Overview</span>
            <textarea
              value={form.overview}
              onChange={(e) => update("overview", e.target.value)}
              placeholder="Detailed description of the cocktail…"
              rows={3}
            />
          </label>

          <DynamicList
            label="Flavor Profile"
            items={form.flavor}
            onChange={(items) => update("flavor", items)}
            placeholder="e.g. Warm apple"
          />

          <DynamicList
            label="Selling Points"
            items={form.selling_points}
            onChange={(items) => update("selling_points", items)}
            placeholder="e.g. Perfect for guests who love whiskey"
          />
        </div>

        {/* ── Spec ── */}
        <div className="admin-form-section">
          <h2>Recipe & Service</h2>

          <SpecEditor
            items={form.spec}
            onChange={(items) => update("spec", items)}
          />

          <div className="admin-field-row">
            <label className="admin-field">
              <span>Technique</span>
              <input
                type="text"
                value={form.technique}
                onChange={(e) => update("technique", e.target.value)}
                placeholder="Shake / Double-strain"
              />
            </label>

            <label className="admin-field">
              <span>Glass</span>
              <input
                type="text"
                value={form.glass}
                onChange={(e) => update("glass", e.target.value)}
                placeholder="Coupe"
              />
            </label>
          </div>

          <div className="admin-field-row">
            <label className="admin-field">
              <span>Ice</span>
              <input
                type="text"
                value={form.ice}
                onChange={(e) => update("ice", e.target.value)}
                placeholder="None (served up)"
              />
            </label>

            <label className="admin-field">
              <span>Garnish</span>
              <input
                type="text"
                value={form.garnish}
                onChange={(e) => update("garnish", e.target.value)}
                placeholder="Dehydrated apple wheel"
              />
            </label>
          </div>

          <label className="admin-field">
            <span>Cheat Sheet</span>
            <input
              type="text"
              value={form.cheat_sheet}
              onChange={(e) => update("cheat_sheet", e.target.value)}
              placeholder="2 bourbon / 0.5 apple brandy / 0.75 lemon / 0.5 honey"
            />
          </label>
        </div>

        {/* ── Batch & Prep ── */}
        <div className="admin-form-section">
          <h2>Batch & Prep</h2>

          <div className="admin-field">
            <label className="admin-toggle">
              <input
                type="checkbox"
                checked={form.has_batch}
                onChange={(e) => update("has_batch", e.target.checked)}
              />
              <span>Has batch recipe</span>
            </label>
          </div>

          {form.has_batch && (
            <>
              <label className="admin-field">
                <span>Batch Yield</span>
                <input
                  type="text"
                  value={form.batch_yield}
                  onChange={(e) => update("batch_yield", e.target.value)}
                  placeholder="30 servings (5 gal)"
                />
              </label>

              <DynamicList
                label="Batch Items"
                items={form.batch_items}
                onChange={(items) => update("batch_items", items)}
                placeholder="e.g. 2.25L Dark rum"
              />
            </>
          )}

          <DynamicList
            label="Prep Components"
            items={form.prep}
            onChange={(items) => update("prep", items)}
            placeholder="e.g. Honey Syrup (2:1)"
          />
        </div>

        {/* ── Actions ── */}
        <div className="admin-form-actions">
          <button
            className="admin-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : isNew ? "Create Cocktail" : "Save Changes"}
          </button>
          <button
            className="admin-btn-secondary"
            onClick={() => navigate("/admin/cocktails")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
