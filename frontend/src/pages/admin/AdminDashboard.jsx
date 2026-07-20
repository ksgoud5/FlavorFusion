// frontend/src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { FaUsers, FaUtensils, FaThLarge, FaComments } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const cards = [
    { label: "Total Users", value: stats?.userCount ?? 0, icon: <FaUsers />, color: "bg-blue-500" },
    { label: "Total Recipes", value: stats?.recipeCount ?? 0, icon: <FaUtensils />, color: "bg-orange-500" },
    { label: "Categories", value: stats?.categoryCount ?? 0, icon: <FaThLarge />, color: "bg-green-500" },
    { label: "Comments", value: stats?.commentCount ?? 0, icon: <FaComments />, color: "bg-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:border dark:border-gray-700 p-6">
            <div className={`${card.color} text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4`}>
              {card.icon}
            </div>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{card.value}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;