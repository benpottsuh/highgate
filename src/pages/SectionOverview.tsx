import { useParams, Link } from "react-router-dom";
import { useSections } from "../hooks/useSections";
import { useCocktails } from "../hooks/useCocktails";
import CocktailCard from "../components/CocktailCard";
import type { SectionId } from "../types";

export default function SectionOverview() {
  const { id } = useParams<{ id: string }>();
  const { getSectionById, loading: secLoading } = useSections();
  const { getCocktailsBySection, loading: cocLoading } = useCocktails();

  if (secLoading || cocLoading) {
    return <div className="empty-state">Loading…</div>;
  }

  const section = getSectionById(id ?? "");

  if (!section) {
    return <div className="empty-state">Section not found.</div>;
  }

  const sectionCocktails = getCocktailsBySection(section.id as SectionId);

  return (
    <div>
      {/* Section header */}
      <div className="section-header fade-in" style={{ background: section.bg }}>
        <h1>{section.name}</h1>
        <p>{section.desc}</p>
      </div>

      {/* Cocktail list */}
      <div className="cocktail-list" style={{ paddingTop: 16 }}>
        {sectionCocktails.map((c, i) => (
          <CocktailCard key={c.slug} cocktail={c} animationDelay={i + 1} />
        ))}
      </div>

      {/* Footer */}
      <div className="footer-actions">
        <Link to="/cocktails" className="btn-secondary">
          View all cocktails
        </Link>
      </div>
    </div>
  );
}
