// frontend/src/pages/About.jsx
import { Link } from "react-router-dom";
import { FaUtensils, FaUsers, FaHeart, FaGlobeAmericas } from "react-icons/fa";

const About = () => {
  const values = [
    {
      icon: <FaUtensils />,
      title: "Real Recipes",
      description: "Every recipe is shared by a real home cook, tested in a real kitchen.",
    },
    {
      icon: <FaUsers />,
      title: "Community First",
      description: "Comment, like, and connect with fellow food lovers from around the world.",
    },
    {
      icon: <FaHeart />,
      title: "Made with Passion",
      description: "We believe great food brings people together, one recipe at a time.",
    },
    {
      icon: <FaGlobeAmericas />,
      title: "Global Flavors",
      description: "From Italian classics to Thai street food — explore cuisines from everywhere.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          About <span className="text-orange-600">FlavorFusion</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          We're building a home for people who love to cook, share, and discover recipes from every corner of the world.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              FlavorFusion started with a simple idea: cooking is better when it's shared. What began as a small
              collection of family recipes has grown into a community platform where home cooks from around the
              world can publish their creations, discover new dishes, and connect over their shared love of food.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're a seasoned chef or just starting out in the kitchen, FlavorFusion gives you the tools
              to document your recipes beautifully — with photos, videos, step-by-step instructions, and a
              community ready to try what you've made.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800"
            alt="Cooking together"
            className="rounded-2xl w-full h-72 object-cover"
          />
        </div>

        {/* Values */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <div className="text-orange-600 text-3xl flex justify-center mb-3">{value.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to join the community?</h2>
          <Link
            to="/register"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition"
          >
            Get Started — It's Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;