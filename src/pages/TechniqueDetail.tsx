import { useParams, Link } from "react-router-dom";
import { useTechniques } from "../hooks/useTechniques";

export default function TechniqueDetail() {
  const { id } = useParams<{ id: string }>();
  const { getTechniqueById, loading } = useTechniques();

  if (loading) {
    return <div className="empty-state">Loading…</div>;
  }

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

      {technique.video && (
        <div className="detail-block fade-in fade-in-2">
          <h2>Technique Videos</h2>
          {technique.video.includes('vimeo.com') ? (
            <div className="detail-video-wrapper">
              <iframe
                src={technique.video}
                className="detail-video-iframe"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={technique.name}
              />
            </div>
          ) : (
            <video
              src={technique.video}
              controls
              playsInline
              preload="metadata"
              className="detail-video"
            />
          )}
        </div>
      )}

      <div className="footer-actions">
        <Link to="/techniques" className="btn-secondary">
          All techniques
        </Link>
      </div>
    </div>
  );
}
