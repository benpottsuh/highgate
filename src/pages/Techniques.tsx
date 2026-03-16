import { Link } from "react-router-dom";
import { useTechniques } from "../hooks/useTechniques";
import { ChevronRight } from "../components/icons/UIIcons";

export default function Techniques() {
  const { techniques, loading } = useTechniques();

  if (loading) {
    return <div className="empty-state">Loading…</div>;
  }

  return (
    <div>
      <div className="home-hero fade-in">
        <h1>Techniques<br />&amp; Standards</h1>
        <p>Execution guides for the Highgate program</p>
      </div>
      <div className="cocktail-list">
        {techniques.map((t, i) => (
          <Link
            key={t.id}
            to={`/techniques/${t.id}`}
            className={`technique-card fade-in fade-in-${Math.min(i + 1, 5)}`}
          >
            <div>
              <h4>{t.name}</h4>
              <p>{t.desc}</p>
            </div>
            <ChevronRight />
          </Link>
        ))}
      </div>
    </div>
  );
}
