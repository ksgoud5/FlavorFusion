// backend/routes/recipeRoutes.js
import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

const recipeUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

// IMPORTANT: specific routes like "/user/my-recipes" must be declared
// BEFORE the dynamic "/:id" route, otherwise Express will think
// "my-recipes" is an :id value and try to look up a recipe with that ID.
router.get("/user/my-recipes", protect, getMyRecipes);

router.post("/", protect, recipeUpload, createRecipe);
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", protect, recipeUpload, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

export default router;