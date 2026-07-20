// frontend/src/components/StarRating.jsx
import { FaStar } from "react-icons/fa";
import { getRatingColor } from "../utils/ratingColors";

// Read-only 5-star display used on RecipeCard and RecipeDetails.
// Filled stars are colored based on the average itself (red for low,
// green for high) — not just orange for everything.
const StarRating = ({ avgRating = 0, numRatings = 0, size = 14, showCount = true }) => {
  const rounded = Math.round(avgRating);
  const color = getRatingColor(avgRating);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            size={size}
            className={star <= rounded ? color : "text-gray-200 dark:text-gray-700"}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-gray-400">
          {avgRating > 0 ? `${avgRating.toFixed(1)} (${numRatings})` : "No ratings yet"}
        </span>
      )}
    </div>
  );
};

export default StarRating;