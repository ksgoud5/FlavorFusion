// frontend/src/pages/MyRecipes.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaUtensils, FaPlus } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { getImageUrl } from "../utils/imageUrl";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // holds the recipe being considered for deletion
  const [deleting, setDeleting] = useState(false);

  const fetchMyRecipes = async () => {
    try {
      const res = await axiosInstance.get("/recipes/user/my-recipes");
      setRecipes(res.data);
    } catch (error) {
      toast.error("Failed to load your recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/recipes/${deleteTarget._id}`);
      setRecipes(recipes.filter((r) => r._id !== deleteTarget._id));
      toast.success("Recipe deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete recipe");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
          <p className="text-gray-500 mt-1">Manage the recipes you've published</p>
        </div>
        <Link
          to="/add-recipe"
          className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-orange-700"
        >
          <FaPlus /> New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <EmptyState
          icon={<FaUtensils />}
          title="No recipes yet"
          message="You haven't published any recipes. Share your first one with the community!"
          actionText="Add Your First Recipe"
          actionLink="/add-recipe"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <Link to={`/recipes/${recipe._id}`}>
                <img
                  src={getImageUrl(recipe.image)}
                  alt={recipe.title}
                  className="w-full h-44 object-cover hover:opacity-90 transition"
                />
              </Link>
              <div className="p-4">
                <Link to={`/recipes/${recipe._id}`}>
                  <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 hover:text-orange-600">
                    {recipe.title}
                  </h3>
                </Link>
                <p className="text-gray-500 text-sm mb-3">
                  {recipe.category} • {recipe.difficulty}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/edit-recipe/${recipe._id}`}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(recipe)}
                    className="flex-1 flex items-center justify-center gap-2 border border-red-300 text-red-600 rounded-lg py-2 text-sm hover:bg-red-50"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmText={deleting ? "Deleting..." : "Delete"}
      />
    </div>
  );
};

export default MyRecipes;