import { useState, useEffect } from "react";
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
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "sidebarCollapsed") {
        setIsCollapsed(JSON.parse(e.newValue));
      }
    };

    // Initial check
    const savedState = localStorage.getItem("sidebarCollapsed");
    setIsCollapsed(savedState ? JSON.parse(savedState) : false);

    // Listen for changes
    window.addEventListener("storage", handleStorageChange);

    // Add custom event listener for same-window updates
    window.addEventListener("sidebarStateChange", (e) => {
      setIsCollapsed(e.detail.isCollapsed);
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("sidebarStateChange", handleStorageChange);
    };
  }, []);
  const [errors, setErrors] = useState({
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

  // Validation functions
  const validateFullName = (name) => {
    if (!name) return "Full name is required";
    if (name.length < 5) return "Full name must be at least 5 characters";
    if (name.length > 30) return "Full name must be less than 30 characters";
    if (!/^[a-zA-Z\s]*$/.test(name))
      return "Full name can only contain letters and spaces";
    return "";
  };

  const validateDateOfBirth = (dob) => {
    if (!dob) return "Date of birth is required";
    const birthDate = new Date(dob);
    const today = new Date();
    if (birthDate > today) return "Date of birth cannot be in the future";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    if (!/^\+63[0-9]{10}$/.test(phone))
      return "Phone number must start with +63 followed by 10 digits";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    // Regex that only allows .com top-level domain
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.com$/i;
    if (!emailRegex.test(email))
      return "Please enter a valid email address ending in .com (e.g., user@example.com)";
    return "";
  };

  const validateAddress = (address) => {
    if (!address) return "Address is required";
    if (address.length < 10) return "Please enter a complete address";
    if (address.length > 80) return "Address is too long";
    return "";
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, "");

    if (!phoneNumber) return "";

    if (!value.startsWith("+63")) {
      return `+63${phoneNumber}`;
    }

    return value;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle phone number formatting
    if (name === "contactNumber" || name === "emergencyContactPhone") {
      const formattedValue = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      // Validate phone
      const phoneError = validatePhone(formattedValue);
      setErrors((prev) => ({
        ...prev,
        [name]: phoneError,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate other fields
      let error = "";
      switch (name) {
        case "fullName":
        case "emergencyContactName":
          error = validateFullName(value);
          break;
        case "dateOfBirth":
          error = validateDateOfBirth(value);
          break;
        case "gender":
          error = !value ? "Please select a gender" : "";
          break;
        case "address":
          error = validateAddress(value);
          break;
        case "emergencyContactEmail":
          error = validateEmail(value);
          break;
        case "emergencyContactRelation":
          error = !value ? "Relationship is required" : "";
          break;
        default:
          break;
      }

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const hasErrorsInCurrentStep = () => {
    if (activeStep === 1) {
      return Object.keys(errors)
        .filter((key) =>
          [
            "fullName",
            "dateOfBirth",
            "gender",
            "contactNumber",
            "address",
          ].includes(key)
        )
        .some((key) => errors[key]);
    } else if (activeStep === 2) {
      return Object.keys(errors)
        .filter((key) =>
          [
            "emergencyContactName",
            "emergencyContactPhone",
            "emergencyContactEmail",
            "emergencyContactRelation",
          ].includes(key)
        )
        .some((key) => errors[key]);
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate all fields
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      dateOfBirth: validateDateOfBirth(formData.dateOfBirth),
      gender: !formData.gender ? "Please select a gender" : "",
      contactNumber: validatePhone(formData.contactNumber),
      address: validateAddress(formData.address),
      emergencyContactName: validateFullName(formData.emergencyContactName),
      emergencyContactPhone: validatePhone(formData.emergencyContactPhone),
      emergencyContactEmail: validateEmail(formData.emergencyContactEmail),
      emergencyContactRelation: !formData.emergencyContactRelation
        ? "Relationship is required"
        : "",
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await addNewResident(formData);
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
      setSuccessMessage("Resident added successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error.message || "Error adding resident");
    } finally {
      setIsSubmitting(false);
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
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg flex items-center">
          <div className="flex-grow">
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      <Sidebar
        activePage="add-resident"
        onToggle={(collapsed) => setIsCollapsed(collapsed)}
      />

      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-24" : "ml-72"
        } p-8`}
      >
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.fullName ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 ${
                        errors.fullName
                          ? "focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent`}
                      placeholder="Enter full name"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.dateOfBirth
                          ? "border-red-500"
                          : "border-gray-200"
                      } focus:outline-none focus:ring-2 ${
                        errors.dateOfBirth
                          ? "focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.gender ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 ${
                        errors.gender
                          ? "focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent appearance-none`}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                          errors.contactNumber
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:outline-none focus:ring-2 ${
                          errors.contactNumber
                            ? "focus:ring-red-500"
                            : "focus:ring-blue-500"
                        } focus:border-transparent`}
                        placeholder="+63 XXX XXX XXXX"
                        maxLength="13"
                      />
                    </div>
                    {errors.contactNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.contactNumber}
                      </p>
                    )}
                    <span className="text-xs text-gray-500 mt-1">
                      Format: +63 XXX XXX XXXX
                    </span>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                          errors.address ? "border-red-500" : "border-gray-200"
                        } focus:outline-none focus:ring-2 ${
                          errors.address
                            ? "focus:ring-red-500"
                            : "focus:ring-blue-500"
                        } focus:border-transparent`}
                        placeholder="Enter complete address"
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    disabled={hasErrorsInCurrentStep()}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
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
                  {/* Emergency Contact Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Name *
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.emergencyContactName
                          ? "border-red-500"
                          : "border-gray-200"
                      } focus:outline-none focus:ring-2 ${
                        errors.emergencyContactName
                          ? "focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent`}
                      placeholder="Enter emergency contact name"
                    />
                    {errors.emergencyContactName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.emergencyContactName}
                      </p>
                    )}
                  </div>

                  {/* Relationship to Resident */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship to Resident *
                    </label>
                    <input
                      type="text"
                      name="emergencyContactRelation"
                      value={formData.emergencyContactRelation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.emergencyContactRelation
                          ? "border-red-500"
                          : "border-gray-200"
                      } focus:outline-none focus:ring-2 ${
                        errors.emergencyContactRelation
                          ? "focus:ring-red-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent`}
                      placeholder="Enter relationship"
                    />
                    {errors.emergencyContactRelation && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.emergencyContactRelation}
                      </p>
                    )}
                  </div>

                  {/* Emergency Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                          errors.emergencyContactPhone
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:outline-none focus:ring-2 ${
                          errors.emergencyContactPhone
                            ? "focus:ring-red-500"
                            : "focus:ring-blue-500"
                        } focus:border-transparent`}
                        placeholder="+63 XXX XXX XXXX"
                        maxLength="13"
                      />
                    </div>
                    {errors.emergencyContactPhone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.emergencyContactPhone}
                      </p>
                    )}
                    <span className="text-xs text-gray-500 mt-1">
                      Format: +63 XXX XXX XXXX
                    </span>
                  </div>

                  {/* Emergency Contact Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="emergencyContactEmail"
                        value={formData.emergencyContactEmail}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                          errors.emergencyContactEmail
                            ? "border-red-500"
                            : "border-gray-200"
                        } focus:outline-none focus:ring-2 ${
                          errors.emergencyContactEmail
                            ? "focus:ring-red-500"
                            : "focus:ring-blue-500"
                        } focus:border-transparent`}
                        placeholder="Enter emergency contact email"
                      />
                    </div>
                    {errors.emergencyContactEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.emergencyContactEmail}
                      </p>
                    )}
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
                    disabled={isSubmitting || hasErrorsInCurrentStep()}
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
