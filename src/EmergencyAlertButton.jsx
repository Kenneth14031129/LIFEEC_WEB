import PropTypes from "prop-types";
import { useState } from "react";
import { AlertTriangle, X, CheckCircle, AlertCircle } from "lucide-react";
import { createEmergencyAlert } from "../services/api";

const Notification = ({ message, type, onClose }) => (
  <div
    className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
      type === "success"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {type === "success" ? (
      <CheckCircle className="h-5 w-5" />
    ) : (
      <AlertCircle className="h-5 w-5" />
    )}
    <p>{message}</p>
    <button onClick={onClose} className="ml-2">
      <X className="h-4 w-4" />
    </button>
  </div>
);

const EmergencyAlertButton = ({ resident }) => {
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleEmergencyAlert = async () => {
    try {
      if (!resident.id || !resident.basicInfo?.name) {
        throw new Error("Missing required resident information");
      }

      const alertData = {
        residentId: resident.id,
        residentName: resident.basicInfo.name,
        message: `Emergency alert triggered`,
        emergencyContact: {
          name: resident.emergencyContact.name,
          phone: resident.emergencyContact.phone,
          email: resident.emergencyContact.email,
          relation: resident.emergencyContact.relation,
        },
      };

      console.log("Sending alert data:", alertData);

      await createEmergencyAlert(alertData);

      setNotification({
        message: `Emergency services have been notified about ${resident.basicInfo.name}.`,
        type: "success",
      });

      setShowModal(false);
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      setNotification({
        message: "Failed to send emergency alert. Please try again.",
        type: "error",
      });
      console.error("Emergency alert error:", err);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:from-red-700 hover:to-red-600 transition-colors"
      >
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">Emergency Alert</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-md mx-4">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Confirm Emergency Alert
            </h2>

            <p className="text-gray-600 mb-4">
              This will notify emergency services and send alerts to:
            </p>

            <ul className="mb-6 space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                • Relative ({resident.emergencyContact.name})
              </li>
              <li className="flex items-center gap-2">• Nurses</li>
              <li className="flex items-center gap-2">• Owner</li>
            </ul>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyAlert}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Confirm Emergency
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

EmergencyAlertButton.propTypes = {
  resident: PropTypes.shape({
    id: PropTypes.string.isRequired,
    basicInfo: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    emergencyContact: PropTypes.shape({
      name: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      relation: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EmergencyAlertButton;
