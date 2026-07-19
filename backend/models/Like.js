// backend/models/Like.js
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index: ensures a single user can only like a single recipe ONCE.
// MongoDB will reject any attempt to insert a duplicate (same user + same recipe) pair.
likeSchema.index({ recipe: 1, user: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;