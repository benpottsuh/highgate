import { useParams, Link } from "react-router-dom";
import { getTechniqueById } from "../data";
import { PlayIcon } from "../components/icons/UIIcons";

export default function TechniqueDetail() {
  const { id } = useParams<{ id: string }>();
  const technique = getTechniqueById(id ?? "");

  if (!technique) {
    return <div className="empty-state">Technique not found.</div>;
  }

  return (
    <div>
      <div className="technique-detail-header fade-in">
        <h1>{technique.name}</h1>
      </div>

      <div className="detail-block fade-in fade-in-1" style={{ borderTop: "none", paddingTop: 0 }}>
        <p>{technique.detail}</p>
        <h3>Key Points</h3>
        <ul className="gold-list">
          {technique.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="detail-block fade-in fade-in-2">
        <div className="video-placeholder" style={{ height: 100 }}>
          <PlayIcon />
          <span>Watch technique video</span>
        </div>
      </div>

      <div className="footer-actions">
        <Link to="/techniques" className="btn-secondary">
          All techniques
        </Link>
      </div>
    </div>
  );
}
