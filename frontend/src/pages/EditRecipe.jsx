// frontend/src/pages/EditRecipe.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import RecipeForm from "../components/RecipeForm";
import LoadingSpinner from "../components/LoadingSpinner";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axiosInstance.get(`/recipes/${id}`);

        // Frontend-level guard: if this isn't your recipe, don't even show the edit form.
        // (The backend independently enforces this too — this is just a UX shortcut.)
        if (res.data.author?._id !== user?.id) {
          setNotAllowed(true);
        } else {
          setRecipe(res.data);
        }
      } catch (error) {
        toast.error("Recipe not found");
        navigate("/my-recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.put(`/recipes/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Recipe updated successfully!");
      navigate(`/recipes/${res.data.recipe._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update recipe");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (notAllowed) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-4">You're not authorized to edit this recipe.</p>
        <Link to="/recipes" className="text-orange-600 font-medium hover:underline">
          Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Recipe</h1>
      <p className="text-gray-500 mb-8">Update your recipe details below.</p>

      {recipe && (
        <RecipeForm
          initialData={recipe}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
};

export default EditRecipe;