// frontend/src/components/DynamicListInput.jsx
import { FaPlus, FaTrash } from "react-icons/fa";

// A reusable "add/remove list of text inputs" component.
// Used for both Ingredients and Steps, since they behave identically:
// an array of strings the user can add to, edit, or remove from.
const DynamicListInput = ({ label, items, setItems, placeholder }) => {
  const handleChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleAdd = () => {
    setItems([...items, ""]);
  };

  const handleRemove = (index) => {
    // Keep at least one input field visible at all times
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`${placeholder} ${index + 1}`}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={items.length === 1}
              className="px-3 text-gray-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 flex items-center gap-2 text-orange-600 text-sm font-medium hover:underline"
      >
        <FaPlus size={12} /> Add {label.slice(0, -1)}
      </button>
    </div>
  );
};

export default DynamicListInput;