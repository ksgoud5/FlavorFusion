// frontend/src/utils/ratingColors.js
// Maps an average rating to a Tailwind color class — this is what makes
// the stars visually communicate quality at a glance, not just the number.
export const getRatingColor = (avg) => {
  if (!avg || avg === 0) return "text-gray-300 dark:text-gray-600"; // no ratings yet
  if (avg < 2) return "text-red-500";
  if (avg < 3) return "text-orange-500";
  if (avg < 4) return "text-yellow-500";
  return "text-green-500"; // 4.0 and up
};