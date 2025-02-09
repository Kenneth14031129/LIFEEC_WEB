import { useState, useEffect } from "react";
import { X, Plus, Trash2, Calendar } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const MealUpdateModal = ({
  isOpen,
  onClose,
  onSubmit,
  isAddingNew,
  mealRecords,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    dietaryNeeds: "",
    nutritionalGoals: "",
    breakfast: [""],
    lunch: [""],
    snacks: [""],
    dinner: [""],
  });

  // Initialize form with data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isAddingNew) {
        // Reset form for new entry
        setFormData({
          date: new Date().toISOString().split("T")[0],
          dietaryNeeds: "",
          nutritionalGoals: "",
          breakfast: [""],
          lunch: [""],
          snacks: [""],
          dinner: [""],
        });
      } else if (mealRecords && mealRecords.length > 0) {
        // Get the latest record
        const latestRecord = mealRecords[0];

        // Initialize form with latest record data
        setFormData({
          date: latestRecord.date,
          dietaryNeeds: latestRecord.dietaryNeeds || "",
          nutritionalGoals: latestRecord.nutritionalGoals || "",
          breakfast: Array.isArray(latestRecord.breakfast)
            ? latestRecord.breakfast
            : [""],
          lunch: Array.isArray(latestRecord.lunch) ? latestRecord.lunch : [""],
          snacks: Array.isArray(latestRecord.snacks)
            ? latestRecord.snacks
            : [""],
          dinner: Array.isArray(latestRecord.dinner)
            ? latestRecord.dinner
            : [""],
        });
      }
    }
  }, [isOpen, isAddingNew, mealRecords]);

  // Handle adding a new item to a meal array
  const handleAddMealItem = (mealType) => {
    setFormData((prev) => ({
      ...prev,
      [mealType]: [...prev[mealType], ""],
    }));
  };

  // Handle removing an item from a meal array
  const handleRemoveMealItem = (mealType, index) => {
    setFormData((prev) => ({
      ...prev,
      [mealType]: prev[mealType].filter((_, i) => i !== index),
    }));
  };

  // Handle updating a specific meal item
  const handleMealItemChange = (mealType, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [mealType]: prev[mealType].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out empty items from arrays before submitting
    const cleanedData = {
      ...formData,
      breakfast: formData.breakfast.filter((item) => item.trim()),
      lunch: formData.lunch.filter((item) => item.trim()),
      snacks: formData.snacks.filter((item) => item.trim()),
      dinner: formData.dinner.filter((item) => item.trim()),
    };

    if (
      !cleanedData.breakfast.length &&
      !cleanedData.lunch.length &&
      !cleanedData.snacks.length &&
      !cleanedData.dinner.length
    ) {
      toast.error("Please add at least one meal item");
      return;
    }

    onSubmit(cleanedData);
  };

  const renderMealSection = (mealType, label) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        {formData[mealType].map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleMealItemChange(mealType, index, e.target.value)
              }
              className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder={`Enter ${label.toLowerCase()} item...`}
            />
            {formData[mealType].length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveMealItem(mealType, index)}
                className="p-2 text-red-500 hover:text-red-700 rounded-lg"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddMealItem(mealType)}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add {label} Item
        </button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-[Poppins]">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isAddingNew ? "Add New Meal Plan" : "Update Meal Plan"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            {isAddingNew ? (
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{formData.date}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Needs
              </label>
              <textarea
                value={formData.dietaryNeeds}
                onChange={(e) =>
                  setFormData({ ...formData, dietaryNeeds: e.target.value })
                }
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Enter dietary needs and restrictions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nutritional Goals
              </label>
              <textarea
                value={formData.nutritionalGoals}
                onChange={(e) =>
                  setFormData({ ...formData, nutritionalGoals: e.target.value })
                }
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Enter nutritional goals..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Daily Meal Schedule
            </h3>
            {renderMealSection("breakfast", "Breakfast")}
            {renderMealSection("lunch", "Lunch")}
            {renderMealSection("snacks", "Snacks")}
            {renderMealSection("dinner", "Dinner")}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {isAddingNew ? "Add Meal Plan" : "Update Meal Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

MealUpdateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isAddingNew: PropTypes.bool.isRequired,
  mealRecords: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      date: PropTypes.string,
      dietaryNeeds: PropTypes.string,
      nutritionalGoals: PropTypes.string,
      breakfast: PropTypes.arrayOf(PropTypes.string),
      lunch: PropTypes.arrayOf(PropTypes.string),
      snacks: PropTypes.arrayOf(PropTypes.string),
      dinner: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default MealUpdateModal;
