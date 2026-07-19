// backend/controllers/recipeController.js
import Recipe from "../models/Recipe.js";

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

    // Basic validation
    if (!title || !description || !ingredients || !steps || !category || !cuisine || !prepTime || !cookTime) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // ingredients and steps arrive as JSON strings from FormData (since FormData can't send arrays directly)
    // so we parse them back into real arrays
    let parsedIngredients, parsedSteps;
    try {
      parsedIngredients = JSON.parse(ingredients);
      parsedSteps = JSON.parse(steps);
    } catch (err) {
      return res.status(400).json({ message: "Ingredients and steps must be valid arrays" });
    }

    // req.files comes from multer when using .fields() — check which files were uploaded
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
      author: req.user.id, // comes from our authMiddleware (protect)
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
// @desc    Get all recipes (basic version — full search/filter comes later)
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("author", "name profilePicture") // pulls in author's name + picture instead of just their ID
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(recipes);
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
    res.status(500).json({ message: "Server error while fetching recipe" });
  }
};