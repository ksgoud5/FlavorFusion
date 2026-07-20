// frontend/src/components/SkeletonCard.jsx
// A "shimmer placeholder" shown while recipe data is loading, shaped
// exactly like a real RecipeCard so the page doesn't jump/reflow once
// real data arrives — a well-known pattern used by YouTube, LinkedIn, etc.
const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:border dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="flex justify-between pt-3 border-t dark:border-gray-700">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;