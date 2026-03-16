import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { filterCocktails, sections } from "../data";
import CocktailCard from "../components/CocktailCard";
import { SearchIcon } from "../components/icons/UIIcons";
import type { SectionId, BaseSpirit } from "../types";

const SPIRIT_CHIPS = ["Tequila", "Whiskey", "Vodka", "Gin", "Rum", "NA"];

export default function Cocktails() {
  const [searchParams] = useSearchParams();
  const initialSpirit = searchParams.get("spirit");

  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState<SectionId | null>(null);
  const [spiritFilter, setSpiritFilter] = useState<BaseSpirit | null>(
    initialSpirit as BaseSpirit | null
  );

  const filtered = filterCocktails({
    search,
    section: sectionFilter,
    spirit: spiritFilter,
  });

  return (
    <div>
      {/* Search */}
      <div className="search-wrap fade-in" style={{ position: "relative" }}>
        <span className="search-icon">
          <SearchIcon />
        </span>
        <input
          className="search-input"
          placeholder="Search cocktails…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Section filter row */}
      <div className="filter-section fade-in fade-in-1">
        <button
          className={`chip ${!sectionFilter ? "active" : ""}`}
          onClick={() => setSectionFilter(null)}
        >
          All
        </button>
        {sections.map((s) => (
          <button
            key={s.id}
            className={`chip ${sectionFilter === s.id ? "active" : ""}`}
            onClick={() =>
              setSectionFilter(sectionFilter === s.id ? null : s.id)
            }
          >
            {s.name.replace(" Cocktails", "")}
          </button>
        ))}
      </div>

      {/* Spirit filter row */}
      <div className="filter-section fade-in fade-in-2" style={{ paddingTop: 6 }}>
        {SPIRIT_CHIPS.map((spirit) => (
          <button
            key={spirit}
            className={`chip ${spiritFilter === spirit ? "active" : ""}`}
            onClick={() =>
              setSpiritFilter(spiritFilter === spirit ? null : (spirit as BaseSpirit))
            }
          >
            {spirit}
          </button>
        ))}
      </div>

      {/* Cocktail list */}
      <div className="cocktail-list">
        {filtered.length === 0 && (
          <div className="empty-state">No cocktails match your filters.</div>
        )}
        {filtered.map((c, i) => (
          <CocktailCard key={c.slug} cocktail={c} animationDelay={i + 1} />
        ))}
      </div>
    </div>
  );
}
