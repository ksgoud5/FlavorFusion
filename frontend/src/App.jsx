// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      {/* Renders toast notifications anywhere in the app — placed once at the root */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />

      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Everything nested inside this ProtectedRoute requires login.
              More protected pages (Add Recipe, My Recipes, Profile, Favorites)
              will be added here in upcoming steps. */}
          <Route element={<ProtectedRoute />}>
            {/* placeholder — real protected pages added in later steps */}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;