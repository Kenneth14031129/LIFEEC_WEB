import PropTypes from "prop-types";
import { X, Activity, MapPin, Clock, Calendar } from "lucide-react";
import { useState } from "react";

const ActivitiesReviewModal = ({ isOpen, onClose, activities }) => {
  const [searchDate, setSearchDate] = useState("");
  const [searchView, setSearchView] = useState("all"); // "all", "date"

  if (!isOpen) return null;

  // Sort and filter records based on search/date
  const filteredAndSortedRecords = [...activities]
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    })
    .filter((record) => {
      if (searchView === "date" && searchDate) {
        const recordDate = new Date(record.date).toISOString().split("T")[0];
        return recordDate === searchDate;
      }
      return true;
    });

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
              Activities History
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
            {filteredAndSortedRecords.map((activity, index) => (
              <div
                key={activity._id || index}
                className="border border-gray-200 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{activity.date}</span>
                    </div>
                    <div
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
                    </div>
                  </div>
                </div>

                {/* Activity Details */}
                <div className="bg-blue-50/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium text-gray-900">
                      Activity Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Name</p>
                      <p className="font-medium text-gray-900">
                        {activity.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {activity.location || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="font-medium text-gray-900">
                          {activity.duration
                            ? `${activity.duration} minutes`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description & Notes */}
                <div className="space-y-4">
                  {activity.description && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-5 w-5 text-gray-500" />
                        <h3 className="font-medium text-gray-900">
                          Description
                        </h3>
                      </div>
                      <p className="text-gray-700">{activity.description}</p>
                    </div>
                  )}

                  {activity.notes && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-5 w-5 text-gray-500" />
                        <h3 className="font-medium text-gray-900">Notes</h3>
                      </div>
                      <p className="text-gray-700">{activity.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredAndSortedRecords.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No activities found for the selected date.
                </p>
              </div>
            )}
          </div>
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

export default ActivitiesReviewModal;
