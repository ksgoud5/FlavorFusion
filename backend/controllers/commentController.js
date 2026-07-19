// backend/controllers/commentController.js
import Comment from "../models/Comment.js";
import Recipe from "../models/Recipe.js";

// @route   POST /api/comments/:recipeId
// @desc    Add a comment to a recipe
export const addComment = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Confirm the recipe actually exists before allowing a comment on it
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const comment = await Comment.create({
      recipe: recipeId,
      author: req.user.id,
      text: text.trim(),
    });

    // Populate author info before sending back, so frontend can display name/picture immediately
    const populatedComment = await comment.populate("author", "name profilePicture");

    res.status(201).json({ message: "Comment added", comment: populatedComment });
  } catch (error) {
    console.error("Add Comment Error:", error.message);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

// @route   GET /api/comments/:recipeId
// @desc    Get all comments for a specific recipe
export const getCommentsForRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const comments = await Comment.find({ recipe: recipeId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Get Comments Error:", error.message);
    res.status(500).json({ message: "Server error while fetching comments" });
  }
};

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment (only by its author)
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete Comment Error:", error.message);
    res.status(500).json({ message: "Server error while deleting comment" });
  }
};