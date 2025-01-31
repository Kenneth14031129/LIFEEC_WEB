import { useState } from "react";
import { Search, X, AlertTriangle, Calendar } from "lucide-react";
import PropTypes from "prop-types";

const AlertHistory = ({ isOpen, onClose, alerts, isLoading }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Filter alerts based on selected date and search query
  const filteredAlerts = alerts.filter((alert) => {
    const matchesDate = selectedDate
      ? new Date(alert.timestamp).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString()
      : true;

    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? alert.residentName.toLowerCase().includes(searchTerm) ||
        alert.message.toLowerCase().includes(searchTerm)
      : true;

    return matchesDate && matchesSearch;
  });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const clearDateFilter = () => {
    setSelectedDate("");
    setShowDatePicker(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Get unique dates from alerts for the date picker
  const uniqueDates = [
    ...new Set(
      alerts.map((alert) => new Date(alert.timestamp).toLocaleDateString())
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="alert-history-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden m-4">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2
              id="alert-history-title"
              className="text-xl font-semibold text-gray-800"
            >
              Alert History
            </h2>
            <p className="text-sm text-gray-500 mt-1">Track all alerts</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close alert history"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Filters and Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <label htmlFor="alert-search" className="sr-only">
                  Search alerts by resident name or message
                </label>
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="alert-search"
                  type="search"
                  placeholder="Search alerts..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  aria-label="Search alerts"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                  aria-expanded={showDatePicker}
                  aria-haspopup="listbox"
                  aria-label={
                    selectedDate
                      ? `Selected date: ${new Date(
                          selectedDate
                        ).toLocaleDateString()}`
                      : "Filter by date"
                  }
                >
                  <Calendar
                    className="h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-600">
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString()
                      : "Filter by Date"}
                  </span>
                </button>

                {/* Date Picker Dropdown */}
                {showDatePicker && (
                  <div
                    className="absolute top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-64 overflow-y-auto"
                    role="listbox"
                    aria-label="Select date"
                  >
                    {selectedDate && (
                      <button
                        onClick={clearDateFilter}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50 border-b border-gray-100"
                        role="option"
                        aria-selected="false"
                      >
                        Clear Filter
                      </button>
                    )}
                    {uniqueDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => handleDateSelect(date)}
                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                        role="option"
                        aria-selected={date === selectedDate}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Alert List */}
          <div className="space-y-4" role="log" aria-label="Alert history list">
            {isLoading ? (
              <div className="text-center text-gray-500 py-4" role="status">
                Loading alerts...
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center text-gray-500 py-4" role="status">
                {selectedDate
                  ? "No alerts found for selected date"
                  : searchQuery
                  ? "No alerts match your search"
                  : "No alerts found"}
              </div>
            ) : (
              <div role="status" className="sr-only">
                {`Found ${filteredAlerts.length} alerts`}
              </div>
            )}
            {filteredAlerts.map((alert) => (
              <div
                key={alert._id}
                className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                role="article"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle
                        className="h-4 w-4 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {alert.residentName}
                      </h3>
                      <p className="text-sm text-gray-500">{alert.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

AlertHistory.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      residentName: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AlertHistory;
