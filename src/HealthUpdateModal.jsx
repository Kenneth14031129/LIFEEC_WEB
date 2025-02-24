import { useState, useEffect } from "react";
import { X, Plus, Trash2, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

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

  // Add validation state
  const [errors, setErrors] = useState({
    date: "",
    status: "",
    allergies: [],
    medicalCondition: [],
    medications: [],
    assessment: "",
    instructions: "",
  });

  // Check if there are existing allergies and conditions
  const hasExistingAllergies = healthRecords?.[0]?.allergies?.length > 0;
  const hasExistingConditions =
    healthRecords?.[0]?.medicalCondition?.length > 0;

  // Initialize form with initialData when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isAddingNew) {
        // Completely reset the form, preserving the current date selection
        setFormData((prevState) => ({
          date: prevState.date || new Date().toISOString().split("T")[0],
          status: "Stable",
          allergies:
            healthRecords.length > 0 ? healthRecords[0].allergies || [] : [],
          medicalCondition:
            healthRecords.length > 0
              ? healthRecords[0].medicalCondition || []
              : [],
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
        }));
      } else {
        // For updating existing record, find the most recent record
        const sortedRecords = [...healthRecords].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        const recordToEdit = sortedRecords[0];

        // Fixed medication handling logic
        let medications;
        if (
          recordToEdit.allMedications &&
          recordToEdit.allMedications.length > 0
        ) {
          medications = recordToEdit.allMedications;
        } else if (typeof recordToEdit.medications === "string") {
          medications = [
            {
              name: recordToEdit.medications || "",
              dosage: recordToEdit.dosage || "",
              quantity: recordToEdit.quantity || "",
              medicationTime: recordToEdit.medicationTime || "",
              isMedicationTaken: recordToEdit.isMedicationTaken || false,
            },
          ];
        } else if (Array.isArray(recordToEdit.medications)) {
          medications = recordToEdit.medications.map((med) => ({
            name: med.name || "",
            dosage: med.dosage || "",
            quantity: med.quantity || "",
            medicationTime: med.medicationTime || "",
            isMedicationTaken: med.isMedicationTaken || false,
          }));
        } else {
          medications = [
            {
              name: "",
              dosage: "",
              quantity: "",
              medicationTime: "",
              isMedicationTaken: false,
            },
          ];
        }

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

      // Reset errors when modal opens
      setErrors({
        date: "",
        status: "",
        allergies: [],
        medicalCondition: [],
        medications: [],
        assessment: "",
        instructions: "",
      });
    }
  }, [isOpen, isAddingNew, healthRecords]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      date: "",
      status: "",
      allergies: [],
      medicalCondition: [],
      medications: [],
      assessment: "",
      instructions: "",
    };

    // Date validation
    if (!formData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today && isAddingNew) {
        newErrors.date = "Cannot add records for past dates";
        isValid = false;
      }
    }

    // Status validation
    if (!formData.status) {
      newErrors.status = "Status is required";
      isValid = false;
    }

    // Allergies validation
    formData.allergies.forEach((allergy, index) => {
      if (allergy.trim() === "") {
        newErrors.allergies[index] = "Allergy cannot be empty";
        isValid = false;
      } else if (allergy.length > 100) {
        newErrors.allergies[index] =
          "Allergy name is too long (max 100 characters)";
        isValid = false;
      }
    });

    // Medical conditions validation
    formData.medicalCondition.forEach((condition, index) => {
      if (condition.trim() === "") {
        newErrors.medicalCondition[index] = "Medical condition cannot be empty";
        isValid = false;
      } else if (condition.length > 100) {
        newErrors.medicalCondition[index] =
          "Medical condition name is too long (max 100 characters)";
        isValid = false;
      }
    });

    // Medications validation
    formData.medications.forEach((medication, index) => {
      const medicationErrors = {};

      if (!medication.name.trim()) {
        medicationErrors.name = "Medication name is required";
        isValid = false;
      } else if (medication.name.length > 100) {
        medicationErrors.name =
          "Medication name is too long (max 100 characters)";
        isValid = false;
      }

      if (!medication.dosage.trim()) {
        medicationErrors.dosage = "Dosage is required";
        isValid = false;
      } else if (medication.dosage.length > 50) {
        medicationErrors.dosage = "Dosage is too long (max 50 characters)";
        isValid = false;
      }

      if (!medication.quantity.trim()) {
        medicationErrors.quantity = "Quantity is required";
        isValid = false;
      } else if (
        isNaN(medication.quantity) ||
        parseInt(medication.quantity) <= 0
      ) {
        medicationErrors.quantity = "Quantity must be a positive number";
        isValid = false;
      }

      if (!medication.medicationTime) {
        medicationErrors.medicationTime = "Medication time is required";
        isValid = false;
      }

      if (Object.keys(medicationErrors).length > 0) {
        newErrors.medications[index] = medicationErrors;
      }
    });

    // Assessment validation
    if (formData.assessment.trim() === "") {
      newErrors.assessment = "Assessment is required";
      isValid = false;
    } else if (formData.assessment.length > 1000) {
      newErrors.assessment = "Assessment is too long (max 1000 characters)";
      isValid = false;
    }

    // Instructions validation
    if (formData.instructions.trim() === "") {
      newErrors.instructions = "Instructions are required";
      isValid = false;
    } else if (formData.instructions.length > 1000) {
      newErrors.instructions =
        "Instructions are too long (max 1000 characters)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddAllergy = () => {
    if (!isAddingNew || !hasExistingAllergies) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, ""],
      }));
      // Clear any existing errors for the new allergy
      setErrors((prev) => ({
        ...prev,
        allergies: [...prev.allergies, ""],
      }));
    }
  };

  const handleRemoveAllergy = (index) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const handleAllergyChange = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.map((item, i) => (i === index ? value : item)),
    }));
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      allergies: prev.allergies.map((item, i) => (i === index ? "" : item)),
    }));
  };

  const handleAddCondition = () => {
    if (!isAddingNew || !hasExistingConditions) {
      setFormData((prev) => ({
        ...prev,
        medicalCondition: [...prev.medicalCondition, ""],
      }));
      // Clear any existing errors for the new condition
      setErrors((prev) => ({
        ...prev,
        medicalCondition: [...prev.medicalCondition, ""],
      }));
    }
  };

  const handleRemoveCondition = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalCondition: prev.medicalCondition.filter((_, i) => i !== index),
    }));
    setErrors((prev) => ({
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
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      medicalCondition: prev.medicalCondition.map((item, i) =>
        i === index ? "" : item
      ),
    }));
  };

  const handleAddMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: "",
          dosage: "",
          quantity: "",
          medicationTime: "",
          isMedicationTaken: false,
        },
      ],
    }));
    // Clear any existing errors for the new medication
    setErrors((prev) => ({
      ...prev,
      medications: [...prev.medications, {}],
    }));
  };

  const handleRemoveMedication = (index) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
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
    // Clear specific field error when user starts typing
    if (errors.medications[index]) {
      const updatedErrors = [...errors.medications];
      updatedErrors[index] = {
        ...updatedErrors[index],
        [field]: "",
      };
      setErrors((prev) => ({
        ...prev,
        medications: updatedErrors,
      }));
    }
  };

  const handleDateChange = (e) => {
    if (!isAddingNew) return;

    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setErrors((prev) => ({
        ...prev,
        date: "Cannot add records for past dates",
      }));
      return;
    }

    const dateExists = healthRecords.some(
      (record) => record.date === e.target.value
    );

    if (dateExists) {
      setErrors((prev) => ({
        ...prev,
        date: "A health record already exists for this date",
      }));
      toast.error("A health record already exists for this date");
      return;
    }

    setFormData({ ...formData, date: e.target.value });
    setErrors((prev) => ({
      ...prev,
      date: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (isAddingNew) {
      const dateExists = healthRecords.some(
        (record) => record.date === formData.date
      );

      if (dateExists) {
        toast.error("A health record already exists for this date");
        return;
      }
    }

    onSubmit(formData);
    onClose();
  };

  // Helper function to render input fields with error messages
  const renderInputWithError = (field, error, children) => (
    <div className="space-y-1">
      {children}
      {error && (
        <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  // Modified function to render medication fields with validation
  const renderMedicationFields = (medication, index) => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        {renderInputWithError(
          "name",
          errors.medications[index]?.name,
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medication Name
            </label>
            <input
              type="text"
              value={medication.name}
              onChange={(e) =>
                handleMedicationChange(index, "name", e.target.value)
              }
              className={`w-full rounded-lg border ${
                errors.medications[index]?.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:ring-2`}
              placeholder="Enter medication name"
            />
          </>
        )}
      </div>

      <div>
        {renderInputWithError(
          "dosage",
          errors.medications[index]?.dosage,
          <>
            <label className="block text-sm font-medium text-gray-700mb-2">
              Dosage
            </label>
            <input
              type="text"
              value={medication.dosage}
              onChange={(e) =>
                handleMedicationChange(index, "dosage", e.target.value)
              }
              className={`w-full rounded-lg border ${
                errors.medications[index]?.dosage
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:ring-2`}
              placeholder="Enter dosage"
            />
          </>
        )}
      </div>

      <div>
        {renderInputWithError(
          "quantity",
          errors.medications[index]?.quantity,
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={medication.quantity}
              onChange={(e) =>
                handleMedicationChange(index, "quantity", e.target.value)
              }
              className={`w-full rounded-lg border ${
                errors.medications[index]?.quantity
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:ring-2`}
              placeholder="Enter quantity"
              min="1"
            />
          </>
        )}
      </div>

      <div>
        {renderInputWithError(
          "medicationTime",
          errors.medications[index]?.medicationTime,
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medication Time
            </label>
            <input
              type="time"
              value={medication.medicationTime}
              onChange={(e) =>
                handleMedicationChange(index, "medicationTime", e.target.value)
              }
              className={`w-full rounded-lg border ${
                errors.medications[index]?.medicationTime
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              } focus:border-transparent focus:ring-2`}
            />
          </>
        )}
      </div>
    </div>
  );

  // Render allergies section with validation
  const renderAllergiesSection = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Allergies
        </label>
        {(!isAddingNew || !hasExistingAllergies) && (
          <button
            type="button"
            onClick={handleAddAllergy}
            className="flex items-center gap-2 px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Allergy
          </button>
        )}
      </div>
      <div className="space-y-2">
        {formData.allergies.map((allergy, index) => (
          <div key={index}>
            {renderInputWithError(
              `allergy-${index}`,
              errors.allergies[index],
              <div className="flex items-center gap-2">
                <span className="text-gray-500">•</span>
                <input
                  type="text"
                  value={allergy}
                  onChange={(e) => handleAllergyChange(index, e.target.value)}
                  className={`flex-1 rounded-lg border ${
                    errors.allergies[index]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } focus:border-transparent focus:ring-2`}
                  placeholder="Enter allergy"
                  disabled={isAddingNew && hasExistingAllergies}
                />
                {(!isAddingNew || !hasExistingAllergies) && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {formData.allergies.length === 0 && (
          <p className="text-sm text-gray-500">No allergies added</p>
        )}
        {isAddingNew && hasExistingAllergies && (
          <p className="text-sm text-blue-600">
            Allergies can only be modified through the Update Health Plan option
          </p>
        )}
      </div>
    </div>
  );

  // Render medical conditions section with validation
  const renderMedicalConditionsSection = () => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Medical Conditions
        </label>
        {(!isAddingNew || !hasExistingConditions) && (
          <button
            type="button"
            onClick={handleAddCondition}
            className="flex items-center gap-2 px-2 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Condition
          </button>
        )}
      </div>
      <div className="space-y-2">
        {formData.medicalCondition.map((condition, index) => (
          <div key={index}>
            {renderInputWithError(
              `condition-${index}`,
              errors.medicalCondition[index],
              <div className="flex items-center gap-2">
                <span className="text-gray-500">•</span>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => handleConditionChange(index, e.target.value)}
                  className={`flex-1 rounded-lg border ${
                    errors.medicalCondition[index]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } focus:border-transparent focus:ring-2`}
                  placeholder="Enter medical condition"
                  disabled={isAddingNew && hasExistingConditions}
                />
                {(!isAddingNew || !hasExistingConditions) && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {formData.medicalCondition.length === 0 && (
          <p className="text-sm text-gray-500">No medical conditions added</p>
        )}
        {isAddingNew && hasExistingConditions && (
          <p className="text-sm text-blue-600">
            Medical conditions can only be modified through the Update Health
            Plan option
          </p>
        )}
      </div>
    </div>
  );

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
            {renderInputWithError(
              "date",
              errors.date,
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  disabled={!isAddingNew}
                  className={`w-full rounded-lg border ${
                    errors.date
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } ${
                    !isAddingNew
                      ? "bg-gray-50 cursor-not-allowed"
                      : "focus:border-transparent focus:ring-2"
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            )}

            {renderInputWithError(
              "status",
              errors.status,
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className={`w-full rounded-lg border ${
                    errors.status
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } focus:border-transparent focus:ring-2`}
                  required
                >
                  <option value="Stable">Stable</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            )}
          </div>

          {/* Allergies and Medical Conditions */}
          <div className="grid grid-cols-2 gap-4">
            {renderAllergiesSection()}
            {renderMedicalConditionsSection()}
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

                {renderMedicationFields(medication, index)}

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
            {renderInputWithError(
              "assessment",
              errors.assessment,
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
                  className={`w-full rounded-lg border ${
                    errors.assessment
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } focus:border-transparent focus:ring-2`}
                  placeholder="Enter assessment notes..."
                />
              </div>
            )}

            {renderInputWithError(
              "instructions",
              errors.instructions,
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
                  className={`w-full rounded-lg border ${
                    errors.instructions
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  } focus:border-transparent focus:ring-2`}
                  placeholder="Enter instructions..."
                />
              </div>
            )}
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
