import { useState, useEffect } from "react";
import { X, Calendar, Search } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const HealthUpdateModal = ({
  isOpen,
  onClose,
  onSubmit,
  isAddingNew,
  healthRecords,
}) => {
  const [showDateSelection, setShowDateSelection] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchDate, setSearchDate] = useState("");
  const [filteredDates, setFilteredDates] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    status: "Stable",
    allergies: "",
    medicalCondition: "",
    medications: "",
    dosage: "",
    quantity: "",
    medicationTime: "",
    isMedicationTaken: false,
    assessment: "",
    instructions: "",
  });

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen && !isAddingNew) {
      setShowDateSelection(true);
      setSelectedDate(null);
      setSearchDate("");
      // Get unique dates from health records
      const dates = healthRecords.map((record) => ({
        date: record.date,
        id: record._id,
      }));
      setFilteredDates(dates);
    } else {
      setShowDateSelection(false);
    }
  }, [isOpen, isAddingNew, healthRecords]);

  // Handle date search
  useEffect(() => {
    if (searchDate) {
      const filtered = healthRecords
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
        healthRecords.map((record) => ({
          date: record.date,
          id: record._id,
        }))
      );
    }
  }, [searchDate, healthRecords]);

  // Initialize form with initialData when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isAddingNew) {
        // Reset form to default values when adding new
        setFormData({
          date: new Date().toISOString().split("T")[0],
          status: "Stable",
          allergies: "",
          medicalCondition: "",
          medications: "",
          dosage: "",
          quantity: "",
          medicationTime: "",
          isMedicationTaken: false,
          assessment: "",
          instructions: "",
        });
      } else if (selectedDate) {
        // Find the record for the selected date
        const selectedRecord = healthRecords.find(
          (record) => record.date === selectedDate
        );

        if (!selectedRecord) {
          toast.error("No health record found for selected date");
          return;
        }

        // Use existing data when updating
        setFormData({
          date: selectedRecord.date,
          status: selectedRecord.status || "Stable",
          allergies: selectedRecord.allergies || "",
          medicalCondition: selectedRecord.medicalCondition || "",
          medications: selectedRecord.medications || "",
          dosage: selectedRecord.dosage || "",
          quantity: selectedRecord.quantity || "",
          medicationTime: selectedRecord.medicationTime || "",
          isMedicationTaken: selectedRecord.isMedicationTaken || false,
          assessment: selectedRecord.assessment || "",
          instructions: selectedRecord.instructions || "",
        });
      }
    }
  }, [isOpen, isAddingNew, selectedDate, healthRecords]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
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
            {isAddingNew ? "Add New Health Record" : "Update Health Record"}
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
                    onClick={() => handleDateSelect(date, id)}
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
            {/* Date and Status Row */}
            <div className="grid grid-cols-2 gap-4">
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
                  Health Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="Stable">Stable</option>
                  <option value="Critical">Critical</option>
                  <option value="Improving">Improving</option>
                  <option value="Declining">Declining</option>
                </select>
              </div>
            </div>

            {/* Allergies and Medical Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter allergies"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Condition
                </label>
                <input
                  type="text"
                  value={formData.medicalCondition}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medicalCondition: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter medical condition"
                />
              </div>
            </div>

            {/* Medication Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Medication Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medications
                  </label>
                  <input
                    type="text"
                    value={formData.medications}
                    onChange={(e) =>
                      setFormData({ ...formData, medications: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter medication name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) =>
                      setFormData({ ...formData, dosage: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter dosage"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication Time
                  </label>
                  <input
                    type="time"
                    value={formData.medicationTime}
                    onChange={(e) => {
                      const time = e.target.value;
                      setFormData({ ...formData, medicationTime: time });
                    }}
                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="medicationTaken"
                  checked={formData.isMedicationTaken}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isMedicationTaken: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label
                  htmlFor="medicationTaken"
                  className="text-sm text-gray-700"
                >
                  Medication has been taken
                </label>
              </div>
            </div>

            {/* Assessment and Instructions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment
                </label>
                <textarea
                  value={formData.assessment}
                  onChange={(e) =>
                    setFormData({ ...formData, assessment: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter assessment notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter instructions..."
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
                {isAddingNew ? "Add Record" : "Update Record"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

HealthUpdateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isAddingNew: PropTypes.bool.isRequired,
  healthRecords: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      date: PropTypes.string,
      status: PropTypes.string,
      allergies: PropTypes.string,
      medicalCondition: PropTypes.string,
      medications: PropTypes.string,
      dosage: PropTypes.string,
      quantity: PropTypes.string,
      medicationTime: PropTypes.string,
      isMedicationTaken: PropTypes.bool,
      assessment: PropTypes.string,
      instructions: PropTypes.string,
    })
  ),
  initialData: PropTypes.shape({
    date: PropTypes.string,
    status: PropTypes.string,
    allergies: PropTypes.arrayOf(PropTypes.string),
    conditions: PropTypes.arrayOf(PropTypes.string),
    medications: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        dosage: PropTypes.string,
        quantity: PropTypes.string,
        time: PropTypes.string,
        status: PropTypes.string,
      })
    ),
    assessmentNotes: PropTypes.string,
    instructions: PropTypes.string,
  }),
};

export default HealthUpdateModal;
