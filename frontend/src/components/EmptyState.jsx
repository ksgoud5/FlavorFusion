// frontend/src/components/EmptyState.jsx
import { Link } from "react-router-dom";

const EmptyState = ({ icon, title, message, actionText, actionLink }) => {
  return (
    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm dark:border dark:border-gray-700">
      {icon && <div className="text-5xl text-gray-300 dark:text-gray-600 mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-700 transition"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;