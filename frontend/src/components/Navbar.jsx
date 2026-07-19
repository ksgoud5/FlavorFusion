// frontend/src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            🍲 FlavorFusion
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipes..."
                className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/recipes" className="text-gray-700 hover:text-orange-600 font-medium">
              Recipes
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-orange-600 font-medium">
              Categories
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="text-gray-700 hover:text-orange-600 text-xl">
                  <FaHeart />
                </Link>
                <Link to="/add-recipe" className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition">
                  + Add Recipe
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700">
                    <FaUserCircle className="text-2xl" />
                    <span className="font-medium">{user?.name?.split(" ")[0]}</span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Profile
                    </Link>
                    <Link to="/my-recipes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Recipes
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-orange-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-2xl text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recipes..."
                className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 text-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>
            <Link to="/recipes" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Recipes</Link>
            <Link to="/categories" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Categories</Link>

            {isAuthenticated ? (
              <>
                <Link to="/favorites" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Favorites</Link>
                <Link to="/add-recipe" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Add Recipe</Link>
                <Link to="/my-recipes" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">My Recipes</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">My Profile</Link>
                <button onClick={handleLogout} className="text-left text-red-600 font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;