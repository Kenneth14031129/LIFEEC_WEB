import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
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
    allergies: [],
    medicalCondition: [],
    medications: [
      {
        name: "",
        dosage: "",
        quantity: "",
        medicationTime: "",
        isMedicationTaken: false,
      },
    ],
    assessment: "",
    instructions: "",
  });

  const handleAddAllergy = () => {
    setFormData((prev) => ({
      ...prev,
      allergies: [...prev.allergies, ""],
    }));
  };

  const handleRemoveAllergy = (index) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const handleAllergyChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleAddCondition = () => {
    setFormData((prev) => ({
      ...prev,
      medicalCondition: [...prev.medicalCondition, ""],
    }));
  };

  const handleRemoveCondition = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalCondition: prev.medicalCondition.filter((_, i) => i !== index),
    }));
  };

  const handleConditionChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalCondition: prev.medicalCondition.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  // Initialize form with initialData when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isAddingNew) {
        // Reset form to default values when adding new
        setFormData({
          date: new Date().toISOString().split("T")[0],
          status: "Stable",
          allergies: [],
          medicalCondition: [],
          medications: [
            {
              name: "",
              dosage: "",
              quantity: "",
              medicationTime: "",
              isMedicationTaken: false,
            },
          ],
          assessment: "",
          instructions: "",
        });
      } else if (healthRecords.length > 0) {
        const recordToEdit =
          healthRecords.find((record) => record.date === formData.date) ||
          healthRecords[0];

        // Convert all medications to the new format
        const medications =
          recordToEdit.allMedications ||
          (recordToEdit.medications
            ? Array.isArray(recordToEdit.medications)
              ? recordToEdit.medications
              : [
                  {
                    name: recordToEdit.medications,
                    dosage: recordToEdit.dosage,
                    quantity: recordToEdit.quantity || "",
                    medicationTime: recordToEdit.medicationTime || "",
                    isMedicationTaken: recordToEdit.isMedicationTaken || false,
                  },
                ]
            : []);

        setFormData({
          date: recordToEdit.date,
          status: recordToEdit.status || "Stable",
          allergies: recordToEdit.allergies || [],
          medicalCondition: recordToEdit.medicalCondition || [],
          medications: medications,
          assessment: recordToEdit.assessment || "",
          instructions: recordToEdit.instructions || "",
        });
      }
    }
  }, [isOpen, isAddingNew, healthRecords, formData.date]);

  const handleAddMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        {
          name: "",
          dosage: "",
          quantity: "",
          medicationTime: "",
          isMedicationTaken: false,
        },
      ],
    });
  };

  const handleRemoveMedication = (index) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index),
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      medications: updatedMedications,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure medications are properly formatted
    const submissionData = {
      ...formData,
      allMedications: formData.medications,
    };
    onSubmit(submissionData);
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

          <div className="grid grid-cols-2 gap-4">
            {/* Allergies */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Allergies
                </label>
                <button
                  type="button"
                  onClick={handleAddAllergy}
                  className="flex items-center gap-2 px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Allergy
                </button>
              </div>
              <div className="space-y-2">
                {formData.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-500">•</span>
                    <input
                      type="text"
                      value={allergy}
                      onChange={(e) =>
                        handleAllergyChange(index, e.target.value)
                      }
                      className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter allergy"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.allergies.length === 0 && (
                  <p className="text-sm text-gray-500">No allergies added</p>
                )}
              </div>
            </div>

            {/* Medical Conditions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Medical Conditions
                </label>
                <button
                  type="button"
                  onClick={handleAddCondition}
                  className="flex items-center gap-2 px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Condition
                </button>
              </div>
              <div className="space-y-2">
                {formData.medicalCondition.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-500">•</span>
                    <input
                      type="text"
                      value={condition}
                      onChange={(e) =>
                        handleConditionChange(index, e.target.value)
                      }
                      className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter medical condition"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.medicalCondition.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No medical conditions added
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Medication Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Medication Details
              </h3>
              <button
                type="button"
                onClick={handleAddMedication}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Medication
              </button>
            </div>

            {formData.medications.map((medication, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Medication {index + 1}
                  </h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medication Name
                    </label>
                    <input
                      type="text"
                      value={medication.name}
                      onChange={(e) =>
                        handleMedicationChange(index, "name", e.target.value)
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
                      value={medication.dosage}
                      onChange={(e) =>
                        handleMedicationChange(index, "dosage", e.target.value)
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
                      value={medication.quantity}
                      onChange={(e) =>
                        handleMedicationChange(
                          index,
                          "quantity",
                          e.target.value
                        )
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
                      value={medication.medicationTime}
                      onChange={(e) =>
                        handleMedicationChange(
                          index,
                          "medicationTime",
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`medicationTaken${index}`}
                    checked={medication.isMedicationTaken}
                    onChange={(e) =>
                      handleMedicationChange(
                        index,
                        "isMedicationTaken",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`medicationTaken${index}`}
                    className="text-sm text-gray-700"
                  >
                    {medication.isMedicationTaken
                      ? "Medication taken"
                      : "Not taken"}
                  </label>
                </div>
              </div>
            ))}
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
        PropTypes.string, // Old format: single medication name
        PropTypes.arrayOf(
          // New format: array of medication objects
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
  ),
};
export default HealthUpdateModal;
