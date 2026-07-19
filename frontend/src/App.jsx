// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* All routes nested inside MainLayout share the same Navbar + Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        {/* More pages (Login, Register, Recipes, etc.) will be added in upcoming steps */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;