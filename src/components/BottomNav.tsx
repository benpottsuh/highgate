import { NavLink } from "react-router-dom";
import { HomeIcon, CocktailIcon, TechIcon, HeartIcon } from "./icons/NavIcons";

const navItems = [
  { to: "/", label: "Home", Icon: HomeIcon },
  { to: "/cocktails", label: "Cocktails", Icon: CocktailIcon },
  { to: "/techniques", label: "Techniques", Icon: TechIcon },
  { to: "/favorites", label: "Favorites", Icon: HeartIcon },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          {({ isActive }) => (
            <>
              <item.Icon active={isActive} />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
