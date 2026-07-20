// frontend/src/components/CategoryCard.jsx
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

// A clickable tile representing one recipe category.
// Clicking it takes you to the Recipes page pre-filtered to that category.
const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/recipes?category=${encodeURIComponent(category.name)}`}
      className="group relative rounded-2xl overflow-hidden h-32 sm:h-40 block"
    >
      <img
        src={getImageUrl(category.image)}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
        <span className="text-white font-bold text-lg text-center px-2">{category.name}</span>
      </div>
    </Link>
  );
};

export default CategoryCard;