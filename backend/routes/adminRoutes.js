// backend/routes/adminRoutes.js
import express from "express";
import {
  getStats,
  getAllUsers,
  deleteUser,
  toggleAdminStatus,
  getAllRecipesAdmin,
  deleteRecipeAdmin,
  createCategoryAdmin,
  deleteCategoryAdmin,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

// EVERY route in this file requires both: (1) valid login, (2) isAdmin === true.
// Applying both middlewares to router.use() means we don't have to repeat
// "protect, adminOnly" on every single line below.
router.use(protect, adminOnly);

router.get("/stats", getStats);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/toggle-admin", toggleAdminStatus);

router.get("/recipes", getAllRecipesAdmin);
router.delete("/recipes/:id", deleteRecipeAdmin);

router.post("/categories", createCategoryAdmin);
router.delete("/categories/:id", deleteCategoryAdmin);

export default router;