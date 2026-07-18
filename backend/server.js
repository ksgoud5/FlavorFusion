
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());           // Allows frontend (different port) to call this API
app.use(express.json());   // Allows Express to read JSON data from request bodies

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to FlavorFusion API 🍲" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});