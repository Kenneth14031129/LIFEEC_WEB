import { Activity, MapPin, Clock } from "lucide-react";
import PropTypes from "prop-types";

const ActivitiesDisplaySection = ({ activities }) => {
  // Get the latest activity by date
  const getLatestActivity = () => {
    if (!Array.isArray(activities) || activities.length === 0) return null;

    return activities.reduce((latest, current) => {
      if (!latest) return current;
      return new Date(current.date) > new Date(latest.date) ? current : latest;
    }, null);
  };

  const latestActivity = getLatestActivity();

  if (!latestActivity) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 text-center">
        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Activities Scheduled
        </h3>
        <p className="text-gray-600 mb-4">
          Schedule activities for this resident using the quick actions panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Activity Plan
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Date:</span>
              <span className="text-gray-600">{latestActivity.date}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-cyan-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-lg">
                  {latestActivity.name}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{latestActivity.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {latestActivity.duration && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    {latestActivity.duration} mins
                  </span>
                </div>
              )}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  latestActivity.status === "Completed"
                    ? "bg-green-50 text-green-600"
                    : latestActivity.status === "Cancelled"
                    ? "bg-red-50 text-red-600"
                    : latestActivity.status === "In Progress"
                    ? "bg-yellow-50 text-yellow-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                {latestActivity.status}
              </span>
            </div>
          </div>

          {(latestActivity.description || latestActivity.notes) && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              {latestActivity.description && (
                <div className="mb-2">
                  <h5 className="text-sm font-medium text-gray-700 mb-1">
                    Description
                  </h5>
                  <p className="text-gray-600">{latestActivity.description}</p>
                </div>
              )}
              {latestActivity.notes && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </h5>
                  <p className="text-gray-600">{latestActivity.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ActivitiesDisplaySection.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
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

export default ActivitiesDisplaySection;
