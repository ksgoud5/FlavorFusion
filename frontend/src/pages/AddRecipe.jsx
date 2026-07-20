// frontend/src/pages/AddRecipe.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import RecipeForm from "../components/RecipeForm";

const AddRecipe = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Recipe published successfully! 🎉");
      navigate(`/recipes/${res.data.recipe._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create recipe");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Share a New Recipe</h1>
      <p className="text-gray-500 mb-8">Fill in the details below to publish your recipe.</p>

      <RecipeForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Publish Recipe" />
    </div>
  );
};

export default AddRecipe;