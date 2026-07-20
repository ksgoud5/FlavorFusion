// backend/controllers/adminController.js
import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import Category from "../models/Category.js";
import Comment from "../models/Comment.js";
import cloudinary from "../config/cloudinary.js";

// @route   GET /api/admin/stats
// @desc    Dashboard summary numbers
export const getStats = async (req, res) => {
  try {
    const [userCount, recipeCount, categoryCount, commentCount] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Category.countDocuments(),
      Comment.countDocuments(),
    ]);

    res.status(200).json({ userCount, recipeCount, categoryCount, commentCount });
  } catch (error) {
    console.error("Admin Stats Error:", error.message);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Admin Get Users Error:", error.message);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// @route   DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Safety guard: an admin should never be able to delete their own account
    // through this panel (prevents accidental total lockout).
    if (targetUser._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account here" });
    }

    await targetUser.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin Delete User Error:", error.message);
    res.status(500).json({ message: "Server error deleting user" });
  }
};

// @route   PUT /api/admin/users/:id/toggle-admin
// @desc    Promote a regular user to admin, or demote an admin back to regular
export const toggleAdminStatus = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot change your own admin status" });
    }

    targetUser.isAdmin = !targetUser.isAdmin;
    await targetUser.save();

    res.status(200).json({
      message: `User ${targetUser.isAdmin ? "promoted to" : "demoted from"} admin`,
      isAdmin: targetUser.isAdmin,
    });
  } catch (error) {
    console.error("Admin Toggle Admin Error:", error.message);
    res.status(500).json({ message: "Server error updating admin status" });
  }
};

// @route   GET /api/admin/recipes
export const getAllRecipesAdmin = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Admin Get Recipes Error:", error.message);
    res.status(500).json({ message: "Server error fetching recipes" });
  }
};

// @route   DELETE /api/admin/recipes/:id
// @desc    Admin can delete ANY recipe, regardless of author (unlike the
// regular user-facing deleteRecipe, which only allows deleting your own)
export const deleteRecipeAdmin = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.imagePublicId) {
      await cloudinary.uploader.destroy(recipe.imagePublicId).catch(() => {});
    }
    if (recipe.videoPublicId) {
      await cloudinary.uploader.destroy(recipe.videoPublicId, { resource_type: "video" }).catch(() => {});
    }

    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Recipe Error:", error.message);
    res.status(500).json({ message: "Server error deleting recipe" });
  }
};

// @route   POST /api/admin/categories
export const createCategoryAdmin = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, image: image || "" });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error("Admin Create Category Error:", error.message);
    res.status(500).json({ message: "Server error creating category" });
  }
};

// @route   DELETE /api/admin/categories/:id
export const deleteCategoryAdmin = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Category Error:", error.message);
    res.status(500).json({ message: "Server error deleting category" });
  }
};