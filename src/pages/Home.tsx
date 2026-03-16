import { Link } from "react-router-dom";
import { useSections } from "../hooks/useSections";
import { useCocktails } from "../hooks/useCocktails";
import { ChevronRight } from "../components/icons/UIIcons";
import type { SectionId } from "../types";

export default function Home() {
  const { sections, loading: secLoading } = useSections();
  const { cocktails, loading: cocLoading } = useCocktails();

  if (secLoading || cocLoading) {
    return <div className="empty-state">Loading…</div>;
  }

  return (
    <div>
      {/* Hero */}
      <div className="home-hero fade-in">
        <h1>Cocktail<br />Menus</h1>
        <p>Every drink, every detail — crafted for the bar.</p>
      </div>

      {/* Section list */}
      <div className="cocktail-list">
        {sections.map((section, i) => {
          const count = cocktails.filter(
            (c) => c.section === (section.id as SectionId)
          ).length;
          return (
            <Link
              key={section.id}
              to={`/sections/${section.id}`}
              className={`technique-card fade-in fade-in-${Math.min(i + 1, 5)}`}
            >
              <div>
                <h4>{section.name}</h4>
                <p>{section.desc || `${count} cocktails`}</p>
              </div>
              <ChevronRight />
            </Link>
          );
        })}

      </div>
    </div>
  );
}
