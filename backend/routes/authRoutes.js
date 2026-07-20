// backend/routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, getMe, updateProfile } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
// upload.single("profilePicture") handles ONE file under the field name "profilePicture"
// (different from recipe uploads which use .fields() for two named files)
router.put("/me", protect, upload.single("profilePicture"), updateProfile);

export default router;