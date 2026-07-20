// backend/controllers/ratingController.js
import Rating from "../models/Rating.js";
import Recipe from "../models/Recipe.js";

// @route   POST /api/ratings/:recipeId
// @desc    Submit or update the logged-in user's rating for a recipe
export const submitRating = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { value } = req.body;
    const userId = req.user.id;

    const numValue = Number(value);
    if (!numValue || numValue < 1 || numValue > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Upsert: create a new rating, OR overwrite the user's existing one
    // for this recipe if they're changing their mind.
    await Rating.findOneAndUpdate(
      { recipe: recipeId, user: userId },
      { value: numValue },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Recompute the average from scratch across ALL ratings for this recipe,
    // rather than trying to incrementally patch the old average — simpler
    // and immune to drift when a user changes an existing rating.
    const stats = await Rating.aggregate([
      { $match: { recipe: recipe._id } },
      { $group: { _id: "$recipe", avg: { $avg: "$value" }, count: { $sum: 1 } } },
    ]);

    const avg = stats.length ? Math.round(stats[0].avg * 10) / 10 : 0; // rounded to 1 decimal
    const count = stats.length ? stats[0].count : 0;

    recipe.avgRating = avg;
    recipe.numRatings = count;
    await recipe.save();

    res.status(200).json({
      message: "Rating submitted",
      avgRating: avg,
      numRatings: count,
      yourRating: numValue,
    });
  } catch (error) {
    console.error("Submit Rating Error:", error.message);
    res.status(500).json({ message: "Server error while submitting rating" });
  }
};

// @route   GET /api/ratings/:recipeId/my-rating
// @desc    Get the logged-in user's own rating for a recipe (0 if they haven't rated it)
export const getMyRating = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const rating = await Rating.findOne({ recipe: recipeId, user: req.user.id });
    res.status(200).json({ yourRating: rating ? rating.value : 0 });
  } catch (error) {
    console.error("Get My Rating Error:", error.message);
    res.status(500).json({ message: "Server error while fetching your rating" });
  }
};