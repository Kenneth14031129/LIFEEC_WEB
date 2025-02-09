import PropTypes from "prop-types";
import {
  X,
  Calendar,
  FileText,
  UtensilsCrossed,
  Apple,
  Pizza,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

const MealReviewModal = ({ isOpen, onClose, mealRecords }) => {
  const [searchDate, setSearchDate] = useState("");
  const [searchView, setSearchView] = useState("all"); // "all", "date"

  if (!isOpen) return null;

  // Sort and filter records based on search/date
  const filteredAndSortedRecords = [...mealRecords]
    .sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt);
      const dateB = new Date(b.date || b.createdAt);
      return dateB - dateA;
    })
    .filter((record) => {
      if (searchView === "date" && searchDate) {
        const recordDate = new Date(record.date || record.createdAt)
          .toISOString()
          .split("T")[0];
        return recordDate === searchDate;
      }
      return true;
    });

  const renderMealItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return <p className="text-gray-500 italic">No items specified</p>;
    }

    return (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700">
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-[Poppins]">
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Meal Records History
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <select
                value={searchView}
                onChange={(e) => setSearchView(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">All Records</option>
                <option value="date">Filter by Date</option>
              </select>
            </div>

            {searchView === "date" && (
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none flex-1"
                />
              </div>
            )}
          </div>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
            {filteredAndSortedRecords.map((record, index) => (
              <div
                key={record._id || index}
                className="border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {record.date || record.createdAt}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Dietary Needs */}
                  <div className="bg-red-50/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <h3 className="font-medium text-gray-900">
                        Dietary Needs
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      {record.dietaryNeeds || "None specified"}
                    </p>
                  </div>

                  {/* Nutritional Goals */}
                  <div className="bg-red-50/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <h3 className="font-medium text-gray-900">
                        Nutritional Goals
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      {record.nutritionalGoals || "None specified"}
                    </p>
                  </div>
                </div>

                {/* Meals */}
                <div className="space-y-4">
                  {/* Breakfast */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Apple className="h-5 w-5 text-green-500" />
                      <h3 className="font-medium text-gray-900">Breakfast</h3>
                    </div>
                    {renderMealItems(record.breakfast)}
                  </div>

                  {/* Lunch */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Pizza className="h-5 w-5 text-orange-500" />
                      <h3 className="font-medium text-gray-900">Lunch</h3>
                    </div>
                    {renderMealItems(record.lunch)}
                  </div>

                  {/* Snacks */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Apple className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-medium text-gray-900">Snacks</h3>
                    </div>
                    {renderMealItems(record.snacks)}
                  </div>

                  {/* Dinner */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UtensilsCrossed className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium text-gray-900">Dinner</h3>
                    </div>
                    {renderMealItems(record.dinner)}
                  </div>
                </div>
              </div>
            ))}

            {filteredAndSortedRecords.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No meal records found for the selected date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

MealReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  mealRecords: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      date: PropTypes.string,
      createdAt: PropTypes.string,
      dietaryNeeds: PropTypes.string,
      nutritionalGoals: PropTypes.string,
      breakfast: PropTypes.arrayOf(PropTypes.string),
      lunch: PropTypes.arrayOf(PropTypes.string),
      snacks: PropTypes.arrayOf(PropTypes.string),
      dinner: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default MealReviewModal;
