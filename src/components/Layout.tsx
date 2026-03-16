import { Outlet, useLocation, useNavigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import { ChevronLeft } from "./icons/UIIcons";
import highgateLogo from "../assets/highgate-logo-clean.png";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Show back button on detail / sub pages
  const isDetailPage =
    location.pathname.startsWith("/cocktails/") ||
    location.pathname.startsWith("/sections/") ||
    location.pathname.startsWith("/techniques/");

  const handleBack = () => {
    if (location.pathname.startsWith("/cocktails/")) navigate("/cocktails");
    else if (location.pathname.startsWith("/sections/")) navigate("/");
    else if (location.pathname.startsWith("/techniques/")) navigate("/techniques");
    else navigate(-1);
  };

  return (
    <div className="app-shell">
      {/* Top bar */}
      <header className="top-bar">
        {isDetailPage ? (
          <button className="top-bar-back" onClick={handleBack}>
            <ChevronLeft size={18} />
            Back
          </button>
        ) : (
          <div className="top-bar-brand">
            <img src={highgateLogo} alt="Highgate" className="top-bar-logo" />
            <span className="top-bar-title">Cocktail Academy</span>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="content">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
