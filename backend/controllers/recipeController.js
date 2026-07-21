// backend/controllers/recipeController.js
import Recipe from "../models/Recipe.js";
import cloudinary from "../config/cloudinary.js";

// @route   POST /api/recipes
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
      servings,
      calories,
      protein,
      carbs,
      fat,
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

    // CHANGED: with CloudinaryStorage, req.files.image[0].path is now the
    // full Cloudinary URL (e.g. https://res.cloudinary.com/.../abc123.jpg),
    // and .filename is the Cloudinary public_id (needed later for deletion).
    const imagePath = req.files?.image ? req.files.image[0].path : "";
    const imagePublicId = req.files?.image ? req.files.image[0].filename : "";
    const videoPath = req.files?.video ? req.files.video[0].path : "";
    const videoPublicId = req.files?.video ? req.files.video[0].filename : "";

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
      servings: Number(servings) || 4,
      image: imagePath,
      imagePublicId,
      video: videoPath,
      videoPublicId,
      author: req.user.id,
      // All nutrition fields are optional — Number(undefined) is NaN, so we
      // fall back to 0 for any field the user left blank.
      nutrition: {
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      },
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

    const match = {};

    if (search) {
      match.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) match.category = category;
    if (cuisine) match.cuisine = cuisine;
    if (difficulty) match.difficulty = difficulty;

    // Maps a friendly "sort" query value to the actual field(s) to sort by.
    // Most of these fields (totalTime, numIngredients, numSteps) don't exist
    // on the document itself — they're computed below via $addFields.
    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      mostLiked: { likesCount: -1 },
      topRated: { avgRating: -1 },
      highProtein: { "nutrition.protein": -1 },
      quickest: { totalTime: 1 },
      fewestIngredients: { numIngredients: 1 },
      fewestSteps: { numSteps: 1 },
    };
    const sortStage = sortMap[sort] || sortMap.newest;

    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * limitNumber;

    const pipeline = [
      { $match: match },
      {
        // Compute the fields we might need to sort by. $ifNull guards
        // against older documents where an array field could be missing.
        $addFields: {
          totalTime: {
            $add: [{ $ifNull: ["$prepTime", 0] }, { $ifNull: ["$cookTime", 0] }],
          },
          numIngredients: { $size: { $ifNull: ["$ingredients", []] } },
          numSteps: { $size: { $ifNull: ["$steps", []] } },
        },
      },
      { $sort: sortStage },
      {
        // $facet runs two parallel sub-pipelines in a single DB round trip:
        // "data" gets the actual paginated results (with author populated
        // via $lookup, since aggregate doesn't support .populate()),
        // "totalCount" gets the total match count for pagination.
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limitNumber },
            {
              $lookup: {
                from: "users",
                let: { authorId: "$author" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$authorId"] } } },
                  { $project: { name: 1, profilePicture: 1 } },
                ],
                as: "author",
              },
            },
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Recipe.aggregate(pipeline);
    const recipes = result[0].data;
    const totalRecipes = result[0].totalCount[0]?.count || 0;

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

// @route   GET /api/recipes/user/my-recipes
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
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

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
      servings,
      calories,
      protein,
      carbs,
      fat,
    } = req.body;

    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (category) recipe.category = category;
    if (cuisine) recipe.cuisine = cuisine;
    if (difficulty) recipe.difficulty = difficulty;
    if (prepTime) recipe.prepTime = prepTime;
    if (cookTime) recipe.cookTime = cookTime;
    if (servings) recipe.servings = Number(servings);
    if (calories !== undefined || protein !== undefined || carbs !== undefined || fat !== undefined) {
      recipe.nutrition = {
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      };
    }

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

    // CHANGED: delete the OLD file from Cloudinary using its public_id
    // (cloudinary.uploader.destroy), instead of fs.unlink on a local path.
    if (req.files?.image) {
      if (recipe.imagePublicId) {
        await cloudinary.uploader.destroy(recipe.imagePublicId).catch((err) =>
          console.error("Failed to delete old image from Cloudinary:", err.message)
        );
      }
      recipe.image = req.files.image[0].path;
      recipe.imagePublicId = req.files.image[0].filename;
    }

    if (req.files?.video) {
      if (recipe.videoPublicId) {
        await cloudinary.uploader
          .destroy(recipe.videoPublicId, { resource_type: "video" })
          .catch((err) => console.error("Failed to delete old video from Cloudinary:", err.message));
      }
      recipe.video = req.files.video[0].path;
      recipe.videoPublicId = req.files.video[0].filename;
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
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    // CHANGED: delete from Cloudinary instead of local disk
    if (recipe.imagePublicId) {
      await cloudinary.uploader.destroy(recipe.imagePublicId).catch((err) =>
        console.error("Failed to delete image from Cloudinary:", err.message)
      );
    }
    if (recipe.videoPublicId) {
      await cloudinary.uploader
        .destroy(recipe.videoPublicId, { resource_type: "video" })
        .catch((err) => console.error("Failed to delete video from Cloudinary:", err.message));
    }

    await recipe.deleteOne();

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Delete Recipe Error:", error.message);
    res.status(500).json({ message: "Server error while deleting recipe" });
  }
};