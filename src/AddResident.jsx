import { useState } from "react";
import {
  UserPlus,
  Phone,
  Mail,
  CheckCircle,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";
import Sidebar from "./SideBar";
import { addNewResident } from "../services/api";

const AddResident = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    contactNumber: "",
    dateOfBirth: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactEmail: "",
    emergencyContactRelation: "",
  });

  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, "");

    // If the input is empty, return empty string
    if (!phoneNumber) return "";

    // Add +63 prefix if not already present
    if (!value.startsWith("+63")) {
      return `+63${phoneNumber}`;
    }

    return value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Add phone number validation
    const phonePattern = /^\+63[0-9]{10}$/;
    if (!phonePattern.test(formData.contactNumber)) {
      setError("Invalid contact number format. Please use: +63 XXX XXX XXXX");
      setIsSubmitting(false);
      return;
    }

    if (!phonePattern.test(formData.emergencyContactPhone)) {
      setError(
        "Invalid emergency contact phone format. Please use: +63 XXX XXX XXXX"
      );
      setIsSubmitting(false);
      return;
    }

    // Basic validation
    const requiredFields = [
      "fullName",
      "dateOfBirth",
      "gender",
      "contactNumber",
      "address",
      "emergencyContactName",
      "emergencyContactPhone",
      "emergencyContactEmail",
      "emergencyContactRelation",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await addNewResident(formData);
      // Handle success
      console.log("Resident added successfully:", response);
      // Reset form
      setFormData({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactEmail: "",
        emergencyContactRelation: "",
      });
      setActiveStep(1);
      // Show success message
      setSuccessMessage("Resident added successfully!");
      // Clear message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error.message || "Error adding resident");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle phone number formatting
    if (name === "contactNumber" || name === "emergencyContactPhone") {
      setFormData((prev) => ({
        ...prev,
        [name]: formatPhoneNumber(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const steps = [
    { number: 1, title: "Basic Information" },
    { number: 2, title: "Emergency Contact" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-[Poppins]">
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg flex items-center">
          <div className="flex-grow">
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-4 text-green-700 hover:text-green-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      <Sidebar activePage="add-resident" />

      <div className="ml-72 p-8">
        {/* Header Section */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Add Resident
              </h1>
              <p className="text-gray-600 mt-1">
                Complete the form below to register a new resident
              </p>
            </div>
            <div className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activeStep >= step.number
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {activeStep > step.number ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className="absolute top-12 text-sm font-medium text-gray-600 whitespace-nowrap">
                      {step.title}
                    </span>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-48 mx-4">
                    <div
                      className={`h-1 rounded ${
                        activeStep > step.number
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                          : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-white/20"
          >
            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+63 XXX XXX XXXX"
                        pattern="\+63[0-9]{10}"
                        maxLength="13"
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      Format: +63 XXX XXX XXXX
                    </span>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter complete address"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Next Step
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Emergency Contact Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter emergency contact name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship to Resident
                    </label>
                    <input
                      type="text"
                      name="emergencyContactRelation"
                      value={formData.emergencyContactRelation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter relationship"
                    />
                  </div>

                  {/* Emergency Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+63 XXX XXX XXXX"
                        pattern="\+63[0-9]{10}"
                        maxLength="13"
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      Format: +63 XXX XXX XXXX
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="emergencyContactEmail"
                        value={formData.emergencyContactEmail}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter emergency contact email"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Previous Step
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding Resident..." : "Add Resident"}
                    <CheckCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddResident;
