import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cocktails from "./pages/Cocktails";
import CocktailDetail from "./pages/CocktailDetail";
import SectionOverview from "./pages/SectionOverview";
import Techniques from "./pages/Techniques";
import TechniqueDetail from "./pages/TechniqueDetail";
import Favorites from "./pages/Favorites";

// Admin
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSections from "./pages/admin/AdminSections";
import AdminSectionEdit from "./pages/admin/AdminSectionEdit";
import AdminCocktails from "./pages/admin/AdminCocktails";
import AdminCocktailEdit from "./pages/admin/AdminCocktailEdit";
import AdminTechniques from "./pages/admin/AdminTechniques";
import AdminTechniqueEdit from "./pages/admin/AdminTechniqueEdit";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Bartender-facing (read-only) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cocktails" element={<Cocktails />} />
          <Route path="/cocktails/:slug" element={<CocktailDetail />} />
          <Route path="/sections/:id" element={<SectionOverview />} />
          <Route path="/techniques" element={<Techniques />} />
          <Route path="/techniques/:id" element={<TechniqueDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>

        {/* Admin CMS */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/sections" element={<AdminSections />} />
          <Route path="/admin/sections/:id" element={<AdminSectionEdit />} />
          <Route path="/admin/cocktails" element={<AdminCocktails />} />
          <Route path="/admin/cocktails/:slug" element={<AdminCocktailEdit />} />
          <Route path="/admin/techniques" element={<AdminTechniques />} />
          <Route path="/admin/techniques/:id" element={<AdminTechniqueEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
