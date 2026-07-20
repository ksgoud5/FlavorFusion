// backend/models/Recipe.js
import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    ingredients: {
      type: [String], // array of ingredient strings, e.g. ["2 cups flour", "1 tsp salt"]
      required: [true, "At least one ingredient is required"],
    },
    steps: {
      type: [String], // array of instruction steps
      required: [true, "At least one step is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"], // e.g. "Dessert", "Breakfast"
    },
    cuisine: {
      type: String,
      required: [true, "Cuisine is required"], // e.g. "Italian", "Indian"
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"], // only these 3 values are allowed
      default: "Easy",
    },
    prepTime: {
      type: Number, // in minutes
      required: [true, "Preparation time is required"],
    },
    cookTime: {
      type: Number, // in minutes
      required: [true, "Cooking time is required"],
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
    },
    video: {
      type: String,
      default: "",
    },
    videoPublicId: {
      type: String,
      default: "",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // reference to the User who created this recipe
      ref: "User",
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
    },
    servings: {
      type: Number,
      default: 4,
    },
    // Denormalized rating summary, kept in sync by ratingController whenever
    // someone submits/updates a rating — same pattern as likesCount.
    avgRating: {
      type: Number,
      default: 0,
    },
    numRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;