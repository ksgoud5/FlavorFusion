// frontend/src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaUserShield, FaUser } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import LoadingSpinner from "../../components/LoadingSpinner";
import ConfirmDialog from "../../components/ConfirmDialog";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/toggle-admin`);
      setUsers(users.map((u) => (u._id === userId ? { ...u, isAdmin: res.data.isAdmin } : u)));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update admin status");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/admin/users/${deleteTarget._id}`);
      setUsers(users.filter((u) => u._id !== deleteTarget._id));
      toast.success("User deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">Manage Users ({users.length})</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:border dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-left">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map((u) => (
              <tr key={u._id} className="text-gray-700 dark:text-gray-200">
                <td className="px-6 py-3 font-medium">{u.name}</td>
                <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                <td className="px-6 py-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      u.isAdmin
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {u.isAdmin ? "Admin" : "User"}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-500 dark:text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleToggleAdmin(u._id)}
                      title={u.isAdmin ? "Demote to user" : "Promote to admin"}
                      className="text-gray-500 hover:text-purple-600"
                    >
                      {u.isAdmin ? <FaUser /> : <FaUserShield />}
                    </button>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      title="Delete user"
                      className="text-gray-500 hover:text-red-600"
                    >
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
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminUsers;