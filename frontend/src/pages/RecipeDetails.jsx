// frontend/src/pages/RecipeDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaClock,
  FaFire,
  FaSignal,
  FaEdit,
  FaTrash,
  FaUserCircle,
  FaDrumstickBite,
  FaBreadSlice,
  FaTint,
  FaUsers
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { getImageUrl, getVideoUrl } from "../utils/imageUrl";
import LoadingSpinner from "../components/LoadingSpinner";
import CommentSection from "../components/CommentSection";
import ConfirmDialog from "../components/ConfirmDialog";
import StarRating from "../components/StarRating";
import InteractiveStarRating from "../components/InteractiveStarRating";
//import ShareMenu from "../components/ShareMenu";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [numRatings, setNumRatings] = useState(0);
  const [yourRating, setYourRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = isAuthenticated && recipe && user?.id === recipe.author?._id;

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/recipes/${id}`);
        setRecipe(res.data);
        setLikesCount(res.data.likesCount || 0);
        setAvgRating(res.data.avgRating || 0);
        setNumRatings(res.data.numRatings || 0);

        // Only check like status / your own rating if logged in (both require auth)
        if (isAuthenticated) {
          const [likeRes, ratingRes] = await Promise.all([
            axiosInstance.get(`/likes/${id}/status`),
            axiosInstance.get(`/ratings/${id}/my-rating`),
          ]);
          setLiked(likeRes.data.liked);
          setYourRating(ratingRes.data.yourRating);
        }
      } catch (error) {
        console.error("Failed to fetch recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like recipes");
      return;
    }
    // Optimistic UI update — flip the state immediately for a snappy feel,
    // then correct it if the API call actually fails.
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await axiosInstance.post(`/likes/${id}`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (error) {
      // Revert on failure
      setLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to update like");
    }
  };
  const handleRate = async (star) => {
    if (!isAuthenticated) {
      toast.error("Please login to rate recipes");
      return;
    }

    setSubmittingRating(true);
    try {
      const res = await axiosInstance.post(`/ratings/${id}`, { value: star });
      setAvgRating(res.data.avgRating);
      setNumRatings(res.data.numRatings);
      setYourRating(res.data.yourRating);
      toast.success("Rating submitted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save favorites");
      return;
    }
    const prevFavorited = favorited;
    setFavorited(!favorited);

    try {
      const res = await axiosInstance.post(`/favorites/${id}`);
      setFavorited(res.data.favorited);
      toast.success(res.data.favorited ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      setFavorited(prevFavorited);
      toast.error("Failed to update favorites");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/recipes/${id}`);
      toast.success("Recipe deleted successfully");
      navigate("/my-recipes");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete recipe");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Recipe not found.</p>
        <Link to="/recipes" className="text-orange-600 font-medium hover:underline">
          Back to Recipes
        </Link>
      </div>
    );
  }

  const difficultyColor = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyColor[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
              {recipe.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">{recipe.title}</h1>
          <div className="mt-2">
            <StarRating avgRating={avgRating} numRatings={numRatings} size={18} />
          </div>
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
            {recipe.author?.profilePicture ? (
              <img src={getImageUrl(recipe.author.profilePicture)} alt="" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <FaUserCircle className="w-6 h-6" />
            )}
            <span>by {recipe.author?.name || "Unknown"}</span>
            <span>•</span>
            <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2 shrink-0">
            <Link
              to={`/edit-recipe/${recipe._id}`}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <FaEdit /> Edit
            </Link>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <img
        src={getImageUrl(recipe.image)}
        alt={recipe.title}
        className="w-full h-72 md:h-96 object-cover rounded-2xl mb-6"
      />

     {/* Like / Favorite / Share bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-medium transition ${
            liked ? "bg-red-50 border-red-300 text-red-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {liked ? <FaHeart /> : <FaRegHeart />} {likesCount} {likesCount === 1 ? "Like" : "Likes"}
        </button>

        <button
          onClick={handleFavoriteToggle}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-medium transition ${
            favorited ? "bg-orange-50 border-orange-300 text-orange-600" : "border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {favorited ? <FaBookmark /> : <FaRegBookmark />} {favorited ? "Saved" : "Save"}
        </button>

        {/*<ShareMenu title={recipe.title} description={recipe.description} />*/}
      </div>
      {/* Rate this recipe */}
      <div className="mb-8 bg-white border border-gray-100 rounded-2xl p-5">
        <p className="text-sm font-medium text-gray-700 mb-2">
          {yourRating > 0 ? "Your rating" : "Rate this recipe"}
        </p>
        <InteractiveStarRating value={yourRating} onRate={handleRate} />
        {submittingRating && <p className="text-xs text-gray-400 mt-2">Saving...</p>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-orange-50 rounded-2xl p-5 mb-8 text-center">
        <div>
          <FaClock className="mx-auto text-orange-600 mb-1" />
          <p className="text-sm text-gray-500">Prep Time</p>
          <p className="font-bold text-gray-800">{recipe.prepTime} min</p>
        </div>
        <div>
          <FaFire className="mx-auto text-orange-600 mb-1" />
          <p className="text-sm text-gray-500">Cook Time</p>
          <p className="font-bold text-gray-800">{recipe.cookTime} min</p>
        </div>
        <div>
          <FaUsers className="mx-auto text-orange-600 mb-1" />
          <p className="text-sm text-gray-500">Servings</p>
          <p className="font-bold text-gray-800">{recipe.servings || 4}</p>
        </div>
        <div>
          <FaSignal className="mx-auto text-orange-600 mb-1" />
          <p className="text-sm text-gray-500">Cuisine</p>
          <p className="font-bold text-gray-800">{recipe.cuisine}</p>
        </div>

      </div>


      {/* Nutrition Facts (only shown if the author actually filled it in) */}
      {recipe.nutrition?.calories > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Nutrition Facts</h3>
          <p className="text-sm text-gray-400 mb-3">Per serving</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <FaFire className="mx-auto text-orange-500 mb-1" />
              <p className="text-lg font-bold text-gray-800">{recipe.nutrition.calories}</p>
              <p className="text-xs text-gray-500">Calories (kcal)</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <FaDrumstickBite className="mx-auto text-red-500 mb-1" />
              <p className="text-lg font-bold text-gray-800">{recipe.nutrition.protein}g</p>
              <p className="text-xs text-gray-500">Protein</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <FaBreadSlice className="mx-auto text-yellow-600 mb-1" />
              <p className="text-lg font-bold text-gray-800">{recipe.nutrition.carbs}g</p>
              <p className="text-xs text-gray-500">Carbs</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
              <FaTint className="mx-auto text-blue-500 mb-1" />
              <p className="text-lg font-bold text-gray-800">{recipe.nutrition.fat}g</p>
              <p className="text-xs text-gray-500">Fat</p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-600 leading-relaxed mb-8">{recipe.description}</p>

      {/* Video (only if uploaded) */}
      {recipe.video && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-3">Cooking Video</h3>
          <video
            src={getVideoUrl(recipe.video)}
            controls
            className="w-full rounded-2xl max-h-[500px] bg-black"
          >
            Your browser does not support video playback.
          </video>
        </div>
      )}

      {/* Ingredients + Steps */}
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-600">
                <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Steps</h3>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-orange-600 text-white text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-gray-600">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Comments */}
      <CommentSection recipeId={id} />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText={deleting ? "Deleting..." : "Delete"}
      />
    </div>
  );
};

export default RecipeDetails;