import { useParams, Link } from "react-router-dom";
import { useCocktails } from "../hooks/useCocktails";
import { useSections } from "../hooks/useSections";
import GlassIcon from "../components/icons/GlassIcon";
import { TechIcon } from "../components/icons/NavIcons";
import { PlayIcon } from "../components/icons/UIIcons";

export default function CocktailDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { getCocktailBySlug, loading: cocLoading } = useCocktails();
  const { getSectionById, loading: secLoading } = useSections();

  if (cocLoading || secLoading) {
    return <div className="empty-state">Loading…</div>;
  }

  const cocktail = getCocktailBySlug(slug ?? "");

  if (!cocktail) {
    return <div className="empty-state">Cocktail not found.</div>;
  }

  const sec = getSectionById(cocktail.section);

  return (
    <div>
      {/* Header */}
      <div className="detail-header fade-in">
        <div className="detail-tags">
          <span className="tag tag-section" style={{ background: sec?.accent }}>
            {sec?.name}
          </span>
          <span className="tag tag-spirit">{cocktail.spirit}</span>
          <span className="tag tag-style">{cocktail.style}</span>
        </div>
        <h1>{cocktail.name}</h1>
      </div>

      {/* Hero photo */}
      <div
        className="detail-hero-photo fade-in fade-in-1"
        style={{ background: sec?.bg || "#333" }}
      >
        <GlassIcon glass={cocktail.glass} size={48} />
      </div>

      {/* Block 1: Overview */}
      <div className="detail-block fade-in fade-in-2">
        <h2>Overview</h2>
        <p>{cocktail.overview}</p>
        <h3>Flavor Profile</h3>
        <ul className="gold-list">
          {cocktail.flavor.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <h3>Selling Guide</h3>
        <ul className="gold-list">
          {cocktail.selling.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Block 2: Spec */}
      <div className="detail-block fade-in fade-in-3">
        <h2>Single-Serve Spec</h2>
        {cocktail.spec.map((s, i) => (
          <div className="spec-row" key={i}>
            <span className="spec-amount">{s.amount}</span>
            <span className="spec-ingredient">{s.ingredient}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
          <div className="meta-row">
            <TechIcon active={false} />
            <span>Technique: {cocktail.technique}</span>
          </div>
          <div className="meta-row">
            <GlassIcon glass={cocktail.glass} size={16} />
            <span>Glass: {cocktail.glass} · Ice: {cocktail.ice}</span>
          </div>
          <div className="meta-row">
            <span style={{ fontSize: 15, marginRight: 2 }}>🌿</span>
            <span>Garnish: {cocktail.garnish}</span>
          </div>
        </div>
        <div className="cheat-sheet">{cocktail.cheatSheet}</div>
      </div>

      {/* Block 3: Batch & Prep */}
      <div className="detail-block fade-in fade-in-4">
        <h2>Batch &amp; Prep</h2>
        {cocktail.batch ? (
          <>
            <h3>Batch Recipe ({cocktail.batch.yield})</h3>
            <ul className="gold-list">
              {cocktail.batch.items.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </>
        ) : (
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            No batch recipe — this cocktail is built to order.
          </p>
        )}
        {cocktail.prep.length > 0 && (
          <>
            <h3>Prep Components</h3>
            <ul className="gold-list">
              {cocktail.prep.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <span className="prep-link">See full prep method in Prep Library →</span>
          </>
        )}
      </div>

      {/* Block 4: Videos */}
      <div className="detail-block fade-in fade-in-5">
        <h2>Videos</h2>
        <div className="video-placeholder">
          <PlayIcon />
          <span>Prep video · 2 min</span>
        </div>
        <div className="video-placeholder">
          <PlayIcon />
          <span>Execution video · 1 min</span>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-actions">
        <Link to={`/sections/${cocktail.section}`} className="btn-secondary">
          Back to {sec?.name}
        </Link>
        <Link to="/cocktails" className="btn-secondary">
          All cocktails
        </Link>
      </div>
    </div>
  );
}
