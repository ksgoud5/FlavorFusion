// backend/routes/commentRoutes.js
import express from "express";
import {
  addComment,
  getCommentsForRecipe,
  deleteComment,
} from "../controllers/commentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:recipeId", protect, addComment);
router.get("/:recipeId", getCommentsForRecipe);
router.delete("/:commentId", protect, deleteComment);

export default router;