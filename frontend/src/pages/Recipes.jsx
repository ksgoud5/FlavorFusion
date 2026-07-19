// frontend/src/pages/Recipes.jsx
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../components/LoadingSpinner";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Appetizer"];
const CUISINES = ["Italian", "Indian", "Chinese", "Mexican", "American", "Thai", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const Recipes = () => {
  // useSearchParams keeps our filters IN the URL (e.g. ?search=pasta&category=Dinner&page=2)
  // This means filters survive a page refresh and are shareable/bookmarkable links.
  const [searchParams, setSearchParams] = useSearchParams();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Read current filter values directly from the URL, with sensible defaults
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const cuisine = searchParams.get("cuisine") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page")) || 1;

  // Updates ONE filter in the URL at a time, always resetting to page 1
  // (since changing a filter should show fresh results from the start)
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const goToPage = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => setSearchParams({});

  // useCallback so this function has a stable identity across renders,
  // safe to use inside useEffect's dependency array below.
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (search) params.search = search;
      if (category) params.category = category;
      if (cuisine) params.cuisine = cuisine;
      if (difficulty) params.difficulty = difficulty;

      const res = await axiosInstance.get("/recipes", { params });
      setRecipes(res.data.recipes);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  }, [search, category, cuisine, difficulty, sort, page]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const activeFilterCount = [category, cuisine, difficulty].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {search ? `Results for "${search}"` : "All Recipes"}
          </h1>
          <p className="text-gray-500 mt-1">Discover recipes from our community</p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-gray-700"
        >
          <FaFilter /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className={`md:w-64 shrink-0 ${showMobileFilters ? "block" : "hidden"} md:block`}>
          <div className="bg-white rounded-xl shadow-sm p-5 sticky top-20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-sm text-orange-600 hover:underline">
                  Clear all
                </button>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
              <select
                value={cuisine}
                onChange={(e) => updateFilter("cuisine", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">All Cuisines</option>
                {CUISINES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => updateFilter("difficulty", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Any Difficulty</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostLiked">Most Liked</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {loading ? (
            <LoadingSpinner fullScreen />
          ) : recipes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl">
              <p className="text-gray-500 text-lg">No recipes found matching your criteria.</p>
              {(search || activeFilterCount > 0) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-orange-600 font-medium hover:underline"
                >
                  Clear filters and try again
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={goToPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;