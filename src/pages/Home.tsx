import { Link } from "react-router-dom";
import { useSections } from "../hooks/useSections";
import { useCocktails } from "../hooks/useCocktails";
import { useTechniques } from "../hooks/useTechniques";
import type { SectionId } from "../types";

const SPIRIT_CHIPS = ["Whiskey", "Vodka", "Gin", "Tequila", "Rum", "NA"];

export default function Home() {
  const { sections, loading: secLoading } = useSections();
  const { cocktails, loading: cocLoading } = useCocktails();
  const { techniques, loading: techLoading } = useTechniques();

  if (secLoading || cocLoading || techLoading) {
    return <div className="empty-state">Loading…</div>;
  }

  return (
    <div>
      {/* Hero */}
      <div className="home-hero fade-in">
        <h1>Highgate<br />Cocktail Academy</h1>
        <p>Internal cocktail &amp; training guide</p>
      </div>

      {/* Section tiles */}
      <div className="section-tiles">
        {sections.map((section, i) => (
          <Link
            key={section.id}
            to={`/sections/${section.id}`}
            className={`section-tile fade-in fade-in-${i + 1}`}
            style={{ background: section.bg }}
          >
            <h3>{section.name}</h3>
            <span>
              {cocktails.filter((c) => c.section === (section.id as SectionId)).length} cocktails
            </span>
          </Link>
        ))}

        {/* Technique tile */}
        <Link
          to="/techniques"
          className="technique-tile fade-in fade-in-5"
        >
          <h3>Learn Techniques</h3>
          <span>{techniques.length} guides</span>
        </Link>
      </div>

      {/* Quick spirit chips */}
      <div className="filter-row fade-in fade-in-5" style={{ paddingBottom: 8 }}>
        {SPIRIT_CHIPS.map((spirit) => (
          <Link
            key={spirit}
            to={`/cocktails?spirit=${spirit}`}
            className="chip"
          >
            {spirit}
          </Link>
        ))}
      </div>
    </div>
  );
}
