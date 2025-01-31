import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Bell, Users, AlertTriangle, Search } from "lucide-react";
import Sidebar from "./SideBar";
import {
  getResidents,
  getResidentEmergencyAlerts,
  markAlertsAsRead,
} from "../services/api";
import AlertHistory from "./AlertHistory";
import ResidentHistory from "./ResidentHistory";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showResidentHistory, setShowResidentHistory] = useState(false);
  const [showAlertHistory, setShowAlertHistory] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allAlerts, setAllAlerts] = useState([]);
  const [totalResidents, setTotalResidents] = useState([0]);

  const fetchAllAlerts = async () => {
    try {
      setIsLoading(true);
      const response = await getResidents();

      // Get residents data array
      let residentsData = Array.isArray(response)
        ? response
        : response.data && Array.isArray(response.data)
        ? response.data
        : response.residents && Array.isArray(response.residents)
        ? response.residents
        : [];

      // Set total residents count
      setTotalResidents(residentsData.length);

      // Fetch alerts for each resident
      const alertPromises = residentsData.map((resident) =>
        resident?._id
          ? getResidentEmergencyAlerts(resident._id)
          : Promise.resolve([])
      );

      const allAlertsArrays = await Promise.all(alertPromises);

      // Flatten and sort all alerts
      const alerts = allAlertsArrays
        .flat()
        .filter((alert) => alert)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setAllAlerts(alerts);

      // Also update notifications format for the notifications dropdown
      setNotifications(
        alerts.map((alert) => ({
          id: alert._id,
          resident: alert.residentName,
          type: "emergency",
          message: alert.message,
          time: formatTimestamp(alert.timestamp),
          read: alert.read || false,
        }))
      );
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setAllAlerts([]);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp to relative time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Get IDs of all unread notifications
      const unreadIds = notifications
        .filter((notif) => !notif.read)
        .map((notif) => notif.id);

      if (unreadIds.length === 0) return;

      // Call API to mark alerts as read
      await markAlertsAsRead(unreadIds);

      // Update local state
      setNotifications(
        notifications.map((notif) => ({
          ...notif,
          read: true,
        }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      // Optionally show an error message to the user
    }
  };

  // Fetch alerts when component mounts
  useEffect(() => {
    fetchAllAlerts();

    // Set up polling for new alerts every minute
    const pollInterval = setInterval(fetchAllAlerts, 60000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notifications-container")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const monthlyData = [
    { month: "Jan", residents: 65 },
    { month: "Feb", residents: 72 },
    { month: "Mar", residents: 85 },
    { month: "Apr", residents: 78 },
    { month: "May", residents: 90 },
    { month: "Jun", residents: 95 },
    { month: "Jul", residents: 90 },
    { month: "Aug", residents: 80 },
    { month: "Sep", residents: 50 },
    { month: "Oct", residents: 40 },
    { month: "Nov", residents: 40 },
    { month: "Dec", residents: 40 },
  ];

  // Sample resident history data
  const residentHistory = [
    {
      id: 1,
      date: "2024-01-18",
      name: "Maria Garcia",
      action: "admitted",
      room: "101",
      type: "admission",
      details: "New resident admission",
      time: "09:30 AM",
    },
    {
      id: 2,
      date: "2024-01-17",
      name: "John Smith",
      action: "admitted",
      room: "205",
      type: "discharge",
      details: "Completed rehabilitation program",
      time: "02:15 PM",
    },
    {
      id: 3,
      date: "2024-01-17",
      name: "Robert Wilson",
      action: "admitted",
      room: "303",
      type: "transfer",
      details: "Internal room transfer",
      time: "11:45 AM",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-poppins">
      <Sidebar activePage="dashboard" />

      <div className="ml-72 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-xl p-4 rounded-xl shadow-sm border border-white/20">
          <div className="flex-1 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/80 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Notification Bell with Dropdown */}
            <div className="relative notifications-container">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-white/80 rounded-lg"
              >
                <Bell className="h-6 w-6" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-white text-xs flex items-center justify-center border-2 border-white">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>

              {/* Updated Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        Notifications
                      </h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            !notification.read ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-xl bg-red-100 text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                {notification.resident}
                              </p>
                              <p className="text-sm text-gray-600">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-100">
                    <button
                      onClick={() => navigate("/notifications")}
                      className="w-full px-4 py-2 text-sm text-center text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/view-profile")}
              className="flex items-center gap-3 p-1 rounded-lg hover:bg-white/80 transition-colors"
            >
              <div className="h-10 w-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your facility today
          </p>
        </div>
        {/* Interactive Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Residents Card */}
          <button
            onClick={() => setShowResidentHistory(true)}
            className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-white/80">
                Total Residents
              </h3>
              <div className="text-3xl font-bold text-white">
                {totalResidents}
              </div>
              <p className="text-xs text-white/70">View all residents</p>
            </div>
          </button>

          {/* Active Alerts Card */}
          <button
            onClick={() => setShowAlertHistory(true)}
            className="rounded-xl bg-gradient-to-br from-red-500 to-pink-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-white/80">
                Total Alerts
              </h3>
              <div className="text-3xl font-bold text-white">
                {allAlerts.length}
              </div>
              <p className="text-xs text-white/70">View all alerts</p>
            </div>
          </button>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl shadow-lg">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  Resident Statistics
                </h3>
                <select className="px-3 py-1.5 bg-white/80 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Last 12 months</option>
                  <option>Last 6 months</option>
                  <option>Last 3 months</option>
                </select>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(255,255,255,0.2)"
                    />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255,255,255,0.9)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="residents"
                      fill="url(#colorGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        {/* Modals */}
        <ResidentHistory
          isOpen={showResidentHistory}
          onClose={() => setShowResidentHistory(false)}
          residents={residentHistory}
          isLoading={isLoading}
        />
        <AlertHistory
          isOpen={showAlertHistory}
          onClose={() => setShowAlertHistory(false)}
          alerts={allAlerts}
          isLoading={isLoading}
        />
        ;
      </div>
    </div>
  );
};

export default Dashboard;
