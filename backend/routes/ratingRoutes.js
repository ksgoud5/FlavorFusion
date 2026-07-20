// backend/routes/ratingRoutes.js
import express from "express";
import { submitRating, getMyRating } from "../controllers/ratingController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:recipeId", protect, submitRating);
router.get("/:recipeId/my-rating", protect, getMyRating);

export default router;