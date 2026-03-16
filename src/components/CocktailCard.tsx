import { Link } from "react-router-dom";
import { useSections } from "../hooks/useSections";
import GlassIcon from "./icons/GlassIcon";
import SpiritIcon from "./icons/SpiritIcon";
import { ChevronRight } from "./icons/UIIcons";
import type { Cocktail } from "../types";

interface Props {
  cocktail: Cocktail;
  animationDelay?: number;
}

export default function CocktailCard({ cocktail, animationDelay = 0 }: Props) {
  const { getSectionById } = useSections();
  const sec = getSectionById(cocktail.section);
  const delayClass = animationDelay > 0 ? `fade-in-${Math.min(animationDelay, 5)}` : "";

  return (
    <Link
      to={`/cocktails/${cocktail.slug}`}
      className={`cocktail-card fade-in ${delayClass}`}
    >
      <div
        className="cocktail-thumb"
        style={{ background: sec?.bg || "#333" }}
      >
        <GlassIcon glass={cocktail.glass} size={26} />
      </div>
      <div className="cocktail-card-info">
        <div className="cocktail-card-section" style={{ color: sec?.accent }}>
          {sec?.name}
        </div>
        <h4>{cocktail.name}</h4>
        <div className="cocktail-card-tagline">{cocktail.tagline}</div>
        <div className="cocktail-card-icons">
          <SpiritIcon spirit={cocktail.spirit} size={14} />
          <GlassIcon glass={cocktail.glass} size={14} />
        </div>
      </div>
      <div className="cocktail-card-chev">
        <ChevronRight />
      </div>
    </Link>
  );
}
