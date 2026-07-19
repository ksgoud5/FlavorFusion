// frontend/src/components/RecipeCard.jsx
import { Link } from "react-router-dom";
import { FaHeart, FaClock, FaSignal } from "react-icons/fa";
import { getImageUrl } from "../utils/imageUrl";

// A reusable card used anywhere we display a list of recipes:
// the Recipes page, Home page trending/latest sections, My Recipes, Favorites.
const RecipeCard = ({ recipe }) => {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  const difficultyColor = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <Link
      to={`/recipes/${recipe._id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden block"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={getImageUrl(recipe.image)}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
            difficultyColor[recipe.difficulty] || "bg-gray-100 text-gray-700"
          }`}
        >
          {recipe.difficulty}
        </span>
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-red-500 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <FaHeart /> {recipe.likesCount || 0}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {recipe.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{recipe.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <span className="flex items-center gap-1">
            <FaClock /> {totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <FaSignal /> {recipe.cuisine}
          </span>
          {recipe.author?.name && (
            <span className="truncate max-w-[80px]">by {recipe.author.name}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;// frontend/src/components/RecipeCard.jsx