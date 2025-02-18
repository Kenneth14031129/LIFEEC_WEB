import { useState } from "react";
import PropTypes from "prop-types";
import { X, Eye, EyeOff } from "lucide-react";
import { changeUserPassword } from "../services/api";

const ChangePasswordModal = ({ onClose, onSuccess }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [validationErrors, setValidationErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    if (!/[_!@#$%^&*]/.test(password))
      return "Password must contain at least one special character (_!@#$%^&*)";
    return "";
  };

  // Modify handleInputChange to include validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    let error = "";
    if (name === "currentPassword") {
      if (!value) error = "Current password is required";
    } else if (name === "newPassword") {
      error = validatePassword(value);
      // Also check confirm password match if it has a value
      if (
        passwordForm.confirmNewPassword &&
        value !== passwordForm.confirmNewPassword
      ) {
        setValidationErrors((prev) => ({
          ...prev,
          confirmNewPassword: "Passwords do not match",
        }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          confirmNewPassword: "",
        }));
      }
    } else if (name === "confirmNewPassword") {
      if (!value) error = "Please confirm your password";
      else if (value !== passwordForm.newPassword)
        error = "Passwords do not match";
    }

    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Modify handleSubmit to check all validations
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    const newErrors = {
      currentPassword: !passwordForm.currentPassword
        ? "Current password is required"
        : "",
      newPassword: validatePassword(passwordForm.newPassword),
      confirmNewPassword:
        passwordForm.newPassword !== passwordForm.confirmNewPassword
          ? "Passwords do not match"
          : "",
    };

    setValidationErrors(newErrors);

    // Check if there are any validation errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      await changeUserPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      onSuccess("Password changed successfully");
    } catch (err) {
      setError(err.message || "Failed to change password. Please try again.");
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-md flex items-center">
              <span className="mr-2">🚫</span>
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.currentPassword ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    validationErrors.currentPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showPasswords.currentPassword ? (
                    <Eye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    validationErrors.newPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showPasswords.newPassword ? (
                    <Eye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.newPassword}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Password must contain at least 8 characters, one uppercase
                letter, one lowercase letter, one number, and one special
                character (_!@#$%^&*)
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmNewPassword ? "text" : "password"}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={passwordForm.confirmNewPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border ${
                    validationErrors.confirmNewPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmNewPassword")}
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                >
                  {showPasswords.confirmNewPassword ? (
                    <Eye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validationErrors.confirmNewPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.confirmNewPassword}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ChangePasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
