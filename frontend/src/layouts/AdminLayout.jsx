// frontend/src/layouts/AdminLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaUtensils, FaThLarge, FaArrowLeft } from "react-icons/fa";

// A completely separate layout from MainLayout — no public Navbar/Footer,
// instead a dedicated admin sidebar. Admin panels are conventionally
// visually distinct from the public-facing site.
const AdminLayout = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-orange-600 text-white"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-5 shrink-0">
        <h1 className="text-xl font-bold text-orange-600 mb-8">🍲 FlavorFusion Admin</h1>
        <nav className="space-y-1">
          <NavLink to="/admin" end className={navLinkClass}>
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClass}>
            <FaUsers /> Users
          </NavLink>
          <NavLink to="/admin/recipes" className={navLinkClass}>
            <FaUtensils /> Recipes
          </NavLink>
          <NavLink to="/admin/categories" className={navLinkClass}>
            <FaThLarge /> Categories
          </NavLink>
        </nav>

        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 mt-8 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600"
        >
          <FaArrowLeft /> Back to Site
        </NavLink>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;