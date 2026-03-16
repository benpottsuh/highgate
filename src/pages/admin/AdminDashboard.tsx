import { Link } from "react-router-dom";
import { useCocktails } from "../../hooks/useCocktails";
import { useSections } from "../../hooks/useSections";
import { useTechniques } from "../../hooks/useTechniques";

interface StatCardProps {
  label: string;
  count: number;
  to: string;
}

function StatCard({ label, count, to }: StatCardProps) {
  return (
    <Link to={to} className="admin-stat-card">
      <span className="admin-stat-count">{count}</span>
      <span className="admin-stat-label">{label}</span>
    </Link>
  );
}

export default function AdminDashboard() {
  const { cocktails, loading: cocLoading } = useCocktails();
  const { sections, loading: secLoading } = useSections();
  const { techniques, loading: techLoading } = useTechniques();

  const loading = cocLoading || secLoading || techLoading;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Manage content for Highgate Cocktail Academy</p>
      </div>

      {loading ? (
        <div className="admin-loading">Loading…</div>
      ) : (
        <div className="admin-stat-grid">
          <StatCard label="Sections" count={sections.length} to="/admin/sections" />
          <StatCard label="Cocktails" count={cocktails.length} to="/admin/cocktails" />
          <StatCard label="Techniques" count={techniques.length} to="/admin/techniques" />
        </div>
      )}

      <div className="admin-quick-actions">
        <h2>Quick Actions</h2>
        <div className="admin-action-list">
          <Link to="/admin/cocktails?new=1" className="admin-action-btn">
            + Add Cocktail
          </Link>
          <Link to="/admin/sections?new=1" className="admin-action-btn">
            + Add Section
          </Link>
          <Link to="/admin/techniques?new=1" className="admin-action-btn">
            + Add Technique
          </Link>
        </div>
      </div>
    </div>
  );
}
