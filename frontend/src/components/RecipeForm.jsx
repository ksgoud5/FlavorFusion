// frontend/src/components/RecipeForm.jsx
import { useState } from "react";
import { FaCloudUploadAlt, FaVideo, FaTimes } from "react-icons/fa";
import DynamicListInput from "./DynamicListInput";
import { getImageUrl, getVideoUrl } from "../utils/imageUrl";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Appetizer"];
const CUISINES = ["Italian", "Indian", "Chinese", "Mexican", "American", "Thai", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

// Shared form used by BOTH Add Recipe and Edit Recipe pages.
// `initialData` is empty defaults for Add, or the existing recipe for Edit.
// `onSubmit` receives a ready-to-send FormData object built for multipart upload.
const RecipeForm = ({ initialData, onSubmit, submitting, submitLabel }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [ingredients, setIngredients] = useState(initialData?.ingredients?.length ? initialData.ingredients : [""]);
  const [steps, setSteps] = useState(initialData?.steps?.length ? initialData.steps : [""]);
  const [category, setCategory] = useState(initialData?.category || "");
  const [cuisine, setCuisine] = useState(initialData?.cuisine || "");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "Easy");
  const [prepTime, setPrepTime] = useState(initialData?.prepTime || "");
  const [cookTime, setCookTime] = useState(initialData?.cookTime || "");
  const [servings, setServings] = useState(initialData?.servings || 4);

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image ? getImageUrl(initialData.image) : null);
  const [videoPreview, setVideoPreview] = useState(initialData?.video ? getVideoUrl(initialData.video) : null);
  
  const [calories, setCalories] = useState(initialData?.nutrition?.calories || "");
  const [protein, setProtein] = useState(initialData?.nutrition?.protein || "");
  const [carbs, setCarbs] = useState(initialData?.nutrition?.carbs || "");
  const [fat, setFat] = useState(initialData?.nutrition?.fat || "");

  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Please select a valid image file" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image must be under 10MB" });
      return;
    }

    setErrors({ ...errors, image: "" });
    setImageFile(file);
    // Create a temporary local preview URL so users see what they picked
    // immediately, without needing to upload first.
    setImagePreview(URL.createObjectURL(file));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setErrors({ ...errors, video: "Please select a valid video file" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrors({ ...errors, video: "Video must be under 50MB" });
      return;
    }

    setErrors({ ...errors, video: "" });
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!category) newErrors.category = "Category is required";
    if (!cuisine) newErrors.cuisine = "Cuisine is required";
    if (!prepTime || prepTime <= 0) newErrors.prepTime = "Enter a valid prep time";
    if (!cookTime || cookTime <= 0) newErrors.cookTime = "Enter a valid cook time";

    const cleanIngredients = ingredients.filter((i) => i.trim());
    if (cleanIngredients.length === 0) newErrors.ingredients = "Add at least one ingredient";

    const cleanSteps = steps.filter((s) => s.trim());
    if (cleanSteps.length === 0) newErrors.steps = "Add at least one step";

    // Image is required only when creating a NEW recipe (no initialData.image means Add mode)
    if (!initialData?.image && !imageFile) {
      newErrors.image = "A cover image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // FormData is required (instead of plain JSON) because we're sending files.
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("cuisine", cuisine);
    formData.append("difficulty", difficulty);
    formData.append("prepTime", prepTime);
    formData.append("cookTime", cookTime);
    formData.append("servings", servings || 4);
    formData.append("calories", calories || 0);
    formData.append("protein", protein || 0);
    formData.append("carbs", carbs || 0);
    formData.append("fat", fat || 0);
    // Arrays must be JSON-stringified since FormData only accepts strings/files —
    // matches exactly what our backend's createRecipe/updateRecipe expect (Step 4/5).
    formData.append("ingredients", JSON.stringify(ingredients.filter((i) => i.trim())));
    formData.append("steps", JSON.stringify(steps.filter((s) => s.trim())));

    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Grandma's Spicy Chicken Curry"
          className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="A short, mouth-watering description of your dish..."
          className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Category / Cuisine / Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              errors.cuisine ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select cuisine</option>
            {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.cuisine && <p className="text-red-500 text-sm mt-1">{errors.cuisine}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Prep / Cook Time / Servings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (minutes)</label>
          <input
            type="number"
            min="1"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              errors.prepTime ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.prepTime && <p className="text-red-500 text-sm mt-1">{errors.prepTime}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time (minutes)</label>
          <input
            type="number"
            min="1"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 ${
              errors.cookTime ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.cookTime && <p className="text-red-500 text-sm mt-1">{errors.cookTime}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
          <input
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="4"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>
        {/* Nutrition Info (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nutrition Info <span className="text-gray-400 font-normal">(optional, per serving)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Calories (kcal)</label>
            <input
              type="number"
              min="0"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Protein (g)</label>
            <input
              type="number"
              min="0"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Carbs (g)</label>
            <input
              type="number"
              min="0"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fat (g)</label>
            <input
              type="number"
              min="0"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
      </div>
      {/* Ingredients */}
      <div>
        <DynamicListInput
          label="Ingredients"
          items={ingredients}
          setItems={setIngredients}
          placeholder="Ingredient"
        />
        {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
      </div>

      {/* Steps */}
      <div>
        <DynamicListInput
          label="Steps"
          items={steps}
          setItems={setSteps}
          placeholder="Step"
        />
        {errors.steps && <p className="text-red-500 text-sm mt-1">{errors.steps}</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
        {imagePreview ? (
          <div className="relative w-full h-56 rounded-xl overflow-hidden">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <label className="absolute bottom-3 right-3 bg-white/90 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer hover:bg-white">
              Change Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
            <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to upload a cover image</span>
            <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 10MB</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        )}
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
      </div>

      {/* Video Upload (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cooking Video <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        {videoPreview ? (
          <div className="relative">
            <video src={videoPreview} controls className="w-full max-h-64 rounded-xl bg-black" />
            <button
              type="button"
              onClick={removeVideo}
              className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition">
            <FaVideo className="text-2xl text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to upload a cooking video</span>
            <span className="text-xs text-gray-400 mt-1">MP4, WEBM — max 50MB</span>
            <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
          </label>
        )}
        {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-orange-600 text-white py-3.5 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default RecipeForm;