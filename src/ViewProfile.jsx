import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  Key,
  ChevronRight,
  ArrowLeft,
  X,
} from "lucide-react";
import Sidebar from "./SideBar";
import { getProfile, updateProfile } from "../services/api";
import ChangePasswordModal from "./ChangePasswordModal";

const ViewProfile = () => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    userType: "",
    createdAt: "",
    phone: "N/A",
    location: "N/A",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  });
  const [updateError, setUpdateError] = useState(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeMessage, setPasswordChangeMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  });

  const validateFullName = (name) => {
    if (!name) return "Full name is required";
    if (name.length < 5) return "Full name must be at least 5 characters";
    if (name.length > 30) return "Full name must be less than 30 characters";
    if (!/^[a-zA-Z\s]*$/.test(name))
      return "Full name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.com$/i;
    if (!emailRegex.test(email))
      return "Please enter a valid email address ending in .com";
    return "";
  };

  const validatePhone = (phone) => {
    if (phone === "N/A") return "";
    if (!phone.startsWith("+63")) return "Phone number must start with +63";
    if (!/^\+63\d{10}$/.test(phone))
      return "Phone number must be 10 digits after +63";
    return "";
  };

  const validateLocation = (location) => {
    if (location === "N/A") return "";
    if (location.length > 50) return "Location must be less than 50 characters";
    return "";
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      const formattedData = {
        fullName: data.fullName,
        email: data.email,
        role: data.userType.charAt(0).toUpperCase() + data.userType.slice(1),
        phone: data.phone || "N/A",
        location: data.location || "N/A",
      };
      setProfileData(formattedData);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditForm({
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Existing phone validation logic
      let phoneNumber = value.replace(/[^\d+]/g, "");
      if (!phoneNumber.startsWith("+63")) {
        if (phoneNumber.startsWith("63")) {
          phoneNumber = "+" + phoneNumber;
        } else if (phoneNumber.startsWith("0")) {
          phoneNumber = "+63" + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith("+")) {
          phoneNumber = "+63" + phoneNumber;
        }
      }

      setEditForm((prev) => ({
        ...prev,
        phone: phoneNumber,
      }));

      // Validate phone
      const phoneError = validatePhone(phoneNumber);
      setValidationErrors((prev) => ({
        ...prev,
        phone: phoneError,
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate other fields
      let error = "";
      switch (name) {
        case "fullName":
          error = validateFullName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "location":
          error = validateLocation(value);
          break;
        default:
          break;
      }

      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Modify the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = {
      fullName: validateFullName(editForm.fullName),
      email: validateEmail(editForm.email),
      phone: validatePhone(editForm.phone),
      location: validateLocation(editForm.location),
    };

    setValidationErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some((error) => error !== "")) {
      setUpdateError("Please fix the validation errors before submitting");
      return;
    }

    try {
      setUpdateError(null);
      await updateProfile(editForm);

      setProfileData({
        fullName: editForm.fullName,
        email: editForm.email,
        role: profileData.role,
        phone: editForm.phone,
        location: editForm.location,
      });

      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setUpdateError(err.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-poppins flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-poppins flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-poppins">
      <Sidebar activePage="profile" />

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              {updateError && (
                <div className="text-red-600 text-sm mb-4">{updateError}</div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      validationErrors.fullName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {validationErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      validationErrors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    placeholder="+63 Phone Number"
                    className={`w-full px-3 py-2 border ${
                      validationErrors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.phone}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Must start with +63
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      validationErrors.location
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {validationErrors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="ml-72 p-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl p-6 rounded-xl shadow-sm border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Profile Card */}
          <div className="col-span-12 lg:col-span-5">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-40 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

              <div className="relative px-6 pb-6">
                <div className="absolute -top-16 left-6">
                  <div className="relative">
                    <div className="h-32 w-32 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold border-4 border-white">
                      {profileData.fullName.charAt(0)}
                    </div>
                    <button
                      onClick={handleEditClick}
                      className="absolute bottom-0 right-0 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                      aria-label="Edit profile"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="pt-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {profileData.fullName}
                      </h2>
                      <p className="text-gray-500">{profileData.role}</p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <Mail className="h-5 w-5 text-gray-500" />
                      </div>
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <Phone className="h-5 w-5 text-gray-500" />
                      </div>
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <MapPin className="h-5 w-5 text-gray-500" />
                      </div>
                      <span>{profileData.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isChangingPassword && (
            <ChangePasswordModal
              onClose={() => {
                setIsChangingPassword(false);
                setPasswordChangeMessage(null);
              }}
              onSuccess={(message) => {
                setPasswordChangeMessage(message);
                // Delay closing the modal slightly to ensure message is visible
                setTimeout(() => {
                  setIsChangingPassword(false);
                }, 500); // Half second delay
                // Clear message after 3 seconds
                setTimeout(() => setPasswordChangeMessage(null), 3000);
              }}
            />
          )}

          {/* Success Messages */}
          {(successMessage || passwordChangeMessage) && (
            <div className="fixed top-4 right-4 z-50 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg flex items-center">
              <div className="flex-grow">
                <p className="text-sm font-medium">
                  {successMessage || passwordChangeMessage}
                </p>
              </div>
              <button
                onClick={() => {
                  setSuccessMessage(null);
                  setPasswordChangeMessage(null);
                }}
                className="ml-4 text-green-700 hover:text-green-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {/* Security Section */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 h-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Security Setting
              </h3>
              <div className="space-y-6">
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="w-full flex items-center justify-between p-6 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 bg-cyan-50 rounded-xl flex items-center justify-center">
                      <Key className="h-6 w-6 text-cyan-500" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">Password</h4>
                      <p className="text-gray-500">Change your password</p>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
