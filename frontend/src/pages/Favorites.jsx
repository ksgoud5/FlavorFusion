// frontend/src/pages/Favorites.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import RecipeCard from "../components/RecipeCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const Favorites = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get("/favorites");
        setRecipes(res.data);
      } catch (error) {
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
        <p className="text-gray-500 mt-1">Recipes you've saved for later</p>
      </div>

      {recipes.length === 0 ? (
        <EmptyState
          icon={<FaHeart />}
          title="No favorites yet"
          message="Browse recipes and tap the Save button to build your personal collection."
          actionText="Browse Recipes"
          actionLink="/recipes"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;