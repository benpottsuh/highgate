import { Outlet, NavLink, Link } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/sections", label: "Sections" },
  { to: "/admin/cocktails", label: "Cocktails" },
  { to: "/admin/techniques", label: "Techniques" },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      {/* Top bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <span className="admin-badge">Admin</span>
          <span className="admin-title">Highgate CMS</span>
        </div>
        <Link to="/" className="admin-live-link">
          View Live Site →
        </Link>
      </header>

      {/* Nav tabs */}
      <nav className="admin-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `admin-nav-item ${isActive ? "active" : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
