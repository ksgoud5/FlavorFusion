// backend/controllers/favoriteController.js
import Favorite from "../models/Favorite.js";
import Recipe from "../models/Recipe.js";

// @route   POST /api/favorites/:recipeId
// @desc    Toggle favorite/unfavorite on a recipe
export const toggleFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const existingFavorite = await Favorite.findOne({
      recipe: recipeId,
      user: userId,
    });

    if (existingFavorite) {
      await existingFavorite.deleteOne();
      return res.status(200).json({ message: "Removed from favorites", favorited: false });
    } else {
      await Favorite.create({ recipe: recipeId, user: userId });
      return res.status(200).json({ message: "Added to favorites", favorited: true });
    }
  } catch (error) {
    console.error("Toggle Favorite Error:", error.message);
    res.status(500).json({ message: "Server error while toggling favorite" });
  }
};

// @route   GET /api/favorites
// @desc    Get all recipes the logged-in user has favorited
export const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: "recipe",
        populate: { path: "author", select: "name profilePicture" },
      })
      .sort({ createdAt: -1 });

    // We only care about the recipe data itself, not the favorite wrapper record
    const recipes = favorites
      .map((fav) => fav.recipe)
      .filter((recipe) => recipe !== null); // in case a favorited recipe was deleted

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Get Favorites Error:", error.message);
    res.status(500).json({ message: "Server error while fetching favorites" });
  }
};