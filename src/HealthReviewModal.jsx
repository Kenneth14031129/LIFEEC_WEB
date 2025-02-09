import PropTypes from "prop-types";
import {
  X,
  AlertTriangle,
  Pill,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const HealthReviewModal = ({ isOpen, onClose, healthRecords }) => {
  const [searchDate, setSearchDate] = useState("");
  const [searchView, setSearchView] = useState("all");
  const [currentMedicationPage, setCurrentMedicationPage] = useState({});
  const medicationsPerPage = 2;

  if (!isOpen) return null;

  const formatTime = (time) => {
    if (!time) return "Not specified";
    try {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return time;
    }
  };

  const filteredAndSortedRecords = [...healthRecords]
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

  // Initialize pagination state for new records if needed
  filteredAndSortedRecords.forEach((record) => {
    if (!(record._id in currentMedicationPage)) {
      currentMedicationPage[record._id] = 0;
    }
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-[Poppins]">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Health Records History
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
            {filteredAndSortedRecords.map((record) => {
              // Get medications array, handling both new and old format
              const medications =
                record.allMedications ||
                (record.medications && typeof record.medications === "string"
                  ? [
                      {
                        name: record.medications,
                        dosage: record.dosage,
                        quantity: record.quantity,
                        medicationTime: record.medicationTime,
                        isMedicationTaken: record.isMedicationTaken,
                      },
                    ]
                  : record.medications || []);

              const totalPages = Math.ceil(
                medications.length / medicationsPerPage
              );
              const currentPage = currentMedicationPage[record._id] || 0;
              const paginatedMedications = medications.slice(
                currentPage * medicationsPerPage,
                (currentPage + 1) * medicationsPerPage
              );

              return (
                <div
                  key={record._id}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === "Critical"
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {record.status}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {record.date || record.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Allergies */}
                    <div className="bg-red-50/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h3 className="font-semibold text-gray-900">
                          Allergies
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {Array.isArray(record.allergies) ? (
                          record.allergies.length > 0 ? (
                            record.allergies.map((allergy, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                <p className="text-gray-600">{allergy}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-600">None reported</p>
                          )
                        ) : (
                          <p className="text-gray-600">
                            {record.allergies || "None reported"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Medical Condition */}
                    <div className="bg-red-50/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h3 className="font-semibold text-gray-900">
                          Medical Condition
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {Array.isArray(record.medicalCondition) ? (
                          record.medicalCondition.length > 0 ? (
                            record.medicalCondition.map((condition, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                <p className="text-gray-600">{condition}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-600">None reported</p>
                          )
                        ) : (
                          <p className="text-gray-600">
                            {record.medicalCondition || "None reported"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Medication Details */}
                  <div className="bg-blue-50/30 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold text-gray-900">
                          Medication Details
                        </h3>
                      </div>
                      {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCurrentMedicationPage({
                                ...currentMedicationPage,
                                [record._id]: Math.max(0, currentPage - 1),
                              });
                            }}
                            disabled={currentPage === 0}
                            className="p-1 hover:bg-blue-100 rounded-lg disabled:opacity-50"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <span className="text-sm text-gray-600">
                            {currentPage + 1} / {totalPages}
                          </span>
                          <button
                            onClick={() => {
                              setCurrentMedicationPage({
                                ...currentMedicationPage,
                                [record._id]: Math.min(
                                  currentPage + 1,
                                  totalPages - 1
                                ),
                              });
                            }}
                            disabled={currentPage >= totalPages - 1}
                            className="p-1 hover:bg-blue-100 rounded-lg disabled:opacity-50"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {paginatedMedications.map((medication, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-5 gap-4 bg-white p-4 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Medication
                            </p>
                            <p className="text-gray-600">{medication.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Dosage
                            </p>
                            <p className="text-gray-600">{medication.dosage}</p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Quantity
                            </p>
                            <p className="text-gray-600">
                              {medication.quantity || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Time
                            </p>

                            <p className="text-gray-600">
                              {formatTime(medication.medicationTime)}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              Status
                            </p>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={medication.isMedicationTaken}
                                readOnly
                                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-600">
                                {medication.isMedicationTaken
                                  ? "Medication taken"
                                  : "Not taken"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assessment & Instructions */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">
                          Assessment Notes
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        {record.assessment || "No assessment notes available"}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">
                          Instructions
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        {record.instructions || "No instructions available"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAndSortedRecords.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No health records found for the selected date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

HealthReviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  healthRecords: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      status: PropTypes.string,
      date: PropTypes.string,
      createdAt: PropTypes.string,
      allergies: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      medicalCondition: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      // Support both old and new format
      medications: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            dosage: PropTypes.string,
            quantity: PropTypes.string,
            medicationTime: PropTypes.string,
            isMedicationTaken: PropTypes.bool,
          })
        ),
      ]),
      // Old format fields
      dosage: PropTypes.string,
      quantity: PropTypes.string,
      medicationTime: PropTypes.string,
      isMedicationTaken: PropTypes.bool,
      // New format field
      allMedications: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          dosage: PropTypes.string,
          quantity: PropTypes.string,
          medicationTime: PropTypes.string,
          isMedicationTaken: PropTypes.bool,
        })
      ),
      assessment: PropTypes.string,
      instructions: PropTypes.string,
    })
  ).isRequired,
};

export default HealthReviewModal;
