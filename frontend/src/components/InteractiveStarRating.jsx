// frontend/src/components/InteractiveStarRating.jsx
import { useState } from "react";
import { FaStar } from "react-icons/fa";

// Clickable star input for submitting YOUR rating on a recipe.
// `value` is the currently selected rating (0 if none yet);
// `onRate` fires with the clicked star number (1-5).
const InteractiveStarRating = ({ value = 0, onRate, size = 22 }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <FaStar
            size={size}
            className={
              star <= (hovered || value)
                ? "text-orange-500"
                : "text-gray-200 dark:text-gray-600"
            }
          />
        </button>
      ))}
    </div>
  );
};

export default InteractiveStarRating;