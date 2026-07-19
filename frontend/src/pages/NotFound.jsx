// frontend/src/pages/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-extrabold text-orange-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! This page doesn't exist.</p>
      <Link
        to="/"
        className="bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;