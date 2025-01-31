import { useState, useEffect, useCallback } from "react";
import { Search, X, UserPlus, Calendar, ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
import { getResidents } from "../services/api";

const ResidentHistory = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [residents, setResidents] = useState([]);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const fetchResidents = useCallback(async () => {
    try {
      const response = await getResidents();

      const transformedResidents = response.residents.map((resident) => ({
        id: resident._id,
        name: resident.fullName,
        dateOfBirth: formatDate(resident.dateOfBirth),
        gender: resident.gender,
        admissionDate: formatDate(resident.createdAt),
        status: resident.status,
        address: resident.address,
      }));

      setResidents(transformedResidents);
    } catch (err) {
      setError(err.message || "Error fetching residents");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchResidents();
    }
  }, [isOpen, fetchResidents]);

  if (!isOpen) return null;

  // Filter residents based on selected date and search query
  const filteredResidents = residents.filter((resident) => {
    const matchesDate = selectedDate
      ? resident.admissionDate === selectedDate
      : true;

    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = searchQuery
      ? resident.name.toLowerCase().includes(searchTerm) ||
        resident.address.toLowerCase().includes(searchTerm)
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

  // Get unique dates from residents for the date picker
  const uniqueDates = [
    ...new Set(residents.map((resident) => resident.admissionDate)),
  ].sort((a, b) => new Date(b) - new Date(a));

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      default:
        return "text-blue-500";
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="resident-history-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden m-4">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2
              id="resident-history-title"
              className="text-xl font-semibold text-gray-800"
            >
              Resident History
            </h2>
            <p className="text-sm text-gray-500 mt-1">Track all residents</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close resident history"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <label htmlFor="resident-search" className="sr-only">
                  Search residents by name
                </label>
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="resident-search"
                  type="search"
                  placeholder="Search residents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-64"
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
                      ? `Selected date: ${selectedDate}`
                      : "Filter by admission date"
                  }
                >
                  <Calendar
                    className="h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-600">
                    {selectedDate || "Filter by Date"}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 text-gray-500"
                    aria-hidden="true"
                  />
                </button>

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

          {/* Resident List */}
          <div className="space-y-4" role="log" aria-label="Resident list">
            {error ? (
              <div className="text-center text-red-500 py-4" role="alert">
                {error}
              </div>
            ) : filteredResidents.length === 0 ? (
              <div className="text-center text-gray-500 py-4" role="status">
                {selectedDate
                  ? "No residents found for selected date"
                  : searchQuery
                  ? "No residents match your search"
                  : "No residents found"}
              </div>
            ) : (
              <>
                <div role="status" className="sr-only">
                  {`Found ${filteredResidents.length} residents`}
                </div>
                {filteredResidents.map((resident) => (
                  <div
                    key={resident.id}
                    className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                    role="article"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <UserPlus
                            className={`h-4 w-4 ${getStatusColor(
                              resident.status
                            )}`}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {resident.name}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {resident.address}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Admitted: {resident.admissionDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ResidentHistory.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ResidentHistory;
