// frontend/src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUtensils } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import RecipeCard from "../components/RecipeCard";
import CategoryCard from "../components/CategoryCard";
import SectionHeader from "../components/SectionHeader";
import LoadingSpinner from "../components/LoadingSpinner";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Run all three requests in parallel — they don't depend on each other,
        // so there's no reason to wait for one before starting the next.
        const [trendingRes, latestRes, categoriesRes] = await Promise.all([
          axiosInstance.get("/recipes", { params: { sort: "mostLiked", limit: 6 } }),
          axiosInstance.get("/recipes", { params: { sort: "newest", limit: 8 } }),
          axiosInstance.get("/categories"),
        ]);

        setTrending(trendingRes.data.recipes);
        setLatest(latestRes.data.recipes);
        setCategories(categoriesRes.data.slice(0, 6)); // show max 6 on homepage
      } catch (error) {
        console.error("Failed to load homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-5 leading-tight">
            Discover & Share <br className="hidden md:block" />
            <span className="text-orange-600">Delicious Recipes</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Join a community of home cooks sharing their favorite recipes, tips, and food stories from around the world.
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for pasta, curry, tacos..."
              className="w-full rounded-full py-4 pl-6 pr-14 text-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 text-white p-3 rounded-full hover:bg-orange-700 transition"
            >
              <FaSearch />
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["Breakfast", "Dinner", "Dessert", "Vegan"].map((tag) => (
              <Link
                key={tag}
                to={`/recipes?search=${tag}`}
                className="bg-white/80 backdrop-blur text-gray-700 text-sm px-4 py-1.5 rounded-full hover:bg-white transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          {/* Categories */}
          {categories.length > 0 && (
            <section>
              <SectionHeader
                title="Browse by Category"
                subtitle="Find recipes by meal type"
                viewAllLink="/categories"
              />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <CategoryCard key={cat._id} category={cat} />
                ))}
              </div>
            </section>
          )}

          {/* Trending */}
          <section>
            <SectionHeader
              title="🔥 Trending Recipes"
              subtitle="Community favorites, most liked this month"
              viewAllLink="/recipes?sort=mostLiked"
            />
            {trending.length === 0 ? (
              <p className="text-gray-400">No trending recipes yet — be the first to get liked!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trending.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}
          </section>

          {/* Latest */}
          <section>
            <SectionHeader
              title="🆕 Latest Recipes"
              subtitle="Freshly published by our community"
              viewAllLink="/recipes?sort=newest"
            />
            {latest.length === 0 ? (
              <p className="text-gray-400">No recipes published yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latest.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="bg-orange-600 rounded-3xl p-10 md:p-14 text-center text-white">
            <FaUtensils className="text-4xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Got a recipe worth sharing?</h2>
            <p className="text-orange-100 mb-6 max-w-lg mx-auto">
              Join FlavorFusion and share your favorite dishes with home cooks around the world.
            </p>
            <Link
              to="/add-recipe"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-orange-50 transition"
            >
              Share Your Recipe
            </Link>
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;