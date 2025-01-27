import { useState, useEffect } from "react";
import { X, Calendar, Search } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const MealUpdateModal = ({
  isOpen,
  onClose,
  onSubmit,
  isAddingNew,
  mealRecords,
}) => {
  const [showDateSelection, setShowDateSelection] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [filteredDates, setFilteredDates] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    dietaryNeeds: "",
    nutritionalGoals: "",
    breakfast: "",
    lunch: "",
    snacks: "",
    dinner: "",
  });

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen && !isAddingNew) {
      setShowDateSelection(true);
      setSelectedDate(null);
      setSearchDate("");
      // Get unique dates from meal records
      const dates = mealRecords.map((record) => ({
        date: record.date,
        id: record._id,
      }));
      setFilteredDates(dates);
    } else {
      setShowDateSelection(false);
    }
  }, [isOpen, isAddingNew, mealRecords]);

  // Handle date search
  useEffect(() => {
    if (searchDate) {
      const filtered = mealRecords
        .map((record) => ({
          date: record.date,
          id: record._id,
        }))
        .filter((record) =>
          record.date.toLowerCase().includes(searchDate.toLowerCase())
        );
      setFilteredDates(filtered);
    } else {
      setFilteredDates(
        mealRecords.map((record) => ({
          date: record.date,
          id: record._id,
        }))
      );
    }
  }, [searchDate, mealRecords]);

  // Initialize form with initialData when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isAddingNew) {
        // Reset form to default values when adding new
        setFormData({
          date: new Date().toISOString().split("T")[0],
          dietaryNeeds: "",
          nutritionalGoals: "",
          breakfast: "",
          lunch: "",
          snacks: "",
          dinner: "",
        });
      } else if (selectedDate) {
        // Find the record for the selected date
        const selectedRecord = mealRecords.find(
          (record) => record.date === selectedDate
        );

        if (!selectedRecord) {
          toast.error("No meal record found for selected date");
          return;
        }

        // Use existing data when updating
        setFormData({
          date: selectedRecord.date,
          dietaryNeeds: selectedRecord.dietaryNeeds || "",
          nutritionalGoals: selectedRecord.nutritionalGoals || "",
          breakfast: selectedRecord.breakfast || "",
          lunch: selectedRecord.lunch || "",
          snacks: selectedRecord.snacks || "",
          dinner: selectedRecord.dinner || "",
        });
      }
    }
  }, [isOpen, isAddingNew, selectedDate, mealRecords]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDateSelection(false);
  };

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

        {/* Date Selection Step */}
        {!isAddingNew && showDateSelection ? (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by date..."
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {filteredDates.map(({ date, id }) => (
                  <button
                    key={id}
                    onClick={() => handleDateSelect(date)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="font-medium text-gray-700">{date}</span>
                    </div>
                  </button>
                ))}
                {filteredDates.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No records found for this date
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Dietary Information */}
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
                    setFormData({
                      ...formData,
                      nutritionalGoals: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter nutritional goals..."
                />
              </div>
            </div>

            {/* Meal Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Daily Meal Schedule
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breakfast
                </label>
                <textarea
                  value={formData.breakfast}
                  onChange={(e) =>
                    setFormData({ ...formData, breakfast: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                  placeholder="Enter breakfast details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lunch
                </label>
                <textarea
                  value={formData.lunch}
                  onChange={(e) =>
                    setFormData({ ...formData, lunch: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                  placeholder="Enter lunch details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Snacks
                </label>
                <textarea
                  value={formData.snacks}
                  onChange={(e) =>
                    setFormData({ ...formData, snacks: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                  placeholder="Enter snacks details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dinner
                </label>
                <textarea
                  value={formData.dinner}
                  onChange={(e) =>
                    setFormData({ ...formData, dinner: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  rows={2}
                  placeholder="Enter dinner details..."
                />
              </div>
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
        )}
      </div>
    </div>
  );
};

MealUpdateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isAddingNew: PropTypes.bool.isRequired,
  initialData: PropTypes.shape({
    dietaryNeeds: PropTypes.string,
    nutritionalGoals: PropTypes.string,
    date: PropTypes.string,
    breakfast: PropTypes.string,
    lunch: PropTypes.string,
    snacks: PropTypes.string,
    dinner: PropTypes.string,
  }),
  mealRecords: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      date: PropTypes.string,
      dietaryNeeds: PropTypes.string,
      nutritionalGoals: PropTypes.string,
      breakfast: PropTypes.string,
      lunch: PropTypes.string,
      snacks: PropTypes.string,
      dinner: PropTypes.string,
    })
  ),
};

export default MealUpdateModal;
