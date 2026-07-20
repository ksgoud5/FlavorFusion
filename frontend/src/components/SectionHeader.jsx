// frontend/src/components/SectionHeader.jsx
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

// A reusable "Section Title + optional 'View All' link" header,
// used above Trending, Latest, and Categories sections on the Home page.
const SectionHeader = ({ title, subtitle, viewAllLink }) => {
  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center gap-1 text-orange-600 font-medium hover:underline shrink-0"
        >
          View All <FaArrowRight size={12} />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;