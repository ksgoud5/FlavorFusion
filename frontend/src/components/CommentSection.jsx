// frontend/src/components/CommentSection.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaUserCircle } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUrl";

const CommentSection = ({ recipeId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/${recipeId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/comments/${recipeId}`, {
        text: newComment.trim(),
      });
      // Add the new comment to the TOP of the list instantly, instead of refetching everything
      setComments([res.data.comment, ...comments]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Comments ({comments.length})
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            maxLength={500}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-orange-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-orange-700 disabled:opacity-60"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="text-gray-500 mb-6 text-sm">
          Please log in to leave a comment.
        </p>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-3 bg-gray-50 rounded-xl p-4">
              {comment.author?.profilePicture ? (
                <img
                  src={getImageUrl(comment.author.profilePicture)}
                  alt={comment.author.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
              ) : (
                <FaUserCircle className="w-9 h-9 text-gray-300 shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800 text-sm">
                    {comment.author?.name || "Unknown User"}
                  </p>
                  {user?.id === comment.author?._id && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete comment"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{comment.text}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(comment.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;