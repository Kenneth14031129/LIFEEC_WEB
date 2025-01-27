import { X, Activity, MapPin, Clock } from "lucide-react";
import PropTypes from "prop-types";

const ActivitiesReviewModal = ({ isOpen, onClose, activities }) => {
  if (!isOpen) return null;

  // Group activities by date
  const groupedActivities = activities.reduce((groups, activity) => {
    const date = activity.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-[Poppins]">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-5 w-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Activities History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 sticky top-20 bg-white py-2">
                {formatDate(date)}
              </h3>
              <div className="space-y-4">
                {groupedActivities[date].map((activity, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Activity className="h-5 w-5 text-green-500" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {activity.name}
                        </h4>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          activity.status === "Completed"
                            ? "bg-green-50 text-green-600"
                            : activity.status === "Cancelled"
                            ? "bg-red-50 text-red-600"
                            : activity.status === "In Progress"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {activity.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                      {activity.duration && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{activity.duration} minutes</span>
                        </div>
                      )}
                    </div>

                    {(activity.description || activity.notes) && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                        {activity.description && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">
                              Description
                            </h5>
                            <p className="text-gray-600">
                              {activity.description}
                            </p>
                          </div>
                        )}
                        {activity.notes && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-1">
                              Notes
                            </h5>
                            <p className="text-gray-600">{activity.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {sortedDates.length === 0 && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Activities Found
              </h3>
              <p className="text-gray-600">
                There are no activities recorded for this resident.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ActivitiesReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      description: PropTypes.string,
      status: PropTypes.string,
      duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      location: PropTypes.string,
      notes: PropTypes.string,
    })
  ).isRequired,
};

export default ActivitiesReviewModal;
