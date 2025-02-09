import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const ActivitiesUpdateModal = ({
  isOpen,
  onClose,
  onSubmit,
  isAddingNew,
  activitiesRecords,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    status: "Scheduled",
    duration: "",
    location: "",
    notes: "",
  });

  // Get the latest activity
  const getLatestActivity = useCallback(() => {
    if (!Array.isArray(activitiesRecords) || activitiesRecords.length === 0)
      return null;

    return activitiesRecords.reduce((latest, current) => {
      if (!latest) return current;
      return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, null);
  }, [activitiesRecords]);

  // Initialize form with data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isAddingNew) {
        // For new activities, set the date to the next day after the latest activity
        const latestActivity = getLatestActivity();
        let nextDate = new Date().toISOString().split("T")[0]; // Default to today

        if (latestActivity) {
          // Get the next day after the latest activity
          const nextDay = new Date(latestActivity.date);
          nextDay.setDate(nextDay.getDate() + 1);
          nextDate = nextDay.toISOString().split("T")[0];
        }

        setFormData({
          name: "",
          date: nextDate,
          description: "",
          status: "Scheduled",
          duration: "",
          location: "",
          notes: "",
        });
      } else {
        // Get the latest activity for updating
        const latestActivity = getLatestActivity();

        if (!latestActivity) {
          toast.error("No activities found to update");
          onClose();
          return;
        }

        setFormData({
          name: latestActivity.name || "",
          date: latestActivity.date,
          description: latestActivity.description || "",
          status: latestActivity.status || "Scheduled",
          duration: latestActivity.duration || "",
          location: latestActivity.location || "",
          notes: latestActivity.notes || "",
        });
      }
    }
  }, [isOpen, isAddingNew, getLatestActivity, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that the new activity date is not in the past
    if (isAddingNew) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.error("Cannot add activities for past dates");
        return;
      }

      // Check if date already exists
      const dateExists = activitiesRecords.some(
        (record) => record.date === formData.date
      );

      if (dateExists) {
        toast.error("An activity already exists for this date");
        return;
      }
    }

    onSubmit({ activities: [formData] });
    onClose();
  };

  const handleDateChange = (e) => {
    if (!isAddingNew) return; // Prevent date changes when updating

    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Cannot select past dates");
      return;
    }

    setFormData({ ...formData, date: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-[Poppins]">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isAddingNew ? "Add New Activity" : "Update Latest Activity"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

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
                onChange={handleDateChange}
                disabled={!isAddingNew}
                className={`w-full rounded-lg border-gray-300 ${
                  !isAddingNew
                    ? "bg-gray-50 cursor-not-allowed"
                    : "focus:border-blue-500 focus:ring-blue-500"
                }`}
                min={new Date().toISOString().split("T")[0]}
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
