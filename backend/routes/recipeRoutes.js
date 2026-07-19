// backend/routes/recipeRoutes.js
import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
} from "../controllers/recipeController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

// upload.fields() lets us accept TWO different files in one request:
// - "image" field (max 1 file)
// - "video" field (max 1 file)
// Both are optional — a user can submit just an image, just a video, both, or neither.
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createRecipe
);

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);

export default router;