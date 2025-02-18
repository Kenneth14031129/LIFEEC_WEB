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

  const [errors, setErrors] = useState({
    name: "",
    date: "",
    description: "",
    duration: "",
    location: "",
  });

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case "name": {
        if (!value.trim()) return "Activity name is required";
        if (value.length < 3)
          return "Activity name must be at least 3 characters";
        if (value.length > 50)
          return "Activity name must be less than 50 characters";
        return "";
      }

      case "date": {
        if (!value) return "Date is required";
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isAddingNew && selectedDate < today) {
          return "Cannot select past dates";
        }
        return "";
      }

      case "description": {
        if (!value.trim()) return "Description is required";
        if (value.length < 10)
          return "Description must be at least 10 characters";
        if (value.length > 500)
          return "Description must be less than 500 characters";
        return "";
      }

      case "duration": {
        if (value && isNaN(value)) return "Duration must be a number";
        if (value && value <= 0) return "Duration must be greater than 0";
        if (value && value > 480)
          return "Duration cannot exceed 8 hours (480 minutes)";
        return "";
      }

      case "location": {
        if (!value.trim()) return "Location is required";
        if (value.length < 3) return "Location must be at least 3 characters";
        if (value.length > 100)
          return "Location must be less than 100 characters";
        return "";
      }

      default:
        return "";
    }
  };

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
        const latestActivity = getLatestActivity();
        let nextDate = new Date().toISOString().split("T")[0];

        if (latestActivity) {
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
      // Reset errors when modal opens
      setErrors({
        name: "",
        date: "",
        description: "",
        duration: "",
        location: "",
      });
    }
  }, [isOpen, isAddingNew, getLatestActivity, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field on change
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {
      name: validateField("name", formData.name),
      date: validateField("date", formData.date),
      description: validateField("description", formData.description),
      duration: validateField("duration", formData.duration),
      location: validateField("location", formData.location),
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    // Additional date validation for new activities
    if (isAddingNew) {
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
    if (!isAddingNew) return;

    const value = e.target.value;
    const error = validateField("date", value);

    if (error) {
      toast.error(error);
      return;
    }

    setFormData({ ...formData, date: value });
    setErrors((prev) => ({ ...prev, date: "" }));
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
                Activity Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full rounded-lg border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring-blue-500`}
                placeholder="Enter activity name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleDateChange}
                disabled={!isAddingNew}
                className={`w-full rounded-lg border ${
                  errors.date ? "border-red-500" : "border-gray-300"
                } ${
                  !isAddingNew
                    ? "bg-gray-50 cursor-not-allowed"
                    : "focus:border-blue-500 focus:ring-blue-500"
                }`}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full rounded-lg border ${
                  errors.location ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring-blue-500`}
                placeholder="Enter activity location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className={`w-full rounded-lg border ${
                  errors.duration ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring-blue-500`}
                placeholder="Enter duration"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full rounded-lg border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:ring-blue-500`}
              placeholder="Enter activity description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={Object.values(errors).some((error) => error)}
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
