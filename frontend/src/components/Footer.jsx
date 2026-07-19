// frontend/src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">🍲 FlavorFusion</h3>
            <p className="text-sm text-gray-400">
              A place for home cooks to share, discover, and celebrate great recipes.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/recipes" className="hover:text-orange-400">Recipes</Link></li>
              <li><Link to="/categories" className="hover:text-orange-400">Categories</Link></li>
              <li><Link to="/about" className="hover:text-orange-400">About</Link></li>
              <li><Link to="/contact" className="hover:text-orange-400">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Follow Us</h4>
            <div className="flex gap-4 text-xl">
              <a href="#" className="hover:text-orange-400"><FaInstagram /></a>
              <a href="#" className="hover:text-orange-400"><FaFacebook /></a>
              <a href="#" className="hover:text-orange-400"><FaTwitter /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} FlavorFusion. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;