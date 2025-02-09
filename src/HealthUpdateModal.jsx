import { useState, useEffect } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

const HealthUpdateModal = ({
  isOpen,
  onClose,
  onSubmit,
  isAddingNew,
  healthRecords,
}) => {
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
      } else if (healthRecords.length > 0) {
        // Use the latest record when updating
        const latestRecord = healthRecords[0];

        setFormData({
          date: latestRecord.date,
          status: latestRecord.status || "Stable",
          allergies: latestRecord.allergies || "",
          medicalCondition: latestRecord.medicalCondition || "",
          medications: latestRecord.medications || "",
          dosage: latestRecord.dosage || "",
          quantity: latestRecord.quantity || "",
          medicationTime: latestRecord.medicationTime || "",
          isMedicationTaken: latestRecord.isMedicationTaken || false,
          assessment: latestRecord.assessment || "",
          instructions: latestRecord.instructions || "",
        });
      }
    }
  }, [isOpen, isAddingNew, healthRecords]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
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
              </select>
            </div>
          </div>

          {/* Rest of the form remains the same */}
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
                {formData.isMedicationTaken ? "Medication taken" : "Not taken"}
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
};

export default HealthUpdateModal;
