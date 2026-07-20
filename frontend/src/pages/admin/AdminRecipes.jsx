// frontend/src/pages/admin/AdminRecipes.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrash, FaExternalLinkAlt } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import LoadingSpinner from "../../components/LoadingSpinner";
import ConfirmDialog from "../../components/ConfirmDialog";

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchRecipes = async () => {
    try {
      const res = await axiosInstance.get("/admin/recipes");
      setRecipes(res.data);
    } catch (error) {
      toast.error("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/recipes/${deleteTarget._id}`);
      setRecipes(recipes.filter((r) => r._id !== deleteTarget._id));
      toast.success("Recipe deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete recipe");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">Manage Recipes ({recipes.length})</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:border dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-left">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Author</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Likes</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {recipes.map((r) => (
              <tr key={r._id} className="text-gray-700 dark:text-gray-200">
                <td className="px-6 py-3 font-medium max-w-xs truncate">{r.title}</td>
                <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{r.author?.name || "Unknown"}</td>
                <td className="px-6 py-3">{r.category}</td>
                <td className="px-6 py-3">{r.likesCount}</td>
                <td className="px-6 py-3">
                  <div className="flex justify-end gap-3">
                    <Link to={`/recipes/${r._id}`} target="_blank" title="View" className="text-gray-500 hover:text-orange-600">
                      <FaExternalLinkAlt />
                    </Link>
                    <button onClick={() => setDeleteTarget(r)} title="Delete recipe" className="text-gray-500 hover:text-red-600">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminRecipes;