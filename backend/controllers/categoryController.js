// backend/controllers/categoryController.js
import Category from "../models/Category.js";

// @route   GET /api/categories
// @desc    Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get Categories Error:", error.message);
    res.status(500).json({ message: "Server error while fetching categories" });
  }
};

// @route   POST /api/categories
// @desc    Create a new category (admin-style action, but open to any logged-in user for now)
export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, image: image || "" });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error("Create Category Error:", error.message);
    res.status(500).json({ message: "Server error while creating category" });
  }
};