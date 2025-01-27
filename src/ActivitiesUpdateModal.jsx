import { useState, useEffect } from "react";
import { X, Calendar, Search } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const ActivitiesUpdateModal = ({
  isOpen,
  onClose,
  onSubmit,
  isAddingNew,
  activitiesRecords,
}) => {
  const [showDateSelection, setShowDateSelection] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [filteredDates, setFilteredDates] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    status: "Scheduled",
    duration: "",
    location: "",
    notes: "",
  });

  // Debug logging for activitiesRecords
  useEffect(() => {
    console.log("Activities Records:", activitiesRecords);
  }, [activitiesRecords]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen && !isAddingNew) {
      setShowDateSelection(true);
      setSelectedDate(null);
      setSearchDate("");

      // Improved date extraction
      const dates = activitiesRecords.reduce((uniqueDates, record) => {
        if (record.date && !uniqueDates.some((d) => d.date === record.date)) {
          uniqueDates.push({
            date: record.date,
            id: record._id || Math.random().toString(),
          });
        }
        return uniqueDates;
      }, []);

      console.log("Extracted Dates:", dates);
      setFilteredDates(dates);
    } else {
      setShowDateSelection(false);
    }
  }, [isOpen, isAddingNew, activitiesRecords]);

  // Handle date search
  useEffect(() => {
    if (searchDate) {
      const filtered = activitiesRecords
        .reduce((uniqueDates, record) => {
          if (record.date && !uniqueDates.some((d) => d.date === record.date)) {
            uniqueDates.push({
              date: record.date,
              id: record._id || Math.random().toString(),
            });
          }
          return uniqueDates;
        }, [])
        .filter((record) =>
          record.date.toLowerCase().includes(searchDate.toLowerCase())
        );

      console.log("Filtered Dates:", filtered);
      setFilteredDates(filtered);
    } else {
      const dates = activitiesRecords.reduce((uniqueDates, record) => {
        if (record.date && !uniqueDates.some((d) => d.date === record.date)) {
          uniqueDates.push({
            date: record.date,
            id: record._id || Math.random().toString(),
          });
        }
        return uniqueDates;
      }, []);

      console.log("Reset Dates:", dates);
      setFilteredDates(dates);
    }
  }, [searchDate, activitiesRecords]);

  // Initialize form with data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isAddingNew) {
        // Reset form to default values when adding new
        setFormData({
          name: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
          status: "Scheduled",
          duration: "",
          location: "",
          notes: "",
        });
      } else if (selectedDate) {
        // Find the activities for the selected date
        const selectedRecord = activitiesRecords.find(
          (record) => record.date === selectedDate
        );

        console.log("Selected Date:", selectedDate);
        console.log("Selected Record:", selectedRecord);

        if (!selectedRecord) {
          toast.error("No activities found for selected date");
          return;
        }

        // More robust data population
        setFormData({
          name: selectedRecord.name || "",
          date: selectedRecord.date || new Date().toISOString().split("T")[0],
          description: selectedRecord.description || "",
          status: selectedRecord.status || "Scheduled",
          duration: selectedRecord.duration || "",
          location: selectedRecord.location || "",
          notes: selectedRecord.notes || "",
        });
      }
    }
  }, [isOpen, isAddingNew, selectedDate, activitiesRecords]);

  // Ensure the date is in the correct format (YYYY-MM-DD)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure the date is in YYYY-MM-DD format
    const formattedFormData = {
      ...formData,
      date: new Date(formData.date).toISOString().split("T")[0],
    };

    console.log("Submitting Activities:", formattedFormData);

    onSubmit({ activities: [formattedFormData] });
    onClose();
  };

  const handleDateSelect = (date) => {
    console.log("Selected Date:", date);
    setSelectedDate(date);
    setShowDateSelection(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-[Poppins]">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isAddingNew ? "Add New Activity" : "Update Activity"}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter activity name"
                  required
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter activity location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter duration"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter activity description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter additional notes"
              />
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
                {isAddingNew ? "Add Activity" : "Update Activity"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

ActivitiesUpdateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isAddingNew: PropTypes.bool.isRequired,
  activitiesRecords: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      date: PropTypes.string,
      description: PropTypes.string,
      status: PropTypes.string,
      duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      location: PropTypes.string,
      notes: PropTypes.string,
    })
  ),
};

export default ActivitiesUpdateModal;
