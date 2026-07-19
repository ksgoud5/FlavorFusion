// backend/controllers/likeController.js
import Like from "../models/Like.js";
import Recipe from "../models/Recipe.js";

// @route   POST /api/likes/:recipeId
// @desc    Toggle like/unlike on a recipe
export const toggleLike = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Check if this user already liked this recipe
    const existingLike = await Like.findOne({ recipe: recipeId, user: userId });

    if (existingLike) {
      // Already liked -> unlike it (remove the like, decrement counter)
      await existingLike.deleteOne();
      recipe.likesCount = Math.max(0, recipe.likesCount - 1);
      await recipe.save();

      return res.status(200).json({
        message: "Recipe unliked",
        liked: false,
        likesCount: recipe.likesCount,
      });
    } else {
      // Not liked yet -> like it (create the like, increment counter)
      await Like.create({ recipe: recipeId, user: userId });
      recipe.likesCount += 1;
      await recipe.save();

      return res.status(200).json({
        message: "Recipe liked",
        liked: true,
        likesCount: recipe.likesCount,
      });
    }
  } catch (error) {
    console.error("Toggle Like Error:", error.message);
    res.status(500).json({ message: "Server error while toggling like" });
  }
};

// @route   GET /api/likes/:recipeId/status
// @desc    Check if the logged-in user has liked a specific recipe
export const getLikeStatus = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const existingLike = await Like.findOne({
      recipe: recipeId,
      user: req.user.id,
    });

    res.status(200).json({ liked: !!existingLike });
  } catch (error) {
    console.error("Get Like Status Error:", error.message);
    res.status(500).json({ message: "Server error while checking like status" });
  }
};