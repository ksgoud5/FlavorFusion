// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Needed to resolve __dirname in ES Modules (not available by default like in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images/videos as static files
// e.g. a file saved at uploads/images/123.jpg becomes accessible at
// http://localhost:5000/uploads/images/123.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to FlavorFusion API 🍲" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

// Global error handler for Multer errors (file too large, wrong type, etc.)
app.use((err, req, res, next) => {
  if (err) {
    console.error("Error:", err.message);
    return res.status(400).json({ message: err.message });
  }
  next();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});