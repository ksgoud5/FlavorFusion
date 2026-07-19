// backend/controllers/recipeController.js
import Recipe from "../models/Recipe.js";
import fs from "fs";

// @route   POST /api/recipes
// @desc    Create a new recipe (with optional image + video upload)
export const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      category,
      cuisine,
      difficulty,
      prepTime,
      cookTime,
    } = req.body;

    if (!title || !description || !ingredients || !steps || !category || !cuisine || !prepTime || !cookTime) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    let parsedIngredients, parsedSteps;
    try {
      parsedIngredients = JSON.parse(ingredients);
      parsedSteps = JSON.parse(steps);
    } catch (err) {
      return res.status(400).json({ message: "Ingredients and steps must be valid arrays" });
    }

    const imagePath = req.files?.image ? `/uploads/images/${req.files.image[0].filename}` : "";
    const videoPath = req.files?.video ? `/uploads/videos/${req.files.video[0].filename}` : "";

    const newRecipe = await Recipe.create({
      title,
      description,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      category,
      cuisine,
      difficulty: difficulty || "Easy",
      prepTime,
      cookTime,
      image: imagePath,
      video: videoPath,
      author: req.user.id,
    });

    res.status(201).json({
      message: "Recipe created successfully",
      recipe: newRecipe,
    });
  } catch (error) {
    console.error("Create Recipe Error:", error.message);
    res.status(500).json({ message: "Server error while creating recipe" });
  }
};

// @route   GET /api/recipes
// @desc    Get all recipes with search, filter, sort, and pagination
// @query   search, category, cuisine, difficulty, sort, page, limit
export const getAllRecipes = async (req, res) => {
  try {
    const {
      search,
      category,
      cuisine,
      difficulty,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build a MongoDB filter object dynamically based on which query params were sent
    const filter = {};

    if (search) {
      // $or means "match ANY of these conditions"
      // $regex with "i" option = case-insensitive partial text match
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (cuisine) filter.cuisine = cuisine;
    if (difficulty) filter.difficulty = difficulty;

    // Decide sort order
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "mostLiked") sortOption = { likesCount: -1 };

    // Pagination math
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * limitNumber;

    // Run the query and count total matches (for frontend pagination controls)
    const [recipes, totalRecipes] = await Promise.all([
      Recipe.find(filter)
        .populate("author", "name profilePicture")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber),
      Recipe.countDocuments(filter),
    ]);

    res.status(200).json({
      recipes,
      totalRecipes,
      totalPages: Math.ceil(totalRecipes / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Get Recipes Error:", error.message);
    res.status(500).json({ message: "Server error while fetching recipes" });
  }
};

// @route   GET /api/recipes/:id
// @desc    Get a single recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "author",
      "name profilePicture"
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error("Get Recipe Error:", error.message);
    // Invalid MongoDB ObjectId format also lands here
    res.status(500).json({ message: "Server error while fetching recipe" });
  }
};

// @route   GET /api/recipes/user/my-recipes
// @desc    Get all recipes created by the currently logged-in user
export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Get My Recipes Error:", error.message);
    res.status(500).json({ message: "Server error while fetching your recipes" });
  }
};

// @route   PUT /api/recipes/:id
// @desc    Update a recipe (only by its original author)
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Ownership check — compare the logged-in user's ID with the recipe's author ID
    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this recipe" });
    }

    const {
      title,
      description,
      ingredients,
      steps,
      category,
      cuisine,
      difficulty,
      prepTime,
      cookTime,
    } = req.body;

    // Only update fields that were actually sent (partial update support)
    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (category) recipe.category = category;
    if (cuisine) recipe.cuisine = cuisine;
    if (difficulty) recipe.difficulty = difficulty;
    if (prepTime) recipe.prepTime = prepTime;
    if (cookTime) recipe.cookTime = cookTime;

    if (ingredients) {
      try {
        recipe.ingredients = JSON.parse(ingredients);
      } catch (err) {
        return res.status(400).json({ message: "Ingredients must be a valid array" });
      }
    }

    if (steps) {
      try {
        recipe.steps = JSON.parse(steps);
      } catch (err) {
        return res.status(400).json({ message: "Steps must be a valid array" });
      }
    }

    // If a new image was uploaded, delete the old one from disk and replace it
    if (req.files?.image) {
      if (recipe.image) {
        const oldImagePath = `.${recipe.image}`; // e.g. "./uploads/images/old.jpg"
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old image:", err.message);
        });
      }
      recipe.image = `/uploads/images/${req.files.image[0].filename}`;
    }

    // Same logic for video
    if (req.files?.video) {
      if (recipe.video) {
        const oldVideoPath = `.${recipe.video}`;
        fs.unlink(oldVideoPath, (err) => {
          if (err) console.error("Failed to delete old video:", err.message);
        });
      }
      recipe.video = `/uploads/videos/${req.files.video[0].filename}`;
    }

    const updatedRecipe = await recipe.save();

    res.status(200).json({
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error("Update Recipe Error:", error.message);
    res.status(500).json({ message: "Server error while updating recipe" });
  }
};

// @route   DELETE /api/recipes/:id
// @desc    Delete a recipe (only by its original author)
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    // Clean up uploaded files from disk before deleting the database record
    if (recipe.image) {
      fs.unlink(`.${recipe.image}`, (err) => {
        if (err) console.error("Failed to delete image file:", err.message);
      });
    }
    if (recipe.video) {
      fs.unlink(`.${recipe.video}`, (err) => {
        if (err) console.error("Failed to delete video file:", err.message);
      });
    }

    await recipe.deleteOne();

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete Recipe Error:", error.message);
    res.status(500).json({ message: "Server error while deleting recipe" });
  }
};