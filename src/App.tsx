import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cocktails from "./pages/Cocktails";
import CocktailDetail from "./pages/CocktailDetail";
import SectionOverview from "./pages/SectionOverview";
import Techniques from "./pages/Techniques";
import TechniqueDetail from "./pages/TechniqueDetail";
import Favorites from "./pages/Favorites";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cocktails" element={<Cocktails />} />
          <Route path="/cocktails/:slug" element={<CocktailDetail />} />
          <Route path="/sections/:id" element={<SectionOverview />} />
          <Route path="/techniques" element={<Techniques />} />
          <Route path="/techniques/:id" element={<TechniqueDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
