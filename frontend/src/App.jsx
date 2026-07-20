// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import RecipeDetails from "./pages/RecipeDetails";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import MyRecipes from "./pages/MyRecipes";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
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
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/:id" element={<RecipeDetails />} />
          <Route path="categories" element={<Categories />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          <Route element={<ProtectedRoute />}>
            <Route path="add-recipe" element={<AddRecipe />} />
            <Route path="edit-recipe/:id" element={<EditRecipe />} />
            <Route path="my-recipes" element={<MyRecipes />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;